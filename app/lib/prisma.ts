// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// ✅ Only create pool if DATABASE_URL exists
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// ✅ Create pool with optimized settings for serverless
const pool = new Pool({
  connectionString: databaseUrl,
  max: 20, // Max connections in pool
  idleTimeoutMillis: 30_000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 5_000, // Timeout for connection attempts
})

// ✅ Ensure pool is properly closed when the process exits
process.on('beforeExit', () => {
  pool.end().catch(console.error)
})

const adapter = new PrismaPg(pool)

// ✅ Use global singleton for Prisma Client
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// ✅ In development, store in global to prevent multiple instances
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// ✅ For production, ensure connections are properly managed
export async function disconnectPrisma() {
  await prisma.$disconnect()
  await pool.end()
}