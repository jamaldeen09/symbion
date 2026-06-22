import { Prisma } from "@/generated/prisma";
import { WindowData } from "@/hooks/windows/use-window-store";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// In generateSurfaceHash — hash only what represents visual state
const HASH_KEYS: (keyof WindowData)[] = ["id", "xPos", "yPos", "width", "height", "zIndex", "mode"];

export async function generateSurfaceHash({ windows }: { windows: Map<string, WindowData> }) {
  const sorted = Array.from(windows.values())
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(w => HASH_KEYS.reduce((acc, k) => ({ ...acc, [k]: w[k] }), {}));

  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify(sorted));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export function getPrismaErrorMessage(error: unknown, fallbackMessage?: string): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const field = (error.meta?.target as string[])?.[0];
        return field
          ? `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different value.`
          : 'A record with this value already exists.';

      case 'P2003':
        return 'This record is referenced by other data and cannot be deleted.';

      case 'P2001':
      case 'P2025':
        return 'The requested record was not found.';

      case 'P2011':
        const fieldName = error.meta?.field_name as string;
        return fieldName
          ? `${fieldName} is required.`
          : 'A required field is missing.';

      case 'P2006':
        return 'Invalid data type provided. Please check your input.';

      case 'P2024':
        return 'Database is busy. Please try again in a moment.';

      case 'P2030':
        return 'Too many requests. Please try again later.';

      case 'P1000':
      case 'P1001':
      case 'P1002':
        return 'Database connection failed. Please try again later.';

      case 'P2023':
        return 'Query took too long. Please try a simpler request.';

      default:
        return `Database error: ${error.message}`;
    }
  }

  // Handle Prisma validation errors
  if (error instanceof Prisma.PrismaClientValidationError) {
    return 'Invalid data provided. Please check your input.';
  }

  // Handle Prisma initialization errors
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return 'Failed to connect to database. Please check your connection.';
  }

  // Handle Prisma Rust panic
  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return 'A critical database error occurred. Please try again.';
  }

  // Fallback
  return fallbackMessage ?? 'An unexpected error occurred.';
}