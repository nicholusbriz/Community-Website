// components/MobileMenu.tsx
'use client';

import { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  FolderGit2,
  Home,
  Info,
  LayoutDashboard,
  MessageSquareQuote,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
  X,
  Settings,
  FolderKanban,
  Plus,
  Star,
  MessageSquare,
  User,
  UserCircle,
  Sun,
  Moon,
  Heart,
  Bell,
  HelpCircle,
  LogOut,
  Gift,
  Bookmark,
  Shield,
  Clock,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Rocket,
  Award,
  Zap,
  CheckCircle,
  Globe,
  Compass,
  Coffee,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/useAuth';

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function MobileMenu({ isOpen, onClose, isDarkMode, setIsDarkMode }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, status, actions } = useAuth();
  const isAuthenticated = status === 'authenticated';

  // All sections expanded by default
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    main: true,
    explore: true,
    dashboard: true,
    resources: true,
    community: true,
    getInvolved: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSignOut = async () => {
    await actions.signOutUser();
    onClose();
  };

  const mainLinks = [
    { href: '/', label: 'Home', icon: Home, description: 'Dashboard overview' },
    { href: '/about', label: 'About', icon: Info, description: 'Learn about us' },
    { href: '/programs', label: 'Programs', icon: FolderGit2, description: 'Learning tracks' },
    { href: '/resources', label: 'Resources', icon: BookOpen, description: 'Knowledge hub' },
    { href: '/developers', label: 'Developers', icon: Users, description: 'Community members' },
  ];

  const dashboardLinks = [
    { href: '/dashboard', label: 'Dashboard Home', icon: LayoutDashboard, description: 'Overview' },
    { href: '/dashboard/projects', label: 'My Projects', icon: FolderKanban, description: 'Your projects' },
    { href: '/dashboard/projects/new', label: 'Create Project', icon: Plus, description: 'Start new', badge: 'New' },
    { href: '/dashboard/saved', label: 'Saved Projects', icon: Star, description: 'Bookmarked' },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare, description: 'Inbox', badge: '3' },
    { href: '/dashboard/profile', label: 'My Profile', icon: User, description: 'Your info' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, description: 'Preferences' },
  ];

  const navGroups = [
    {
      key: 'resources',
      label: 'Resources',
      icon: BookOpen,
      description: 'Learn and grow',
      items: [
        { href: '/blog', label: 'Blog', icon: MessageSquareQuote, description: 'Latest posts' },
        { href: '/gallery', label: 'Gallery', icon: FolderGit2, description: 'Visual stories' },
        { href: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote, description: 'Member stories' },
      ],
    },
    {
      key: 'community',
      label: 'Community',
      icon: Users,
      description: 'Connect and engage',
      items: [
        { href: '/community', label: 'Community Hub', icon: Users, description: 'Main space' },
        { href: '/events', label: 'Events', icon: CalendarDays, description: 'Upcoming', badge: 'Live' },
        { href: '/mentors', label: 'Mentors', icon: Users, description: 'Find mentors' },
        { href: '/projects', label: 'Projects', icon: FolderGit2, description: 'All projects' },
      ],
    },
    {
      key: 'getInvolved',
      label: 'Get Involved',
      icon: Sparkles,
      description: 'Make an impact',
      items: [
        { href: '/join', label: 'Join Us', icon: Users, description: 'Become a member' },
        { href: '/faq', label: 'FAQ', icon: Info, description: 'Common questions' },
        { href: '/contact', label: 'Contact', icon: Info, description: 'Get in touch' },
      ],
    },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const stats = [
    { label: 'Members', value: '1.2k', icon: Users, color: 'text-blue-500' },
    { label: 'Online', value: '89', icon: Zap, color: 'text-emerald-500' },
    { label: 'Projects', value: '456', icon: FolderGit2, color: 'text-purple-500' },
  ];

  // Quick links - show different links based on auth status
  const quickLinks = isAuthenticated ? [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', color: 'from-blue-500 to-indigo-500' },
    { icon: Calendar, label: 'Events', href: '/events', color: 'from-cyan-500 to-blue-500' },
    { icon: GraduationCap, label: 'Mentors', href: '/mentors', color: 'from-emerald-500 to-teal-500' },
    { icon: FolderGit2, label: 'Projects', href: '/projects', color: 'from-purple-500 to-pink-500' },
  ] : [
    { icon: Users, label: 'Login', href: '/login', color: 'from-blue-500 to-indigo-500' },
    { icon: Calendar, label: 'Events', href: '/events', color: 'from-cyan-500 to-blue-500' },
    { icon: GraduationCap, label: 'Mentors', href: '/mentors', color: 'from-emerald-500 to-teal-500' },
    { icon: FolderGit2, label: 'Projects', href: '/projects', color: 'from-purple-500 to-pink-500' },
  ];

  // Get user initials from centralized auth
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Get user display name from centralized auth
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    // ✅ The key fix: Use isOpen prop to control the animation
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - separate from the menu for better animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9998] lg:hidden bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-in Menu */}
          <motion.div
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ 
              type: 'spring',
              stiffness: 350,
              damping: 28,
              mass: 0.6,
              duration: 0.35
            }}
            className="fixed top-0 left-0 h-full w-[92%] max-w-sm z-[9999] lg:hidden bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
          >
            <div className="p-5">
              {/* Header with Brand and Close */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                    <Image
                      src="/community-website-logo.png"
                      alt="Community Ecosystem Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent text-sm">
                      Community
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">
                      Ecosystem
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Hero Section - Hide when authenticated */}
              {!isAuthenticated && (
                <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-800/30">
                  <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                    <Users className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    Join the movement
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Become part of Tech Rise Africa</h3>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                    Join an active community of learners, builders, mentors, and volunteers.
                  </p>
                  <Link
                    href="/join"
                    onClick={onClose}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 text-[11px] font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
                  >
                    Join Now
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {/* Stats Section with hover effects */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.label} 
                      className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-2 text-center hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Icon className={`h-3 w-3 ${stat.color}`} />
                        <p className="text-sm font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      </div>
                      <p className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Links with hover effects */}
              <div className="grid grid-cols-4 gap-1.5 mb-5">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      className="group flex flex-col items-center gap-0.5 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-105"
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${link.color} flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-[8px] font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* MAIN SECTION */}
              <div className="mb-3">
                <button
                  onClick={() => toggleSection('main')}
                  className="group flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    Main
                  </span>
                  {expandedSections.main ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.main && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 mt-1">
                        {mainLinks.map((link) => {
                          const Icon = link.icon;
                          const active = isActive(link.href);
                          return (
                            <Link
                              key={link.href}
                              href={link.href}
                              onClick={onClose}
                              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                                active
                                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm border border-blue-200 dark:border-blue-800/30'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                                active 
                                  ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md' 
                                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                              }`}>
                                <Icon className="h-4 w-4" />
                              </div>
                              <div className="flex-1">
                                <span className="font-medium">{link.label}</span>
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                                  {link.description}
                                </p>
                              </div>
                              {active && (
                                <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EXPLORE SECTION */}
              <div className="mb-3">
                <button
                  onClick={() => toggleSection('explore')}
                  className="group flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    Explore
                  </span>
                  {expandedSections.explore ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedSections.explore && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 mt-1">
                        {navGroups.map((group) => {
                          const Icon = group.icon;
                          const isGroupOpen = expandedSections[group.key] ?? true;
                          const groupActive = group.items.some(item => isActive(item.href));
                          
                          return (
                            <div key={group.key} className="mb-1">
                              <button
                                onClick={() => toggleSection(group.key)}
                                className={`group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                  groupActive
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              >
                                <div className={`p-1 rounded-lg transition-all duration-200 ${
                                  groupActive 
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md' 
                                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1 text-left">
                                  <span className="font-medium">{group.label}</span>
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                                    {group.description}
                                  </p>
                                </div>
                                {isGroupOpen ? (
                                  <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                )}
                              </button>
                              {isGroupOpen && (
                                <div className="ml-7 space-y-0.5 pl-2 border-l-2 border-gray-200 dark:border-gray-700 mt-1">
                                  {group.items.map((link) => {
                                    const LinkIcon = link.icon;
                                    const active = isActive(link.href);
                                    return (
                                      <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                          active
                                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-medium border border-blue-200 dark:border-blue-800/30'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                      >
                                        <LinkIcon className="h-3.5 w-3.5" />
                                        <div className="flex-1">
                                          <span>{link.label}</span>
                                          <p className="text-[9px] text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                                            {link.description}
                                          </p>
                                        </div>
                                        {link.badge && (
                                          <span className="text-[8px] font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-1.5 py-0.5 rounded-full">
                                            {link.badge}
                                          </span>
                                        )}
                                        {active && (
                                          <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                                        )}
                                      </Link>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* DASHBOARD SECTION - Only show when authenticated */}
              {isAuthenticated && (
                <div className="mb-3">
                  <button
                    onClick={() => toggleSection('dashboard')}
                    className="group flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  >
                    <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                      Dashboard
                    </span>
                    {expandedSections.dashboard ? (
                      <ChevronUp className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.dashboard && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 mt-1">
                          {dashboardLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                              <Link
                                key={link.href}
                                href={link.href}
                                onClick={onClose}
                                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                                  active
                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 font-medium shadow-sm border border-blue-200 dark:border-blue-800/30'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'
                                }`}
                              >
                                <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                                  active 
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md' 
                                    : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="flex-1">
                                  <span className="font-medium">{link.label}</span>
                                  <p className="text-[10px] text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                                    {link.description}
                                  </p>
                                </div>
                                {link.badge && (
                                  <span className={`text-[8px] font-medium px-1.5 py-0.5 rounded-full ${
                                    link.badge === 'New' 
                                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                                  }`}>
                                    {link.badge}
                                  </span>
                                )}
                                {active && (
                                  <span className="w-1.5 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* User Section - Show different content based on auth status */}
              <div className="pt-1">
                {isAuthenticated ? (
                  // Authenticated User Section
                  <>
                    <div className="flex items-center gap-3 mb-3 group cursor-default">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center">
                          {user?.image ? (
                            <Image
                              src={user.image}
                              alt={getUserName()}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <span className="text-sm font-bold text-blue-600">
                              {getUserInitials()}
                            </span>
                          )}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {getUserName()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                        <p className="text-[9px] text-blue-500 dark:text-blue-400 font-medium">
                          {user?.role || 'USER'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Link
                        href="/dashboard/profile"
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-sm group"
                      >
                        <UserCircle className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Profile</span>
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={onClose}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-sm group"
                      >
                        <Settings className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Settings</span>
                      </Link>
                    </div>

                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-sm group mb-2"
                    >
                      {isDarkMode ? <Sun className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" /> : <Moon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />}
                      <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </button>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-700 transition-all duration-200 text-sm group"
                    >
                      <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">Sign Out</span>
                    </button>
                  </>
                ) : (
                  // Unauthenticated User Section
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-sm group"
                      >
                        <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Log In</span>
                      </Link>
                      <Link
                        href="/join"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 text-sm group"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Join Now</span>
                      </Link>
                    </div>

                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 text-sm group"
                    >
                      {isDarkMode ? <Sun className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" /> : <Moon className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />}
                      <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                      </span>
                    </button>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

              {/* Bottom Action Button - Changes based on auth status */}
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="group flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <LayoutDashboard className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ) : (
                <Link
                  href="/join"
                  onClick={onClose}
                  className="group flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  Join the Community
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}