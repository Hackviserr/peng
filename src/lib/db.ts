import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Finding, Project } from '../types';

interface PengDB extends DBSchema {
    projects: {
        key: string;
        value: Project;
    };
    findings: {
        key: string;
        value: Finding;
        indexes: { projectId: string };
    };
}

const DB_NAME = 'peng-db';
const DB_VERSION = 3;

let dbPromise: Promise<IDBPDatabase<PengDB>> | null = null;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<PengDB>(DB_NAME, DB_VERSION, {
            upgrade(db, oldVersion) {
                // Clean slate: drop old stores if they exist
                if ((db.objectStoreNames as DOMStringList).contains('projectMeta')) {
                    db.deleteObjectStore('projectMeta' as never);
                }
                if (oldVersion < 3) {
                    // Recreate findings with index
                    if (db.objectStoreNames.contains('findings')) {
                        db.deleteObjectStore('findings');
                    }
                    const findingsStore = db.createObjectStore('findings', { keyPath: 'id' });
                    findingsStore.createIndex('projectId', 'projectId');
                }
                if (!db.objectStoreNames.contains('projects')) {
                    db.createObjectStore('projects', { keyPath: 'id' });
                }
            },
        });
    }
    return dbPromise;
}

// --- Projects ---

export async function getAllProjects(): Promise<Project[]> {
    const db = await getDB();
    return db.getAll('projects');
}

export async function getProject(id: string): Promise<Project | undefined> {
    const db = await getDB();
    return db.get('projects', id);
}

export async function saveProject(project: Project): Promise<void> {
    const db = await getDB();
    await db.put('projects', project);
}

export async function deleteProject(id: string): Promise<void> {
    const db = await getDB();
    // Delete project
    await db.delete('projects', id);
    // Delete all findings for this project
    const tx = db.transaction('findings', 'readwrite');
    const index = tx.store.index('projectId');
    let cursor = await index.openCursor(id);
    while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
    }
    await tx.done;
}

// --- Findings (project-scoped) ---

export async function getProjectFindings(projectId: string): Promise<Finding[]> {
    const db = await getDB();
    return db.getAllFromIndex('findings', 'projectId', projectId);
}

export async function saveProjectFindings(projectId: string, findings: Finding[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('findings', 'readwrite');
    // Delete existing findings for this project
    const index = tx.store.index('projectId');
    let cursor = await index.openCursor(projectId);
    while (cursor) {
        await cursor.delete();
        cursor = await cursor.continue();
    }
    // Insert new findings
    for (const finding of findings) {
        await tx.store.put(finding);
    }
    await tx.done;
}
