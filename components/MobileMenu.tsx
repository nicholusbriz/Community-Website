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
  LogOut,
  Calendar,
  GraduationCap,
  Zap,
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

// ─────────────────────────────────────────────────────────────
// Brand tokens — matches DesktopSidebar: black + dark navy only.
// ─────────────────────────────────────────────────────────────
const BRAND_GRADIENT = 'from-[#0B0F1A] via-[#16223F] to-[#1B2A56]';
const ACCENT = {
  navy: { text: 'text-[#1B2A56]', darkText: 'dark:text-[#8CA0DE]', bg: 'bg-[#1B2A56]', soft: 'bg-[#1B2A56]/10', softDark: 'dark:bg-[#1B2A56]/15' },
  black: { text: 'text-[#171717]', darkText: 'dark:text-[#E5E5E5]', bg: 'bg-[#171717]', soft: 'bg-[#171717]/10', softDark: 'dark:bg-white/10' },
};

export default function MobileMenu({ isOpen, onClose, isDarkMode, setIsDarkMode }: MobileMenuProps) {
  const pathname = usePathname();
  const { user, status, actions } = useAuth();
  const isAuthenticated = status === 'authenticated';

  // ✅ Simply use user.image from the session - no real-time logic
  const avatarUrl = user?.image || null;

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
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
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
      accent: ACCENT.black,
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
      accent: ACCENT.navy,
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
      accent: ACCENT.black,
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
    { label: 'Members', value: '1.2k', icon: Users, accent: ACCENT.black },
    { label: 'Online', value: '89', icon: Zap, accent: ACCENT.navy },
    { label: 'Projects', value: '456', icon: FolderGit2, accent: ACCENT.black },
  ];

  // Quick links - show different links based on auth status
  const quickLinks = isAuthenticated
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', accent: ACCENT.navy },
        { icon: Calendar, label: 'Events', href: '/events', accent: ACCENT.black },
        { icon: GraduationCap, label: 'Mentors', href: '/mentors', accent: ACCENT.navy },
        { icon: FolderGit2, label: 'Projects', href: '/projects', accent: ACCENT.black },
      ]
    : [
        { icon: Users, label: 'Login', href: '/login', accent: ACCENT.navy },
        { icon: Calendar, label: 'Events', href: '/events', accent: ACCENT.black },
        { icon: GraduationCap, label: 'Mentors', href: '/mentors', accent: ACCENT.navy },
        { icon: FolderGit2, label: 'Projects', href: '/projects', accent: ACCENT.black },
      ];

  // Get user initials from centralized auth
  const getUserInitials = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  // Get user display name from centralized auth
  const getUserName = () => {
    if (user?.name) return user.name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className="fixed top-0 left-0 h-full w-[92%] max-w-sm z-[9999] lg:hidden bg-white dark:bg-[#101114] shadow-2xl overflow-y-auto"
          >
            {/* Signature brand rail — matches the desktop sidebar */}
            <div className={`absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b ${BRAND_GRADIENT}`} />

            <div className="p-5 pl-6">
              {/* Header with Brand and Close */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden bg-gradient-to-br ${BRAND_GRADIENT} shadow-md`}
                  >
                    <Image
                      src="/community-website-logo.png"
                      alt="Community Ecosystem Logo"
                      width={36}
                      height={36}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[15px] font-semibold tracking-tight text-stone-900 dark:text-white">
                      Community
                    </p>
                    <p className="text-[10px] text-stone-400 dark:text-stone-500 font-medium tracking-[0.14em] uppercase">
                      Ecosystem
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} className="text-stone-500 dark:text-stone-400" />
                </button>
              </div>

              {/* Hero Section - Hide when authenticated */}
              {!isAuthenticated && (
                <div className={`relative overflow-hidden mb-5 p-4 rounded-2xl bg-gradient-to-br ${BRAND_GRADIENT} shadow-lg shadow-[#1B2A56]/20`}>
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                  <div className="relative mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white">
                    <Users className="h-3 w-3" />
                    Join the movement
                  </div>
                  <h3 className="relative text-sm font-semibold text-white mb-1">Become part of Tech Rise Africa</h3>
                  <p className="relative text-[11px] text-white/85 leading-relaxed">
                    An active community of learners, builders, mentors and volunteers.
                  </p>
                  <Link
                    href="/join"
                    onClick={onClose}
                    className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#1B2A56] transition-all hover:shadow-md active:scale-95"
                  >
                    Join Now
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}

              {/* Stats Section */}
              <div className="grid grid-cols-3 gap-2 mb-5">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/[0.03] py-2.5 text-center hover:border-stone-300 dark:hover:border-white/20 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <Icon className={`h-3 w-3 ${stat.accent.text} ${stat.accent.darkText}`} />
                        <p className="text-sm font-bold text-stone-900 dark:text-white">{stat.value}</p>
                      </div>
                      <p className="text-[9px] text-stone-400 dark:text-stone-500 font-medium tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-4 gap-1.5 mb-5">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={onClose}
                      className="group flex flex-col items-center gap-1 p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-white/5 transition-all duration-200"
                    >
                      <div
                        className={`w-8 h-8 rounded-lg ${link.accent.soft} ${link.accent.softDark} flex items-center justify-center group-hover:scale-105 transition-transform duration-200`}
                      >
                        <Icon className={`h-3.5 w-3.5 ${link.accent.text} ${link.accent.darkText}`} />
                      </div>
                      <span className="text-[8.5px] font-medium text-stone-500 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-200 dark:border-white/10 my-4" />

              {/* MAIN SECTION */}
              <div className="mb-3">
                <button
                  onClick={() => toggleSection('main')}
                  className="group flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-all duration-200"
                >
                  <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.12em]">
                    Main
                  </span>
                  {expandedSections.main ? (
                    <ChevronUp className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
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
                              className={`group relative flex items-center gap-3 rounded-lg pl-3 pr-2 py-2.5 text-sm transition-all duration-200 ${
                                active
                                  ? 'bg-[#1B2A56]/[0.08] dark:bg-[#1B2A56]/[0.15] text-[#1B2A56] dark:text-[#8CA0DE] font-medium'
                                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
                              }`}
                            >
                              {active && (
                                <span className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-to-b ${BRAND_GRADIENT}`} />
                              )}
                              <Icon
                                className={`h-4 w-4 flex-shrink-0 ${
                                  active ? 'text-[#1B2A56] dark:text-[#8CA0DE]' : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                                }`}
                              />
                              <div className="flex-1 min-w-0">
                                <span className="font-medium">{link.label}</span>
                                <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate">{link.description}</p>
                              </div>
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
                  className="group flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-all duration-200"
                >
                  <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.12em]">
                    Explore
                  </span>
                  {expandedSections.explore ? (
                    <ChevronUp className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
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
                          const groupActive = group.items.some((item) => isActive(item.href));

                          return (
                            <div key={group.key} className="mb-0.5">
                              <button
                                onClick={() => toggleSection(group.key)}
                                className="group w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-stone-100 dark:hover:bg-white/5 transition-all duration-200"
                              >
                                <div
                                  className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${
                                    groupActive ? `${group.accent.soft} ${group.accent.softDark}` : 'text-stone-400 dark:text-stone-500'
                                  }`}
                                >
                                  <Icon
                                    className={`h-3.5 w-3.5 ${
                                      groupActive ? `${group.accent.text} ${group.accent.darkText}` : 'text-stone-400 dark:text-stone-500'
                                    }`}
                                  />
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <span className={`font-medium ${groupActive ? 'text-stone-900 dark:text-white' : 'text-stone-600 dark:text-stone-300'}`}>
                                    {group.label}
                                  </span>
                                  <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate">{group.description}</p>
                                </div>
                                {isGroupOpen ? (
                                  <ChevronUp className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                                ) : (
                                  <ChevronDown className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500 flex-shrink-0" />
                                )}
                              </button>
                              {isGroupOpen && (
                                <div className="ml-3 pl-4 space-y-0.5 mt-0.5 border-l border-stone-200 dark:border-white/10">
                                  {group.items.map((link) => {
                                    const LinkIcon = link.icon;
                                    const active = isActive(link.href);
                                    return (
                                      <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className={`group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all duration-200 ${
                                          active
                                            ? `${group.accent.text} ${group.accent.darkText} font-medium ${group.accent.soft} ${group.accent.softDark}`
                                            : 'text-stone-500 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-white/5 hover:text-stone-800 dark:hover:text-white'
                                        }`}
                                      >
                                        <LinkIcon className="h-3.5 w-3.5 flex-shrink-0" />
                                        <span className="flex-1 truncate">{link.label}</span>
                                        {link.badge && (
                                          <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r ${BRAND_GRADIENT}`}>
                                            {link.badge}
                                          </span>
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
                    className="group flex items-center justify-between w-full px-2 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-all duration-200"
                  >
                    <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.12em]">
                      Dashboard
                    </span>
                    {expandedSections.dashboard ? (
                      <ChevronUp className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
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
                                className={`group relative flex items-center gap-3 rounded-lg pl-3 pr-2 py-2.5 text-sm transition-all duration-200 ${
                                  active
                                    ? 'bg-[#1B2A56]/[0.08] dark:bg-[#1B2A56]/[0.15] text-[#1B2A56] dark:text-[#8CA0DE] font-medium'
                                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5'
                                }`}
                              >
                                {active && (
                                  <span className={`absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-gradient-to-b ${BRAND_GRADIENT}`} />
                                )}
                                <Icon
                                  className={`h-4 w-4 flex-shrink-0 ${
                                    active ? 'text-[#1B2A56] dark:text-[#8CA0DE]' : 'text-stone-400 dark:text-stone-500 group-hover:text-stone-600 dark:group-hover:text-stone-300'
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="font-medium">{link.label}</span>
                                  <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate">{link.description}</p>
                                </div>
                                {link.badge && (
                                  <span
                                    className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                                      link.badge === 'New'
                                        ? 'bg-[#1B2A56]/10 dark:bg-[#1B2A56]/20 text-[#1B2A56] dark:text-[#8CA0DE]'
                                        : 'text-white bg-gradient-to-r ' + BRAND_GRADIENT
                                    }`}
                                  >
                                    {link.badge}
                                  </span>
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
              <div className="border-t border-stone-200 dark:border-white/10 my-4" />

              {/* User Section - Show different content based on auth status */}
              <div className="pt-1">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`w-10 h-10 rounded-full overflow-hidden ring-2 ring-white dark:ring-[#101114] shadow-sm bg-gradient-to-br ${BRAND_GRADIENT} flex items-center justify-center`}
                        >
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
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#1B2A56] rounded-full ring-2 ring-white dark:ring-[#101114]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-stone-900 dark:text-white text-sm truncate">{getUserName()}</p>
                        <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{user?.email}</p>
                        <p className="text-[9px] text-[#1B2A56] dark:text-[#8CA0DE] font-semibold uppercase tracking-wider">
                          {user?.role || 'USER'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Link
                        href="/dashboard/profile"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-[#1B2A56]/30 hover:text-[#1B2A56] dark:hover:text-[#8CA0DE] hover:bg-stone-50 dark:hover:bg-white/5 transition-all duration-200 text-[13px]"
                      >
                        <UserCircle className="h-3.5 w-3.5" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-[#1B2A56]/30 hover:text-[#1B2A56] dark:hover:text-[#8CA0DE] hover:bg-stone-50 dark:hover:bg-white/5 transition-all duration-200 text-[13px]"
                      >
                        <Settings className="h-3.5 w-3.5" />
                        Settings
                      </Link>
                    </div>

                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:border-[#1B2A56]/30 transition-all duration-200 text-[13px] mb-2"
                    >
                      {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/40 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-200 text-[13px]"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <Link
                        href="/login"
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:border-[#1B2A56]/30 transition-all duration-200 text-[13px]"
                      >
                        Log In
                      </Link>
                      <Link
                        href="/join"
                        onClick={onClose}
                        className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${BRAND_GRADIENT} text-white shadow-sm hover:shadow-md transition-all duration-200 text-[13px] font-medium active:scale-95`}
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        Join Now
                      </Link>
                    </div>

                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="flex items-center gap-3 w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:border-[#1B2A56]/30 transition-all duration-200 text-[13px]"
                    >
                      {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                      {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                  </>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-stone-200 dark:border-white/10 my-4" />

              {/* Bottom Action Button - Changes based on auth status */}
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className={`group flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r ${BRAND_GRADIENT} px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#1B2A56]/20 transition-all hover:shadow-lg hover:shadow-[#1B2A56]/30 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ) : (
                <Link
                  href="/join"
                  onClick={onClose}
                  className={`group flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r ${BRAND_GRADIENT} px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#1B2A56]/20 transition-all hover:shadow-lg hover:shadow-[#1B2A56]/30 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <Sparkles className="h-4 w-4" />
                  Join the Community
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </motion.div>
      )}
    </AnimatePresence>
  );
}