"use client"
import React from 'react';
import { motion } from 'framer-motion';

interface DraggableIconProps {
    title?: string;
    imgSrc?: string;
    initialTop?: string;
    initialLeft?: string;
    constraintsRef?: React.RefObject<HTMLDivElement | null>;
}

export default function DraggableArtifact({
    title = "solar * Białas",
    imgSrc = "https://framerusercontent.com/images/54Fk6FZWk05pc226hIGqlYKpM.jpg",
    initialTop = "52%",
    initialLeft = "72%",
    constraintsRef
}: DraggableIconProps) {

    return (
        <motion.div
            drag
            dragConstraints={constraintsRef}
            dragElastic={0}
            dragMomentum={false}
            whileDrag={{
                scale: 1.05,
                zIndex: 50
            }}
            className="absolute flex flex-col items-center justify-start gap-2 select-none cursor-grab active:cursor-grabbing z-10"
            style={{
                top: initialTop,
                left: initialLeft,
                transform: 'translate(-50%, -50%)',
            }}
        >
            {/* Icon Image Frame Container */}
            <div className="relative w-[60px] h-[60px] rounded-[2px] overflow-hidden shadow-md transition-shadow duration-200 bg-zinc-900 pointer-events-none">
                <img
                    src={imgSrc}
                    alt={title}
                    className="w-full h-full object-cover select-none pointer-events-none"
                    draggable={false}
                />
            </div>

            {/* Subtext Label */}
            <div className="max-w-[120px] text-center pointer-events-none">
                <h1
                    className="text-[11px] font-sans text-white font-medium tracking-wide leading-tight select-none px-1 py-0.5"
                    style={{
                        textShadow: 'rgba(0, 0, 0, 0.6) 1px 1px 2px, rgba(0, 0, 0, 0.3) 0px 0px 4px',
                    }}
                >
                    {title}
                </h1>
            </div>
        </motion.div>
    );
}