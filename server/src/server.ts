import express from "express";
import http from "http";
import dotenv from "dotenv"
import cors from "cors";
import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { TokenVerificationError } from "@clerk/backend/errors";
import createNode from "./agents/tools/nodes/create-node";
import { prisma } from "./config/prisma";
import listNodes from "./agents/tools/nodes/list-nodes";
import updateNode from "./agents/tools/nodes/update-node";
import deleteNode from "./agents/tools/nodes/delete-node";
import { getProjectTreeSnapshot } from "./lib/tree-snapshot";
import seedBoilerPlate from "./lib/seed-boilerplate";
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.WEB_URL,
        methods: ["GET", "POST"]
    },
    connectionStateRecovery: {
        maxDisconnectionDuration: 60 * 1000,
        skipMiddlewares: false
    }
});

// Mount socket.io middleware to make sure
// every connected socket is authenticated
io.use(async (socket, next) => {
    const token =
        socket.handshake.auth.token ||
        (socket.handshake.query.token as string);

    if (!token) return next(new Error("Missing authentication token"));

    try {
        const payload = await verifyToken(token, {
            secretKey: process.env.CLERK_SECRET_KEY,
            jwtKey: process.env.CLERK_JWT_KEY,
            authorizedParties: [process.env.CLIENT_URL!],
        });

        socket.data.userId = payload.sub;
        next();
    } catch (err) {
        if (err instanceof TokenVerificationError)
            return next(new Error("Invalid token: " + err.message));

        console.error("Socket auth error:", err);
        return next(new Error("Authentication failed"));
    }
});



// Setup global middlewares
app.use(express.json());
app.use(cors({
    origin: process.env.WEB_URL,
    methods: ["GET", "POST"]
}));

app.post("/nodes", async (req, res) => {
    const node = req.body.node;
    const surfaceId = req.body.surfaceId;

    if (!node || !surfaceId) return res.status(400).send("node or surfaceId missing");

    const result = await createNode({ node, surfaceId });
    return res.status(200).json(result)
})

app.get("/nodes", async (req, res) => {
    const surfaceId = req.query.surfaceId as string | undefined;
    if (!surfaceId) return res.status(400).send("surfaceId missing");

    return res.status(200).json(await listNodes({
        surfaceId,
        howMany: req.body.howMany ?? undefined,
        specificNodes: req.body.specificNodes ?? undefined,
        fieldsToSelect: [
            "name",
            "id",
            "isFolder",
            "fileBlob.extension",
            "fileBlob.mimeType",
            "parentId",
            "fileBlobId"
        ],
    }));
});


app.put("/nodes/:nodeId", async (req, res) => {
    const nodeId = req.params.nodeId;
    if (!nodeId) return res.status(400).send("nodeId missing");

    return res.status(200).json(await updateNode({
        nodeId,
        data: { name: "Todo App" }
    }))
})

app.post("/surface", async (req, res) => {
    const userId = req.query.userId as string | undefined;
    if (!userId) return res.status(400).send("UserId required");

    res.status(200).json(await prisma.surface.create({
        data: { userId },
    }));
});

app.delete("/nodes/:nodeId", async (req, res) => {
    const nodeId = req.params.nodeId;
    if (!nodeId) return res.status(400).send("nodeId missing");

    return res.status(200).json(await deleteNode({
        nodeId,
        fieldsToSelect: ["name", "id", "isFolder"]
    }));
});
// ─────────────────────────────────────────────
//  GET /tree-snapshot
// ─────────────────────────────────────────────
app.get("/tree-snapshot", async (req, res) => {
    const surfaceId = req.query.surfaceId as string | undefined;
    if (!surfaceId) {
        return res.status(400).send("surfaceId missing");
    }

    try {
        const snapshot = await getProjectTreeSnapshot(surfaceId);
        return res.status(200).json({ snapshot });
    } catch (error) {
        console.error("Failed to generate tree snapshot:", error);
        return res.status(500).json({
            error: error instanceof Error ? error.message : "Internal server error"
        });
    }
});

// ─────────────────────────────────────────────
//  POST /scaffold
// ─────────────────────────────────────────────
app.post("/scaffold", async (req, res) => {
    const { genreId, surfaceId, parentId } = req.body;

    if (!surfaceId) {
        return res.status(400).send("surfaceId missing");
    }
    if (!genreId) {
        return res.status(400).send("genreId missing");
    }

    try {
        const result = await seedBoilerPlate({ genreId, surfaceId, parentId });
        return res.status(200).json(result); // { rootNodeId: "..." }
    } catch (error) {
        console.error("Failed to seed boilerplate:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return res.status(500).json({ error: message });
    }
});

const port = process.env.PORT ?? "3000";
server.listen(parseInt(port), () => console.log(`Server is running on http://localhost:${port}`));
