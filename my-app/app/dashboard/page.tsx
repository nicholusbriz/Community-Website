'use client';

import { useState } from 'react';
import { Menu, X, LayoutDashboard, FolderKanban, Users, Home, LogOut, User, Settings } from 'lucide-react';
import ProjectsComponent from '../../components/ProjectsComponent';
import UsersComponent from '../../components/UsersComponent';
import SettingsComponent from '../../components/SettingsComponent';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-[#8B5CF6] p-2 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#12121A] border-r border-[#8B5CF6]/20 z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <LayoutDashboard className="text-[#8B5CF6]" size={28} />
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.href) {
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </a>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeTab === item.id
                      ? 'bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User actions */}
          <div className="mt-8 pt-6 border-t border-[#8B5CF6]/20 space-y-2">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-white/5"
            >
              <User size={20} />
              <span>Profile</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-gray-400 hover:text-white hover:bg-white/5"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="md:ml-64 p-6 md:p-8 pt-16 md:pt-8">
        {activeTab === 'projects' && <ProjectsComponent />}
        {activeTab === 'users' && <UsersComponent />}
        {activeTab === 'settings' && <SettingsComponent />}
      </main>
    </div>
  );
}
