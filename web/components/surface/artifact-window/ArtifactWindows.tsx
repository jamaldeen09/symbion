"use client";
import { useShallow } from "zustand/react/shallow";
import { useArtifactWindowStore } from "@/app/hooks/artifact-window/use-artifact-window-store";
import ArtifactWindow from "./ArtifactWindow";
import IdeContainer from "../ide/IdeContainer";

export default function ArtifactWindows() {
  const hasHydrated = useArtifactWindowStore((s) => s._hasHydrated);
  const windowIds = useArtifactWindowStore(useShallow((state) => Array.from(state.windows.keys())));

  if (!hasHydrated) return null;
  return (
    <main className="h-full w-full">
      {windowIds.map((id) => (
        <ArtifactWindow key={id} id={id}>
          <IdeContainer />
        </ArtifactWindow>
      ))}
    </main>
  );
}