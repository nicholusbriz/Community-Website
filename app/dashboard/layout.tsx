'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, FolderKanban, Users, Home, LogOut, User, Settings, Plus, Star, MessageSquare, ExternalLink } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '/' },
    { id: 'dashboard', label: 'Dashboard Home', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'projects', label: 'My Projects', icon: FolderKanban, href: '/dashboard/projects' },
    { id: 'create-project', label: 'Create Project', icon: Plus, href: '/dashboard/projects/new' },
    { id: 'developers', label: 'Developers', icon: Users, href: '/developers' },
    { id: 'saved', label: 'Saved Projects', icon: Star, href: '/dashboard/saved' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/dashboard/messages' },
    { id: 'profile', label: 'My Profile', icon: User, href: '/dashboard/profile' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-black text-white p-2 rounded-lg shadow-lg shadow-gray-200"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0070f3] to-[#7928ca] rounded-lg flex items-center justify-center">
              <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  prefetch={false}
                  onClick={() => setSidebarOpen(false)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-[#0070f3]/10 to-[#7928ca]/10 text-[#0070f3] font-medium'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                  {isActive(item.href) && (
                    <div className="ml-auto w-1.5 h-6 bg-gradient-to-b from-[#0070f3] to-[#7928ca] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User actions */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-1">
            <Link
              href="/developer/sarahj"
              prefetch={false}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-gray-600 hover:text-black hover:bg-gray-50"
            >
              <ExternalLink size={20} />
              <span>View Public Profile</span>
            </Link>
            <button
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-gray-600 hover:text-black hover:bg-gray-50"
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
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="md:ml-64 p-6 md:p-8 pt-16 md:pt-8">
        {children}
      </main>
    </div>
  );
}
