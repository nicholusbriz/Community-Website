'use client';

import { Sparkles, FolderKanban, Users, MessageSquare, BarChart3, Plus, ArrowRight, Heart, MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardHome() {
  const quickStats = [
    { label: 'Projects', value: '12', icon: FolderKanban, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Published', value: '10', icon: BarChart3, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Saved', value: '8', icon: Heart, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Messages', value: '3', icon: MessageSquare, color: 'text-gray-600', bg: 'bg-gray-50' },
  ];

  const quickActions = [
    { label: 'Create New Project', icon: Plus, href: '/dashboard/projects/new', color: 'from-blue-600 to-blue-700' },
    { label: 'Find Collaborators', icon: Users, href: '/developers', color: 'from-purple-600 to-purple-700' },
    { label: 'View Analytics', icon: TrendingUp, href: '#', color: 'from-green-600 to-green-700' },
    { label: 'Messages', icon: MessageSquare, href: '/dashboard/messages', color: 'from-gray-600 to-gray-700' },
  ];

  const myProjects = [
    { id: 1, title: 'AI Chat App', status: 'Published', likes: 45, comments: 12, date: '2024-01-15' },
    { id: 2, title: 'DevPortfolio', status: 'Draft', likes: 32, comments: 8, date: '2024-01-10' },
    { id: 3, title: 'React Dashboard', status: 'Published', likes: 28, comments: 15, date: '2024-01-05' },
  ];

  const recentActivity = [
    { action: 'You saved "AI Chat App"', time: '2 hours ago', icon: Heart, color: 'text-red-500' },
    { action: 'Mike commented on your "DevPortfolio"', time: '5 hours ago', icon: MessageCircle, color: 'text-blue-500' },
    { action: 'Join request from Emily for "EcoTracker"', time: '1 day ago', icon: Users, color: 'text-purple-500' },
    { action: 'Your project "React Dashboard" was featured', time: '2 days ago', icon: Sparkles, color: 'text-yellow-500' },
  ];

  const upcomingEvents = [
    { title: 'Community Meetup', date: 'Jan 20, 2024', time: '3:00 PM' },
    { title: 'Project Showcase', date: 'Jan 25, 2024', time: '5:00 PM' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Welcome back, Sarah! 👋</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your community activity</p>
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
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
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

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Projects - Takes 2/3 of the space */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-900">My Projects</h3>
              <Link 
                href="/dashboard/projects" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-medium transition-colors text-sm"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {myProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{project.title}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {project.status}
                        </span>
                        <span className="text-gray-500">{project.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        {project.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        {project.comments}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-200 transition-colors">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Takes 1/3 of the space */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}