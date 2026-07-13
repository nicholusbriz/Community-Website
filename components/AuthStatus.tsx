// components/AuthStatus.tsx
'use client'

import { useAuth } from "@/app/lib/auth/useAuth"  // ✅ Import from useAuth directly
import Link from "next/link"
import Image from "next/image"

export function AuthStatus() {
  const { user, status, isLoading, actions } = useAuth()

  if (isLoading) {
    return <span className="text-sm text-gray-500">Loading...</span>
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {user.image ? (
            <Image 
              src={user.image} 
              alt={user.name || user.email || 'User'} 
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
              {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="text-sm">
            <p className="font-medium text-gray-900">{user.name || user.email}</p>
            <p className="text-xs text-gray-500">Role: {user.role}</p>
          </div>
        </div>
        <button
          onClick={() => actions.signOutUser()}
          className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/login"
        className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        Log In
      </Link>
      <Link
        href="/join"
        className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:shadow-lg hover:shadow-blue-500/30"
      >
        Join
      </Link>
    </div>
  )
}