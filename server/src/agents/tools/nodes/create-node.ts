import { buildNodeSelect, formatNodeForPrisma, getPrismaErrorDetails } from "../../../lib/utils";
import { SafeNodeField, Tool } from "../../../types/agent";
import { prisma } from "../../../config/prisma";

export interface MinimalNode {
    name: string;
    isFolder: boolean;

    parentId?: string;
    children?: MinimalNode[]
    fileBlobId?: string
    fileBlob?: {
        extension: string;
        content: string;
    }
};

const createNode: Tool<{ node: MinimalNode; surfaceId: string }, SafeNodeField> = async (args) => {
    const node = args?.node;
    const surfaceId = args?.surfaceId;
    const startTime = Date.now();
    const missing: string[] = [];

    if (!node) missing.push("node");
    if (!surfaceId) missing.push("surfaceId");

    if (missing.length > 0) {
        // Build a clear picture of what the agent actually provided
        const provided = {
            node: node ? 'received (object)' : 'undefined/null',
            surfaceId: surfaceId ? 'received (string)' : 'undefined/null',
        };

        // Craft a dynamic suggestion based on what's missing
        let suggestion = '';
        if (missing.includes('surfaceId') && missing.includes('node')) {
            suggestion =
                "Step 1: Retrieve the user's surface ID using the 'getUserSurface' tool (or pass it from the context). " +
                "Step 2: Build the node payload with at least { name: string, isFolder: boolean }. " +
                "Step 3: Call createNode() with both arguments.";
        } else if (missing.includes('surfaceId')) {
            suggestion =
                "The surfaceId is missing. Fetch the current user's surface ID via the 'getUserSurface' tool first, " +
                "or ensure you're passing the 'surfaceId' from the parent tool's context.";
        } else {
            suggestion =
                "The 'node' payload is missing. Construct it with at least { name: string, isFolder: boolean }. " +
                "If you're moving a node, include 'parentId' or 'fileBlob' as needed.";
        }

        return {
            status: "error",
            error: {
                code: "MISSING_REQUIRED_ARGUMENTS",
                message: `Cannot create node. Missing argument(s): ${missing.join(', ')}.`,
                details: {
                    required: ['node: { name: string, isFolder: boolean, ...optional }', 'surfaceId: string'],
                    provided,
                },
                suggestion,
            },
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            },
        };
    }


    try {
        // Try to create the node
        const formattedNode = await formatNodeForPrisma(node!, surfaceId!);
        const createdNode = await prisma.node.create({
            data: formattedNode,
            select: buildNodeSelect(args.fieldsToSelect)
        });

        return {
            status: "success",
            data: createdNode,
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime
            }
        }
    } catch (err) {
        console.log("Received error:", err);
        return {
            status: "error",
            error: getPrismaErrorDetails(err),
            metadata: {
                timestamp: new Date().toISOString(),
                executionTimeMs: Date.now() - startTime,
            }
        };
    }
}

export default createNode;