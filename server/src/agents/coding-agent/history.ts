import type { Content, Part } from "@google/genai";
import { Prisma } from "@/generated";
import { prisma } from "../../config/prisma";
import { getPrismaErrorDetails } from "../../lib/utils";

interface LoadHistoryResult {
  status: "success" | "error";
  history: Content[];
  error?: ReturnType<typeof getPrismaErrorDetails>;
}

export async function loadHistory(surfaceId: string): Promise<LoadHistoryResult> {
  try {
    const messages = await prisma.agentMessage.findMany({
      where: { surfaceId },
      orderBy: { createdAt: "asc" },
    });
    return {
      status: "success",
      history: messages.map((m) => ({
        role: m.role,
        parts: m.parts as Part[],
      })),
    };
  } catch (err) {
    console.error(`loadHistory failed for surface ${surfaceId}:`, err);
    return {
      status: "error",
      history: [],
      error: getPrismaErrorDetails(err),
    };
  }
}

interface AppendHistoryResult {
  status: "success" | "error";
  error?: ReturnType<typeof getPrismaErrorDetails>;
}

export async function appendHistory(surfaceId: string, newEntries: Content[]): Promise<AppendHistoryResult> {
  if (newEntries.length === 0) 
    return { status: "success" };

  try {
    await prisma.agentMessage.createMany({
      data: newEntries.map((entry) => ({
        surfaceId,
        role: entry.role ?? "user",
        parts: (entry.parts ?? []) as unknown as Prisma.InputJsonValue,
      })),
    });
    return { status: "success" };
  } catch (err) {
    console.error(`appendHistory failed for surface ${surfaceId}:`, err);
    return {
      status: "error",
      error: getPrismaErrorDetails(err),
    };
  }
}