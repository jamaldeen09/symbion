import { prisma } from "../../../config/prisma";
import { buildNodeSelect, getPrismaErrorDetails } from "../../../lib/utils";
import { SafeNodeField, Tool } from "../../../types/agent";

const deleteNode: Tool<{ nodeId: string }, SafeNodeField> = async (args) => {
    const startTime = Date.now();
    const nodeId = args.nodeId;

    if (!nodeId) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: `Cannot delete node. Missing required argument: nodeId.`,
                details: {
                    required: ['nodeId: string (the unique identifier of the node to delete)'],
                    provided: {
                        nodeId: nodeId ? 'received (string)' : 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Retrieve the target node's ID from a previous 'getNodes' or 'listNodes' query response. " +
                    "Step 2: Confirm the node actually exists (use 'listNodes' and pass the ID into the 'specificNodes' arg if unsure). " +
                    "Step 3: Pass that exact string value as the 'nodeId' argument when calling 'deleteNode' again.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

    try {
        const node = await prisma.node.delete({
            where: { id: nodeId },
            select: buildNodeSelect(args.fieldsToSelect)
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

export default deleteNode;