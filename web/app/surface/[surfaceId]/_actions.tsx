"use server"
const id = crypto.randomUUID()
import { Artifact } from "@/redux/slices/artifacts-slice"

const artifact: Artifact = {
    id,  
    name: "Sybmbion IDE", 
    description: "A coding IDE",
    iconUrl: "https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fuxwing.com%2Fcursor-ai-code-icon%2F&ved=0CBYQjRxqGAoTCMCZ8YDhk5UDFQAAAAAdAAAAABCYAQ&opi=89978449",
    windowData: {
        id: crypto.randomUUID(), 
        x: 448,
        y: 208,
        width: 384,
        height: 384,
        zIndex: 10, 
        mode: "default", 
        updatedAt: Date.now(),
    }, 
};

let artifacts = [artifact];   

export const fetchSavedArtifactWindows = async (surfaceId: string, artifactWindowIds?: string[]) => {
    return artifacts.map(({ windowData }) => windowData); 
};

export const removeArtifactWindowFromSaved = async (artifactWindowId: string) => {
    artifacts = artifacts.filter(({ windowData: { id } }) => {
        console.log(id !== artifactWindowId);
        return id !== artifactWindowId
    });
    return "OK";
};

export const fetchSavedArtifactWindowsMeta = async (surfaceId: string) => {
    return {
        surfaceHash: "this is a hash",
        count: artifacts.length,
        manifest: artifacts.map(({ windowData: { id, updatedAt } }) => ({ id, updatedAt })),
    }
}