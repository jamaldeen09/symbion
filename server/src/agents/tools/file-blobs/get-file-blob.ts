import { SafeFileBlobField, Tool } from "../../../types/agent";
import { buildFileBlobSelect, getPrismaErrorDetails } from "../../../lib/utils";
import { prisma } from "../../../config/prisma";

const getFileBlob: Tool<{ id: string; }, SafeFileBlobField> = async (args) => {
    const startTime = Date.now();
    const id = args?.id;

    if (!id) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: "Cannot get file blob. Missing required argument: id.",
                details: {
                    required: ["id: string (the unique identifier of the file blob)"],
                    provided: {
                        id: id ? 'received (string)' : 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Retrieve the file blob ID from a node's 'fileBlobId' field or from a previous 'listNodes' query. " +
                    "Step 2: Pass that exact ID string as the 'id' argument when calling 'getFileBlob' again.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

    // --- Main query ---
    try {
        const fileBlob = await prisma.fileBlob.findUnique({
            where: { id },
            select: buildFileBlobSelect(args.fieldsToSelect),
        });

        // --- VALIDATION 2: Not found ---
        if (!fileBlob) {
            return {
                status: "error",
                error: {
                    code: "NOT_FOUND",
                    message: `File blob with ID "${id}" does not exist.`,
                    details: {
                        searchedId: id,
                    },
                    suggestion:
                        "Step 1: Verify the ID is correct by checking the node's 'fileBlobId' field again. " +
                        "Step 2: If the ID is correct but still not found, the blob may have been deleted. " +
                        "Step 3: Consider using 'listNodes' to see which nodes have associated file blobs.",
                },
                metadata: {
                    timestamp: new Date().toISOString(),
                    executionTimeMs: Date.now() - startTime,
                },
            };
        }


        return {
            status: "success",
            data: fileBlob,
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
                contentIncluded: args.fieldsToSelect?.includes('content') ?? false,
                note: args.fieldsToSelect?.includes('content')
                    ? undefined
                    : "The 'content' field was not requested. Use { fieldsToSelect: ['content'] } if you need the actual file data.",
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

export default getFileBlob;