import { PrismaClient } from "@/generated"
import { neonConfig } from '@neondatabase/serverless'
import { PrismaNeon } from '@prisma/adapter-neon'
import ws from "ws"
import dotenv from "dotenv"
dotenv.config();
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not defined");
neonConfig.webSocketConstructor = ws

const connectionString = process.env.DATABASE_URL
const adapter = new PrismaNeon({ connectionString });
const globalForPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter })
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma