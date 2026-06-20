"use client"

import { removeArtifactWindowFromSaved } from "@/app/surface/[surfaceId]/_actions";
import { useMutation } from "@tanstack/react-query"

export default function useRemoveArtifactWindowFromSaved () {
    return useMutation({
        mutationFn: removeArtifactWindowFromSaved,
    });
}