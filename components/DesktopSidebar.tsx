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
  LogOut,
  Zap,
  Shield,
  ShieldCheck,
  Users as UsersIcon,
  Database,
  Server,
  Activity,
  BarChart,
  Mail,
  FileText,
  HelpCircle,
  MapPin,
  Briefcase,
  Award,
  Globe,
  ListTodo,
  Bell,
  FolderOpen,
  GitBranch,
  Code,
  TrendingUp,
  UserPlus,
  CheckCircle,
  Clock,
  Archive
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/app/lib/auth/useAuth';

interface DesktopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

// ─────────────────────────────────────────────────────────────
// Brand tokens — "Sunrise" identity
// ─────────────────────────────────────────────────────────────
const BRAND_GRADIENT = 'from-[#0B0F1A] via-[#16223F] to-[#1B2A56]';
const ACCENT = {
  coral: { text: 'text-[#1B2A56]', darkText: 'dark:text-[#8CA0DE]', bg: 'bg-[#1B2A56]', soft: 'bg-[#1B2A56]/10', softDark: 'dark:bg-[#1B2A56]/15', ring: 'border-[#1B2A56]/25' },
  amber: { text: 'text-[#171717]', darkText: 'dark:text-[#E5E5E5]', bg: 'bg-[#171717]', soft: 'bg-[#171717]/10', softDark: 'dark:bg-white/10' },
  teal: { text: 'text-[#1B2A56]', darkText: 'dark:text-[#8CA0DE]', bg: 'bg-[#1B2A56]', soft: 'bg-[#1B2A56]/10', softDark: 'dark:bg-[#1B2A56]/15' },
  plum: { text: 'text-[#171717]', darkText: 'dark:text-[#E5E5E5]', bg: 'bg-[#171717]', soft: 'bg-[#171717]/10', softDark: 'dark:bg-white/10' },
};

