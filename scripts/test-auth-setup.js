// scripts/test-auth-setup.js
const fs = require('fs')
const path = require('path')

console.log('🔍 Testing Auth Setup...\n')

// List of required files with correct paths
const requiredFiles = [
  // Auth Config
  'app/lib/auth/config.ts',
  'app/lib/auth/types.ts',
  'app/lib/auth/client.ts',
  'app/lib/auth/server.ts',
  
  // NextAuth API Route
  'app/api/auth/[...nextauth]/route.ts',
  
  // Middleware
  'middleware.ts',
  
  // Providers
  'app/providers.tsx',
  
  // Auth Components (at root level)
  'components/SignupForm.tsx',
  'components/AuthStatus.tsx',
  
  // Pages
  'app/join/page.tsx',
  'app/login/page.tsx',
  'app/dashboard/page.tsx',
]

// List of required dependencies
const requiredDependencies = [
  'next-auth',
  '@auth/prisma-adapter',
  '@prisma/client',
  'bcryptjs',
]

// Check files
console.log('📁 Checking required files...')
let allFilesExist = true

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file)
  const exists = fs.existsSync(fullPath)
  console.log(`  ${exists ? '✅' : '❌'} ${file}`)
  if (!exists) allFilesExist = false
})

console.log('\n📦 Checking dependencies...')
let allDepsExist = true

requiredDependencies.forEach(dep => {
  try {
    const packagePath = path.join(process.cwd(), 'node_modules', dep)
    const exists = fs.existsSync(packagePath)
    console.log(`  ${exists ? '✅' : '❌'} ${dep}`)
    if (!exists) allDepsExist = false
  } catch (e) {
    console.log(`  ❌ ${dep} (not found)`)
    allDepsExist = false
  }
})

// Check imports in key files
console.log('\n🔍 Checking imports...')

function checkFileImports(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    if (!fs.existsSync(fullPath)) {
      console.log(`  ❌ ${filePath} - File not found`)
      return false
    }
    
    const content = fs.readFileSync(fullPath, 'utf8')
    
    // Check for common import patterns
    const hasImports = content.includes('import') || content.includes('require')
    const hasExport = content.includes('export') || content.includes('module.exports')
    
    console.log(`  ${hasImports && hasExport ? '✅' : '⚠️'} ${filePath} (${hasImports ? 'has imports' : 'no imports'} ${hasExport ? 'has exports' : 'no exports'})`)
    return hasImports && hasExport
  } catch (e) {
    console.log(`  ❌ ${filePath} - Error reading file`)
    return false
  }
}

console.log('\n📝 Checking key files for imports/exports:')
const keyFiles = [
  'app/lib/auth/config.ts',
  'app/lib/auth/client.ts',
  'app/api/auth/[...nextauth]/route.ts',
  'middleware.ts',
  'app/providers.tsx',
]

keyFiles.forEach(file => checkFileImports(file))

// Check .env variables
console.log('\n🔑 Checking .env variables...')
try {
  const envPath = path.join(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const hasDatabaseUrl = envContent.includes('DATABASE_URL')
    const hasNextAuthSecret = envContent.includes('NEXTAUTH_SECRET')
    const hasNextAuthUrl = envContent.includes('NEXTAUTH_URL')
    
    console.log(`  ${hasDatabaseUrl ? '✅' : '❌'} DATABASE_URL`)
    console.log(`  ${hasNextAuthSecret ? '✅' : '❌'} NEXTAUTH_SECRET`)
    console.log(`  ${hasNextAuthUrl ? '✅' : '❌'} NEXTAUTH_URL`)
  } else {
    console.log('  ❌ .env file not found')
  }
} catch (e) {
  console.log('  ❌ Error reading .env file')
}

// Check if components are in the right place
console.log('\n📂 Checking component locations...')
const componentLocations = [
  { path: 'components/SignupForm.tsx', expected: 'root/components/' },
  { path: 'components/AuthStatus.tsx', expected: 'root/components/' },
  { path: 'app/components/SignupForm.tsx', expected: 'app/components/' },
  { path: 'app/components/AuthStatus.tsx', expected: 'app/components/' },
]

componentLocations.forEach(loc => {
  const exists = fs.existsSync(path.join(process.cwd(), loc.path))
  console.log(`  ${exists ? '✅' : '❌'} ${loc.path} (${exists ? 'Found in ' + loc.expected : 'Not found'})`)
})

// Summary
console.log('\n📊 Summary:')
console.log(`  ${allFilesExist ? '✅' : '❌'} All required files: ${allFilesExist ? 'Complete' : 'Missing some files'}`)
console.log(`  ${allDepsExist ? '✅' : '❌'} All dependencies: ${allDepsExist ? 'Installed' : 'Missing some packages'}`)

if (allFilesExist && allDepsExist) {
  console.log('\n✅ Your auth setup is complete!')
  console.log('🚀 You can run: npm run dev')
  console.log('📱 Visit: http://localhost:3000/join')
} else {
  console.log('\n⚠️ Some items are missing. Please check the output above.')
  console.log('\n📝 Note: Your components are at the root level in "components/" folder.')
  console.log('Make sure your imports use: @/components/ComponentName')
}

console.log('\n💡 To test the actual auth flow:')
console.log('  1. npm run dev')
console.log('  2. Visit http://localhost:3000/join')
console.log('  3. Create a test account')
console.log('  4. Verify login and dashboard access')