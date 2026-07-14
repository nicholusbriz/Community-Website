// components/PWAInstallPrompt.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Sparkles } from 'lucide-react'
import Image from 'next/image'

export default function PWAInstallPrompt() {
  const pathname = usePathname()
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [autoDismissTimer, setAutoDismissTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user dismissed the prompt (only hide if less than 5 minutes ago)
    const dismissedTimestamp = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissedTimestamp) {
      const fiveMinutesInMs = 5 * 60 * 1000
      const timeSinceDismissal = Date.now() - parseInt(dismissedTimestamp)
      if (timeSinceDismissal < fiveMinutesInMs) {
        return
      }
      // Clear the old dismissal if more than 5 minutes have passed
      localStorage.removeItem('pwa-prompt-dismissed')
    }

    // Listen for beforeinstallprompt event (desktop Chrome, Android Chrome)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Also listen for appinstalled event to know when it's installed
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    // Show prompt after 3 seconds if not triggered
    const timer = setTimeout(() => {
      if (!isInstalled && !localStorage.getItem('pwa-prompt-dismissed')) {
        setShowPrompt(true)
      }
    }, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(timer)
      if (autoDismissTimer) {
        clearTimeout(autoDismissTimer)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
      clearTimeout(timer)
    }
  }, [isInstalled])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setIsInstalled(true)
        localStorage.removeItem('pwa-prompt-dismissed')
      }
      setDeferredPrompt(null)
    }
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
    if (autoDismissTimer) {
      clearTimeout(autoDismissTimer)
      setAutoDismissTimer(null)
    }
  }

  // Don't show on iOS (Safari) since it's not supported
  const isIOS = typeof window !== 'undefined' && 
    /iPad|iPhone|iPod/.test(navigator.userAgent) && 
    !(window as any).MSStream

  // Only show on home page
  if (pathname !== '/') {
    return null
  }

  if (!showPrompt || isInstalled || isIOS) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.9 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-full mx-4"
      >
        <div 
          className="relative bg-[#0B0F1A]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/40 overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at top right, #1B2A56 0%, #0B0F1A 100%)'
          }}
        >
          {/* Background glow effect */}
          <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-[#8CA0DE]/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full bg-[#8CA0DE]/10 blur-2xl" />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors p-1 z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative p-5 sm:p-6">
            <div className="flex items-start gap-4">
              {/* App icon */}
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 shadow-lg shadow-black/30 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8CA0DE]/30 to-[#1B2A56]/50" />
                <Image
                  src="/community-website-logo.png"
                  alt="Community Ecosystem"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover relative z-10"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                {/* Badge */}
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#8CA0DE]/10 border border-[#8CA0DE]/20 mb-2">
                  <Sparkles className="w-3 h-3 text-[#8CA0DE]" />
                  <span className="text-[10px] font-semibold text-[#8CA0DE] uppercase tracking-wider">
                    PWA
                  </span>
                </div>

                <h3 className="font-bold text-white text-base sm:text-lg mb-1 leading-tight">
                  Install App
                </h3>
                <p className="text-white/50 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                  Add to home screen for quick access
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleInstall}
                  className="w-full bg-gradient-to-r from-[#8CA0DE] to-[#1B2A56] hover:from-[#8CA0DE]/90 hover:to-[#1B2A56]/90 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#8CA0DE]/20 border border-[#8CA0DE]/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Install Now</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}