import { useContext, useEffect, useState } from 'react';
import { Terminal, ChevronUp, ChevronDown, AlertCircle, Check } from 'lucide-react';

interface LogEntry {
  id: number;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
  timestamp: Date;
}

const initialLogs: LogEntry[] = [
  { id: 1, message: 'Freeing Port Three Thousand', type: 'success', timestamp: new Date() },
  {
    id: 2,
    message: 'Fixing Next.js Hero Component Rendering',
    type: 'info',
    timestamp: new Date(),
  },
  {
    id: 3,
    message: 'Fix Database URL Load Error',
    type: 'warning',
    timestamp: new Date(),
  },
  {
    id: 4,
    message: 'Installing dependencies...',
    type: 'info',
    timestamp: new Date(),
  },
  {
    id: 5,
    message: 'Dev server ready on http://localhost:3000',
    type: 'success',
    timestamp: new Date(),
  },
];

export function TerminalTray() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);
  const [isMinimized, setIsMinimized] = useState(false);

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return <Check size={12} className="text-ide-accent-green" />;
      case 'error':
        return <AlertCircle size={12} className="text-red-500" />;
      case 'warning':
        return <AlertCircle size={12} className="text-yellow-500" />;
      default:
        return null;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'success':
        return 'text-ide-accent-green';
      case 'error':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-ide-text-muted';
    }
  };

  return (
    <div className="h-44 bg-ide-bg border-t border-ide-border flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between px-2 py-1 border-b border-ide-border bg-ide-surface">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-ide-text-muted" />
          <span className="text-[11px] font-mono text-ide-text-secondary">
            Terminal
          </span>
          <div className="flex items-center gap-1 ml-2">
            <button className="px-2 py-0.5 text-[10px] font-mono text-ide-text-primary bg-white/10 rounded">
              task
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            {isMinimized ? (
              <ChevronUp size={14} className="text-ide-text-muted" />
            ) : (
              <ChevronDown size={14} className="text-ide-text-muted" />
            )}
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 overflow-auto no-scrollbar p-2 font-mono text-[11px] leading-[16px]">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 py-0.5">
              <span className="text-ide-text-muted opacity-50 flex-shrink-0">
                [{log.timestamp.toLocaleTimeString('en-US', { hour12: false })}]
              </span>
              <div className={`flex items-center gap-1.5 ${getLogColor(log.type)}`}>
                {getLogIcon(log.type)}
                <span>{log.message}</span>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-1 py-0.5">
            <span className="text-ide-accent-green">$</span>
            <span className="w-2 h-3 bg-ide-text-primary animate-pulse" />
          </div>
        </div>
      )}
    </div>
  );
}
