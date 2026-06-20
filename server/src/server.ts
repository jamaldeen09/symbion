import express from "express";
import http from "http";
import dotenv from "dotenv"
import cors from "cors";
import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { TokenVerificationError } from "@clerk/backend/errors";
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


const port = process.env.PORT ?? "3000";
server.listen(parseInt(port), () => console.log(`Server is running on http://localhost:${port}`));