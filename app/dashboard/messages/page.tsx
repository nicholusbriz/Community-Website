'use client';

import { useState } from 'react';
import { Send, Search, MoreVertical, Clock, User } from 'lucide-react';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const conversations = [
    { id: 1, name: 'Sarah Johnson', lastMessage: 'Hey! Love your project!', time: '2 min ago', unread: 2 },
    { id: 2, name: 'Mike Chen', lastMessage: 'Available for collaboration?', time: '1 hour ago', unread: 0 },
    { id: 3, name: 'Emily Rodriguez', lastMessage: 'Join request for EcoTracker', time: '2 days ago', unread: 1 },
  ];

  const messages = {
    1: [
      { id: 1, sender: 'Sarah', text: 'Hey! Love your project!', time: '2 min ago', isMe: false },
      { id: 2, sender: 'Me', text: 'Thanks! Want to collab?', time: '1 min ago', isMe: true },
      { id: 3, sender: 'Sarah', text: 'Yes, let\'s talk!', time: '30 sec ago', isMe: false },
    ],
    2: [
      { id: 1, sender: 'Mike', text: 'Available for collaboration?', time: '1 hour ago', isMe: false },
    ],
    3: [
      { id: 1, sender: 'Emily', text: 'Join request for EcoTracker', time: '2 days ago', isMe: false },
    ],
  };

  const currentMessages = messages[selectedConversation as keyof typeof messages] || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Messages</h2>
        <p className="text-gray-500 text-sm mt-1">Communicate with your community</p>
      </div>

      {/* Messages Layout */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden" style={{ minHeight: '600px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 h-full">
          {/* Conversations List */}
          <div className="border-r border-gray-200">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(600px - 73px)' }}>
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                    selectedConversation === conversation.id ? 'bg-[#0070f3]/10 border-l-4 border-l-[#0070f3]' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-[#0070f3]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{conversation.name}</span>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 bg-[#0070f3] text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat View */}
          <div className="md:col-span-2 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#0070f3]" />
                </div>
                <div>
                  <h3 className="font-semibold">{conversations.find(c => c.id === selectedConversation)?.name}</h3>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: '400px' }}>
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl ${
                      message.isMe
                        ? 'bg-[#0070f3] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      message.isMe ? 'text-white/70' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {message.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3]"
                  onKeyPress={(e) => e.key === 'Enter' && setMessageInput('')}
                />
                <button className="px-4 py-3 bg-[#0070f3] text-white rounded-lg hover:bg-[#0070f3]/90 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
