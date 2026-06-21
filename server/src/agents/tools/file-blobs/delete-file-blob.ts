import { Tool } from "../../../types/agent";
import { getPrismaErrorDetails } from "../../../lib/utils";
import { prisma } from "../../../config/prisma";


const deleteFileBlob: Tool<{ id: string; }> = async (args) => {
    const startTime = Date.now();
    const id = args?.id;

    if (!id) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: "Cannot delete file blob. Missing required argument: id.",
                details: {
                    required: ["id: string (the unique identifier of the file blob)"],
                    provided: {
                        id: id ? 'received (string)' : 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Locate the file blob ID from the node's 'fileBlobId' field. " +
                    "Step 2: Confirm that this blob is not attached to any critical nodes (check the node's 'fileBlobId' references). " +
                    "Step 3: Pass the ID as the 'id' argument to 'deleteFileBlob'.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

    try {
        const deleted = await prisma.fileBlob.delete({
            where: { id },
            select: {
                id: true,
                extension: true,
                size: true
            },
        });

        return {
            status: "success",
            data: {
                message: `File blob "${deleted.id}" (${deleted.extension}, ${deleted.size} bytes) was successfully deleted.`,
                deletedBlob: deleted,
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    } catch (err) {
        // Prisma will throw "RecordNotFound" if the ID doesn't exist
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

export default deleteFileBlob;