// app/dashboard/projects/[id]/dashboard/components/ChatWidget.tsx
'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Users, Loader2 } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ReplyIndicator } from './ReplyIndicator';

interface ChatWidgetProps {
  chat: {
    messages: any[];
    isLoading: boolean;
  };
  projectId: string;
  isMember: boolean;
  onSendMessage: (content: string) => Promise<void>;
  onSendReply: (content: string, parentId: string) => Promise<void>;
  // ✅ Optional: Add current user ID for styling own messages
  currentUserId?: string;
  // ✅ Optional: Add project title for context
  projectTitle?: string;
}

export function ChatWidget({ 
  chat, 
  projectId, 
  isMember, 
  onSendMessage, 
  onSendReply,
  currentUserId,
  projectTitle,
}: ChatWidgetProps) {
  const [showChat, setShowChat] = useState(false);
  const [replyTo, setReplyTo] = useState<any>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const { messages, isLoading } = chat;

  // ✅ Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current && showChat) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showChat]);

  // ✅ Handle escape key to cancel reply
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && replyTo) {
        setReplyTo(null);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [replyTo]);

  // ✅ Count unique users in chat
  const uniqueUsers = useMemo(() => {
    const userSet = new Set<string>();
    messages.forEach((msg: any) => {
      if (msg.user?.id) userSet.add(msg.user.id);
    });
    return userSet.size;
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (replyTo) {
      await onSendReply(content, replyTo.id);
      setReplyTo(null);
    } else {
      await onSendMessage(content);
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
  };

  // ✅ Toggle chat collapse
  const toggleChat = () => {
    if (showChat) {
      setIsCollapsed(!isCollapsed);
    } else {
      setShowChat(true);
      setIsCollapsed(false);
    }
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Team Chat
            {projectTitle && (
              <span className="text-sm font-normal text-gray-400">
                in {projectTitle}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Communicate with your team in real-time
            {messages.length > 0 && (
              <span className="ml-1 text-gray-400">
                ({messages.length} messages, {uniqueUsers} participants)
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* ✅ Show unread count (if you add unread tracking) */}
          {!showChat && messages.length > 0 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {messages.length} new
            </span>
          )}
          <button
            onClick={toggleChat}
            className="px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors flex items-center gap-2 text-sm font-medium shadow-sm hover:shadow-md"
          >
            {!showChat ? 'Open Chat' : isCollapsed ? 'Expand Chat' : 'Collapse Chat'}
            {!showChat ? (
              <ChevronDown className="w-4 h-4" />
            ) : isCollapsed ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Chat Container */}
      {showChat && (
        <div 
          ref={chatContainerRef}
          className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all duration-300 ${
            isCollapsed ? 'h-[80px]' : 'h-[500px]'
          }`}
        >
          {/* Collapsed Preview */}
          {isCollapsed ? (
            <div 
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsCollapsed(false)}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {messages.length > 0 
                    ? `Last message: ${messages[messages.length - 1]?.content?.slice(0, 50)}...`
                    : 'No messages yet'
                  }
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1B2A56]" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="font-medium">No messages yet</p>
                    <p className="text-sm">Be the first to send a message</p>
                  </div>
                ) : (
                  messages.map((msg: any) => (
                    <ChatMessage 
                      key={msg.id} 
                      message={msg} 
                      onReply={() => setReplyTo(msg)}
                      isOwnMessage={msg.userId === currentUserId}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Indicator */}
              {replyTo && (
                <ReplyIndicator 
                  replyTo={replyTo} 
                  onCancel={handleCancelReply} 
                />
              )}

              {/* Chat Input */}
              <ChatInput 
                onSend={handleSendMessage}
                disabled={!isMember}
                placeholder={isMember ? "Type a message..." : "You must be a project member to send messages"}
                maxLength={2000}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}