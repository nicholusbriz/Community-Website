'use client';

import { Send, MessageSquare, Clock, Users, Bell } from 'lucide-react';

export default function MessagesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Communicate with your community</p>
      </div>

      {/* Coming Soon Card */}
      <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Clock className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Messaging Feature Coming Soon
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
            We're building a powerful messaging system to help you connect with fellow developers, 
            collaborate on projects, and build meaningful relationships.
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center">
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
              <span className="text-sm text-blue-600 dark:text-blue-400">Real-time chat</span>
            </div>
            <div className="px-4 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-full">
              <span className="text-sm text-purple-600 dark:text-purple-400">Group conversations</span>
            </div>
            <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 rounded-full">
              <span className="text-sm text-green-600 dark:text-green-400">File sharing</span>
            </div>
          </div>
          
          <div className="mt-8 p-4 bg-gray-50 dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-gray-800 max-w-md">
            <div className="flex items-center gap-3">
              <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium text-gray-900 dark:text-white">Stay tuned!</span> 
                {' '}We'll notify you when messaging is available.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Direct Messages</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">One-on-one conversations</p>
        </div>
        
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Group Chats</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Team and project discussions</p>
        </div>
        
        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Smart Notifications</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Never miss an important message</p>
        </div>
      </div>
    </div>
  );
}