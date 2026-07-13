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
    
    // Check if user has required role (uses centralized role hierarchy)
    hasRole(requiredRole: string): boolean {
      return hasRole(user?.role, requiredRole)
    },
    
    // Check if user has exact role
    hasExactRole(requiredRole: string): boolean {
      return hasExactRole(user?.role, requiredRole)
    },
    
    // Check if user is admin or superadmin
    isAdmin(): boolean {
      return isAdmin(user?.role)
    },
    
    // Check if user is superadmin only
    isSuperAdmin(): boolean {
      return isSuperAdmin(user?.role)
    },
    
    // Check if user has meteor role or higher
    isMeteor(): boolean {
      return isMeteor(user?.role)
    },
    
    // Check if user is authenticated
    isAuthenticated(): boolean {
      return !!user
    },
    
    // Get user's role
    getUserRole(): UserRole | null {
      return user?.role || null
    },
    
    // Get user's role ID
    getUserRoleId(): string | null {
      return user?.roleId || null
    },
    
    // Get user's name
    getUserName(): string {
      return user?.name || "User"
    },
    
    // Get user's initials for avatar
    getUserInitials(): string {
      if (user?.name) {
        return user.name.charAt(0).toUpperCase()
      }
      if (user?.email) {
        return user.email.charAt(0).toUpperCase()
      }
      return "U"
    },
    
    // Get user's email
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