// app/layout.tsx
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Providers } from "@/app/providers"
import PublicLayout from "@/components/PublicLayout"
import { initializeAuth } from "@/app/lib/auth/init"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"

export const metadata: Metadata = {
  title: {
    default: "Developers Ecosystem",
    template: "%s | Developers Ecosystem"
  },
  description: "Developers Ecosystem is a community website ecosystem connecting developers globally with free internships, mentorship, and collaborative projects. Join the fastest growing developer community ecosystem.",
  keywords: [
    "Developers Ecosystem",
    "developer community",
    "tech community",
    "developer internships",
    "free internships",
    "software developers",
    "tech ecosystem",
    "mentorship program",
    "coding community",
    "open source projects",
    "developer collaboration",
    "developer hub",
    "software development",
    "free coding internships",
    "tech mentorship",
    "developer community ecosystem",
    "Briz",
    "Briz developer",
  ],
  authors: [
    { name: "Atriz" },
    { name: "Developers Ecosystem Team" }
  ],
  creator: "Atriz",
  publisher: "Developers Ecosystem",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://community-website-sigma.vercel.app/",
  },
  openGraph: {
    title: "Developers Ecosystem - Build, Learn & Grow",
    description: "Join the largest developer community ecosystem. Get free internships, mentorship, and collaborate on projects with developers globally.",
    url: "https://community-website-sigma.vercel.app/",
    siteName: "Developers Ecosystem",
    images: [
      {
        url: "https://community-website-sigma.vercel.app//og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Developers Ecosystem - Community Website Ecosystem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Developers Ecosystem - Free Internships & Developer Community",
    description: "Connect with developers globally, access free internships, mentorship, and build amazing projects together.",
    images: ["https://community-website-sigma.vercel.app//twitter-image.jpg"],
    creator: "@developersecosystem",
    site: "@developersecosystem",
  },
  verification: {
    google: "CWp1CoMCJwY7mM1h2Ds4IjRT6rRLqmNL3hy8-mU_MLQ", // ✅ Your Google Search Console verification code
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Developers Ecosystem",
  },
  icons: {
    icon: "/community-website-logo.png",
    apple: "/community-website-logo.png",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
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
        <meta name="apple-mobile-web-app-title" content="Developers Ecosystem" />
        <link rel="apple-touch-icon" href="/community-website-logo.png" />
        {/* ✅ Google Search Console verification meta tag */}
        <meta 
          name="google-site-verification" 
          content="CWp1CoMCJwY7mM1h2Ds4IjRT6rRLqmNL3hy8-mU_MLQ" 
        />
        {/* ✅ Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Briz" />
        <meta name="geo.region" content="Africa" />
        <meta name="geo.placename" content="Africa" />
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