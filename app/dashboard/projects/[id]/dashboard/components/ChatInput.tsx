// app/dashboard/projects/[id]/dashboard/components/ChatInput.tsx
'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Paperclip, Smile, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  disabled: boolean;
  placeholder: string;
  maxLength?: number; // ✅ Added max length
  onTyping?: (isTyping: boolean) => void; // ✅ Added typing indicator
}

export function ChatInput({ 
  onSend, 
  disabled, 
  placeholder,
  maxLength = 1000,
  onTyping,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Auto-focus on mount
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // ✅ Handle typing indicator
  useEffect(() => {
    if (onTyping) {
      const timeout = setTimeout(() => {
        onTyping(false);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [message, onTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || disabled || isSending) return;

    // ✅ Check max length
    if (message.length > maxLength) {
      alert(`Message cannot exceed ${maxLength} characters`);
      return;
    }

    setIsSending(true);
    try {
      await onSend(message);
      setMessage('');
      if (onTyping) onTyping(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // ✅ Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ✅ Handle paste (optional: strip formatting)
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    // Optional: Process pasted text (e.g., remove excessive whitespace)
    // You could also handle image pastes here
  };

  const remainingChars = maxLength - message.length;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border-t border-gray-200 flex-shrink-0 bg-white">
      <div className="flex gap-2">
        {/* Attachment Button */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || isSending}
          title="Attach file (coming soon)"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Emoji Button */}
        <button
          type="button"
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled || isSending}
          title="Add emoji (coming soon)"
        >
          <Smile className="w-5 h-5" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onPaste={handlePaste}
            placeholder={placeholder}
            disabled={disabled || isSending}
            maxLength={maxLength}
            className={`w-full px-4 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/20 focus:border-[#1B2A56] disabled:bg-gray-50 disabled:cursor-not-allowed transition-all ${
              isFocused ? 'border-[#1B2A56]' : 'border-gray-200'
            } ${
              message.length > maxLength * 0.9 ? 'border-yellow-400 focus:border-yellow-400' : ''
            }`}
          />
          {/* ✅ Character counter */}
          {message.length > 0 && (
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
              remainingChars < 50 ? 'text-yellow-500' : 'text-gray-400'
            } ${remainingChars < 10 ? 'text-red-500' : ''}`}>
              {remainingChars}
            </span>
          )}
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!message.trim() || disabled || isSending}
          className="px-4 py-2 bg-[#1B2A56] text-white rounded-lg hover:bg-[#16223F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isSending ? 'Sending...' : 'Send'}
          </span>
        </button>
      </div>

      {/* ✅ Typing indicator */}
      {isSending && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader2 className="w-3 h-3 animate-spin" />
          Sending message...
        </div>
      )}
    </form>
  );
}