// app/lib/auth/init.ts
// Initialize role cache on app startup
import { initializeRoleCache } from './roles'
import { prisma } from '@/app/lib/prisma'  // ✅ Fixed: Absolute path

let isInitialized = false

export async function initializeAuth() {
  if (isInitialized) return
  
  try {
    await initializeRoleCache(prisma)
    isInitialized = true
    console.log('✅ Auth initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize auth:', error)
    throw error
  }
}