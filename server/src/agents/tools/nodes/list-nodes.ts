import { SafeNodeField, Tool } from "../../../types/agent";
import { buildNodeSelect, getPrismaErrorDetails } from "../../../lib/utils";
import { prisma } from "../../../config/prisma";

export interface ListNodesArgs {
    surfaceId?: string,
    howMany?: number,
    specificNodes?: string[],
}

const listNodes: Tool<ListNodesArgs, SafeNodeField> = async (args) => {
    const startTime = Date.now();
    const surfaceId = args?.surfaceId;
    const specificNodes = args?.specificNodes;
    const howMany = args?.howMany;

    if (!surfaceId) {
        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: "Cannot list nodes. Missing required argument: surfaceId.",
                details: {
                    required: [
                        "surfaceId: string (the unique identifier of the surface whose nodes you want to list)",
                    ],
                    provided: {
                        surfaceId: surfaceId ? 'received (string)' : 'undefined/null',
                        specificNodes: specificNodes ? `array (${specificNodes.length} IDs)` : 'undefined/null',
                        howMany: howMany ? `number (${howMany})` : 'undefined/null',
                    },
                },
                suggestion:
                    "Step 1: Retrieve the user's surface ID using the 'getUserSurface' tool (or pass it from context). " +
                    "Step 2: If you already have a surfaceId but it's not passed to this tool, ensure you're forwarding it from the previous tool's result. " +
                    "Step 3: Call 'listNodes' again with the 'surfaceId' argument set to a valid string.",
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }

    try {
        const nodes = await prisma.node.findMany({
            where: {
                id: specificNodes && specificNodes.length > 0
                    ? { in: specificNodes }
                    : undefined
            },
            take: howMany,
            orderBy: specificNodes && specificNodes.length > 0
                ? undefined
                : [
                    { position: 'asc' },
                    { createdAt: 'asc' }
                ],
            select: buildNodeSelect(args.fieldsToSelect)
        });

        return {
            status: "success",
            data: nodes,
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
                ...(nodes.length <= 0 ? {
                    name: "No nodes found in this surface. The surface may be empty, or the 'specificNodes' filter didn't match any IDs. " +
                        "If you want to create a node, use the 'createNode' tool with a payload containing at least { name: string, isFolder: boolean }.",
                } : {})
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

export default listNodes