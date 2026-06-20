import { useState } from 'react';
import {
  Plus,
  History,
  X,
  LayoutPanelLeft,
  Mic,
  ChevronDown,
  Loader2,
} from 'lucide-react';

interface FeedEvent {
  id: number;
  message: string;
  time: string;
}

const feedEvents: FeedEvent[] = [
  { id: 1, message: 'Freeing Port Three Thousand', time: '2s' },
  { id: 2, message: 'Fix Database URL Load Error', time: '5s' },
  {
    id: 3,
    message: 'Fixing Next.js Hero Component Rendering',
    time: '7d',
  },
];

export function AgentChat() {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setMessage('');
    }
  };

  if (!isExpanded) {
    return (
      <div className="w-12 bg-ide-bg border-l border-ide-border flex items-center justify-center flex-shrink-0">
        <button
          onClick={() => setIsExpanded(true)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-ide-text-muted hover:text-ide-text-secondary"
          title="Open Agent"
        >
          <LayoutPanelLeft size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-ide-bg border-l border-ide-border flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-ide-border">
        <span className="text-[11px] font-medium uppercase tracking-wider text-ide-text-secondary">
          Agent
        </span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-ide-text-muted hover:text-ide-text-secondary">
            <Plus size={14} />
          </button>
          <button className="p-1.5 hover:bg-white/10 rounded transition-colors text-ide-text-muted hover:text-ide-text-secondary">
            <History size={14} />
          </button>
          <button
            onClick={() => setIsExpanded(false)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-ide-text-muted hover:text-ide-text-secondary"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-white/[0.03] blur-xl rounded-full" />
          <div className="relative flex flex-col items-center gap-4 pb-12">
            <div className="w-20 h-20 flex items-center justify-center">
              <svg
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-80"
              >
                <path
                  d="M40 10 L40 70"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.15"
                />
                <path
                  d="M25 18 L40 10 L55 18"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                <path
                  d="M15 38 L40 22 L65 38"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.9"
                />
                <path
                  d="M10 58 L40 38 L70 58"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.5"
                />
                <circle cx="40" cy="70" r="4" fill="white" opacity="0.7" />
              </svg>
            </div>
            <h2 className="text-lg font-medium text-ide-text-primary tracking-tight">
              alibi
            </h2>
            <p className="text-xs text-ide-text-muted text-center max-w-48">
              Your AI-powered development environment
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-ide-border p-3 space-y-3">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything, @ to mention, / for actions..."
              className="w-full h-20 px-3 py-2.5 bg-ide-surface border border-ide-border-strong rounded-xl text-[12px] text-ide-text-primary placeholder-ide-text-muted resize-none focus:outline-none focus:border-ide-accent-blue transition-colors"
            />
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <button
                type="button"
                className="flex items-center gap-1 px-2 py-1 hover:bg-white/5 rounded transition-colors text-ide-text-muted"
              >
                <span className="text-[10px] font-mono">Gemini 3.1 Pro</span>
                <span className="text-[9px] font-medium text-ide-accent-green bg-ide-accent-green/10 px-1 rounded">
                  High
                </span>
                <ChevronDown size={10} />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-ide-text-muted hover:text-ide-text-secondary"
              >
                <Mic size={14} />
              </button>
            </div>
          </div>
        </form>

        <div className="relative h-5 overflow-hidden">
          <div className="flex items-center gap-4 text-[10px] text-ide-text-muted animate-marquee whitespace-nowrap">
            {feedEvents.map((event) => (
              <span key={event.id} className="flex items-center gap-1">
                <Loader2 size={10} className="animate-spin" />
                {event.message}
                <span className="text-ide-text-muted/60">({event.time})</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
