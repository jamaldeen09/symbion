import { useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Puzzle,
  Settings,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';

interface ActivityItem {
  id: string;
  icon: React.ReactNode;
  badge?: string;
  active?: boolean;
}

export function ActivityBar() {
  const [activeItem, setActiveItem] = useState('files');

  const items: ActivityItem[] = [
    { id: 'files', icon: <Files size={20} /> },
    { id: 'search', icon: <Search size={20} /> },
    { id: 'git', icon: <GitBranch size={20} />, badge: '2' },
    { id: 'extensions', icon: <Puzzle size={20} /> },
    { id: 'settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="w-12 bg-ide-bg border-r border-ide-border flex flex-col items-center py-2 flex-shrink-0">
      <div className="flex flex-col gap-1 flex-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveItem(item.id)}
            className={`relative w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 group ${
              activeItem === item.id
                ? 'bg-white/10 text-ide-text-primary'
                : 'text-ide-text-muted hover:text-ide-text-secondary hover:bg-white/5'
            }`}
          >
            {item.icon}
            {activeItem === item.id && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-ide-accent-green rounded-r" />
            )}
            {item.badge && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-ide-accent-blue rounded-full text-[10px] font-medium text-white flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-ide-border pt-2">
        <button className="group relative w-10 h-10 flex items-center justify-center rounded-lg text-ide-text-muted hover:text-ide-text-secondary hover:bg-white/5 transition-colors">
          <GitBranch size={16} />
          <span className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-ide-surface border border-ide-border rounded text-[10px] text-ide-text-secondary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            main*
          </span>
        </button>

        <button className="group relative w-10 h-10 flex items-center justify-center rounded-lg text-ide-text-muted hover:text-ide-text-secondary hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-0.5">
            <AlertCircle size={14} className="text-ide-accent-blue" />
            <span className="text-[10px] font-mono text-ide-text-muted">0</span>
          </div>
          <div className="flex items-center gap-0.5">
            <AlertTriangle size={14} className="text-yellow-500" />
            <span className="text-[10px] font-mono text-ide-text-muted">0</span>
          </div>
        </button>
      </div>
    </div>
  );
}
