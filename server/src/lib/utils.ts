import { Prisma } from "@/generated";
import { MinimalNode } from "../agents/tools/nodes/create-node";
import { SafeFileBlobField, SafeNodeField } from "../types/agent";

export function getPrismaErrorDetails(error: unknown) {
    let code = "INTERNAL_ERROR";
    let message = "An unexpected error occurred.";
    let suggestion = "Review your input and try again.";
    let details = error;

    //  Prisma Client Known Request Errors (Database level)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const target = (error.meta?.target as string[])?.join(", ");

        switch (error.code) {
            // Constraint Violations
            case 'P2002':
                code = 'DUPLICATE_ENTRY';
                message = target ? `Conflict on: ${target}.` : 'A unique constraint was violated.';
                suggestion = 'Ensure your data is unique or update existing records.';
                break;
            case 'P2003':
                code = 'INVALID_RELATION';
                message = 'Foreign key constraint failed.';
                suggestion = 'Ensure related records (like Projects or Parent Folders) exist.';
                break;
            case 'P2004':
                code = 'CONSTRAINT_FAILED';
                message = 'A database constraint was triggered.';
                suggestion = 'Check your data against schema requirements.';
                break;

            // Data/Query Errors
            case 'P2001':
            case 'P2025':
                code = 'NOT_FOUND';
                message = 'The record does not exist.';
                suggestion = 'Verify the ID or path is correct.';
                break;
            case 'P2006':
                code = 'INVALID_INPUT';
                message = 'Provided value is invalid.';
                suggestion = 'Check the data format (e.g., UUID, JSON structure).';
                break;
            case 'P2011':
                code = 'MISSING_FIELD';
                message = `Required field ${error.meta?.field_name || ''} is missing.`;
                suggestion = 'Ensure all required fields are populated.';
                break;

            // System/Connection Errors
            case 'P2024':
                code = 'DB_BUSY';
                message = 'Database connection timed out.';
                suggestion = 'Retry the request in a few seconds.';
                break;
            case 'P1000':
            case 'P1001':
            case 'P1002':
                code = 'CONNECTION_FAILED';
                message = 'Cannot reach the database.';
                suggestion = 'Check your database connection string and server status.';
                break;
            case 'P2030':
                code = 'TOO_MANY_REQUESTS';
                message = 'Query threshold exceeded.';
                suggestion = 'Simplify your request or throttle your actions.';
                break;

            default:
                code = `PRISMA_${error.code}`;
                message = error.message || 'Database error.';
        }
    }
    // Validation Errors
    else if (error instanceof Prisma.PrismaClientValidationError) {
        code = 'VALIDATION_ERROR';
        message = 'Invalid data structure provided to Prisma.';
        suggestion = 'Check your types and ensure optional fields are handled.';
    }
    // Connection/Initialization Errors
    else if (error instanceof Prisma.PrismaClientInitializationError) {
        code = 'INIT_ERROR';
        message = 'Database client failed to initialize.';
        suggestion = 'Check environment variables and network settings.';
    }
    // Critical Rust Panics
    else if (error instanceof Prisma.PrismaClientRustPanicError) {
        code = 'RUST_PANIC';
        message = 'The underlying database engine crashed.';
        suggestion = 'This is a system error. Please restart the service.';
    }

    return { code, message, suggestion, details };
}

export function buildNodeSelect(fields: SafeNodeField[] = []): Prisma.NodeSelect {
    const select: Prisma.NodeSelect = {};
    const blobSelect: Prisma.FileBlobSelect = {};

    for (const field of fields) {
        if (field.startsWith('fileBlob.')) {
            // Extract the metadata field (e.g., 'extension' from 'fileBlob.extension')
            const blobField = field.split('.')[1] as keyof Prisma.FileBlobSelect;
            blobSelect[blobField] = true;
        } else {
            // It's a scalar node field
            select[field as keyof Prisma.NodeSelect] = true;
        }
    }

    // Only include the nested fileBlob relation if metadata was requested
    if (Object.keys(blobSelect).length > 0) select.fileBlob = { select: blobSelect };

    // Always include ID if the agent forgot? 
    if (!select.id) select.id = true;
    return select;
}


