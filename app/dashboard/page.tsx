'use client';

import { Sparkles, FolderKanban, Users, MessageSquare, BarChart3, Plus, Heart, Calendar, TrendingUp, UserPlus, Settings, GitBranch } from 'lucide-react';
import Link from 'next/link';
import { redirect } from "next/navigation";
import { useAuth } from "@/app/lib/auth/useAuth";

export default function DashboardHome() {
  const { user, status } = useAuth();

  // Redirect to join if not authenticated
  if (status === "unauthenticated") {
    redirect("/join");
  }

  // Show loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Get user data
  const userName = user?.name || 'User';
  const userEmail = user?.email || '';
  const userRole = user?.role || 'USER';
  const userImage = user?.image || '';

  // Quick links to all dashboard sections
  const quickLinks = [
    { 
      label: 'My Projects', 
      icon: FolderKanban, 
      href: '/dashboard/projects',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      label: 'Create Project', 
      icon: Plus, 
      href: '/dashboard/projects/new',
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      label: 'Join Requests', 
      icon: UserPlus, 
      href: '/dashboard/join-requests',
      color: 'from-indigo-500 to-indigo-600',
      bg: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    { 
      label: 'Messages', 
      icon: MessageSquare, 
      href: '/dashboard/messages',
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      label: 'Analytics', 
      icon: BarChart3, 
      href: '/dashboard/analytics',
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    { 
      label: 'Settings', 
      icon: Settings, 
      href: '/dashboard/settings',
      color: 'from-gray-500 to-gray-600',
      bg: 'bg-gray-50',
      textColor: 'text-gray-600'
    },
  ];

  // Quick actions
  const quickActions = [
    { label: 'Find Collaborators', icon: Users, href: '/developers', color: 'from-purple-600 to-purple-700' },
    { label: 'Community Feed', icon: Sparkles, href: '/feed', color: 'from-pink-600 to-rose-600' },
    { label: 'Your Profile', icon: Users, href: '/dashboard/profile', color: 'from-blue-600 to-cyan-600' },
    { label: 'Saved Projects', icon: Heart, href: '/dashboard/projects?saved=true', color: 'from-red-600 to-rose-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Welcome back, {userName}! 👋</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Quick access to your project management tools</p>
        <p className="text-xs text-gray-400 mt-0.5">{userEmail}</p>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {quickLinks.map((link, index) => {
          const Icon = link.icon;
          return (
            <Link
              key={index}
              href={link.href}
              className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105 hover:border-indigo-200"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`w-14 h-14 ${link.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-7 h-7 ${link.textColor}`} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{link.label}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-gray-700">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-indigo-100 dark:border-indigo-800/30 rounded-xl p-6">
        <div className="flex items-center gap-4">
          {userImage ? (
            <img 
              src={userImage} 
              alt={userName} 
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-500/20">
              {userName[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-gray-900 dark:text-white text-lg">{userName}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userEmail}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase tracking-wider mt-0.5">
              {userRole}
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/profile"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
            >
              Profile
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}