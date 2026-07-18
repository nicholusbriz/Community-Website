// app/lib/auth/init.ts
import { prisma } from '@/app/lib/prisma'
import { initializeRoleCache } from './roles'

let isAuthInitialized = false

export async function initializeAuth() {
  // Skip if already initialized
  if (isAuthInitialized) return
  
  try {
    console.log('🚀 Initializing auth...')
    await initializeRoleCache(prisma)
    isAuthInitialized = true
    console.log('✅ Auth initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize auth:', error)
    // Re-throw the error - don't fallback
    throw error
  }
}

// Call this at app startup
initializeAuth().catch((error) => {
  console.error('❌ Auth initialization failed:', error)
  // In production, you might want to exit the process if auth fails
  // process.exit(1)
})