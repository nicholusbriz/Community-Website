// app/lib/auth/useAuth.ts
'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { AuthState, AuthUser } from "./types"
import { hasRole, hasExactRole, isAdmin, isSuperAdmin, isMeteor, UserRole } from "./roles"

// Centralized auth hook that all components will use
export function useAuth(): AuthState {
  const { data: session, status, update } = useSession()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true)
      return
    }

    if (session?.user) {
      const updatedUser = {
        id: session.user.id,
        email: session.user.email || "",
        name: session.user.name || "",
        role: session.user.role || "USER",
        roleId: session.user.roleId || "",
        image: session.user.image || null,
      }
      setUser(updatedUser)
    } else {
      setUser(null)
    }

    setIsLoading(false)
  }, [session, status])

  // Helper to get user role for checks
  const getUserRole = (): UserRole | null => {
    return user?.role || null
  }

  // Centralized auth actions
  const authActions = {
    signIn,
    signOut,
    
    // Sign in with credentials (email/password)
    async signInWithCredentials(email: string, password: string, action: 'login' | 'signup' = 'login', name?: string) {
      const result = await signIn("credentials", {
        email,
        password,
        name,
        action,
        redirect: false,
      })
      
      if (result?.error) {
        throw new Error(result.error)
      }
      
      return result
    },
    
    // Sign in with Google
    async signInWithGoogle() {
      await signIn("google", { callbackUrl: "/dashboard" })
    },
    
    // Sign in with GitHub
    async signInWithGitHub() {
      await signIn("github", { callbackUrl: "/dashboard" })
    },
    
    // Sign out
    async signOutUser() {
      await signOut({ callbackUrl: "/" })
    },

    // Refresh session data (call after profile updates like avatar change)
    async refreshSession() {
      try {
        // Fetch fresh user data from database
        const response = await fetch('/api/profile')
        if (response.ok) {
          const freshData = await response.json()
          console.log('Refreshing session with data:', freshData)
          // Update the session with fresh data
          const result = await update({
            user: {
              id: freshData.id,
              email: freshData.email,
              name: freshData.name,
              image: freshData.image,
              role: freshData.role,
              roleId: freshData.roleId,
            }
          })
          console.log('Session update result:', result)
        } else {
          console.error('Failed to fetch profile for session refresh')
        }
      } catch (error) {
        console.error('Failed to refresh session:', error)
      }
    },
    
    // ✅ All role checks use the centralized functions from roles.ts
    hasRole(requiredRole: string): boolean {
      return hasRole(user?.role, requiredRole)
    },
    
    hasExactRole(requiredRole: string): boolean {
      return hasExactRole(user?.role, requiredRole)
    },
    
    isAdmin(): boolean {
      return isAdmin(user?.role)
    },
    
    isSuperAdmin(): boolean {
      return isSuperAdmin(user?.role)
    },
    
    isMeteor(): boolean {
      return isMeteor(user?.role)
    },
    
    isAuthenticated(): boolean {
      return !!user
    },
    
    getUserRole(): UserRole | null {
      return user?.role || null
    },
    
    getUserRoleId(): string | null {
      return user?.roleId || null
    },
    
    getUserName(): string {
      return user?.name || "User"
    },
    
    getUserInitials(): string {
      if (user?.name) {
        return user.name.charAt(0).toUpperCase()
      }
      if (user?.email) {
        return user.email.charAt(0).toUpperCase()
      }
      return "U"
    },
    
    getUserEmail(): string {
      return user?.email || ""
    },
  }

  return {
    user,
    status: status as "authenticated" | "unauthenticated" | "loading",
    isLoading,
    actions: authActions,
  }
}