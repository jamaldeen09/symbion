import { ArtifactWindowData } from "@/app/hooks/artifact-window/use-artifact-window-store";
import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface Artifact {
    id: string;
    iconUrl: string;
    name: string;
    description: string | null;
    windowData: ArtifactWindowData;
};

const initialState: { artifacts: Artifact[] } = { artifacts: [] };

export const artifactsSlice = createSlice({
    initialState,
    name: "artifacts-slice",
    reducers: {
        newArtifact: (state, action: PayloadAction<{
            type: "bulk" | "single",
            data: Artifact | Artifact[]
        }>) => {
            const { type, data } = action.payload
            let updatedState = [...state.artifacts];

            switch (type) {
                case "bulk":
                    if (!Array.isArray(data)) return;
                    updatedState = [...updatedState, ...data];
                    break;

                case "single":
                    updatedState = [...updatedState, data as Artifact];
                    break;
            };

            state.artifacts = updatedState;
        },

        removeArtifact: (state, action: PayloadAction<{ id: string; }>) => {
            const { id } = action.payload;
            let updatedState = [...state.artifacts];
            updatedState = state.artifacts.filter(({ id: artifactId }) => artifactId !== id);
            state.artifacts = updatedState
        }
    }
});

export const {
    newArtifact,
    removeArtifact,
} = artifactsSlice.actions

