// app/dashboard/projects/[id]/dashboard/components/ChatMessage.tsx
'use client';

import { Reply, User, MoreVertical, Check, CheckCheck, Clock } from 'lucide-react';
import { useState } from 'react';

interface ChatMessageProps {
  message: any;
  onReply: () => void;
  isOwnMessage?: boolean; // ✅ Added to style own messages differently
  showTimestamp?: boolean; // ✅ Added to control timestamp visibility
}

export function ChatMessage({ 
  message, 
  onReply, 
  isOwnMessage = false,
  showTimestamp = true,
}: ChatMessageProps) {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // ✅ Get color based on user ID for consistent avatar colors
  const getAvatarColor = (userId: string) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-orange-100 text-orange-600',
      'bg-teal-100 text-teal-600',
      'bg-indigo-100 text-indigo-600',
      'bg-red-100 text-red-600',
    ];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  };

  // ✅ Get message status icon
  const getStatusIcon = () => {
    if (message.status === 'sent') return <Check className="w-3 h-3" />;
    if (message.status === 'delivered') return <CheckCheck className="w-3 h-3" />;
    if (message.status === 'read') return <CheckCheck className="w-3 h-3 text-blue-500" />;
    return <Clock className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div 
      className={`flex gap-3 group ${isOwnMessage ? 'flex-row-reverse' : ''}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full overflow-hidden">
          {message.user?.image ? (
            <img 
              src={message.user.image} 
              alt={message.user?.name || 'User'} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center text-sm font-medium ${getAvatarColor(message.user?.id || '')}`}>
              {message.user?.name ? getInitials(message.user.name) : '?'}
            </div>
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : ''}`}>
        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
          <span className="font-medium text-sm text-gray-900">
            {message.user?.name || 'Unknown'}
          </span>
          {showTimestamp && (
            <span className="text-xs text-gray-400">
              {formatDate(message.createdAt)}
            </span>
          )}
          {/* ✅ Message status */}
          {isOwnMessage && message.status && (
            <span className="text-gray-400">
              {getStatusIcon()}
            </span>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`rounded-lg p-3 ${isOwnMessage ? 'bg-[#1B2A56] text-white' : 'bg-gray-100 text-gray-900'}`}>
          {/* Parent message (reply context) */}
          {message.parent && (
            <div className={`text-xs opacity-75 mb-1 p-2 rounded ${isOwnMessage ? 'bg-white/10' : 'bg-black/10'}`}>
              <span className="font-medium">
                @{message.parent.user?.name}:
              </span>{' '}
              {message.parent.content}
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'justify-end' : ''}`}>
          <button 
            onClick={onReply} 
            className="text-xs text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <Reply className="w-3 h-3" />
            Reply
          </button>
          {/* ✅ Show timestamp on hover for less clutter */}
          {!showTimestamp && (
            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatDate(message.createdAt)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}