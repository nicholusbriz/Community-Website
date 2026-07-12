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
  Menu,
  MessageSquareQuote,
  Sparkles,
  Users,
  X,
  ChevronDown,
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const updateViewport = () => setIsMobileView(window.innerWidth < 1024);

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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

  const isHomePage = pathname === '/';
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));
  const shouldShowHeader = !isMobileView;
  const shouldShowBrand = !isMobileView;
  const headerPositionClass = 'relative';
  const desktopNavPositionClass = 'relative';
  const mobileButtonClass =
    'fixed left-4 top-4 z-50 rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-lg transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-xl active:scale-95 lg:hidden';
  const toggleDropdown = (key: string) => setActiveDropdown((current) => (current === key ? null : key));

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const childVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }
    },
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Mobile menu toggle button - positioned on the left */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        onClick={() => setMobileMenuOpen((open) => !open)}
        className={`${mobileButtonClass} ${!isMobileView ? 'hidden' : ''}`}
        aria-label="Toggle mobile menu"
        whileTap={{ scale: 0.9 }}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      <header className={`${headerPositionClass} z-40`}>
        {shouldShowHeader ? (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="border-b border-gray-200/80 bg-white/95 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-transform duration-300 ease-out"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
              <Link href="/" className={`group min-w-0 items-center gap-3 ${shouldShowBrand ? 'flex' : 'hidden'}`}>
                <motion.div 
                  className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-violet-50 shadow-sm transition-all duration-200 group-hover:shadow-md"
                  whileHover={{ scale: 1.05, rotate: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src="/community-website-logo.png"
                    alt="Community Ecosystem logo"
                    width={44}
                    height={44}
                    className="h-full w-full object-contain p-1"
                  />
                </motion.div>
                <div className="min-w-0">
                  <motion.p 
                    className="truncate text-base font-semibold tracking-tight text-gray-900 sm:text-lg"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    Community Ecosystem
                  </motion.p>
                  <motion.p 
                    className="hidden text-sm text-gray-500 sm:block"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    Building a thriving space to connect, learn, and grow together.
                  </motion.p>
                  <p className="block text-xs text-gray-500 sm:hidden">
                    Connect • Learn • Grow Together
                  </p>
                </div>
              </Link>

              <div className="flex items-center gap-2" />
            </div>
          </motion.div>
        ) : null}

        <motion.nav 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          className={`hidden border-b border-gray-200/70 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl transition-all duration-300 lg:block sm:px-6 lg:px-8 ${desktopNavPositionClass}`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-1">
              {mainLinks.map((link, index) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                        active
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {navGroups.map((group, index) => {
                const Icon = group.icon;
                const isOpen = activeDropdown === group.key;
                return (
                  <motion.div 
                    key={group.key} 
                    className="relative"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 + (mainLinks.length + index) * 0.05 }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleDropdown(group.key)}
                      className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                        isOpen
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {group.label}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/70"
                        >
                          <div className="mb-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                            {group.label}
                          </div>
                          <div className="space-y-0.5">
                            {group.items.map((link, itemIndex) => {
                              const LinkIcon = link.icon;
                              const active = isActive(link.href);
                              return (
                                <motion.div
                                  key={link.href}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                                >
                                  <Link
                                    href={link.href}
                                    onClick={() => setActiveDropdown(null)}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                                      active
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                  >
                                    <LinkIcon className="h-4 w-4" />
                                    {link.label}
                                  </Link>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/join"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-95"
                >
                  Join Us
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm active:scale-95"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.nav>
      </header>

      {/* Mobile Menu - slides from the left */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel - slides from left */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-y-0 left-0 w-full max-w-sm bg-white shadow-2xl"
            >
              {/* Menu Header with close button */}
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <div>
                  <motion.p 
                    className="text-base font-semibold text-gray-900"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    Menu
                  </motion.p>
                  <motion.p 
                    className="text-sm text-gray-500"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                  >
                    Explore Community Ecosystem
                  </motion.p>
                </div>
                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
                  aria-label="Close mobile menu"
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Menu Content */}
              <div className="h-[calc(100vh-140px)] overflow-y-auto px-4 py-4">
                {/* Main Links */}
                <div>
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Main</p>
                  <div className="space-y-0.5">
                    {mainLinks.map((link, index) => {
                      const Icon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                              active
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            {link.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Groups */}
                {navGroups.map((group, groupIndex) => {
                  const Icon = group.icon;
                  return (
                    <motion.div 
                      key={group.key} 
                      className="mt-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 + groupIndex * 0.1 }}
                    >
                      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {group.label}
                      </p>
                      <div className="space-y-0.5">
                        {group.items.map((link, itemIndex) => {
                          const LinkIcon = link.icon;
                          const active = isActive(link.href);
                          return (
                            <motion.div
                              key={link.href}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.25 + itemIndex * 0.05 }}
                            >
                              <Link
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                  active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                              >
                                <LinkIcon className="h-4 w-4" />
                                {link.label}
                              </Link>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  );
                })}

                {/* Dashboard Link - Mobile */}
                <motion.div 
                  className="mt-6 border-t border-gray-200 pt-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Account</p>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </motion.div>
              </div>

              {/* Menu Footer */}
              <motion.div 
                className="border-t border-gray-200 bg-gray-50/50 p-4 space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.35 }}
              >
                <Link
                  href="/join"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
                >
                  <Sparkles className="h-4 w-4" />
                  Join Us
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content with page transitions */}
      <motion.main 
        className="flex-1 overflow-y-auto pb-16 pt-0"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
      >
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
      </motion.main>

      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border-t border-gray-200 bg-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:flex-row">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              &copy; 2026 Community Ecosystem. Building connections, sharing knowledge, growing together.
            </motion.p>
            <div className="flex flex-wrap gap-6">
              {['/about', '/faq', '/contact'].map((href, index) => {
                const labels = ['About', 'FAQ', 'Contact'];
                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Link href={href} className="transition-colors hover:text-gray-900">
                      {labels[index]}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}