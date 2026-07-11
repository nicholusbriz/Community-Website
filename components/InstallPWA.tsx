'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('SW registration failed:', err));
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the prompt after page load
      setTimeout(() => setShowPrompt(true), 2500);
    };

    const onAppInstalled = () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA installed successfully');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
    window.addEventListener('appinstalled', onAppInstalled as EventListener);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as EventListener);
      window.removeEventListener('appinstalled', onAppInstalled as EventListener);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('PWA installation accepted');
      }
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (err) {
      console.error('Install prompt error:', err);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            transition={{ duration: 0.2 }}
          />

          {/* Modal Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="bg-[#12121A] border border-[#8B5CF6]/30 rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] px-6 py-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-8 -mb-8" />
                
                <div className="relative z-10 flex items-center gap-3 mb-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Download size={28} />
                  </motion.div>
                  <h2 className="text-2xl font-bold">Install App</h2>
                </div>
                <p className="text-white/80 text-sm">Get the best experience</p>
              </div>

              {/* Content */}
              <div className="px-6 py-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Install <span className="font-semibold text-[#A78BFA]">Community Ecosystem</span> on your device for quick access and offline support. Enjoy a native app experience directly from your home screen.
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {[
                      { icon: '⚡', text: 'Fast offline access' },
                      { icon: '💾', text: 'Instant home screen' },
                      { icon: '🔔', text: 'Push notifications' },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                      >
                        <span className="text-lg">{feature.icon}</span>
                        <span>{feature.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 pt-2 border-t border-[#8B5CF6]/20 flex gap-3">
                <motion.button
                  onClick={handleDismiss}
                  className="flex-1 px-4 py-3 rounded-lg border border-[#8B5CF6]/30 text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X size={18} />
                  Later
                </motion.button>
                <motion.button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:shadow-lg hover:shadow-[#8B5CF6]/50 transition-all font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileHover={{ scale: isInstalling ? 1 : 1.02 }}
                  whileTap={{ scale: isInstalling ? 1 : 0.98 }}
                >
                  {isInstalling ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Download size={18} />
                      </motion.div>
                      Installing...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Install Now
                    </>
                  )}
                </motion.button>
              </div>

              {/* Close button */}
              <motion.button
                onClick={handleDismiss}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}