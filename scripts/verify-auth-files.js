// scripts/verify-auth-files.js
const fs = require('fs')
const path = require('path')

console.log('🔍 Verifying Auth & Profile Files...\n')

// ============================================================
// 1. CHECK REQUIRED FILES EXIST
// ============================================================
console.log('📁 Checking required files...\n')

const requiredFiles = [
  // Auth Core
  { path: 'app/lib/auth/config.ts', name: 'NextAuth Config' },
  { path: 'app/lib/auth/roles.ts', name: 'Role Utilities' },
  { path: 'app/lib/auth/useAuth.ts', name: 'Client Auth Hook' },
  { path: 'app/lib/auth/server.ts', name: 'Server Auth Helpers' },
  { path: 'app/lib/auth/init.ts', name: 'Auth Initialization' },
  
  // Prisma
  { path: 'app/lib/prisma.ts', name: 'Prisma Client' },
  
  // Supabase
  { path: 'app/lib/supabase/client.ts', name: 'Supabase Client' },
  
  // API Routes
  { path: 'app/api/profile/route.ts', name: 'Profile API (GET/PUT)' },
  { path: 'app/api/profile/upload-avatar/route.ts', name: 'Avatar Upload API' },
  { path: 'app/api/profile/delete-avatar/route.ts', name: 'Avatar Delete API' },
  { path: 'app/api/profile/password/route.ts', name: 'Password Update API' },
  { path: 'app/api/auth/[...nextauth]/route.ts', name: 'NextAuth Route' },
  
  // Components
  { path: 'components/MobileMenu.tsx', name: 'Mobile Menu' },
  { path: 'components/DesktopSidebar.tsx', name: 'Desktop Sidebar' },
  { path: 'components/TopBar.tsx', name: 'Top Bar' },
  { path: 'components/PublicLayout.tsx', name: 'Public Layout' },
  { path: 'components/SignupForm.tsx', name: 'Signup Form' },
  { path: 'components/AuthStatus.tsx', name: 'Auth Status' },
  
  // Pages
  { path: 'app/page.tsx', name: 'Home Page' },
  { path: 'app/join/page.tsx', name: 'Join Page' },
  { path: 'app/login/page.tsx', name: 'Login Page' },
  { path: 'app/dashboard/page.tsx', name: 'Dashboard' },
  { path: 'app/dashboard/profile/page.tsx', name: 'Profile Page' },
  
  // Layout
  { path: 'app/layout.tsx', name: 'Root Layout' },
  { path: 'app/providers.tsx', name: 'Providers' },
  
  // Middleware
  { path: 'middleware.ts', name: 'Middleware' },
  
  // Prisma Schema
  { path: 'prisma/schema.prisma', name: 'Prisma Schema' },
  { path: 'prisma/seed.ts', name: 'Seed File' },
  
  // Config Files
  { path: 'prisma.config.ts', name: 'Prisma Config' },
  { path: 'postcss.config.mjs', name: 'PostCSS Config' },
  { path: 'next.config.ts', name: 'Next.js Config' },
]

let allFilesExist = true
let missingFiles = []

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file.path)
  const exists = fs.existsSync(fullPath)
  console.log(`  ${exists ? '✅' : '❌'} ${file.name} (${file.path})`)
  if (!exists) {
    allFilesExist = false
    missingFiles.push(file.path)
  }
})

// ============================================================
// 2. CHECK FILE IMPORTS (Basic Validation)
// ============================================================
console.log('\n📝 Checking imports in key files...\n')

const importChecks = [
  {
    file: 'app/lib/auth/init.ts',
    checks: [
      { text: "from './roles'", description: 'Imports roles' },
      { text: "from '@/app/lib/prisma'", description: 'Imports prisma (should be absolute)' },
    ],
    alternativeChecks: [
      { text: "from '../prisma'", description: 'Imports prisma (relative)' },
      { text: "from './prisma'", description: 'Imports prisma (local)' },
    ]
  },
  {
    file: 'app/lib/auth/config.ts',
    checks: [
      { text: "from '@prisma/client'", description: 'Imports PrismaClient' },
      { text: "from '@prisma/adapter-pg'", description: 'Imports PrismaPg' },
      { text: "from 'pg'", description: 'Imports Pool' },
      { text: "from 'bcryptjs'", description: 'Imports bcrypt' },
      { text: "from 'next-auth'", description: 'Imports NextAuth' },
    ]
  },
  {
    file: 'app/lib/prisma.ts',
    checks: [
      { text: "from '@prisma/client'", description: 'Imports PrismaClient' },
      { text: "from '@prisma/adapter-pg'", description: 'Imports PrismaPg' },
      { text: "from 'pg'", description: 'Imports Pool' },
    ]
  },
  {
    file: 'app/lib/auth/useAuth.ts',
    checks: [
      { text: "from 'next-auth/react'", description: 'Imports useSession' },
      { text: "from './types'", description: 'Imports types' },
    ]
  },
  {
    file: 'app/lib/auth/server.ts',
    checks: [
      { text: "from './config'", description: 'Imports auth config' },
      { text: "from 'react'", description: 'Imports cache' },
    ]
  },
]

