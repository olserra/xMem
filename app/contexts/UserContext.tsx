'use client';

import {
    createContext,
    useContext,
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    ReactNode
} from 'react';
import { useSession } from 'next-auth/react';
import {
    User,
    Project,
    Memory,
    UserContextType,
    UserContextState,
    ApiResponse
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useApi } from '../hooks/useApi';

// Action Types
type Action =
    | { type: 'SET_USER'; payload: User | null }
    | { type: 'SET_BEARER_TOKEN'; payload: string | null }
    | { type: 'SET_PROJECTS'; payload: Project[] }
    | { type: 'SET_MEMORIES'; payload: Memory[] }
    | { type: 'SET_FAVORITES'; payload: string[] }
    | { type: 'SET_FILTER_LABEL'; payload: string }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: Error | null }
    | { type: 'TOGGLE_FAVORITE'; payload: string }
    | { type: 'UPDATE_MEMORIES'; payload: Memory[] };

// Initial State
const initialState: UserContextState = {
    user: null,
    bearerToken: null,
    projects: [],
    memories: [],
    favorites: [],
    filterLabel: '',
    isLoading: false,
    error: null,
};

// Reducer
function reducer(state: UserContextState, action: Action): UserContextState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_BEARER_TOKEN':
            return { ...state, bearerToken: action.payload };
        case 'SET_PROJECTS':
            return { ...state, projects: action.payload };
        case 'SET_MEMORIES':
            return { ...state, memories: action.payload };
        case 'SET_FAVORITES':
            return { ...state, favorites: action.payload };
        case 'SET_FILTER_LABEL':
            return { ...state, filterLabel: action.payload };
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'TOGGLE_FAVORITE':
            return {
                ...state,
                favorites: state.favorites.includes(action.payload)
                    ? state.favorites.filter(id => id !== action.payload)
                    : [...state.favorites, action.payload]
            };
        case 'UPDATE_MEMORIES':
            return { ...state, memories: action.payload };
        default:
            return state;
    }
}

// Context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider
export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [state, dispatch] = useReducer(reducer, initialState);
    const { get } = useApi();
    const { getItem, setItem } = useLocalStorage();

    const refreshProjects = useCallback(async () => {
        if (!state.user?.id || !state.bearerToken) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await get<ApiResponse<Project[]>>('/projects');
            if (response.success && Array.isArray(response.data)) {
                dispatch({ type: 'SET_PROJECTS', payload: response.data });
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.user?.id, state.bearerToken, get]);

    const refreshMemories = useCallback(async () => {
        if (!state.user?.id || !state.bearerToken) return;

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const response = await get<ApiResponse<Memory[]>>('/memories');
            if (response.success && Array.isArray(response.data)) {
                dispatch({ type: 'SET_MEMORIES', payload: response.data });
            }
        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error as Error });
        } finally {
            dispatch({ type: 'SET_LOADING', payload: false });
        }
    }, [state.user?.id, state.bearerToken, get]);

    // Initialize favorites from local storage
    useEffect(() => {
        if (state.user?.id) {
            const storedFavorites = getItem<string[]>(`favorites-${state.user.id}`) || [];
            dispatch({ type: 'SET_FAVORITES', payload: storedFavorites });
        }
    }, [state.user?.id, getItem]);

    // Update user when session changes
    useEffect(() => {
        if (session?.user) {
            dispatch({
                type: 'SET_USER',
                payload: {
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.name!
                }
            });
        } else {
            dispatch({ type: 'SET_USER', payload: null });
        }
    }, [session]);

    // Fetch projects and memories when user changes
    useEffect(() => {
        if (state.user?.id && state.bearerToken) {
            refreshProjects();
            refreshMemories();
        }
    }, [state.user?.id, state.bearerToken, refreshProjects, refreshMemories]);

    // Actions
    const setFilterLabel = useCallback((label: string) => {
        dispatch({ type: 'SET_FILTER_LABEL', payload: label });
    }, []);

    const toggleFavorite = useCallback((projectId: string) => {
        dispatch({ type: 'TOGGLE_FAVORITE', payload: projectId });
        if (state.user?.id) {
            setItem(`favorites-${state.user.id}`,
                state.favorites.includes(projectId)
                    ? state.favorites.filter(id => id !== projectId)
                    : [...state.favorites, projectId]
            );
        }
    }, [state.favorites, state.user?.id, setItem]);

    const updateMemories = useCallback((memories: Memory[]) => {
        dispatch({ type: 'UPDATE_MEMORIES', payload: memories });
    }, []);

    // Context value
    const value = useMemo(
        () => ({
            ...state,
            setFilterLabel,
            toggleFavorite,
            updateMemories,
            refreshProjects,
            refreshMemories,
        }),
        [state, setFilterLabel, toggleFavorite, updateMemories, refreshProjects, refreshMemories]
    );

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// Hook
export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}