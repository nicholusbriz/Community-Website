'use client';

import { Users, UserPlus, Mail, Phone, Calendar, Star, Sparkles, ArrowRight, MoreVertical } from 'lucide-react';

export default function UsersPage() {
  const users = [
    { name: 'Sarah Johnson', role: 'Senior Developer', projects: 8, status: 'Active', email: 'sarah@example.com', joined: 'Jan 2024' },
    { name: 'Mike Chen', role: 'Project Lead', projects: 12, status: 'Active', email: 'mike@example.com', joined: 'Mar 2023' },
    { name: 'Emily Rodriguez', role: 'UI/UX Designer', projects: 5, status: 'Away', email: 'emily@example.com', joined: 'Jun 2024' },
    { name: 'David Kim', role: 'DevOps Engineer', projects: 6, status: 'Active', email: 'david@example.com', joined: 'Sep 2023' },
    { name: 'Lisa Thompson', role: 'Product Manager', projects: 10, status: 'Active', email: 'lisa@example.com', joined: 'Nov 2022' },
    { name: 'James Wilson', role: 'Full Stack Developer', projects: 4, status: 'Inactive', email: 'james@example.com', joined: 'Apr 2024' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Away':
        return 'bg-yellow-100 text-yellow-700';
      case 'Inactive':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Sparkles className="w-4 h-4 text-[#0070f3]" />
            <span>Community Members</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Project Owners</h2>
          <p className="text-gray-500 text-sm mt-1">Manage and connect with project owners in your community</p>
        </div>
        <button className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0070f3] to-[#7928ca] text-white px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-[#0070f3]/25 transition-all duration-200 font-medium text-sm">
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '24', icon: Users, color: 'text-[#0070f3]' },
          { label: 'Active Owners', value: '18', icon: Star, color: 'text-[#7928ca]' },
          { label: 'New This Month', value: '4', icon: UserPlus, color: 'text-green-600' },
          { label: 'Total Projects', value: '45', icon: Sparkles, color: 'text-gray-600' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3] transition-all"
          />
          <Users className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
        <select className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0070f3]/20 focus:border-[#0070f3] transition-all">
          <option>All Status</option>
          <option>Active</option>
          <option>Away</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <div
            key={index}
            className="group bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0070f3]/10 to-[#7928ca]/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-semibold text-[#0070f3]">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-[#0070f3] transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{user.role}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Joined {user.joined}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                <span className="text-sm text-gray-500">
                  {user.projects} projects
                </span>
              </div>
              <button className="text-gray-400 group-hover:text-[#0070f3] transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center pt-4">
        <button className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#0070f3] transition-colors">
          View all users
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
