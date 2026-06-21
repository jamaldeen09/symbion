import type { Content, Part } from "@google/genai";
import { loadHistory, appendHistory } from "./history";
import { genAI } from "../../config/google-genai";
import { agentTools } from "../tools/list";
import { leanPrompt } from "../../lib/utils";
import { SYMBION_GENRES } from "../scope-check-agent/genres";
import { buildSystemInstruction } from "./system-instruction";
import createNode from "../tools/nodes/create-node";
import listNodes from "../tools/nodes/list-nodes";
import updateNode from "../tools/nodes/update-node";
import deleteNode from "../tools/nodes/delete-node";
import createFileBlob from "../tools/file-blobs/create-file-blob";
import getFileBlob from "../tools/file-blobs/get-file-blob";
import updateFileBlob from "../tools/file-blobs/update-file-blob";
import deleteFileBlob from "../tools/file-blobs/delete-file-blob";
import { getProjectTreeSnapshot } from "../../lib/tree-snapshot";

const MAX_TOOL_CALL_LOOPS = 8;

export interface RunCodingAgentResult {
    status: "success" | "error";
    reply?: string;
    history?: Content[];
    historyPersisted?: boolean;
    error?: string;
}

export async function runCodingAgent(
    surfaceId: string,
    message: string,
    genreId: string,
    genreFraming?: string
): Promise<RunCodingAgentResult> {
    const genre = SYMBION_GENRES.find((g) => g.id === genreId);
    if (!genre) {
        return {
            status: "error",
            error: `Unknown genre: ${genreId}`,
        };
    }

    // Load history for this surface only
    const loaded = await loadHistory(surfaceId);
    if (loaded.status === "error") {
        return {
            status: "error",
            error: `Failed to load conversation history: ${loaded.error?.message ?? "unknown error"}`,
        };
    }

    try {
        const chat = genAI.chats.create({
            model: "gemini-2.5-flash",
            config: {
                systemInstruction: buildSystemInstruction(genre),
                tools: agentTools,
                temperature: 0.2,
            },
            history: loaded.history,
        });

        // Fetch current tree snapshot for context
        const treeSnapshot = await getProjectTreeSnapshot(surfaceId);

        let response = await chat.sendMessage({
            message: leanPrompt(
                `[Context: surfaceId = ${surfaceId}, genre = ${genre.label}]` +
                (genreFraming ? `\n[How this request fits the genre: ${genreFraming}]` : "") +
                `\n[Current file tree:\n${treeSnapshot}]` +
                `\nUser: ${message}`
            ),
        });

        let loops = 0;
        while (response.functionCalls && response.functionCalls.length > 0) {
            if (++loops > MAX_TOOL_CALL_LOOPS) {
                const history = chat.getHistory();
                const historyPersisted = await persistNewTurns(surfaceId, loaded.history, history);
                return {
                    status: "error",
                    error: "Agent exceeded the maximum number of tool calls for this turn.",
                    history,
                    historyPersisted,
                };
            }

            const functionResponseParts: Part[] = await Promise.all(
                response.functionCalls.map(async (call) => {
                    console.log(`Agent executing: ${call.name}`);
                    let toolResult;
                    try {
                        toolResult = await executeTool(call.name, call.args ?? {}, surfaceId);
                    } catch (toolError) {
                        toolResult = {
                            status: "error",
                            error: { message: toolError instanceof Error ? toolError.message : "Tool execution failed" },
                        };
                    }
                    return {
                        functionResponse: {
                            id: call.id,
                            name: call.name,
                            response: toolResult as Record<string, unknown>,
                        },
                    };
                })
            );

            response = await chat.sendMessage({ message: functionResponseParts });
        }

        const finalHistory = chat.getHistory();
        const historyPersisted = await persistNewTurns(surfaceId, loaded.history, finalHistory);

        return {
            status: "success",
            reply: response.text,
            history: finalHistory,
            historyPersisted,
        };
    } catch (error) {
        console.error("Agent run failed:", error);
        return {
            status: "error",
            error: error instanceof Error ? error.message : "Unknown agent error",
        };
    }
}

/**
 * Saves only the turns added since `priorHistory` was loaded.
 * Now scoped to `surfaceId`.
 */
async function persistNewTurns(
    surfaceId: string,
    priorHistory: Content[],
    fullHistory: Content[]
): Promise<boolean> {
    const newEntries = fullHistory.slice(priorHistory.length);
    const result = await appendHistory(surfaceId, newEntries);
    if (result.status === "error") {
        console.error(`Failed to persist agent history for surface ${surfaceId}:`, result.error);
        return false;
    }
    return true;
}

// Tool dispatcher
async function executeTool(
    name: string | undefined,
    args: Record<string, any>,
    surfaceId: string
) {
    switch (name) {
        case "createNode":
            return createNode({
                ...args,
                surfaceId,
                fieldsToSelect: args.fieldsToSelect,
            });
        case "listNodes":
            return listNodes({
                surfaceId,
                howMany: args.howMany,
                specificNodes: args.specificNodes,
                fieldsToSelect: args.fieldsToSelect,
            });
        case "updateNode":
            return updateNode({
                nodeId: args.nodeId,
                data: args.data,
                fieldsToSelect: args.fieldsToSelect,
            });
        case "deleteNode":
            return deleteNode({
                nodeId: args.nodeId,
                fieldsToSelect: args.fieldsToSelect,
            });
        case "createFileBlob":
            return createFileBlob({
                extension: args.extension,
                content: args.content,
                url: args.url,
                width: args.width,
                height: args.height,
                duration: args.duration,
                fieldsToSelect: args.fieldsToSelect,
            });
        case "getFileBlob":
            return getFileBlob({
                id: args.id,
                fieldsToSelect: args.fieldsToSelect,
            });
        case "updateFileBlob":
            return updateFileBlob({
                id: args.id,
                data: args.data,
                fieldsToSelect: args.fieldsToSelect,
            });
        case "deleteFileBlob":
            return deleteFileBlob({ id: args.id });
        default:
            return {
                status: "error",
                error: { message: `Unknown tool: ${name}` },
            };
    }
}