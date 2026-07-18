// app/projects/[slug]/components/ProjectLinks.tsx
'use client';

import { useState } from 'react';
import { Copy, Check, GitFork, Globe, Link2, AlertCircle } from 'lucide-react';

interface ProjectLinkProps {
  url: string | null;
  label: string;
  icon: any;
  placeholder?: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

function ProjectLinkDisplay({ url, label, icon: Icon, placeholder = 'Not provided' }: ProjectLinkProps) {
  if (!url) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
        <div className="p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
          <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {placeholder}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50 hover:border-[#1B2A56]/30 dark:hover:border-[#8CA0DE]/30 transition-all duration-200">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {/* ✅ Display as text only - not clickable */}
          <span className="text-sm text-gray-600 dark:text-gray-400 break-all">
            {url}
          </span>
          <CopyButton text={url} label="Copy" />
        </div>
      </div>
    </div>
  );
}

export function ProjectLinks({ repositoryUrl, demoUrl }: { repositoryUrl: string | null; demoUrl: string | null }) {
  const hasLinks = repositoryUrl || demoUrl;

  if (!hasLinks) {
    return (
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Project Links</h3>
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700/50">
          <Link2 className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No links provided for this project</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Project Links</h3>
      <div className="space-y-3">
        {/* Repository Link */}
        <ProjectLinkDisplay 
          url={repositoryUrl} 
          label="Repository" 
          icon={GitFork}
          placeholder="No repository link provided"
        />
        
        {/* Demo Link */}
        <ProjectLinkDisplay 
          url={demoUrl} 
          label="Live Demo" 
          icon={Globe}
          placeholder="No demo link provided"
        />
      </div>
    </div>
  );
}