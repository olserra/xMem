import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter, useSearchParams } from 'next/navigation';
import CreateData from '../CreateData';
import { useUser } from '@/app/contexts/UserContext';
import { useMCPClient } from '@/app/services/mcp';

// Mock the next/navigation hooks
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn()
}));

// Mock the UserContext
jest.mock('@/app/contexts/UserContext', () => ({
    useUser: jest.fn()
}));

// Mock the MCP client
jest.mock('@/app/services/mcp', () => ({
    useMCPClient: jest.fn()
}));

describe('CreateData', () => {
    const mockRouter = {
        push: jest.fn()
    };

    const mockUser = {
        id: 'test-user-id',
    };

    const mockMCPClient = {
        semanticSearch: jest.fn()
    };

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Setup default mocks
        (useRouter as jest.Mock).mockReturnValue(mockRouter);
        (useSearchParams as jest.Mock).mockReturnValue({
            get: jest.fn().mockReturnValue(null)
        });
        (useUser as jest.Mock).mockReturnValue({
            user: mockUser,
            bearerToken: 'test-token',
            refreshData: jest.fn()
        });
        (useMCPClient as jest.Mock).mockReturnValue(mockMCPClient);

        // Setup fetch mock
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ id: 'test-id' })
        });
    });

    it('renders the create data form', () => {
        render(<CreateData />);
        
        expect(screen.getByText('Create New Data')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter your text content...')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Add a tag...')).toBeInTheDocument();
    });

    it('shows similar memories when typing content', async () => {
        const mockSimilarMemories = {
            status: 'success',
            data: {
                results: {
                    ids: ['1'],
                    documents: ['Similar memory content'],
                    distances: [0.2],
                    metadatas: [{ tags: ['tag1', 'tag2'], created_at: '2024-03-20' }]
                }
            }
        };

        mockMCPClient.semanticSearch.mockResolvedValue(mockSimilarMemories);

        render(<CreateData />);

        const contentInput = screen.getByPlaceholderText('Enter your text content...');
        await userEvent.type(contentInput, 'This is a test memory with enough characters');

        // Wait for the debounced search to complete
        await waitFor(() => {
            expect(mockMCPClient.semanticSearch).toHaveBeenCalled();
        });

        // Check if similar memory is displayed
        await waitFor(() => {
            expect(screen.getByText('Similar memory content')).toBeInTheDocument();
        });
    });

    it('allows toggling similar memories visibility', () => {
        render(<CreateData />);
        
        const toggleButton = screen.getByText('Hide Similar');
        fireEvent.click(toggleButton);
        
        expect(screen.getByText('Show Similar')).toBeInTheDocument();
    });

    it('populates form when selecting a similar memory', async () => {
        const mockSimilarMemories = {
            status: 'success',
            data: {
                results: {
                    ids: ['1'],
                    documents: ['Selected memory content'],
                    distances: [0.2],
                    metadatas: [{ tags: ['tag1', 'tag2'], created_at: '2024-03-20' }]
                }
            }
        };

        mockMCPClient.semanticSearch.mockResolvedValue(mockSimilarMemories);

        render(<CreateData />);

        // Type content to trigger similar memories search
        const contentInput = screen.getByPlaceholderText('Enter your text content...');
        await userEvent.type(contentInput, 'This is a test memory with enough characters');

        // Wait for similar memories to appear
        await waitFor(() => {
            expect(screen.getByText('Selected memory content')).toBeInTheDocument();
        });

        // Click on the similar memory
        fireEvent.click(screen.getByText('Selected memory content'));

        // Check if form is populated with selected memory
        expect(contentInput).toHaveValue('Selected memory content');
        expect(screen.getByText('tag1')).toBeInTheDocument();
        expect(screen.getByText('tag2')).toBeInTheDocument();
    });

    it('submits form with correct data', async () => {
        render(<CreateData />);

        // Fill form
        const contentInput = screen.getByPlaceholderText('Enter your text content...');
        await userEvent.type(contentInput, 'Test content');

        const tagInput = screen.getByPlaceholderText('Add a tag...');
        await userEvent.type(tagInput, 'test-tag');
        fireEvent.click(screen.getByText('Add'));

        // Submit form
        fireEvent.click(screen.getByText('Create Text Data'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer test-token'
                },
                body: JSON.stringify({
                    content: 'Test content',
                    tags: ['test-tag'],
                    type: 'TEXT',
                    userId: 'test-user-id',
                    metadata: {
                        tags: ['test-tag']
                    }
                })
            });
        });
    });

    it('handles errors during form submission', async () => {
        // Mock fetch to return an error
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: false,
            json: () => Promise.resolve({ error: 'Test error' })
        });

        render(<CreateData />);

        // Fill and submit form
        const contentInput = screen.getByPlaceholderText('Enter your text content...');
        await userEvent.type(contentInput, 'Test content');
        fireEvent.click(screen.getByText('Create Text Data'));

        // Check if error message is displayed
        await waitFor(() => {
            expect(screen.getByText('Failed to create data')).toBeInTheDocument();
        });
    });
}); 