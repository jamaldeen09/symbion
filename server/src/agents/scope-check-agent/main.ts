import { Type } from "@google/genai";
import { genAI } from "../../config/google-genai";
import { SYMBION_GENRES } from "./genres";
import { leanPrompt } from "../../lib/utils";

export type ScopeDecision = "approved" | "redirect" | "refused";

export interface ScopeCheckResult {
    decision: ScopeDecision;
    genre?: string; // best-fit genre id — present when decision is "approved"
    reason: string; // short internal-facing reason, for logs/debugging
    userMessage?: string; // friendly message to show the user — present for "redirect" and "refused"
}

const scopeCheckSchema = {
    type: Type.OBJECT,
    properties: {
        decision: {
            type: Type.STRING,
            enum: ["approved", "redirect", "refused"],
            description:
                "'approved' = fits one of the available genres and is small enough to build directly. " +
                "'redirect' = too big or doesn't fit a genre as literally asked, but a smaller in-scope version exists. " +
                "'refused' = a literal clone of a named branded product, or a content-policy violation, with no reasonable smaller version.",
        },
        genre: {
            type: Type.STRING,
            description:
                "The id of the closest-fit genre from the provided list — found through creative reinterpretation if there's no literal match. Required when decision is 'approved'.",
        },
        reason: {
            type: Type.STRING,
            description:
                "One short sentence explaining the decision — if genre matching required reinterpretation, briefly note the mapping (e.g. 'recipe app reinterpreted as Notes Board with a rating twist'). For internal logs only.",
        },
        userMessage: {
            type: Type.STRING,
            description:
                "A brief, friendly, user-facing message. Required when decision is 'redirect' (offer the smaller version) or 'refused' (explain why, kindly). Omit when approved.",
        },
    },
    required: ["decision", "reason"],
};

const SCOPE_CHECK_INSTRUCTION = `You are a fast pre-flight scope checker for Symbion, a platform where an AI agent builds small static‑only mini-apps inside pre-built genre scaffolds. You do not build anything yourself — you only decide whether a request should be passed to the building agent.

Genres are broad archetypes, not literal categories. Most requests that don't name a genre outright can still be creatively reinterpreted as a version of one — do that before considering a request out of scope. For example: "a recipe-sharing app for my friends" isn't a genre on the list, but it maps naturally onto Notes Board (recipe cards as notes, with a "rate this dish" multiplayer twist). "Let's vote on where to eat" maps onto Poll & Decision Tool. Stretch toward the closest fit; don't require a literal match.

Approve a request if, after that reinterpretation, it realistically fits inside ONE of the provided genres and doesn't require things the platform doesn't support:
- Persistent user accounts/auth beyond what the platform already provides.
- Real payments or monetary transactions.
- File storage beyond basic images.
- External API integrations needing secret keys.
- A custom backend service, server, database, or WebSocket connections.

⚠️ **Server‑side and real‑time requests**:
- If the request explicitly asks for "WebSockets", "server", "database", "authentication", or "real‑time" in the sense of persistent live connections, **refuse or redirect**.
- Redirect to a static alternative where possible. For example:
  - "real‑time chat" → redirect to "a static chat interface with polling or turn‑based messaging"
  - "multiplayer game with WebSockets" → redirect to "a turn‑based game with client‑side state management"
  - "a server‑side API" → redirect to "a static mock or client‑side data store"

Redirect (don't refuse) if the request is too big as literally stated, or doesn't cleanly reinterpret into any genre, but has a smaller or adapted version that does — propose that version in userMessage. Most requests have a buildable core hiding inside them; find it before giving up.

Refuse only if the request is:
- A literal clone of a specific named, branded product (e.g. "build me Discord", "build me Lovable").
- A request that explicitly demands WebSockets, a server, a database, or real‑time persistent connections with no reasonable static alternative.
- Violates basic content policy (malicious, deceptive, explicit, harassing).
- Genuinely cannot be reinterpreted into anything resembling the available genres even with generous stretching.

Be kind and brief in userMessage either way — this should feel like a creative nudge, never a wall.`;

export async function evaluateRequestScope(message: string): Promise<ScopeCheckResult> {
    // Only genres with a real scaffold behind them are ever offered to the
    // classifier — see the scaffoldReady note in genres.ts.
    const availableGenres = SYMBION_GENRES.filter((g) => g.scaffoldReady);
    const genreList = availableGenres.map((g) => `- ${g.id}: ${g.label} — ${g.description}`).join("\n");

    try {
        const response = await genAI.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: `Available genres:\n${genreList}\n\nUser request: "${message}"`,
            config: {
                systemInstruction: leanPrompt(SCOPE_CHECK_INSTRUCTION),
                temperature: 0,
                responseMimeType: "application/json",
                responseSchema: scopeCheckSchema,
            },
        });

        const parsed = JSON.parse(response.text ?? "{}") as Partial<ScopeCheckResult>;

        if (!parsed.decision || !parsed.reason) {
            // Malformed output — fail closed rather than letting an unparseable
            // response silently slip through to the expensive, tool-enabled agent.
            return {
                decision: "redirect",
                reason: "Scope check returned malformed output.",
                userMessage: "I couldn't quite parse that one — could you rephrase what you'd like to build?",
            };
        }

        return parsed as ScopeCheckResult;
    } catch (err) {
        console.error("evaluateRequestScope failed:", err);
        return {
            decision: "redirect",
            reason: "Scope check failed unexpectedly.",
            userMessage: "Something went wrong checking that request — mind trying again?",
        };
    }
}
