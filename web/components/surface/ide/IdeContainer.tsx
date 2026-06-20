"use client";
import { useState } from 'react';
import { FileExplorer } from './FileExplorer';
import { EditorCanvas } from './Canvas';
import { TerminalTray } from './TerminalTray';
import { AgentChat } from './AgentChat';

export default function IdeContainer() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  return (
    <div className="h-full w-full flex flex-col bg-zinc-950 overflow-hidden">
      {/* Workspace Header */}
      <div className="w-full h-8 flex items-center px-4 bg-zinc-900/40 border-b border-white/5">
        <div className="text-[11px] font-mono tracking-tight text-white/40 bg-white/5 px-3 py-0.5 rounded-md border border-white/5">
          alibi — workspace
        </div>
      </div>

      <div className="flex-1 w-full flex min-h-0">
        {/* Pane 1: File Navigator */}
        <FileExplorer
          onFileSelect={(name) => setSelectedFile(name)}
          selectedFile={selectedFile}
        />

        {/* Pane 2: Editor & Chat */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex min-h-0">
            <EditorCanvas selectedFile={selectedFile} onCloseTab={() => setSelectedFile(null)} />
            <AgentChat />
          </div>

          {/* Pane 3: Runtime Tray */}
          <TerminalTray />
        </div>
      </div>
    </div>
  );
}