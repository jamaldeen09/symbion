"use client";
import { useShallow } from "zustand/react/shallow";
import { useWindowStore } from "@/hooks/windows/use-window-store";
import IdeContainer from "./ide/IdeContainer";
import Window from "./Window";
import { useRemoveWindow } from "@/hooks/windows/use-remove-window";

export default function Windows({ surfaceId }: { surfaceId: string; }) {
  const hasHydrated = useWindowStore((s) => s._hasHydrated);
  const windowIds = useWindowStore(useShallow((state) => Array.from(state.windows.keys())));
  const { mutate: removeWindow } = useRemoveWindow(surfaceId);

  if (!hasHydrated) return null;
  return (
    <main className="h-full w-full">
      {windowIds.map((id) => (
        <Window key={id} id={id} onDelete={(id) => removeWindow(id)}>
          <IdeContainer />
        </Window>
      ))}
    </main>
  );
}