export function buildFileBlobSelect(
    fields: SafeFileBlobField[] = []
): Prisma.FileBlobSelect {
    const select: Prisma.FileBlobSelect = {};

    // Always include ID if the agent forgot (useful for referencing results)
    if (fields.length === 0 || !fields.includes('id')) 
        select.id = true;

    for (const field of fields)
        select[field] = true;
    
    return select;
}


export function leanPrompt(prompt: string): string {
    return prompt
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
}

export function calculateFileSize(content: string): number {
    if (!content) return 0;
    return Buffer.byteLength(content, "utf-8");
}

export async function formatNodeForPrisma(node: MinimalNode, surfaceId: string) {
    // Recursively build the nested `create` data for a node (without its parent)
    function buildNodeCreateInput(
        node: MinimalNode,
        index?: number
    ): Prisma.NodeCreateWithoutParentInput {
        // FileBlob handling: connect by id OR create new
        let fileBlobData: Prisma.FileBlobCreateNestedOneWithoutNodesInput | undefined;

        if (node.fileBlobId) {
            fileBlobData = {
                connect: {
                    id: node.fileBlobId
                }
            };
        } else if (node.fileBlob) {
            const size = calculateFileSize(node.fileBlob.content || "");
            const mimeType = getMimeType(node.fileBlob.extension);

            fileBlobData = {
                create: {
                    extension: node.fileBlob.extension,
                    content: node.fileBlob.extension,
                    mimeType,
                    size,
                },
            };
        }

        // Recursively build children (each gets its position = index in array)
        const childrenCreate = node.children?.map((child, idx) => buildNodeCreateInput(child, idx));

        // Build the node creation object
        const createInput: Prisma.NodeCreateWithoutParentInput = {
            name: node.name,
            isFolder: node.isFolder,
            position: index ?? 0,
            surface: { connect: { id: surfaceId } },
            ...(fileBlobData ? { fileBlob: fileBlobData } : {}),
            ...(childrenCreate && childrenCreate.length > 0
                ? { children: { create: childrenCreate } }
                : {}),
        };

        return createInput;
    }

    // Build the root node (without parent yet)
    const rootWithoutParent = buildNodeCreateInput(node);

    // Attach to an existing parent if `parentId` was provided
    return {
        ...rootWithoutParent,
        ...(node.parentId ? { parent: { connect: { id: node.parentId } } } : {}),
    };
};

export function getMimeType(fileNameOrExtension: string): string {
    if (!fileNameOrExtension) return "text/plain";

    // Extract extension if a full file name with a dot was provided
    const extension = fileNameOrExtension.includes('.')
        ? fileNameOrExtension.split('.').pop()?.toLowerCase()
        : fileNameOrExtension.toLowerCase();

    const mimeMap: Record<string, string> = {
        // Web & Code Formats
        'html': 'text/html',
        'htm': 'text/html',
        'css': 'text/css',
        'js': 'application/javascript',
        'mjs': 'application/javascript',
        'ts': 'application/typescript',
        'jsx': 'text/jsx',
        'tsx': 'text/tsx',

        // Data & Configuration Formats
        'json': 'application/json',
        'xml': 'application/xml',
        'yaml': 'text/yaml',
        'yml': 'text/yaml',
        'md': 'text/markdown',
        'txt': 'text/plain',

        // Images
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',
        'gif': 'image/gif',
        'ico': 'image/x-icon',

        // Audio & Video Media
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'm4a': 'audio/mp4',
        'ogg': 'audio/ogg',
        'mp4': 'video/mp4',
        'webm': 'video/webm'
    };

    // Return the matched MIME type, or fallback to text/plain for unrecognized formats
    return (extension && mimeMap[extension]) ? mimeMap[extension] : 'text/plain';
}
