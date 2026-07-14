// components/PublicLayout.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import DesktopSidebar from './DesktopSidebar';
import MobileMenu from './MobileMenu';
import TopBar from './TopBar';
import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // ✅ Simple mobile menu slide - no spring, no bounce
  const mobileMenuVariants: Variants = {
    hidden: {
      x: '-100%',
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }
    },
    exit: {
      x: '-100%',
      transition: {
        duration: 0.35,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Desktop Sidebar - No animations */}
      <div className="hidden lg:flex h-screen fixed top-0 left-0 z-[100]">
        <DesktopSidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      </div>

      {/* Main Content Area - No animations */}
      <div className={`flex-1 min-h-screen w-full ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-16'}`}>
        {/* Desktop Content */}
        <div className="hidden lg:block">
          <TopBar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isMobile={false}
          />

          {/* Desktop Main Content with medium padding */}
          <main className="min-h-screen w-full">
            <div className="w-full">
              {children}
            </div>
          </main>

          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm w-full">
            <div className="w-full px-6 py-6">
              <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-600 dark:text-gray-400 sm:flex-row">
                <p className="flex items-center gap-2">
                  <span className="text-gray-400">✦</span>
                  &copy; 2026 Community Ecosystem. Building connections, sharing knowledge, growing together.
                </p>
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  <Link href="/about" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">About</Link>
                  <Link href="/faq" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">FAQ</Link>
                  <Link href="/contact" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">Contact</Link>
                  <Link href="#" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">Privacy</Link>
                  <Link href="#" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">Terms</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Mobile Content - with medium padding */}
        <div className="lg:hidden flex flex-col min-h-screen w-full">
          <TopBar 
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isMobile={true}
            onMenuToggle={toggleMobileMenu}
            mobileMenuOpen={mobileMenuOpen}
          />

          {/* Mobile Main Content with medium padding */}
          <main className="flex-1 w-full overflow-x-hidden overflow-y-auto">
            <div className="w-full">
              {children}
            </div>
          </main>

          <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 w-full flex-shrink-0">
            <div className="w-full px-4 py-4">
              <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-600 dark:text-gray-400 sm:flex-row">
                <p>&copy; 2026 Community Ecosystem</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/about" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">About</Link>
                  <Link href="/faq" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">FAQ</Link>
                  <Link href="/contact" className="transition-colors hover:text-gray-800 dark:hover:text-gray-200">Contact</Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* ONLY Mobile Menu with simple slide animation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Subtle backdrop for overlay effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9998] lg:hidden bg-black/30"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Independent overlay menu */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileMenuVariants}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm z-[9999] lg:hidden shadow-2xl"
            >
              <MobileMenu
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}