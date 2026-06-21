import { prisma } from "../../../config/prisma";
import { buildNodeSelect, getPrismaErrorDetails } from "../../../lib/utils";
import { SafeNodeField, Tool } from "../../../types/agent";

interface UpdateNodeArgs {
    nodeId: string,
    data?: Partial<{
        name: string;
        isFolder: boolean;
        parentId: string;
        fileBlobId: string;
    }>
}

const updateNode: Tool<UpdateNodeArgs, SafeNodeField> = async (args) => {
    const startTime = Date.now();
    const nodeId = args?.nodeId;

    if (!nodeId) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: "Cannot update node. Missing required argument: nodeId.",
                details: {
                    required: [
                        "nodeId: string (the unique identifier of the node to update)",
                    ],
                    provided: {
                        nodeId: `received (${typeof nodeId})`,
                        data: `provided (${typeof args.data}`,
                    },
                },
                suggestion:
                    "Step 1: Retrieve the target node's ID from a previous query (e.g., via 'listNodes'). " +
                    "Step 2: Look for the 'id' field of the node in the response of 'listNodes' tool. " +
                    "Step 3: Pass that exact string value as the 'nodeId' argument when calling 'updateNode' again.",
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
                message: "Cannot update node. The 'data' object is empty or missing.",
                details: {
                    available_fields_to_update: [
                        "name: string",
                        "isFolder: boolean",
                        "parentId: string (move under a different folder)",
                        "fileBlobId: string (attach a different file to the node)",
                    ],
                    provided: {
                        nodeId: nodeId,
                        data: args.data ?? 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Decide which property of the node you want to change. " +
                    "Step 2: Build a 'data' object containing at least one of the allowed fields (e.g., { name: 'New Folder Name' }). " +
                    "Step 3: Pass that object as the 'data' argument alongside the 'nodeId'.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }


    try {
        const node = await prisma.node.update({
            where: { id: nodeId },
            data: args.data!,
            select: buildNodeSelect(args.fieldsToSelect),
        });

        return {
            status: "success",
            data: node,
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime
            }
        };
    } catch (err) {
        return {
            status: "error",
            error: getPrismaErrorDetails(err),
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime
            }
        };
    }
}

export default updateNode