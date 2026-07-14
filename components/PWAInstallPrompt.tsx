// components/PWAInstallPrompt.tsx
'use client'

import { useState, useEffect } from 'react'
import { Download, X } from 'lucide-react'
import Image from 'next/image'

export default function PWAInstallPrompt() {
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

  if (!showPrompt || isInstalled || isIOS) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300 max-w-sm w-full mx-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Image
              src="/community-website-logo.png"
              alt="Community Ecosystem"
              width={64}
              height={64}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-base mb-1">
              Install Community App
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Get quick access to your community from your home screen
            </p>
            <button
              onClick={handleInstall}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}