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
  Home,
  ChevronRight,
  MessageSquare,
  Plus,
  FolderGit2,
  ListTodo,
  Bell as BellIcon,
  User,
  Sparkles,
  FolderOpen,
  Shield,
  ShieldCheck,
  CheckCircle,
  Users,
  UserPlus,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/useAuth';
import { useNotifications } from '@/app/lib/hooks/useNotifications';
// ✅ Import Prisma types
import type { Notification } from '@prisma/client';

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isMobile?: boolean;
  onMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}

// ✅ Extended notification type with relations
type NotificationWithProject = Notification & {
  project: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

// ─────────────────────────────────────────────────────────────
// Brand tokens — matches DesktopSidebar / MobileMenu
// ─────────────────────────────────────────────────────────────
const BRAND_GRADIENT = 'from-[#0B0F1A] via-[#16223F] to-[#1B2A56]';
const NAVY = '#1B2A56';
const NAVY_DARK = '#8CA0DE';

export default function TopBar({
  sidebarOpen,
  setSidebarOpen,
  isDarkMode,
  setIsDarkMode,
  isMobile = false,
  onMenuToggle,
  mobileMenuOpen = false,
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, actions } = useAuth();
  const isAuthenticated = status === 'authenticated';
  const userRole = user?.role || 'USER';

  // ✅ Use real notifications from the API with error handling
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    isMarking,
    isMarkingAll,
    error: notificationsError
  } = useNotifications({ limit: 10 });

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const avatarUrl = user?.image || null;

  // Get icon for notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REQUEST':
        return <UserPlus className="w-3.5 h-3.5 text-yellow-500" />;
      case 'TASK':
        return <CheckCircle className="w-3.5 h-3.5 text-blue-500" />;
      case 'PROJECT':
        return <Users className="w-3.5 h-3.5 text-purple-500" />;
      case 'MENTION':
        return <MessageSquare className="w-3.5 h-3.5 text-green-500" />;
      default:
        return <BellIcon className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  // ✅ Fix: Accept Date or string, convert to Date if needed
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'Just now';
    if (mins < 60) return mins + 'm ago';
    if (hours < 24) return hours + 'h ago';
    if (days < 7) return days + 'd ago';
    return d.toLocaleDateString();
  };

  const handleSignOut = async () => {
    setUserDropdownOpen(false);
    await actions.signOutUser();
  };

  const getUserInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const handleNotificationClick = async (notification: NotificationWithProject) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    setNotificationsOpen(false);
    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead();
  };

  // User dropdown items
  const userDropdownItems = isAuthenticated
    ? [
        { icon: UserCircle, label: 'My Profile', href: '/dashboard/profile' },
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: FolderGit2, label: 'My Projects', href: '/dashboard/projects' },
        { icon: ListTodo, label: 'My Tasks', href: '/dashboard/tasks' },
        { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
        { icon: Gift, label: 'Invite Friends', href: '/join' },
      ]
    : [];

  // Quick actions for desktop top bar
  const quickActions = [
    { icon: Plus, label: 'Create Project', href: '/dashboard/projects/create' },
    { icon: FolderOpen, label: 'My Projects', href: '/dashboard/projects' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
  ];

  // Admin quick actions
  const adminQuickActions = [
    { icon: Shield, label: 'Admin Panel', href: '/admin' },
    { icon: ShieldCheck, label: 'Super Admin', href: '/super' },
  ];

  // Get breadcrumb items
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return [{ label: 'Home', href: '/' }];

    const crumbs = [{ label: 'Home', href: '/' }];
    let currentPath = '';
    for (const segment of segments) {
      currentPath += '/' + segment;
      let label = segment.replace(/-/g, ' ');
      if (segment === 'dashboard') label = 'Dashboard';
      else if (segment === 'projects') label = 'Projects';
      else if (segment === 'admin') label = 'Admin';
      else if (segment === 'super') label = 'Super Admin';
      else if (segment === 'create') label = 'Create';
      else if (segment === 'manage') label = 'Manage';
      else if (segment === 'tasks') label = 'Tasks';
      else if (segment === 'team') label = 'Team';
      else if (segment === 'chat') label = 'Chat';
      else if (segment === 'files') label = 'Files';
      else if (segment === 'settings') label = 'Settings';
      else if (segment === 'profile') label = 'Profile';
      else if (segment === 'messages') label = 'Messages';
      else if (segment === 'notifications') label = 'Notifications';
      else if (segment === 'reports') label = 'Reports';
      else if (segment === 'analytics') label = 'Analytics';
      else if (segment === 'review') label = 'Review';
      else if (segment === 'archive') label = 'Archive';
      else if (segment === 'system') label = 'System';
      else if (segment === 'logs') label = 'Logs';
      
      crumbs.push({
        label: label.charAt(0).toUpperCase() + label.slice(1),
        href: currentPath,
      });
    }
    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push('/search?q=' + encodeURIComponent(searchQuery));
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // If mobile, render the mobile header
  if (isMobile) {
    return (
      <header className="lg:hidden sticky top-0 z-50 bg-white/95 dark:bg-[#101114]/95 backdrop-blur-md border-b border-stone-200/70 dark:border-white/10 shadow-sm">
        <div className="px-4 py-3 relative">
          <button
            onClick={onMenuToggle}
            className="absolute top-1/2 -translate-y-1/2 left-4 z-10 p-2.5 rounded-xl bg-white dark:bg-[#101114] shadow-lg border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/10 transition-all duration-200 focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5 text-stone-700 dark:text-stone-300" />
            ) : (
              <Menu className="h-5 w-5 text-stone-700 dark:text-stone-300" />
            )}
          </button>

          <div className="flex items-center justify-between pl-14">
            <Link href="/" className="flex items-center gap-2">
              <div className={'w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br ' + BRAND_GRADIENT + ' shadow-sm'}>
                <Image
                  src="/community-website-logo.png"
                  alt="Community Ecosystem Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="hidden xs:flex flex-col leading-tight">
                <span className="text-sm font-semibold tracking-tight text-stone-900 dark:text-white">Community</span>
                <span className="text-[9px] text-stone-400 dark:text-stone-500 tracking-wider uppercase">Ecosystem</span>
              </div>
            </Link>

            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-stone-400"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-stone-400"
                aria-label="Toggle theme"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {isAuthenticated && (
                <Link
                  href="/dashboard/messages"
                  className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-stone-400 relative"
                  aria-label="Messages"
                >
                  <MessageSquare className="h-5 w-5" />
                </Link>
              )}

              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-stone-400 relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className={'absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r ' + BRAND_GRADIENT + ' text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm'}>
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {notificationsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#16181D] rounded-xl shadow-2xl border border-stone-200 dark:border-white/10 overflow-hidden z-50"
                      >
                        <div className="p-4 border-b border-stone-200 dark:border-white/10 flex items-center justify-between">
                          <h3 className="font-semibold text-stone-900 dark:text-white text-sm">Notifications</h3>
                          {unreadCount > 0 && (
                            <button
                              onClick={handleMarkAllRead}
                              disabled={isMarkingAll}
                              className="text-xs font-medium text-[#1B2A56] dark:text-[#8CA0DE] hover:underline disabled:opacity-50"
                            >
                              {isMarkingAll ? '...' : 'Mark all read'}
                            </button>
                          )}
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="text-center py-8">
                              <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">No notifications</p>
                            </div>
                          ) : (
                            notifications.map((notif: NotificationWithProject) => (
                              <div
                                key={notif.id}
                                onClick={() => handleNotificationClick(notif)}
                                className={'block p-3 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-stone-100 dark:border-white/5 last:border-0 ' + (
                                  !notif.isRead ? 'bg-[#1B2A56]/[0.04] dark:bg-[#1B2A56]/10' : ''
                                )}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                    {getNotificationIcon(notif.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-stone-900 dark:text-white">{notif.title}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{notif.message}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <p className="text-xs text-stone-400 dark:text-stone-500">{formatDate(notif.createdAt)}</p>
                                      {notif.project && (
                                        <span className="text-xs text-stone-400 dark:text-stone-500">• {notif.project.title}</span>
                                      )}
                                    </div>
                                  </div>
                                  {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2 bg-[#1B2A56]" />
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="p-3 border-t border-stone-200 dark:border-white/10 text-center">
                          <Link
                            href="/dashboard/notifications"
                            className="text-sm font-medium text-[#1B2A56] dark:text-[#8CA0DE] hover:underline"
                            onClick={() => setNotificationsOpen(false)}
                          >
                            View all notifications
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {!isAuthenticated && (
                <Link
                  href="/join"
                  className={'ml-1 rounded-full bg-gradient-to-r ' + BRAND_GRADIENT + ' px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:shadow-md active:scale-95'}
                >
                  Join
                </Link>
              )}
            </div>
          </div>

          {searchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3"
            >
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 dark:text-stone-500" />
                <input
                  type="text"
                  placeholder="Search projects, developers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 dark:focus:ring-[#8CA0DE]/30 focus:border-transparent transition-all text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 transition-colors text-stone-400"
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
    <header className="hidden lg:block sticky top-0 z-50 bg-white/95 dark:bg-[#101114]/95 backdrop-blur-md border-b border-stone-200/70 dark:border-white/10 shadow-sm">
      <div className="px-6 py-2.5 flex items-center justify-between">
        {/* Left Section - Sidebar toggle and breadcrumb */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-stone-500 dark:text-stone-400" />
          </button>

          <nav className="hidden md:flex items-center gap-1 text-sm" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.href} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-stone-300 dark:text-stone-600" />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-stone-900 dark:text-white capitalize">{crumb.label}</span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 transition-colors capitalize text-sm"
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
              <Search className="h-4 w-4 text-stone-400 dark:text-stone-500" />
            </div>
            <input
              type="text"
              placeholder="Search projects, developers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1B2A56]/30 dark:focus:ring-[#8CA0DE]/30 focus:border-transparent transition-all text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-white/10 px-1.5 py-0.5 rounded border border-stone-200 dark:border-white/10 font-mono">
              ⌘K
            </kbd>
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-0.5">
          {isAuthenticated && (
            <div className="hidden xl:flex items-center gap-1 mr-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.label}
                    href={action.href}
                    className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                    title={action.label}
                  >
                    <Icon className="h-4 w-4" />
                  </Link>
                );
              })}
              {(userRole === 'ADMIN' || userRole === 'SUPERADMIN') && (
                <>
                  <div className="w-px h-6 bg-stone-200 dark:bg-white/10 mx-1" />
                  {userRole === 'SUPERADMIN' && (
                    <Link
                      href="/super"
                      className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                      title="Super Admin"
                    >
                      <ShieldCheck className="h-4 w-4" />
                    </Link>
                  )}
                  {(userRole === 'ADMIN' || userRole === 'SUPERADMIN') && (
                    <Link
                      href="/admin"
                      className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-400 dark:text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                      title="Admin Panel"
                    >
                      <Shield className="h-4 w-4" />
                    </Link>
                  )}
                </>
              )}
              <div className="w-px h-6 bg-stone-200 dark:bg-white/10 mx-1" />
            </div>
          )}

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-stone-400"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <Link
            href="/faq"
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-stone-400"
            aria-label="Help"
          >
            <HelpCircle className="h-5 w-5" />
          </Link>

          {/* ✅ Updated Notifications with real data */}
          {isAuthenticated && (
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors text-stone-500 dark:text-stone-400 relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className={'absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r ' + BRAND_GRADIENT + ' text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm'}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#16181D] rounded-xl shadow-2xl border border-stone-200 dark:border-white/10 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-stone-200 dark:border-white/10 flex items-center justify-between">
                      <h3 className="font-semibold text-stone-900 dark:text-white text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          disabled={isMarkingAll}
                          className="text-xs font-medium text-[#1B2A56] dark:text-[#8CA0DE] hover:underline disabled:opacity-50"
                        >
                          {isMarkingAll ? '...' : 'Mark all read'}
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center py-8">
                          <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif: NotificationWithProject) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={'block p-3 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors cursor-pointer border-b border-stone-100 dark:border-white/5 last:border-0 ' + (
                              !notif.isRead ? 'bg-[#1B2A56]/[0.04] dark:bg-[#1B2A56]/10' : ''
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                                {getNotificationIcon(notif.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-900 dark:text-white">{notif.title}</p>
                                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">{notif.message}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <p className="text-xs text-stone-400 dark:text-stone-500">{formatDate(notif.createdAt)}</p>
                                  {notif.project && (
                                    <span className="text-xs text-stone-400 dark:text-stone-500">• {notif.project.title}</span>
                                  )}
                                </div>
                              </div>
                              {!notif.isRead && (
                                <span className="w-2 h-2 rounded-full flex-shrink-0 mt-2 bg-[#1B2A56]" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-stone-200 dark:border-white/10 text-center">
                      <Link
                        href="/dashboard/notifications"
                        className="text-sm font-medium text-[#1B2A56] dark:text-[#8CA0DE] hover:underline"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* User Avatar with Dropdown */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 border-l border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg p-1 transition-colors ml-1"
                aria-label="User menu"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className={'w-8 h-8 rounded-full overflow-hidden ring-2 ring-white dark:ring-[#101114] shadow-sm bg-gradient-to-br ' + BRAND_GRADIENT + ' flex items-center justify-center'}>
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={getUserName()}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-xs font-bold text-white">{getUserInitials()}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-[#101114]" style={{ backgroundColor: NAVY }} />
                  </div>
                  <span className="text-sm font-medium text-stone-600 dark:text-stone-300 hidden sm:block">
                    {getUserName()}
                  </span>
                </div>
                <ChevronDown className={'h-4 w-4 text-stone-400 dark:text-stone-500 hidden sm:block transition-transform duration-200 ' + (userDropdownOpen ? 'rotate-180' : '')} />
              </button>

              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#16181D] rounded-xl shadow-2xl border border-stone-200 dark:border-white/10 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-stone-200 dark:border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className={'w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-[#101114] shadow-sm bg-gradient-to-br ' + BRAND_GRADIENT + ' flex items-center justify-center'}>
                            {avatarUrl ? (
                              <Image
                                src={avatarUrl}
                                alt={getUserName()}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                                unoptimized
                              />
                            ) : (
                              <span className="text-sm font-bold text-white">{getUserInitials()}</span>
                            )}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ring-2 ring-white dark:ring-[#101114]" style={{ backgroundColor: NAVY }} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 dark:text-white truncate">{user?.name || 'User'}</p>
                          <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{user?.email}</p>
                          <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: NAVY }}>
                            {user?.role || 'USER'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="py-1">
                      {userDropdownItems.map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <item.icon className="h-4 w-4 text-stone-400 dark:text-stone-500" />
                          {item.label}
                        </Link>
                      ))}
                      <div className="border-t border-stone-200 dark:border-white/10 my-1" />
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <Link
                href="/login"
                className="px-4 py-1.5 text-sm font-medium text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/join"
                className={'px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r ' + BRAND_GRADIENT + ' rounded-lg transition-all hover:shadow-md active:scale-95'}
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}