import { X, Command } from 'lucide-react';

interface Tab {
  name: string;
  closeable?: boolean;
}

const codeContent: { [key: string]: string } = {
  '.env': `# Database Configuration
DATABASE_URL=postgresql://localhost:5432/alibi
REDIS_URL=redis://localhost:6379

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# External APIs
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...
`,
  'page.tsx': `import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
    </main>
  )
}
`,
  'Header.tsx': `'use client'

import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50">
      {/* Header content */}
    </header>
  )
}
`,
};

interface EditorCanvasProps {
  selectedFile: string | null;
  onCloseTab: () => void;
}

export function EditorCanvas({ selectedFile, onCloseTab }: EditorCanvasProps) {
  const tabs: Tab[] = selectedFile
    ? [
        { name: selectedFile, closeable: true },
        { name: 'page.tsx', closeable: true },
        { name: 'Header.tsx', closeable: true },
      ]
    : [];

  const currentContent = selectedFile
    ? codeContent[selectedFile] || codeContent['page.tsx']
    : '';

  if (!selectedFile) {
    return (
      <div className="flex-1 bg-ide-bg flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.02] to-transparent" />
        <div className="flex flex-col items-center gap-8 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-white/[0.05] blur-xl rounded-full" />
            <div className="w-24 h-24 relative">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <g opacity="0.9">
                  <path
                    d="M50 15 L50 85"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity="0.2"
                  />
                  <path
                    d="M35 20 L50 15 L65 20"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25 45 L50 30 L75 45"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 70 L50 50 L80 70"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity="0.6"
                  />
                  <circle cx="50" cy="85" r="3" fill="white" opacity="0.8" />
                </g>
              </svg>
            </div>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-xl font-medium text-ide-text-primary tracking-tight">
              Antigravity IDE
            </h1>
            <p className="text-sm text-ide-text-muted">
              Code with Agent
            </p>
          </div>

          <button className="mt-4 flex items-center gap-3 px-4 py-2 bg-white/5 hover:bg-white/10 border border-ide-border rounded-lg transition-all group">
            <div className="flex items-center gap-2 text-ide-text-secondary">
              <Command size={14} />
              <span className="text-xs font-mono">L</span>
            </div>
            <span className="text-sm text-ide-text-secondary group-hover:text-ide-text-primary transition-colors">
              Open Agent
            </span>
          </button>
        </div>
      </div>
    );
  }

  const lines = currentContent.split('\n');

  return (
    <div className="flex-1 bg-ide-bg flex flex-col min-w-0">
      <div className="h-9 bg-ide-surface border-b border-ide-border flex items-center overflow-x-auto no-scrollbar">
        {tabs.map((tab, index) => (
          <div
            key={tab.name}
            className={`h-full px-3 flex items-center gap-2 border-r border-ide-border cursor-pointer flex-shrink-0 transition-colors ${
              tab.name === selectedFile
                ? 'bg-ide-bg text-ide-text-primary'
                : 'bg-ide-surface text-ide-text-muted hover:text-ide-text-secondary hover:bg-white/5'
            }`}
          >
            <span className="text-[11px] font-mono truncate max-w-32">
              {tab.name}
            </span>
            {tab.closeable && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (tab.name === selectedFile) {
                    onCloseTab();
                  }
                }}
                className="hover:bg-white/10 rounded p-0.5 -mr-1 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-auto no-scrollbar">
        <div className="min-w-max">
          {lines.map((line, lineNumber) => (
            <div key={lineNumber} className="flex">
              <div className="w-10 flex-shrink-0 text-right pr-3 py-0.5 select-none">
                <span className="text-[11px] font-mono text-ide-text-muted opacity-40">
                  {lineNumber + 1}
                </span>
              </div>
              <div className="py-0.5 pr-4 flex-1">
                <pre className="text-[12px] font-mono text-ide-text-primary leading-[18px]">
                  {line || ' '}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
