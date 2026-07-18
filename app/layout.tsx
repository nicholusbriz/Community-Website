// app/layout.tsx
import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Providers } from "@/app/providers"
import PublicLayout from "@/components/PublicLayout"
import { initializeAuth } from "@/app/lib/auth/init"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"

export const metadata: Metadata = {
  title: {
    default: "Tech Rise Africa",
    template: "%s | Tech Rise Africa"
  },
  description: "Tech Rise Africa is a community ecosystem connecting developers across Africa with free internships, mentorship, and collaborative projects. Join the fastest growing tech community in Africa.",
  keywords: [
    "Tech Rise Africa",
    "tech community Africa",
    "developer internships",
    "free internships",
    "African developers",
    "tech ecosystem",
    "mentorship program",
    "coding community",
    "open source projects",
    "developer collaboration",
    "tech rise",
    "Africa tech hub",
    "software development",
    "free coding internships",
    "tech mentorship",
    "developer community Africa",
    "Briz",
    "Briz developer",
  ],
  authors: [
    { name: "Atriz" },
    { name: "Tech Rise Africa Team" }
  ],
  creator: "Atriz",
  publisher: "Tech Rise Africa",
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
    title: "Tech Rise Africa - Build, Learn & Grow",
    description: "Join the largest tech ecosystem in Africa. Get free internships, mentorship, and collaborate on projects with developers across the continent.",
    url: "https://community-website-sigma.vercel.app/",
    siteName: "Tech Rise Africa",
    images: [
      {
        url: "https://community-website-sigma.vercel.app//og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tech Rise Africa - Community Ecosystem",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Rise Africa - Free Internships & Developer Community",
    description: "Connect with developers across Africa, access free internships, mentorship, and build amazing projects together.",
    images: ["https://community-website-sigma.vercel.app//twitter-image.jpg"],
    creator: "@techriseafrica",
    site: "@techriseafrica",
  },
  verification: {
    google: "CWp1CoMCJwY7mM1h2Ds4IjRT6rRLqmNL3hy8-mU_MLQ", // ✅ Your Google Search Console verification code
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tech Rise Africa",
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
        <meta name="apple-mobile-web-app-title" content="Tech Rise Africa" />
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