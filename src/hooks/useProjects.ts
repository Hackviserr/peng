import { useState, useEffect } from 'react';
import { getAllProjects, saveProject, deleteProject as dbDeleteProject } from '../lib/db';
import type { Project } from '../types';
import { createDefaultProject } from '../types';

export interface UseProjectsReturn {
    projects: Project[];
    isLoading: boolean;
    createProject: (name: string) => Project;
    updateProject: (project: Project) => void;
    deleteProject: (id: string) => Promise<void>;
}

export function useProjects(): UseProjectsReturn {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAllProjects()
            .then((stored) => {
                // Sort by most recently updated
                stored.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
                setProjects(stored);
            })
            .catch((err) => {
                console.error('Failed to load projects:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const createProject = (name: string): Project => {
        const project = createDefaultProject(name);
        setProjects((prev) => [project, ...prev]);
        saveProject(project).catch((err) => console.error('Failed to save project:', err));
        return project;
    };

    const updateProject = (project: Project) => {
        const updated = { ...project, updatedAt: new Date().toISOString() };
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        saveProject(updated).catch((err) => console.error('Failed to save project:', err));
    };

    const deleteProjectHandler = async (id: string) => {
        await dbDeleteProject(id);
        setProjects((prev) => prev.filter((p) => p.id !== id));
    };

    return { projects, isLoading, createProject, updateProject, deleteProject: deleteProjectHandler };
}
