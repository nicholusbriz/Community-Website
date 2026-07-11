'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform?: string }>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .catch((err) => console.warn('SW registration failed:', err));
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // show the prompt after page load/your loading screen finishes
      setTimeout(() => setShowPrompt(true), 1500);
    };

    const onAppInstalled = () => {
      setShowPrompt(false);
      console.log('PWA installed');
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
    setShowPrompt(false);
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      console.log('User choice:', choice.outcome);
      setDeferredPrompt(null);
    } catch (err) {
      console.error('Install prompt error', err);
    }
  };

  if (!showPrompt) return null;

  // simple floating button; style with your tailwind classes
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleInstallClick}
        className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg shadow-lg"
        aria-label="Install app"
      >
        Install Community
      </button>
    </div>
  );
}
