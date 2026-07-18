// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set')
}

// ✅ Create pool with optimized settings for serverless
const pool = new Pool({
  connectionString: databaseUrl,
  max: process.env.NODE_ENV === 'production' ? 10 : 20,
  idleTimeoutMillis: 30_000,
  // ✅ Increase connection timeout
  connectionTimeoutMillis: 30_000, // 30 seconds (was 5s)
  // ✅ Add keepalive to maintain connection
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
  // ✅ SSL settings for Supabase
  ssl: {
    rejectUnauthorized: false,
  },
})

// ✅ Ensure pool is properly closed
process.on('beforeExit', () => {
  pool.end().catch(console.error)
})

const adapter = new PrismaPg(pool)

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['error', 'warn'] 
      : ['error'],
    // ✅ Add connection timeout
    // Note: These settings may vary based on Prisma version
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export async function disconnectPrisma() {
  await prisma.$disconnect()
  await pool.end()
}

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

export async function withTransaction<T>(
  callback: (prisma: PrismaClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    return callback(tx as PrismaClient)
  })
}