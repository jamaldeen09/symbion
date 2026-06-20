"use client";
import React, { useEffect } from "react";
import { Rnd } from "react-rnd";
import { ArtifactWindowData, useArtifactWindowStore } from "@/app/hooks/artifact-window/use-artifact-window-store";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import useRemoveArtifactWindowFromSaved from "@/app/hooks/artifact-window/use-remove-artifact-window-from-saved";

function DefaultArtifactWindow({
    windowData,
    children,
    width = ({ min: 200 }),
    height = ({ min: 200 })
}: {
    children: React.ReactNode,
    windowData: ArtifactWindowData,
    width?: { min: number; max?: number };
    height?: { min: number; max?: number; };
}) {
    const { updateArtifactWindow, bringToFront } = useArtifactWindowStore();
    return (
        <Rnd
            size={{ width: windowData.width, height: windowData.height }}
            position={{ x: windowData.x, y: windowData.y }}
            onDragStop={(_, d) => updateArtifactWindow(windowData.id, { x: d.x, y: d.y })}
            onResizeStop={(_, __, ref, ___, pos) => updateArtifactWindow(windowData.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: pos.x,
                y: pos.y
            })}
            onMouseDown={() => bringToFront(windowData.id)}
            style={{ zIndex: windowData.zIndex }}
            dragHandleClassName="window-header"
            minWidth={width.min}
            minHeight={height.min}
            bounds="parent"
        >
            {children}
        </Rnd>
    )
}

export default function ArtifactWindow({
    id,
    className,
    children,
}: {
    id: string,
    children: React.ReactNode,
    className?: string;
}) {
    const { 
        registerArtifactWindow, 
        updateArtifactWindow, 
        removeArtifactWindow, 
        _hasHydrated 
    } = useArtifactWindowStore();
    const { mutate } = useRemoveArtifactWindowFromSaved();
    const artifactWindowData = useArtifactWindowStore((state) => state.windows.get(id));
    const defaultX = (typeof window !== 'undefined' ? window.innerWidth : 1280) / 2 - 192;
    const defaultY = (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 - 192;
    
    const variants = {
        "full-screen": "fixed inset-0 h-[90vh] rounded-none",
        "default": "w-full h-full rounded-xl shadow-2xl"
    }

    // Register the artifact window if it doesn't exist
    useEffect(() => {
        if (_hasHydrated && !artifactWindowData) {
            return registerArtifactWindow(id, {
                id,
                x: defaultX,
                y: defaultY,
                width: 384,
                height: 384,
                zIndex: 10,
                mode: "default",
                updatedAt: Date.now(),
            });
        }
    }, [_hasHydrated, id, artifactWindowData, registerArtifactWindow, defaultX, defaultY]);

    useEffect(() => {
        const handleSetToFullScreen = () => {

            if (window.innerWidth > 764 || !artifactWindowData) return;

            // Update the position of the artifact (back to the center) anytime
            // the screen resizes while below/equals to 764px
            return updateArtifactWindow(artifactWindowData.id, {
                x: defaultX,
                y: defaultY
            })
        }

        window.addEventListener("resize", handleSetToFullScreen);
        return () => window.removeEventListener("resize", handleSetToFullScreen);
    }, [artifactWindowData, defaultX, defaultY]);

    useEffect(() => {
        console.log("Artifact window data id in ArtifactWindow component: ", artifactWindowData?.id)
    }, [artifactWindowData])

    const artifactWindowContent = artifactWindowData && (
        <div
            style={{ zIndex: artifactWindowData.zIndex }}
            className={cn(variants[artifactWindowData.mode], className, "flex flex-col")}
        >
            {/* Top bar */}
            <header
                className={`${artifactWindowData.mode === "default" ? "window-header rounded-t-xl" : "rounded-none"
                    } bg-white/12 backdrop-blur-xl h-8 flex items-center justify-between px-3 text-xs text-white`}
            >
                {/* Title on the Left */}
                <h2 className="text-black">Artifact {artifactWindowData.id.slice(0, 8)}</h2>

                {/* Buttons on the Right */}
                <div className="flex items-center gap-2">
                    {/* Toggle Mode Button (Using your icon) */}
                    <button
                        onClick={() =>
                            updateArtifactWindow(artifactWindowData.id, {
                                mode: artifactWindowData.mode === "full-screen" ? "default" : "full-screen"
                            })
                        }
                        className="hover:bg-white/10 p-1 rounded transition-colors"
                    >
                        <svg className="size-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <path d="M9 3v18" />
                        </svg>
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={() => {
                            mutate(artifactWindowData.id);
                            removeArtifactWindow(artifactWindowData.id);
                        }}
                        className="hover:bg-red-500/20 hover:text-red-400 p-1 rounded transition-colors"
                    >
                        <X className="size-3"/>
                    </button>
                </div>
            </header>

            {/* Body */}
            <main className={cn("flex-1 overflow-hidden relative", artifactWindowData.mode === "default" && "rounded-b-xl")}>
                {children}
            </main>
        </div>
    );

    // Make sure the artifact window exists before showing any
    if (!_hasHydrated) return <>Loading....</>
    if (!artifactWindowData) return null;
    if (artifactWindowData.mode === "full-screen") return artifactWindowContent;
    return <DefaultArtifactWindow windowData={artifactWindowData}>{artifactWindowContent}</DefaultArtifactWindow>
};

