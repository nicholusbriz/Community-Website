'use client';

import { useEffect, useState } from 'react';
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
  Menu,
  X,
  Settings,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileGroup, setExpandedMobileGroup] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const mainLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/programs', label: 'Programs', icon: FolderGit2 },
    { href: '/resources', label: 'Resources', icon: BookOpen },
    { href: '/developers', label: 'Developers', icon: Users },
  ];

  const navGroups = [
    {
      key: 'resources',
      label: 'Resources',
      icon: BookOpen,
      items: [
        { href: '/blog', label: 'Blog', icon: MessageSquareQuote },
        { href: '/gallery', label: 'Gallery', icon: FolderGit2 },
        { href: '/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
      ],
    },
    {
      key: 'community',
      label: 'Community',
      icon: Users,
      items: [
        { href: '/community', label: 'Community Hub', icon: Users },
        { href: '/events', label: 'Events', icon: CalendarDays },
        { href: '/mentors', label: 'Mentors', icon: Users },
        { href: '/projects', label: 'Projects', icon: FolderGit2 },
      ],
    },
    {
      key: 'get-involved',
      label: 'Get Involved',
      icon: Sparkles,
      items: [
        { href: '/join', label: 'Join Us', icon: Users },
        { href: '/faq', label: 'FAQ', icon: Info },
        { href: '/contact', label: 'Contact', icon: Info },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));
  const toggleMobileGroup = (key: string) => setExpandedMobileGroup((current) => (current === key ? null : key));

  // Page transition variants
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
        ease: "easeIn"
      }
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* ==================== DESKTOP SIDEBAR ==================== */}
      <div className="hidden lg:flex h-screen fixed top-0 left-0 z-[100]">
        {/* Sidebar */}
        <aside className={`bg-white border-r border-gray-200 shadow-lg transition-all duration-300 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}>
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors"
          >
            <ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-300 ${sidebarOpen ? 'rotate-90' : '-rotate-90'}`} />
          </button>

          {/* Logo/Brand with your image */}
          <div className={`flex items-center gap-3 px-4 py-6 border-b border-gray-200 ${sidebarOpen ? 'justify-start' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
              <Image
                src="/community-website-logo.png"
                alt="Community Ecosystem Logo"
                width={40}
                height={40}
                className="w-full h-full object-contain"
              />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-semibold text-gray-900 whitespace-nowrap">Community</span>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            {mainLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  } ${!sidebarOpen ? 'justify-center' : ''}`}
                  title={!sidebarOpen ? link.label : ''}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && <span>{link.label}</span>}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="my-4 border-t border-gray-200" />

            {/* Navigation Groups */}
            {navGroups.map((group) => {
              const Icon = group.icon;
              const [isOpen, setIsOpen] = useState(false);
              return (
                <div key={group.key} className="space-y-1">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 w-full ${
                      !sidebarOpen ? 'justify-center' : ''
                    }`}
                    title={!sidebarOpen ? group.label : ''}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="flex-1 text-left">{group.label}</span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                  {sidebarOpen && isOpen && (
                    <div className="ml-4 space-y-1">
                      {group.items.map((link) => {
                        const LinkIcon = link.icon;
                        const active = isActive(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                              active
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <LinkIcon className="h-4 w-4" />
                            {link.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Divider */}
            <div className="my-4 border-t border-gray-200" />

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title={!sidebarOpen ? 'Dashboard' : ''}
            >
              <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Dashboard</span>}
            </Link>
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 px-3 py-4 space-y-2">
            <Link
              href="/join"
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200 ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title={!sidebarOpen ? 'Join Us' : ''}
            >
              <Sparkles className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Join Us</span>}
            </Link>
            <button
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 w-full ${
                !sidebarOpen ? 'justify-center' : ''
              }`}
              title={!sidebarOpen ? 'Settings' : ''}
            >
              <Settings className="h-5 w-5 flex-shrink-0" />
              {sidebarOpen && <span>Settings</span>}
            </button>
          </div>
        </aside>
      </div>

      {/* ==================== DESKTOP MAIN CONTENT ==================== */}
      <div className="hidden lg:block flex-1 ml-64 transition-all duration-300">
        <main className="min-h-screen p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:flex-row">
              <p>&copy; 2026 Community Ecosystem. Building connections, sharing knowledge, growing together.</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                <Link href="/about" className="transition-colors hover:text-gray-900">About</Link>
                <Link href="/faq" className="transition-colors hover:text-gray-900">FAQ</Link>
                <Link href="/contact" className="transition-colors hover:text-gray-900">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* ==================== MOBILE NAVIGATION ==================== */}
      <header className="lg:hidden sticky top-0 z-[100] bg-white border-b border-gray-200/70 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
          </button>

          {/* Mobile Brand with logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
              <Image
                src="/community-website-logo.png"
                alt="Community Ecosystem Logo"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-sm font-semibold text-gray-900">Community</span>
          </Link>

          {/* Mobile Join Button */}
          <Link
            href="/join"
            className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-blue-700 active:scale-95"
          >
            Join
          </Link>
        </div>
      </header>

      {/* ==================== MOBILE MENU OVERLAY ==================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[9999] lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute top-0 left-0 h-full w-80 max-w-[80%] bg-white shadow-2xl overflow-y-auto"
            >
              <div className="p-4">
                {/* Close button inside menu */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close menu"
                  >
                    <X size={24} className="text-gray-700" />
                  </button>
                </div>

                {/* Mobile Brand in Menu with logo */}
                <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                      src="/community-website-logo.png"
                      alt="Community Ecosystem Logo"
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Community Ecosystem</p>
                    <p className="text-xs text-gray-500">Connect • Learn • Grow</p>
                  </div>
                </div>

                {/* Menu Links */}
                <div className="space-y-1">
                  {mainLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                          active
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-200" />

                {/* Navigation Groups */}
                {navGroups.map((group) => {
                  const Icon = group.icon;
                  const isOpen = expandedMobileGroup === group.key;
                  return (
                    <div key={group.key} className="mb-2">
                      <button
                        onClick={() => toggleMobileGroup(group.key)}
                        className="flex items-center justify-between w-full rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          {group.label}
                        </span>
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 space-y-1">
                              {group.items.map((link) => {
                                const LinkIcon = link.icon;
                                const active = isActive(link.href);
                                return (
                                  <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                                      active
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                  >
                                    <LinkIcon className="h-4 w-4" />
                                    {link.label}
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Divider */}
                <div className="my-4 border-t border-gray-200" />

                {/* Dashboard Link */}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  Dashboard
                </Link>

                {/* Join Us Button in Menu */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href="/join"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 active:scale-95"
                  >
                    <Sparkles className="h-4 w-4" />
                    Join Us
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== MOBILE CONTENT ==================== */}
      <div className="lg:hidden flex-1">
        <main className="min-h-screen p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Footer */}
        <footer className="border-t border-gray-200 bg-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:flex-row">
              <p className="text-center text-xs">&copy; 2026 Community Ecosystem</p>
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <Link href="/about" className="transition-colors hover:text-gray-900">About</Link>
                <Link href="/faq" className="transition-colors hover:text-gray-900">FAQ</Link>
                <Link href="/contact" className="transition-colors hover:text-gray-900">Contact</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}