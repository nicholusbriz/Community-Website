// components/TopBar.tsx
'use client';

import { useState } from 'react';
import {
  Bell,
  Search,
  HelpCircle,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  UserCircle,
  LayoutDashboard,
  Settings,
  Bookmark,
  Gift,
  LogOut,
  Sparkles,
  Home,
  ChevronRight,
  MessageSquare,
  Plus,
  FolderGit2,
  Users,
  CalendarDays,
  BookOpen,
  Info,
  FolderKanban,
  Star,
  User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isMobile?: boolean;
  onMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

export default function TopBar({ 
  sidebarOpen, 
  setSidebarOpen, 
  isDarkMode, 
  setIsDarkMode,
  isMobile = false,
  onMenuToggle,
  mobileMenuOpen = false
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Notification items
  const notifications = [
    { id: 1, title: 'New comment on your project', message: 'Sarah commented on "AI Chat App"', time: '5 min ago', read: false, link: '/dashboard/messages' },
    { id: 2, title: 'Project liked', message: 'Mike liked your project "DevPortfolio"', time: '1 hour ago', read: false, link: '/dashboard/projects' },
    { id: 3, title: 'Join request', message: 'Emily requested to join "EcoTracker"', time: '3 hours ago', read: true, link: '/dashboard/messages' },
    { id: 4, title: 'New member joined', message: 'Welcome James Wilson to the community!', time: '1 day ago', read: true, link: '/community' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // User dropdown items
  const userDropdownItems = [
    { icon: UserCircle, label: 'My Profile', href: '/dashboard/profile' },
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    { icon: Bookmark, label: 'Saved Projects', href: '/dashboard/saved' },
    { icon: Gift, label: 'Invite Friends', href: '#' },
    { icon: LogOut, label: 'Sign Out', href: '#', isDanger: true },
  ];

  // Quick actions for desktop top bar
  const quickActions = [
    { icon: Plus, label: 'New Project', href: '/dashboard/projects/new' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
    { icon: FolderGit2, label: 'Projects', href: '/dashboard/projects' },
  ];

  // Get current page name for breadcrumb
  const getPageName = () => {
    if (pathname === '/') return 'Home';
    const segments = pathname.split('/').filter(Boolean);
    return segments[segments.length - 1]?.replace(/-/g, ' ') || 'Dashboard';
  };

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ label: 'Home', href: '/' }];
    
    const crumbs = [{ label: 'Home', href: '/' }];
    let currentPath = '';
    for (const segment of segments) {
      currentPath += `/${segment}`;
      crumbs.push({ 
        label: segment.replace(/-/g, ' '), 
        href: currentPath 
      });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Check if a link is active
  const isActiveLink = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

  // If mobile, render the mobile header
  if (isMobile) {
    return (
      <header className="lg:hidden sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="px-4 py-3">
          {/* Top Row: Menu, Logo, Actions */}
          <div className="flex items-center justify-between">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={onMenuToggle}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                )}
              </button>
              
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
                  <Image
                    src="/community-website-logo.png"
                    alt="Community Ecosystem Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="hidden xs:flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Community</span>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">Ecosystem</span>
                </div>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-0.5">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Messages */}
              <Link
                href="/dashboard/messages"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 relative"
                aria-label="Messages"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-indigo-500/30">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                        <button 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
                        >
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((notif) => (
                          <Link
                            key={notif.id}
                            href={notif.link}
                            onClick={() => setNotificationsOpen(false)}
                            className={`block p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${
                              !notif.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                                <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">✓</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{notif.message}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                              </div>
                              {!notif.read && (
                                <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full flex-shrink-0 mt-2"></span>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                        <Link href="/dashboard/messages" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium">
                          View all notifications
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Join Button */}
              <Link
                href="/join"
                className="ml-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95"
              >
                Join
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar (expandable) */}
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search projects, developers, resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </header>
    );
  }

  // Desktop header
  return (
    <header className="hidden lg:block sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="px-6 py-2.5 flex items-center justify-between">
        {/* Left Section - Sidebar toggle and breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Breadcrumb Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-600" />
                )}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors capitalize"
                  >
                    {index === 0 && <Home className="h-3.5 w-3.5 inline mr-1" />}
                    {crumb.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <form onSubmit={handleSearch} className="w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search projects, developers, resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-400/50 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-gray-600 font-mono">
              ⌘K
            </kbd>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-0.5">
          {/* Quick Actions - Desktop Only */}
          <div className="hidden xl:flex items-center gap-1 mr-1">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  title={action.label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              );
            })}
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Help - Links to FAQ */}
          <Link
            href="/faq"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-400 relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md shadow-indigo-500/30">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                    <button 
                      onClick={() => setNotificationsOpen(false)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.link}
                        onClick={() => setNotificationsOpen(false)}
                        className={`block p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700/50 last:border-0 ${
                          !notif.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center flex-shrink-0">
                            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-bold">✓</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{notif.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notif.message}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full flex-shrink-0 mt-2"></span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
                    <Link href="/dashboard/messages" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors font-medium">
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-1 transition-colors ml-1"
              aria-label="User menu"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-md shadow-indigo-500/20">
                  S
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Sarah</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 hidden sm:block transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-md shadow-indigo-500/20">
                        S
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">sarah@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="py-1">
                    {userDropdownItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setUserDropdownOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                          item.isDanger 
                            ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <item.icon className={`h-4 w-4 ${item.isDanger ? 'text-rose-500' : 'text-gray-400 dark:text-gray-500'}`} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}