// components/DesktopSidebar.tsx
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
  Settings,
  FolderKanban,
  Plus,
  Star,
  MessageSquare,
  User,
  Sun,
  Moon,
  UserCircle,
  Calendar,
  GraduationCap,
  Bell,
  Gift,
  LogOut,
  Heart,
  Zap,
  TrendingUp,
  Award,
  Clock,
  Compass,
  Globe,
  Briefcase,
  Coffee
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface DesktopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export default function DesktopSidebar({ 
  sidebarOpen, 
  setSidebarOpen, 
  isDarkMode, 
  setIsDarkMode 
}: DesktopSidebarProps) {
  const pathname = usePathname();
  
  const [mainExpanded, setMainExpanded] = useState(true);
  const [exploreExpanded, setExploreExpanded] = useState(true);
  const [dashboardExpanded, setDashboardExpanded] = useState(true);
  
  const [resourcesExpanded, setResourcesExpanded] = useState(true);
  const [communityExpanded, setCommunityExpanded] = useState(true);
  const [getInvolvedExpanded, setGetInvolvedExpanded] = useState(true);

  // Main navigation links with icons and descriptions
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
      expanded: resourcesExpanded,
      setExpanded: setResourcesExpanded,
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
      expanded: communityExpanded,
      setExpanded: setCommunityExpanded,
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
      expanded: getInvolvedExpanded,
      setExpanded: setGetInvolvedExpanded,
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

  const quickLinks = [
    { icon: Users, label: 'Join', href: '/join', color: 'from-indigo-500 to-purple-500' },
    { icon: Calendar, label: 'Events', href: '/events', color: 'from-blue-500 to-cyan-500' },
    { icon: GraduationCap, label: 'Mentors', href: '/mentors', color: 'from-emerald-500 to-teal-500' },
    { icon: FolderGit2, label: 'Projects', href: '/projects', color: 'from-purple-500 to-pink-500' },
  ];

  const sectionVariants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 },
  };

  return (
    <div className="hidden lg:flex h-screen fixed top-0 left-0 z-[100]">
      <aside className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-xl transition-all duration-300 flex flex-col h-full ${
        sidebarOpen ? 'w-72' : 'w-16'
      }`}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={`absolute -right-3 top-6 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-20 ${
            sidebarOpen ? 'rotate-90' : '-rotate-90'
          }`}
        >
          <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </button>

        {sidebarOpen ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-thumb-gray-600">
            {/* Logo/Brand with animation */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200 dark:border-gray-800 group">
              <div className="relative w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/community-website-logo.png"
                  alt="Community Ecosystem Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">Community</span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase">Ecosystem</span>
              </div>
            </div>

            {/* Hero Section with gradient */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 border border-indigo-100 dark:border-indigo-800/30 hover:shadow-md transition-shadow duration-300">
                <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-800 px-2.5 py-0.5 text-[10px] font-medium text-gray-700 dark:text-gray-300 shadow-sm">
                  <Users className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                  Join the movement
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">Become part of Tech Rise Africa</h3>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                  Join an active community of learners, builders, mentors, and volunteers.
                </p>
                <Link
                  href="/join"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1 text-[11px] font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 active:scale-95"
                >
                  Join Now
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Stats Section with hover effects */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-3 gap-2">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={stat.label} 
                      className="group rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-2 text-center hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all duration-300 cursor-default"
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
            </div>

            {/* Quick Links with hover effects */}
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-4 gap-1.5">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
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
            </div>

            {/* Navigation Sections */}
            <div className="px-3 py-3 space-y-1">
              {/* MAIN SECTION */}
              <div className="mb-2">
                <button
                  onClick={() => setMainExpanded(!mainExpanded)}
                  className="group flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    Main
                  </span>
                  {mainExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {mainExpanded && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={sectionVariants}
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
                              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                                active
                                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                                active 
                                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md' 
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
                                <span className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
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
              <div className="mb-2">
                <button
                  onClick={() => setExploreExpanded(!exploreExpanded)}
                  className="group flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    Explore
                  </span>
                  {exploreExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {exploreExpanded && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={sectionVariants}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-0.5 mt-1">
                        {navGroups.map((group) => {
                          const Icon = group.icon;
                          const active = group.items.some(item => isActive(item.href));
                          
                          return (
                            <div key={group.key} className="mb-1">
                              <button
                                onClick={() => group.setExpanded(!group.expanded)}
                                className={`group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                  active
                                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                }`}
                              >
                                <div className={`p-1 rounded-lg transition-all duration-200 ${
                                  active 
                                    ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md' 
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
                                {group.expanded ? (
                                  <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                                )}
                              </button>
                              {group.expanded && (
                                <div className="ml-7 space-y-0.5 pl-2 border-l-2 border-gray-200 dark:border-gray-700 mt-1">
                                  {group.items.map((link) => {
                                    const LinkIcon = link.icon;
                                    const active = isActive(link.href);
                                    return (
                                      <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                                          active
                                            ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
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
                                          <span className="text-[8px] font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-1.5 py-0.5 rounded-full">
                                            {link.badge}
                                          </span>
                                        )}
                                        {active && (
                                          <span className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
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

              {/* DASHBOARD SECTION */}
              <div className="mb-2">
                <button
                  onClick={() => setDashboardExpanded(!dashboardExpanded)}
                  className="group flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    Dashboard
                  </span>
                  {dashboardExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  )}
                </button>
                <AnimatePresence initial={false}>
                  {dashboardExpanded && (
                    <motion.div
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={sectionVariants}
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
                              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                                active
                                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:shadow-sm'
                              }`}
                            >
                              <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                                active 
                                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md' 
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
                                <span className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* User Section with enhanced styling */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3 mb-3 group cursor-default">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                  S
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    Sarah Johnson
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">sarah@example.com</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Link
                  href="/dashboard/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 text-sm group"
                >
                  <UserCircle className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Profile</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 text-sm group"
                >
                  <Settings className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Settings</span>
                </Link>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 text-sm group"
              >
                {isDarkMode ? <Sun className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" /> : <Moon className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />}
                <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>

            {/* Join Button - Enhanced */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/join"
                className="group flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                Join the Community
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        ) : (
          // Collapsed Sidebar with tooltips
          <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <div className="flex items-center justify-center py-2 border-b border-gray-200 dark:border-gray-800 w-full pb-4">
              <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20 hover:scale-110 transition-transform duration-300">
                <Image
                  src="/community-website-logo.png"
                  alt="Community Ecosystem Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {mainLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center justify-center rounded-lg p-2.5 text-sm transition-all w-12 h-12 ${
                    active
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {link.label}
                  </span>
                </Link>
              );
            })}

            <Link
              href="/dashboard"
              className={`group relative flex items-center justify-center rounded-lg p-2.5 text-sm transition-all w-12 h-12 ${
                isActive('/dashboard')
                  ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                Dashboard
              </span>
            </Link>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="group relative flex items-center justify-center rounded-lg p-2.5 text-sm transition-all w-12 h-12 text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="absolute left-full ml-3 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}