// app/layout.tsx
import type { Metadata, Viewport } from "next"  // ✅ Add Viewport import
import "./globals.css"
import { Providers } from "@/app/providers"
import PublicLayout from "@/components/PublicLayout"
import { initializeAuth } from "@/app/lib/auth/init"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"

export const metadata: Metadata = {
  title: "Tech Rise Africa",
  description: "Community of learners, builders, and mentors",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Community Ecosystem",
  },
  icons: {
    icon: "/community-website-logo.png",
    apple: "/community-website-logo.png",
  },
}

// ✅ Move themeColor to a separate viewport export
export const viewport: Viewport = {
  themeColor: "#e4dff0",
  // Optional: Add other viewport settings if needed
  // width: 'device-width',
  // initialScale: 1,
}

// Initialize role cache on app startup
initializeAuth().catch(console.error)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#8B5CF6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Community Ecosystem" />
        <link rel="apple-touch-icon" href="/community-website-logo.png" />
      </head>
      <body>
        <Providers>
          <PublicLayout>
            {children}
          </PublicLayout>
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  )
}