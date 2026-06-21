import { SafeFileBlobField, Tool } from "../../../types/agent";
import { buildFileBlobSelect, calculateFileSize, getMimeType, getPrismaErrorDetails } from "../../../lib/utils";
import { prisma } from "../../../config/prisma";

interface UpdateFileBlobArgs {
    id: string;
    data: Partial<{
        url: string;
        extension: string;
        content: string;
        width: number;
        height: number;
        duration: number;
    }>;
}

const updateFileBlob: Tool<UpdateFileBlobArgs, SafeFileBlobField> = async (args) => {
    const startTime = Date.now();
    const id = args?.id;

    if (!id) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: "Cannot update file blob. Missing required argument: id.",
                details: {
                    required: ["id: string (the unique identifier of the file blob)"],
                    provided: {
                        id: id ? 'received (string)' : 'undefined/null',
                        data: args.data ? 'provided (object)' : 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Get the file blob ID from the node's 'fileBlobId' or from a previous query. " +
                    "Step 2: Pass that ID as the 'id' argument in your next 'updateFileBlob' call.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

    const hasData = args.data && Object.keys(args.data).length > 0;
    if (!hasData) {
        return {
            status: "error",
            error: {
                code: "EMPTY_UPDATE_DATA",
                message: "Cannot update file blob. The 'data' object is empty or missing.",
                details: {
                    available_fields_to_update: [
                        "url: string (cloud storage path)",
                        "extension: string (e.g., 'png', 'pdf')",
                        "content: string",
                        "width: number (for images/videos)",
                        "height: number (for images/videos)",
                        "duration: number (for audio/video in seconds)",
                    ],
                    provided: {
                        id: id,
                        data: args.data ?? 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Decide which property of the file blob you want to update. " +
                    "Step 2: Build a 'data' object containing at least one of the allowed fields above. " +
                    "Step 3: Pass that object alongside the 'id' argument.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

    // --- Main update ---
    try {
        const updatedBlob = await prisma.fileBlob.update({
            where: { id },
            data: {
                ...args.data,
                ...(args.data?.extension ? {
                    mimeType: getMimeType(args.data.extension)
                } : {}),

                ...(args.data?.content ? {
                    size: calculateFileSize(args.data.content)
                } : {})
            },
            select: buildFileBlobSelect(args.fieldsToSelect),
        });

        return {
            status: "success",
            data: updatedBlob,
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
                updatedFields: Object.keys(args.data ?? {}),
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

export default updateFileBlob;