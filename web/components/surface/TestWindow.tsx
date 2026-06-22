"use client"
import React from "react";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from 'uuid';
import { useWindowStore } from "@/hooks/windows/use-window-store";


const id = uuidv4()

const defaultX = (typeof window !== 'undefined' ? window.innerWidth : 1280) / 2 - 192;
const defaultY = (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 - 192;

const TestWindow = (): React.ReactElement => {
    const { registerWindow } = useWindowStore()
  return (
    <Button
    onClick={() => registerWindow(id, {
      id,
      xPos: defaultX,
      yPos: defaultY,
      width: 384,
      height: 384,
      zIndex: 10,
      mode: "default",
      updatedAt: new Date(),
    })}
    size="lg"
    className="z-50 fixed bottom-0 right-0"
  >
    Register a window
  </Button>
  );
};

export default TestWindow;