importChecks.forEach(fileCheck => {
  const fullPath = path.join(process.cwd(), fileCheck.file)
  if (!fs.existsSync(fullPath)) {
    console.log(`  ❌ ${fileCheck.file} - File not found, skipping import check`)
    return
  }
  
  const content = fs.readFileSync(fullPath, 'utf8')
  console.log(`  📄 ${fileCheck.file}:`)
  
  let allChecksPassed = true
  fileCheck.checks.forEach(check => {
    if (content.includes(check.text)) {
      console.log(`    ✅ ${check.description}`)
    } else {
      allChecksPassed = false
      console.log(`    ❌ ${check.description} (missing: "${check.text}")`)
    }
  })
  
  // Check alternative imports for init.ts
  if (fileCheck.file === 'app/lib/auth/init.ts' && fileCheck.alternativeChecks) {
    let hasAlternative = false
    fileCheck.alternativeChecks.forEach(check => {
      if (content.includes(check.text)) {
        hasAlternative = true
        console.log(`    ℹ️ Alternative import found: ${check.description}`)
      }
    })
    if (!hasAlternative && !content.includes("from '@/app/lib/prisma'")) {
      console.log(`    ⚠️ No prisma import found! Please add one.`)
    }
  }
  
  if (allChecksPassed) {
    console.log(`    ✅ All imports are present`)
  }
  console.log('')
})

// ============================================================
// 3. CHECK ENVIRONMENT VARIABLES
// ============================================================
console.log('🔑 Checking environment variables...\n')

const envPath = path.join(process.cwd(), '.env')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envVars = {
    'DATABASE_URL': 'Database connection string',
    'NEXTAUTH_SECRET': 'NextAuth secret',
    'NEXTAUTH_URL': 'NextAuth URL',
    'NEXT_PUBLIC_SUPABASE_URL': 'Supabase URL (for storage)',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anon Key (for storage)',
  }
  
  Object.entries(envVars).forEach(([key, description]) => {
    if (envContent.includes(key)) {
      console.log(`  ✅ ${key} - ${description}`)
    } else {
      console.log(`  ⚠️ ${key} - ${description} (not set)`)

    }
  })
} else {
  console.log('  ❌ .env file not found!')
}

// ============================================================
// 4. CHECK NODE_MODULES DEPENDENCIES
// ============================================================
console.log('\n📦 Checking dependencies...\n')

const dependencies = [
  'next-auth',
  '@auth/prisma-adapter',
  '@prisma/client',
  '@prisma/adapter-pg',
  'bcryptjs',
  'pg',
  'dotenv',
  '@supabase/supabase-js',
  'lucide-react',
  'framer-motion',
]

dependencies.forEach(dep => {
  try {
    const packagePath = path.join(process.cwd(), 'node_modules', dep)
    const exists = fs.existsSync(packagePath)
    console.log(`  ${exists ? '✅' : '❌'} ${dep}`)
  } catch (e) {
    console.log(`  ❌ ${dep} (not found)`)
  }
})

// ============================================================
// 5. SUMMARY
// ============================================================
console.log('\n📊 Summary:')
console.log('═'.repeat(50))

if (allFilesExist) {
  console.log('  ✅ All required files exist')
} else {
  console.log('  ❌ Missing files:')
  missingFiles.forEach(file => console.log(`     - ${file}`))
}

console.log('\n💡 Next Steps:')
console.log('═'.repeat(50))

if (allFilesExist) {
  console.log('  ✅ All files exist. You can proceed with updates.')
} else {
  console.log('  ⚠️ Some files are missing. Create them before updating.')
  console.log('  📝 Missing files:')
  missingFiles.forEach(file => console.log(`     - ${file}`))
}

console.log('\n🔧 Common Fixes:')
console.log('  - If init.ts is missing the prisma import, update it to use:')
console.log('    import { prisma } from "@/app/lib/prisma"')
console.log('  - Make sure prisma.ts exists at app/lib/prisma.ts')
console.log('  - Run: npm install @supabase/supabase-js (if using storage)')
console.log('  - Add missing environment variables to .env')

console.log('\n✅ Verification complete!')