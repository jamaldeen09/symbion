"use client"
import { removeWindowFromSaved } from "@/app/surface/[surfaceId]/_actions";
import { useMutation } from "@tanstack/react-query"

export default function useRemoveWindowFromSaved () {
    return useMutation({
        mutationFn: removeWindowFromSaved,
    });
}