import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  FileText,
  MoreHorizontal,
} from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  status?: 'modified' | 'untracked' | 'added';
  children?: FileNode[];
}

const projectStructure: FileNode = {
  name: 'alibi',
  type: 'folder',
  children: [
    {
      name: 'client',
      type: 'folder',
      children: [
        {
          name: 'app',
          type: 'folder',
          children: [
            { name: 'page.tsx', type: 'file', status: 'modified' },
            { name: 'layout.tsx', type: 'file' },
            { name: 'globals.css', type: 'file' },
          ],
        },
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.tsx', type: 'file', status: 'modified' },
            { name: 'Hero.tsx', type: 'file', status: 'modified' },
            { name: 'Footer.tsx', type: 'file' },
          ],
        },
        {
          name: 'lib',
          type: 'folder',
          children: [{ name: 'utils.ts', type: 'file' }],
        },
        { name: '.env', type: 'file', status: 'untracked' },
        { name: '.gitignore', type: 'file', status: 'untracked' },
        { name: 'next.config.ts', type: 'file', status: 'untracked' },
        { name: 'package.json', type: 'file' },
        { name: 'README.md', type: 'file', status: 'untracked' },
        { name: 'tsconfig.json', type: 'file' },
      ],
    },
  ],
};

interface FileTreeProps {
  node: FileNode;
  depth?: number;
  onSelect: (name: string) => void;
  selectedFile: string | null;
  expandedFolders: Set<string>;
  toggleFolder: (name: string) => void;
}

function FileTree({
  node,
  depth = 0,
  onSelect,
  selectedFile,
  expandedFolders,
  toggleFolder,
}: FileTreeProps) {
  const isExpanded = expandedFolders.has(node.name);
  const isFolder = node.type === 'folder';
  const isSelected = selectedFile === node.name;

  const getStatusStyle = () => {
    switch (node.status) {
      case 'modified':
        return 'text-yellow-400';
      case 'untracked':
        return 'text-ide-accent-green';
      case 'added':
        return 'text-ide-accent-green';
      default:
        return 'text-ide-text-secondary';
    }
  };

  const getStatusBadge = () => {
    switch (node.status) {
      case 'modified':
        return (
          <span className="text-[9px] text-yellow-400 font-mono ml-auto">M</span>
        );
      case 'untracked':
        return (
          <span className="text-[9px] text-ide-accent-green font-mono ml-auto">U</span>
        );
      case 'added':
        return (
          <span className="text-[9px] text-ide-accent-green font-mono ml-auto">A</span>
        );
      default:
        return null;
    }
  };

  const handleClick = () => {
    if (isFolder) {
      toggleFolder(node.name);
    } else {
      onSelect(node.name);
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-1.5 py-0.5 px-2 text-[11px] font-mono transition-colors hover:bg-white/5 ${isSelected ? 'bg-white/10' : ''
          } ${getStatusStyle()}`}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {isFolder && (
          <span className="text-ide-text-muted flex-shrink-0">
            {isExpanded ? (
              <ChevronDown size={12} />
            ) : (
              <ChevronRight size={12} />
            )}
          </span>
        )}
        <span className="flex-shrink-0 text-ide-text-muted">
          {isFolder ? (
            isExpanded ? (
              <FolderOpen size={14} />
            ) : (
              <Folder size={14} />
            )
          ) : (
            <FileText size={14} />
          )}
        </span>
        <span className="truncate">{node.name}</span>
        {getStatusBadge()}
      </button>
      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTree
              key={child.name}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedFile={selectedFile}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileExplorerProps {
  onFileSelect: (name: string) => void;
  selectedFile: string | null;
}

export function FileExplorer({ onFileSelect, selectedFile }: FileExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['alibi', 'client', 'app', 'components'])
  );

  const toggleFolder = (name: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div className="w-52 bg-ide-bg border-r border-ide-border flex flex-col flex-shrink-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-ide-border">
        <span className="text-[11px] uppercase tracking-wider font-medium text-ide-text-secondary">
          Explorer
        </span>
        <button className="text-ide-text-muted hover:text-ide-text-secondary transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-1">
        <FileTree
          node={projectStructure}
          onSelect={onFileSelect}
          selectedFile={selectedFile}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
        />
      </div>
    </div>
  );
}
