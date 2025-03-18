import { useEffect, useState, useCallback } from "react";
import { Project, Memory } from "../types";

const useFetchData = (userId: string | null, bearerToken: string | null) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [memories, setMemories] = useState<Memory[]>([]);

    const fetchData = useCallback(async () => {
        if (!userId || !bearerToken) return;

        try {
            const [projectsRes, memoriesRes] = await Promise.all([
                fetch(`/api/projects?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${bearerToken}` },
                }),
                fetch(`/api/memory?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${bearerToken}` },
                }),
            ]);

            const projectsData = await projectsRes.json();
            const memoriesData = await memoriesRes.json();

            setProjects(projectsData);
            setMemories(memoriesData.memories || []);
        } catch (error) {
            console.error("Error fetching projects and memories:", error);
        }
    }, [userId, bearerToken]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { projects, memories, setMemories };
};

export default useFetchData;