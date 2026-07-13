// scripts/test-db.js
const { PrismaClient } = require('@prisma/client')
const { PrismaPg } = require('@prisma/adapter-pg')
const { Pool } = require('pg')
const path = require('path')

// Load .env from project root
require('dotenv').config({ 
  path: path.resolve(__dirname, '../.env') 
})

console.log('📋 DATABASE_URL:', process.env.DATABASE_URL ? '✅ Found' : '❌ Not Found')

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL not found in .env file!')
  process.exit(1)
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Create Prisma adapter
const adapter = new PrismaPg(pool)

// Create PrismaClient with adapter
const prisma = new PrismaClient({
  adapter,
})

async function main() {
  try {
    console.log('🔍 Testing database connection...')
    await prisma.$connect()
    console.log('✅ Connected to Supabase!')
    
    // Check if users table exists
    const userCount = await prisma.user.count()
    console.log(`📊 Users in database: ${userCount}`)
    
    // Test database time
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    console.log('🕐 Database time:', result[0].current_time)
    
    console.log('✅ All tests passed! Database is ready.')
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('\n💡 Make sure:')
    console.error('1. Your DATABASE_URL in .env is correct')
    console.error('2. Supabase is running')
    console.error('3. Network connectivity is available')
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main()