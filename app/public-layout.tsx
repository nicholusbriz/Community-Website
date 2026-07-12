'use client';

import { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CalendarDays,
  ChevronDown,
  FolderGit2,
  Home,
  Info,
  Menu,
  MessageSquareQuote,
  Sparkles,
  Users,
  X,
  LayoutDashboard,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isDesktopNavPinned, setIsDesktopNavPinned] = useState(false);
  const pathname = usePathname();
  const lastScrollYRef = useRef(0);

  // Close mobile menu on route change
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMobileMenuOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isMobileView = window.innerWidth < 1024;
      const shouldShow = isMobileView || currentScrollY < 80 || currentScrollY < lastScrollYRef.current;
      setIsHeaderVisible(shouldShow);
      setIsDesktopNavPinned(!isMobileView && currentScrollY > 80);
      lastScrollYRef.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const mainLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About', icon: Info },
    { href: '/programs', label: 'Programs', icon: FolderGit2 },
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
  const toggleDropdown = (key: string) => setActiveDropdown((current) => (current === key ? null : key));

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={`border-b border-gray-200/80 bg-white/95 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-transform duration-300 ease-out ${
            isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-violet-50 shadow-sm transition-all duration-200 group-hover:shadow-md">
                <Image
                  src="/community-website-logo.png"
                  alt="Community Ecosystem logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-contain p-1"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold tracking-tight text-gray-900 sm:text-lg">
                  Community Ecosystem
                </p>
                <p className="hidden text-sm text-gray-500 sm:block">
                  Building a thriving space to connect, learn, and grow together.
                </p>
                <p className="block text-xs text-gray-500 sm:hidden">
                  Connect • Learn • Grow Together
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen((open) => !open)}
                className="fixed right-4 top-4 z-9999 rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 shadow-lg transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-xl active:scale-95 lg:hidden"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        <nav className={`hidden border-b border-gray-200/70 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl transition-all duration-300 lg:block sm:px-6 lg:px-8 ${isDesktopNavPinned ? 'fixed inset-x-0 top-0 z-60' : 'relative'}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            <div className="flex flex-1 items-center gap-1">
              {mainLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
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
                );
              })}

              {navGroups.map((group) => {
                const Icon = group.icon;
                const isOpen = activeDropdown === group.key;
                return (
                  <div key={group.key} className="relative">
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
                      <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <div
                      className={`absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-2 shadow-2xl shadow-gray-200/70 transition-all duration-200 ${
                        isOpen ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'
                      }`}
                    >
                      <div className="mb-1 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">
                        {group.label}
                      </div>
                      <div className="space-y-0.5">
                        {group.items.map((link) => {
                          const LinkIcon = link.icon;
                          const active = isActive(link.href);
                          return (
                            <Link
                              key={link.href}
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
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/join"
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-md active:scale-95"
              >
                Join Us
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm active:scale-95"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`fixed inset-0 z-9998 lg:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div
          className={`absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl transition-transform duration-300 ease-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <p className="text-base font-semibold text-gray-900">Menu</p>
              <p className="text-sm text-gray-500">Explore Community Ecosystem</p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 active:bg-gray-200"
              aria-label="Close mobile menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Content */}
          <div className="h-[calc(100vh-140px)] overflow-y-auto px-4 py-4">
            {/* Main Links */}
            <div>
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Main</p>
              <div className="space-y-0.5">
                {mainLinks.map((link) => {
                  const Icon = link.icon;
                  const active = isActive(link.href);
                  return (
                    <Link
                      key={link.href}
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
                  );
                })}
              </div>
            </div>

            {/* Navigation Groups */}
            {navGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.key} className="mt-6">
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.items.map((link) => {
                      const LinkIcon = link.icon;
                      const active = isActive(link.href);
                      return (
                        <Link
                          key={link.href}
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
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Dashboard Link - Mobile */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Account</p>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg bg-blue-50 px-3 py-2.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            </div>
          </div>

          {/* Menu Footer */}
          <div className="border-t border-gray-200 bg-gray-50/50 p-4 space-y-2">
            <Link
              href="/join"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              Join Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-16 pt-24 lg:pt-28">
        {children}
      </main>

      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 sm:flex-row">
            <p>&copy; 2026 Community Ecosystem. Building connections, sharing knowledge, growing together.</p>
            <div className="flex flex-wrap gap-6">
              <Link href="/about" className="transition-colors hover:text-gray-900">About</Link>
              <Link href="/faq" className="transition-colors hover:text-gray-900">FAQ</Link>
              <Link href="/contact" className="transition-colors hover:text-gray-900">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}