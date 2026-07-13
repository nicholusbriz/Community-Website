// scripts/test-vercel-db.js
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// Use the Vercel connection string
const DATABASE_URL = "postgresql://postgres.lshmxyswfynkgxevdpqn:mx0KB3sEs0W48Mh0@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

// Create a connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
})

// Create the Prisma adapter
const adapter = new PrismaPg(pool)

// Create Prisma Client with adapter
const prisma = new PrismaClient({
  adapter,
})

async function test() {
  try {
    console.log('🔍 Testing Prisma connection with Vercel URL...')
    await prisma.$connect()
    console.log('✅ Connected to database!')

    // Test query
    const userCount = await prisma.user.count()
    console.log(`📊 Users in database: ${userCount}`)

    // Get current time
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('🕐 Database time:', result[0].current_time)

    console.log('✅ Database connection with Vercel URL is working!')
  } catch (error) {
    console.error('❌ Connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

test()