import fs from 'fs/promises';
import path from 'path';
import createNode from "../agents/tools/nodes/create-node";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ScaffoldOptions {
    genreId: string;
    surfaceId: string;
    parentId?: string; 
}


export default async function seedBoilerPlate(
    options: ScaffoldOptions
): Promise<{ rootNodeId: string }> {
    const { genreId, surfaceId, parentId } = options;
    const boilerplateRoot = path.resolve(__dirname, "../boilerplates", genreId);

    try {
        await fs.access(boilerplateRoot);
    } catch {
        throw new Error(`Boilerplate for genre "${genreId}" not found at ${boilerplateRoot}`);
    }


    async function processDirectory(
        dirPath: string,
        currentParentId: string | null
    ): Promise<string> {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        // Create a folder node for this directory
        const folderName = path.basename(dirPath);
        const folderNode = await createNode({
            surfaceId,
            node: {
                name: folderName,
                isFolder: true,
                ...(currentParentId ? { parentId: currentParentId } : {}),
            },
        });
        const folderId = folderNode.data.id;

        // Process files and subdirectories
        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                // Recursively process subdirectory – throws on failure
                await processDirectory(fullPath, folderId);
            } else {
                // Create file node
                const content = await fs.readFile(fullPath, 'utf-8');
                const extension = path.extname(entry.name).slice(1);
                await createNode({
                    surfaceId,
                    node: {
                        name: entry.name,
                        isFolder: false,
                        parentId: folderId,
                        fileBlob: {
                            extension,
                            content,
                        },
                    },
                });
            }
        }

        return folderId;
    }

    // Handle the root of the boilerplate
    const rootEntries = await fs.readdir(boilerplateRoot, { withFileTypes: true });
    const hasDirectories = rootEntries.some((e) => e.isDirectory());
    const fileCount = rootEntries.filter((e) => e.isFile()).length;

    let rootNodeId: string;

    if (!hasDirectories && fileCount === 1) {
        // Single file – create it directly
        const fileEntry = rootEntries[0];
        const fullPath = path.join(boilerplateRoot, fileEntry.name);
        const content = await fs.readFile(fullPath, 'utf-8');
        const extension = path.extname(fileEntry.name).slice(1);

        const node = await createNode({
            surfaceId,
            node: {
                name: fileEntry.name,
                isFolder: false,
                fileBlob: {
                    extension,
                    content,
                },
                ...(parentId ? { parentId } : {}),
            },
        });
        rootNodeId = node.data.id;
    } else {
        // Multiple items – create a root folder named after the genre
        const rootFolderNode = await createNode({
            surfaceId,
            node: {
                name: genreId,
                isFolder: true,
                ...(parentId ? { parentId } : {}),
            },
        });
        rootNodeId = rootFolderNode.data.id;

        // Process each entry under the root folder
        for (const entry of rootEntries) {
            const fullPath = path.join(boilerplateRoot, entry.name);
            if (entry.isDirectory()) {
                await processDirectory(fullPath, rootNodeId);
            } else {
                const content = await fs.readFile(fullPath, 'utf-8');
                const extension = path.extname(entry.name).slice(1);
                await createNode({
                    surfaceId,
                    node: {
                        name: entry.name,
                        isFolder: false,
                        parentId: rootNodeId,
                        fileBlob: {
                            extension,
                            content,
                        },
                    },
                });
            }
        }
    }

    return { rootNodeId };
}