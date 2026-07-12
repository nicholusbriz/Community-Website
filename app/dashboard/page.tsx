'use client';

import { Sparkles, FolderKanban, Users, MessageSquare, BarChart3, Plus, ArrowRight, Heart, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const quickStats = [
    { label: 'Projects', value: '12', icon: FolderKanban, color: 'text-[#0070f3]' },
    { label: 'Published', value: '10', icon: BarChart3, color: 'text-[#7928ca]' },
    { label: 'Saved', value: '8', icon: Heart, color: 'text-green-600' },
    { label: 'Messages', value: '3', icon: MessageSquare, color: 'text-gray-600' },
  ];

  const quickActions = [
    { label: 'Create New Project', icon: Plus, href: '/dashboard/projects/new', color: 'bg-[#0070f3]' },
    { label: 'Find Collaborators', icon: Users, href: '/developers', color: 'bg-[#7928ca]' },
    { label: 'View Analytics', icon: BarChart3, href: '#', color: 'bg-green-600' },
    { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', color: 'bg-gray-600' },
  ];

  const myProjects = [
    { id: 1, title: 'AI Chat App', status: 'Published', likes: 45, comments: 12 },
    { id: 2, title: 'DevPortfolio', status: 'Draft', likes: 32, comments: 8 },
    { id: 3, title: 'React Dashboard', status: 'Published', likes: 28, comments: 15 },
  ];

  const recentActivity = [
    { action: 'You saved "AI Chat App"', time: '2 hours ago', icon: Heart },
    { action: 'Mike commented on your "DevPortfolio"', time: '5 hours ago', icon: MessageCircle },
    { action: 'Join request from Emily for "EcoTracker"', time: '1 day ago', icon: Users },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Sparkles className="w-4 h-4 text-[#0070f3]" />
          <span>Welcome back, Sarah! 👋</span>
        </div>
        <h2 className="text-2xl font-bold">Dashboard Home</h2>
        <p className="text-gray-500 text-sm mt-1">Overview of your community activity</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* My Projects */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">My Projects (Recent)</h3>
          <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-[#0070f3] hover:text-[#7928ca] font-medium transition-colors">
            View All Projects
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {myProjects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-[#0070f3]" />
                </div>
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-gray-500">Status: {project.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {project.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {project.comments}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-200 transition-colors">
                    Edit
                  </button>
                  <button className="px-3 py-1 text-sm border border-gray-200 rounded hover:bg-gray-200 transition-colors">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-semibold text-lg mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, index) => {
            const Icon = activity.icon;
            return (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#0070f3]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}