export default function DesktopSidebar({
  sidebarOpen,
  setSidebarOpen,
  isDarkMode,
  setIsDarkMode,
}: DesktopSidebarProps) {
  const pathname = usePathname();
  const { user, status, actions } = useAuth();
  const isAuthenticated = status === 'authenticated';
  const userRole = user?.role || 'USER';

  const avatarUrl = user?.image || null;

  // Section expanded states
  const [mainExpanded, setMainExpanded] = useState(true);
  const [exploreExpanded, setExploreExpanded] = useState(true);
  const [dashboardExpanded, setDashboardExpanded] = useState(true);
  const [adminExpanded, setAdminExpanded] = useState(true);
  const [superAdminExpanded, setSuperAdminExpanded] = useState(true);

  const handleSignOut = async () => {
    await actions.signOutUser();
  };

  // ============================================================
  // 📋 NAVIGATION CONFIGURATION
  // ============================================================

  // 1️⃣ PUBLIC NAVIGATION (Visible to everyone)
  const mainLinks = [
    { href: '/', label: 'Home', icon: Home, description: 'Dashboard overview' },
    { href: '/about', label: 'About', icon: Info, description: 'Learn about us' },
    { href: '/developers', label: 'Developers', icon: Users, description: 'Community members' },
    { href: '/projects', label: 'Projects', icon: FolderGit2, description: 'All projects' },
  ];

  // 2️⃣ EXPLORE (Public)
  const exploreItems = [
    { href: '/community', label: 'Community Hub', icon: Users, description: 'Main space' },
    { href: '/events', label: 'Events', icon: CalendarDays, description: 'Upcoming', badge: 'Live' },
    { href: '/mentors', label: 'Mentors', icon: GraduationCap, description: 'Find mentors' },
    { href: '/developers', label: 'Developers', icon: Users, description: 'Meet developers' },
  ];

  // 3️⃣ GET INVOLVED (Public)
  const getInvolvedItems = [
    { href: '/join', label: 'Join Us', icon: UserPlus, description: 'Become a member' },
    { href: '/faq', label: 'FAQ', icon: HelpCircle, description: 'Common questions' },
    { href: '/contact', label: 'Contact', icon: MapPin, description: 'Get in touch' },
  ];

  // 4️⃣ DASHBOARD NAVIGATION (Authenticated users)
  const dashboardLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, description: 'Overview' },
    { href: '/dashboard/projects', label: 'My Projects', icon: FolderKanban, description: 'Your projects' },
    { href: '/dashboard/tasks', label: 'My Tasks', icon: ListTodo, description: 'Assigned tasks' },
    { href: '/dashboard/messages', label: 'Messages', icon: MessageSquare, description: 'Inbox', badge: '3' },
    { href: '/dashboard/notifications', label: 'Notifications', icon: Bell, description: 'Updates', badge: '5' },
    { href: '/dashboard/profile', label: 'Profile', icon: User, description: 'Your info' },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings, description: 'Preferences' },
  ];

  // ✅ 5️⃣ PROJECT ACTIONS (Authenticated users) - FIXED: Changed from projectActionLinks to projectActions
  const projectActions = [
    { href: '/dashboard/projects/create', label: 'Create Project', icon: Plus, description: 'Start a new project' },
    { href: '/dashboard/projects', label: 'Manage Projects', icon: FolderOpen, description: 'Manage your projects' },
  ];

  // 6️⃣ ADMIN NAVIGATION (ADMIN or SUPERADMIN)
  const adminLinks = [
    { href: '/admin', label: 'Admin Dashboard', icon: Shield, description: 'Admin overview' },
    { href: '/admin/projects', label: 'Manage Projects', icon: FolderKanban, description: 'Project oversight' },
    { href: '/admin/users', label: 'Manage Users', icon: UsersIcon, description: 'User management' },
    { href: '/admin/projects/analytics', label: 'Analytics', icon: BarChart, description: 'Site analytics' },
    { href: '/admin/reports', label: 'Reports', icon: FileText, description: 'Platform reports' },
  ];

  // 7️⃣ SUPERADMIN NAVIGATION (SUPERADMIN only)
  const superAdminLinks = [
    { href: '/super', label: 'Super Dashboard', icon: ShieldCheck, description: 'System overview' },
    { href: '/super/projects', label: 'All Projects', icon: FolderGit2, description: 'Review all projects' },
    { href: '/super/projects/review', label: 'Review Queue', icon: CheckCircle, description: 'Pending reviews' },
    { href: '/super/projects/archive', label: 'Archived', icon: Archive, description: 'Archived projects' },
    { href: '/super/system', label: 'System Settings', icon: Server, description: 'System configuration' },
    { href: '/super/logs', label: 'Activity Logs', icon: Activity, description: 'System logs' },
  ];

  // 8️⃣ QUICK LINKS - Based on auth status and role
  const quickLinks = isAuthenticated
    ? [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', accent: ACCENT.coral },
        { icon: Calendar, label: 'Events', href: '/events', accent: ACCENT.amber },
        { icon: GraduationCap, label: 'Mentors', href: '/mentors', accent: ACCENT.teal },
        { icon: FolderGit2, label: 'Projects', href: '/projects', accent: ACCENT.plum },
        ...(userRole === 'ADMIN' || userRole === 'SUPERADMIN' ? [
          { icon: Shield, label: 'Admin', href: '/admin', accent: ACCENT.coral },
        ] : []),
        ...(userRole === 'SUPERADMIN' ? [
          { icon: ShieldCheck, label: 'Super', href: '/super', accent: ACCENT.coral },
        ] : []),
      ]
    : [
        { icon: User, label: 'Login', href: '/login', accent: ACCENT.coral },
        { icon: Calendar, label: 'Events', href: '/events', accent: ACCENT.amber },
        { icon: GraduationCap, label: 'Mentors', href: '/mentors', accent: ACCENT.teal },
        { icon: FolderGit2, label: 'Projects', href: '/projects', accent: ACCENT.plum },
      ];

  // ============================================================
  // 🔧 HELPER FUNCTIONS
  // ============================================================

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    if (href === '/dashboard') return pathname === href || pathname.startsWith('/dashboard/');
    if (href === '/admin') return pathname === href || pathname.startsWith('/admin/');
    if (href === '/super') return pathname === href || pathname.startsWith('/super/');
    if (href === '/projects') return pathname === href || pathname.startsWith('/projects/');
    return pathname.startsWith(href);
  };

  const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';
  const isSuperAdmin = userRole === 'SUPERADMIN';

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

  const stats = [
    { label: 'Members', value: '1.2k', icon: Users, accent: ACCENT.coral },
    { label: 'Online', value: '89', icon: Zap, accent: ACCENT.teal },
    { label: 'Projects', value: '456', icon: FolderGit2, accent: ACCENT.amber },
  ];

  const sectionVariants = {
    open: { opacity: 1, height: 'auto' },
    closed: { opacity: 0, height: 0 },
  };

  // Navigation item renderer
  const NavItem = ({ href, label, icon: Icon, description, badge, active }: any) => (
    <Link
      href={href}
      className={`group relative flex items-center gap-3 rounded-lg pl-3 pr-2 py-2.5 text-sm transition-all duration-200 ${
        active
          ? 'bg-[#1B2A56]/[0.08] dark:bg-[#1B2A56]/[0.12] text-[#1B2A56] dark:text-[#8CA0DE] font-medium'
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
        <span className="font-medium">{label}</span>
        {description && (
          <p className="text-[10px] text-stone-400 dark:text-stone-500 truncate">{description}</p>
        )}
      </div>
      {badge && (
        <span
          className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
            badge === 'New' || badge === 'Live'
              ? 'bg-[#1B2A56]/10 dark:bg-[#1B2A56]/20 text-[#1B2A56] dark:text-[#8CA0DE]'
              : 'text-white bg-gradient-to-r ' + BRAND_GRADIENT
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );

  const SectionHeader = ({ label, expanded, toggle }: any) => (
    <button
      onClick={toggle}
      className="group flex items-center justify-between w-full px-3 py-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/5 transition-all duration-200"
    >
      <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-500 uppercase tracking-[0.12em]">
        {label}
      </span>
      {expanded ? (
        <ChevronUp className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
      ) : (
        <ChevronDown className="h-3.5 w-3.5 text-stone-400 dark:text-stone-500" />
      )}
    </button>
  );

  return (
    <div className="hidden lg:flex h-screen fixed top-0 left-0 z-[100]">
      <aside
        className={`relative bg-white dark:bg-[#101114] border-r border-stone-200 dark:border-white/10 shadow-xl transition-all duration-300 flex flex-col h-full ${
          sidebarOpen ? 'w-72' : 'w-16'
        }`}
      >
        {/* Signature brand rail */}
        <div className={`absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b ${BRAND_GRADIENT}`} />

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          className="absolute -right-3 top-6 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-[#1B1D22] border border-stone-200 dark:border-white/10 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-300 z-20"
        >
          <ChevronDown
            className={`h-3.5 w-3.5 text-stone-500 dark:text-stone-400 transition-transform duration-300 ${
              sidebarOpen ? 'rotate-90' : '-rotate-90'
            }`}
          />
        </button>

        {sidebarOpen ? (
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700 scrollbar-track-transparent">
            {/* Logo/Brand */}
            <div className="flex items-center gap-3 pl-5 pr-4 py-5 border-b border-stone-200 dark:border-white/10">
              <div
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br ${BRAND_GRADIENT} shadow-md`}
              >
                <Image
                  src="/community-website-logo.png"
                  alt="Community Ecosystem Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold tracking-tight text-stone-900 dark:text-white">
                  Community
                </span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium tracking-[0.14em] uppercase">
                  Ecosystem
                </span>
              </div>
            </div>

            {/* Hero Section */}
            {!isAuthenticated && (
              <div className="px-5 pt-4">
                <div
                  className={`relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br ${BRAND_GRADIENT} shadow-lg shadow-[#1B2A56]/20`}
                >
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10" />
                  <div className="relative mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-medium text-white">
                    <Users className="h-3 w-3" />
                    Join the movement
                  </div>
                  <h3 className="relative text-sm font-semibold text-white mb-1">
                    Become part of Tech Rise Africa
                  </h3>
                  <p className="relative text-[11px] text-white/85 leading-relaxed">
                    An active community of learners, builders, mentors and volunteers.
                  </p>
                  <Link
                    href="/join"
                    className="relative mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#1B2A56] transition-all hover:shadow-md hover:scale-[1.03] active:scale-95"
                  >
                    Join Now
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}

            {/* Stats Section */}
            <div className="px-5 py-4">
              <div className="grid grid-cols-3 gap-2">
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
            </div>

            {/* Quick Links */}
            <div className="px-5 pb-4">
              <div className="grid grid-cols-4 gap-1.5">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
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
            </div>

            <div className="mx-5 border-t border-stone-200 dark:border-white/10" />

            {/* Navigation Sections */}
            <div className="px-3 py-4 space-y-1">
              {/* MAIN SECTION */}
              <div className="mb-1">
                <SectionHeader label="Main" expanded={mainExpanded} toggle={() => setMainExpanded(!mainExpanded)} />
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
                        {mainLinks.map((link) => (
                          <NavItem key={link.href} {...link} active={isActive(link.href)} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* EXPLORE SECTION */}
              <div className="mb-1">
                <SectionHeader label="Explore" expanded={exploreExpanded} toggle={() => setExploreExpanded(!exploreExpanded)} />
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
                        {exploreItems.map((link) => (
                          <NavItem key={link.href} {...link} active={isActive(link.href)} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* GET INVOLVED */}
              <div className="mb-1">
                <div className="space-y-0.5 mt-1">
                  {getInvolvedItems.map((link) => (
                    <NavItem key={link.href} {...link} active={isActive(link.href)} />
                  ))}
                </div>
              </div>

              {/* ✅ PROJECT ACTIONS - Only when authenticated (FIXED: uses projectActions) */}
              {isAuthenticated && (
                <div className="mb-2">
                  <div className="space-y-0.5">
                    {projectActions.map((link) => (
                      <NavItem key={link.href} {...link} active={isActive(link.href)} />
                    ))}
                  </div>
                  <div className="mx-3 my-2 border-t border-stone-200 dark:border-white/10" />
                </div>
              )}

              {/* DASHBOARD SECTION - Only show when authenticated */}
              {isAuthenticated && (
                <div className="mb-1">
                  <SectionHeader label="Dashboard" expanded={dashboardExpanded} toggle={() => setDashboardExpanded(!dashboardExpanded)} />
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
                          {dashboardLinks.map((link) => (
                            <NavItem key={link.href} {...link} active={isActive(link.href)} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* ADMIN SECTION - ADMIN or SUPERADMIN */}
              {(isAdmin || isSuperAdmin) && (
                <div className="mb-1">
                  <SectionHeader label="Admin" expanded={adminExpanded} toggle={() => setAdminExpanded(!adminExpanded)} />
                  <AnimatePresence initial={false}>
                    {adminExpanded && (
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sectionVariants}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 mt-1">
                          {adminLinks.map((link) => (
                            <NavItem key={link.href} {...link} active={isActive(link.href)} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* SUPERADMIN SECTION - SUPERADMIN only */}
              {isSuperAdmin && (
                <div className="mb-1">
                  <SectionHeader label="Super Admin" expanded={superAdminExpanded} toggle={() => setSuperAdminExpanded(!superAdminExpanded)} />
                  <AnimatePresence initial={false}>
                    {superAdminExpanded && (
                      <motion.div
                        initial="closed"
                        animate="open"
                        exit="closed"
                        variants={sectionVariants}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 mt-1">
                          {superAdminLinks.map((link) => (
                            <NavItem key={link.href} {...link} active={isActive(link.href)} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* User Section */}
            <div className="px-5 py-4 border-t border-stone-200 dark:border-white/10">
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
                      <p className="font-semibold text-stone-900 dark:text-white text-sm truncate">
                        {getUserName()}
                      </p>
                      <p className="text-xs text-stone-400 dark:text-stone-500 truncate">{user?.email}</p>
                      <p className="text-[9px] text-[#1B2A56] dark:text-[#8CA0DE] font-semibold uppercase tracking-wider">
                        {user?.role || 'USER'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-[#1B2A56]/30 hover:text-[#1B2A56] dark:hover:text-[#8CA0DE] hover:bg-stone-50 dark:hover:bg-white/5 transition-all duration-200 text-[13px]"
                    >
                      <UserCircle className="h-3.5 w-3.5" />
                      Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
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
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-white/5 hover:border-[#1B2A56]/30 transition-all duration-200 text-[13px]"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/join"
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${BRAND_GRADIENT} text-white shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200 text-[13px] font-medium`}
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

            {/* Bottom Action Button */}
            <div className="px-5 py-4 border-t border-stone-200 dark:border-white/10">
              {isAuthenticated ? (
                <Link
                  href="/dashboard"
                  className={`group flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r ${BRAND_GRADIENT} px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#1B2A56]/20 transition-all hover:shadow-lg hover:shadow-[#1B2A56]/30 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              ) : (
                <Link
                  href="/join"
                  className={`group flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r ${BRAND_GRADIENT} px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#1B2A56]/20 transition-all hover:shadow-lg hover:shadow-[#1B2A56]/30 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <Sparkles className="h-4 w-4" />
                  Join the Community
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              )}
            </div>
          </div>
        ) : (
          // Collapsed Sidebar
          <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 space-y-2 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700 scrollbar-track-transparent">
            <div className="flex items-center justify-center pb-4 border-b border-stone-200 dark:border-white/10 w-full">
              <div
                className={`relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden bg-gradient-to-br ${BRAND_GRADIENT} shadow-md hover:scale-110 transition-transform duration-300`}
              >
                <Image
                  src="/community-website-logo.png"
                  alt="Community Ecosystem Logo"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Main Links - Collapsed */}
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative flex items-center justify-center rounded-xl w-11 h-11 transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-[#1B2A56]/10 dark:bg-[#1B2A56]/15 text-[#1B2A56] dark:text-[#8CA0DE]'
                    : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <link.icon className="h-5 w-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-stone-900 dark:bg-[#22252E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {link.label}
                </span>
              </Link>
            ))}

            <div className="w-10 border-t border-stone-200 dark:border-white/10 my-2" />

            {/* Dashboard Link */}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={`group relative flex items-center justify-center rounded-xl w-11 h-11 transition-all duration-200 ${
                  isActive('/dashboard')
                    ? 'bg-[#1B2A56]/10 dark:bg-[#1B2A56]/15 text-[#1B2A56] dark:text-[#8CA0DE]'
                    : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-stone-900 dark:bg-[#22252E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Dashboard
                </span>
              </Link>
            )}

            {/* ✅ Create Project Link - FIXED: Points to /dashboard/projects/create */}
            {isAuthenticated && (
              <Link
                href="/dashboard/projects/create"
                className={`group relative flex items-center justify-center rounded-xl w-11 h-11 transition-all duration-200 ${
                  isActive('/dashboard/projects/create')
                    ? 'bg-[#1B2A56]/10 dark:bg-[#1B2A56]/15 text-[#1B2A56] dark:text-[#8CA0DE]'
                    : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <Plus className="h-5 w-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-stone-900 dark:bg-[#22252E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Create Project
                </span>
              </Link>
            )}

            {/* Admin Link */}
            {(isAdmin || isSuperAdmin) && (
              <Link
                href="/admin"
                className={`group relative flex items-center justify-center rounded-xl w-11 h-11 transition-all duration-200 ${
                  isActive('/admin')
                    ? 'bg-[#1B2A56]/10 dark:bg-[#1B2A56]/15 text-[#1B2A56] dark:text-[#8CA0DE]'
                    : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <Shield className="h-5 w-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-stone-900 dark:bg-[#22252E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Admin
                </span>
              </Link>
            )}

            {/* Super Admin Link */}
            {isSuperAdmin && (
              <Link
                href="/super"
                className={`group relative flex items-center justify-center rounded-xl w-11 h-11 transition-all duration-200 ${
                  isActive('/super')
                    ? 'bg-[#1B2A56]/10 dark:bg-[#1B2A56]/15 text-[#1B2A56] dark:text-[#8CA0DE]'
                    : 'text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-300'
                }`}
              >
                <ShieldCheck className="h-5 w-5" />
                <span className="absolute left-full ml-3 px-2 py-1 bg-stone-900 dark:bg-[#22252E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  Super Admin
                </span>
              </Link>
            )}

            <div className="!mt-auto w-full flex flex-col items-center space-y-2 pt-2">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="group relative flex items-center justify-center rounded-xl w-11 h-11 text-stone-400 dark:text-stone-500 hover:bg-stone-100 dark:hover:bg-white/5 hover:text-stone-700 dark:hover:text-stone-300 transition-all duration-200"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                <span className="absolute left-full ml-3 px-2 py-1 bg-stone-900 dark:bg-[#22252E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                  {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={handleSignOut}
                  className="group relative flex items-center justify-center rounded-xl w-11 h-11 text-red-400 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="absolute left-full ml-3 px-2 py-1 bg-stone-900 dark:bg-[#22252E] text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    Sign Out
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}