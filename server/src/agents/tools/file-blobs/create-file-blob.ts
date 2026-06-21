import { SafeFileBlobField, Tool } from "../../../types/agent";
import { buildFileBlobSelect, calculateFileSize, getMimeType, getPrismaErrorDetails } from "../../../lib/utils";
import { prisma } from "../../../config/prisma";

interface CreateFileBlobArgs {
    extension: string;
    content: string;
    url?: string;
    width?: number;
    height?: number;
    duration?: number;
}

const createFileBlob: Tool<CreateFileBlobArgs, SafeFileBlobField> = async (args) => {
    const startTime = Date.now();

    if (!args?.extension) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: "Cannot create file blob. Missing required argument: extension.",
                details: {
                    required: [
                        "extension: string (e.g., 'png', 'pdf', 'mp3', 'txt')",
                        "content: string",
                    ],
                    provided: {
                        extension: args?.extension ?? 'undefined/null',
                        content: `received (${typeof args.content})`,
                    },
                },
                suggestion:
                    "Step 1: Determine the file type based on user input or the content format. " +
                    "Step 2: Provide the file extension as a string (without the leading dot). " +
                    "Step 3: Pass the file content as a base64-encoded string (for binary) or plain text. " +
                    "Step 4: Call 'createFileBlob' again with both 'extension' and 'content'.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

 
    if (!args?.content) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: "Cannot create file blob. Missing required argument: content.",
                details: {
                    required: [
                        "content: string (base64-encoded or raw text)",
                    ],
                    provided: {
                        extension: args.extension,
                        content: args.content ?? 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Obtain the file data from the user, an external source, or generate it. " +
                    "Step 2: Encode binary files as base64 (e.g., using 'Buffer.from(data).toString('base64')'). " +
                    "Step 3: Pass the resulting string as the 'content' argument.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

    // --- Main creation ---
    try {
        const { 
            extension, 
            content, 
            url, 
            width, 
            height, 
            duration 
        } = args;

        const computedSize = calculateFileSize(content)
        const computedMimeType = getMimeType(extension); 

        const fileBlob = await prisma.fileBlob.create({
            data: {
                extension,
                content,
                mimeType: computedMimeType,
                size: computedSize,
                url: url ?? null,
                width: width ?? null,
                height: height ?? null,
                duration: duration ?? null,
            },
            select: buildFileBlobSelect(args.fieldsToSelect),
        });

        return {
            status: "success",
            data: fileBlob,
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
                blobId: fileBlob.id,
            },
        };
    } catch (err) {
        return {
            status: "error",
            error: getPrismaErrorDetails(err),
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }
};

export default createFileBlob;