'use client';

import { Reply, X } from 'lucide-react';

interface ReplyIndicatorProps {
  replyTo: any;
  onCancel: () => void;
}

export function ReplyIndicator({ replyTo, onCancel }: ReplyIndicatorProps) {
  return (
    <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mx-4 mb-2 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm text-blue-700">
        <Reply className="w-4 h-4" />
        <span>Replying to: <span className="font-medium">{replyTo.user?.name}</span></span>
        <span className="text-xs text-blue-500">"{replyTo.content?.slice(0, 50)}..."</span>
      </div>
      <button onClick={onCancel} className="text-blue-500 hover:text-blue-700">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
