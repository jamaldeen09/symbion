"use client";
import { useShallow } from "zustand/react/shallow";
import { useWindowStore } from "@/hooks/windows/use-window-store";
import IdeContainer from "./ide/IdeContainer";
import Window from "./Window";

export default function Windows() {
  const hasHydrated = useWindowStore((s) => s._hasHydrated);
  const windowIds = useWindowStore(useShallow((state) => Array.from(state.windows.keys())));

  if (!hasHydrated) return null;
  return (
    <main className="h-full w-full">
      {windowIds.map((id) => (
        <Window key={id} id={id}>
          <IdeContainer />
        </Window>
      ))}
    </main>
  );
}