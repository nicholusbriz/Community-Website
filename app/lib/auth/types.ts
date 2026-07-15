// app/lib/auth/types.ts
import { DefaultSession } from "next-auth"
import { UserRole } from "./roles"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      roleId: string
    } & DefaultSession["user"]
  }

  interface User {
    role: UserRole
    roleId: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    roleId: string
    id: string
  }
}

export interface AuthUser {
  id: string
  email: string
  name?: string | null
  role: UserRole
  roleId: string
  image?: string | null
}

export interface AuthState {
  user: AuthUser | null
  status: "authenticated" | "unauthenticated" | "loading"
  isLoading: boolean
  actions: {
    signIn: typeof import("next-auth/react").signIn
    signOut: typeof import("next-auth/react").signOut
    signInWithCredentials: (email: string, password: string, action?: 'login' | 'signup', name?: string) => Promise<any>
    signInWithGoogle: () => Promise<void>
    signInWithGitHub: () => Promise<void>
    signOutUser: () => Promise<void>
    refreshSession: () => Promise<void>
    hasRole: (role: string) => boolean
    hasExactRole: (role: string) => boolean
    isAdmin: () => boolean
    isSuperAdmin: () => boolean
    isMentor: () => boolean
    isStudent: () => boolean
    isUser: () => boolean
    isAuthenticated: () => boolean
    getUserRole: () => UserRole | null
    getUserRoleId: () => string | null
    getUserName: () => string
    getUserInitials: () => string
    getUserEmail: () => string
  }
}