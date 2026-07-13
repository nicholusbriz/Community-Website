// app/providers.tsx
'use client'

import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={60 * 30} // Refetch session every 30 minutes
      refetchOnWindowFocus={true}
    >
      {children}
    </SessionProvider>
  )
}