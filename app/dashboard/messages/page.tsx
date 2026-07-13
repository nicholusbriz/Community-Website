'use client';

import { useState } from 'react';
import { Send, Search, MoreVertical, Clock, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    { id: 1, name: 'Sarah Johnson', lastMessage: 'Hey! Love your project!', time: '2 min ago', unread: 2, online: true },
    { id: 2, name: 'Mike Chen', lastMessage: 'Available for collaboration?', time: '1 hour ago', unread: 0, online: false },
    { id: 3, name: 'Emily Rodriguez', lastMessage: 'Join request for EcoTracker', time: '2 days ago', unread: 1, online: true },
    { id: 4, name: 'Alex Rivera', lastMessage: 'Thanks for the feedback!', time: '3 days ago', unread: 0, online: false },
  ];

  const messages = {
    1: [
      { id: 1, sender: 'Sarah Johnson', text: 'Hey! Love your project!', time: '2:30 PM', isMe: false },
      { id: 2, sender: 'You', text: 'Thanks! Want to collab?', time: '2:31 PM', isMe: true },
      { id: 3, sender: 'Sarah Johnson', text: 'Yes, let\'s talk! I have some ideas.', time: '2:32 PM', isMe: false },
      { id: 4, sender: 'You', text: 'Great! What do you have in mind?', time: '2:33 PM', isMe: true },
      { id: 5, sender: 'Sarah Johnson', text: 'I think we could integrate AI features.', time: '2:34 PM', isMe: false },
    ],
    2: [
      { id: 1, sender: 'Mike Chen', text: 'Available for collaboration?', time: '1:00 PM', isMe: false },
      { id: 2, sender: 'You', text: 'Yes, I am! What project are you working on?', time: '1:05 PM', isMe: true },
      { id: 3, sender: 'Mike Chen', text: 'Building a new mobile app with React Native', time: '1:10 PM', isMe: false },
    ],
    3: [
      { id: 1, sender: 'Emily Rodriguez', text: 'Join request for EcoTracker', time: 'Yesterday', isMe: false },
      { id: 2, sender: 'You', text: 'Thanks Emily! I\'ll review it.', time: 'Yesterday', isMe: true },
    ],
    4: [
      { id: 1, sender: 'Alex Rivera', text: 'Thanks for the feedback!', time: '3 days ago', isMe: false },
    ],
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentMessages = messages[selectedConversation as keyof typeof messages] || [];
  const currentConversation = conversations.find(c => c.id === selectedConversation);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, you would send the message here
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Communicate with your community</p>
      </div>

      {/* Messages Layout */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 h-[600px]">
          {/* Conversations List */}
          <div className="border-r border-gray-200 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(conversation.name)}
                        </div>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-gray-900">{conversation.name}</span>
                          <span className="text-xs text-gray-500">{conversation.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                  No conversations found
                </div>
              )}
            </div>
          </div>

          {/* Chat View */}
          <div className="md:col-span-2 flex flex-col">
            {currentConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(currentConversation.name)}
                      </div>
                      {currentConversation.online && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{currentConversation.name}</h3>
                      <p className="text-xs text-gray-500">
                        {currentConversation.online ? 'Online' : 'Last seen recently'}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {currentMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isMe ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl ${
                          message.isMe
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className={`flex items-center gap-1 mt-1 text-xs ${
                          message.isMe ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          <Clock className="w-3 h-3" />
                          <span>{message.time}</span>
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
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}