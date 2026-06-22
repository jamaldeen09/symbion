"use client";
import React, { useEffect } from "react";
import { Rnd } from "react-rnd";
import { WindowData, useWindowStore } from "@/hooks/windows/use-window-store";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

function DefaultWindow({
    windowData,
    children,
    width = ({ min: 200 }),
    height = ({ min: 200 })
}: {
    children: React.ReactNode,
    windowData: WindowData,
    width?: { min: number; max?: number };
    height?: { min: number; max?: number; };
}) {
    const { updateWindow, bringToFront } = useWindowStore();
    return (
        <Rnd
            size={{ width: windowData.width, height: windowData.height }}
            position={{ x: windowData.xPos, y: windowData.yPos }}
            onDragStop={(_, d) => updateWindow(windowData.id, { xPos: d.x, yPos: d.y })}
            onResizeStop={(_, __, ref, ___, pos) => updateWindow(windowData.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                xPos: pos.x,
                yPos: pos.y
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

export default function Window({
    id,
    className,
    onDelete,
    children,
}: {
    id: string,
    children: React.ReactNode,
    onDelete: (id: string) => void;
    className?: string;
}) {
    const {
        registerWindow,
        updateWindow,
        _hasHydrated
    } = useWindowStore();
    // const { mutate } = useRemoveWindow();
    const windowData = useWindowStore((state) => state.windows.get(id));
    const defaultX = (typeof window !== 'undefined' ? window.innerWidth : 1280) / 2 - 192;
    const defaultY = (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 - 192;

    const variants = {
        "full_screen": "fixed inset-0 h-[90vh] rounded-none",
        "default": "w-full h-full rounded-xl shadow-2xl"
    }

    // Register the window if it doesn't exist
    useEffect(() => {
        if (_hasHydrated && !windowData) {
            return registerWindow(id, {
                id,
                xPos: defaultX,
                yPos: defaultY,
                width: 384,
                height: 384,
                zIndex: 10,
                mode: "default",
                updatedAt: new Date(),
            });
        }
    }, [_hasHydrated, id, windowData, registerWindow, defaultX, defaultY]);

    useEffect(() => {
        const handleSetToFullScreen = () => {
            if (window.innerWidth > 764 || !windowData) return;
            return updateWindow(windowData.id, {
                xPos: defaultX,
                yPos: defaultY
            })
        }

        window.addEventListener("resize", handleSetToFullScreen);
        return () => window.removeEventListener("resize", handleSetToFullScreen);
    }, [windowData, defaultX, defaultY]);

    const windowContent = windowData && (
        <div
            style={{ zIndex: windowData.zIndex }}
            className={cn(variants[windowData.mode], className, "flex flex-col")}
        >
            {/* Top bar */}
            <header
                className={`${windowData.mode === "default" ? "window-header rounded-t-xl" : "rounded-none"
                    } bg-white/12 backdrop-blur-xl h-8 flex items-center justify-between px-3 text-xs text-white`}
            >
                {/* Title on the Left */}
                <h2 className="text-black">Windoiw {windowData.id.slice(0, 8)}</h2>

                {/* Buttons on the Right */}
                <div className="flex items-center gap-2">
                    {/* Toggle Mode Button (Using your icon) */}
                    <button
                        onClick={() =>
                            updateWindow(windowData.id, {
                                mode: windowData.mode === "full_screen" ? "default" : "full_screen"
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
                        onClick={() => onDelete(id)}
                        className="hover:bg-red-500/20 hover:text-red-400 p-1 rounded transition-colors"
                    >
                        <X className="size-3" />
                    </button>
                </div>
            </header>

            {/* Body */}
            <main className={cn("flex-1 overflow-hidden relative", windowData.mode === "default" && "rounded-b-xl")}>
                {children}
            </main>
        </div>
    );

    // Make sure the window exists before showing any
    if (!_hasHydrated) return <>Loading....</>
    if (!windowData) return null;
    if (windowData.mode === "full_screen") return windowContent;
    return <DefaultWindow windowData={windowData}>{windowContent}</DefaultWindow>
};

