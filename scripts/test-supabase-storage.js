// scripts/test-supabase-storage.js
// Test Supabase connection and avatars bucket access
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

console.log('🔍 Testing Supabase Storage Connection\n')
console.log('Supabase URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('URL format:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey ? '✅ Set (length: ' + supabaseAnonKey.length + ')' : '❌ Missing')
console.log('Service Key:', supabaseServiceKey ? '✅ Set (length: ' + supabaseServiceKey.length + ')' : '❌ Missing')

if (!supabaseUrl) {
  console.error('\n❌ Missing Supabase URL')
  process.exit(1)
}

// Use service role key (bypasses RLS for server-side operations)
const keyToUse = supabaseServiceKey || supabaseAnonKey
const keyType = supabaseServiceKey ? 'Service Role (bypasses RLS)' : 'Anon'
console.log(`Using ${keyType} key for tests`)

const supabase = createClient(supabaseUrl, keyToUse)

async function testConnection() {
  try {
    // Test 1: Try to upload a test file with folder structure (simulating authenticated user)
    console.log('\n� Test 1: Uploading test image with folder structure (userId folder)...')
    const testUserId = 'cmrj7twu20000l0tz0ffexqch' // Use actual user ID from logs
    const testFileName = `${testUserId}/test-upload-${Date.now()}.png`
    const testContent = Buffer.from('fake png data') // Simulated image
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(testFileName, testContent, {
        contentType: 'image/png',
        upsert: true
      })
    
    if (uploadError) {
      console.error('❌ Upload with folder failed:', uploadError)
      console.error('   Error code:', uploadError.statusCode)
      console.error('   Message:', uploadError.message)
    } else {
      console.log('✅ Upload with folder successful')
      console.log('   Path:', uploadData.path)
      
      // Clean up test file
      console.log('\n🧹 Cleaning up test file...')
      await supabase.storage.from('avatars').remove([testFileName])
      console.log('✅ Test file removed')
    }

    // Test 2: Try flat path (without folder) - this should fail per policy
    console.log('\n📤 Test 2: Uploading test image with FLAT path (no folder - should fail)...')
    const flatFileName = `flat-test-${Date.now()}.png`
    
    const { data: flatUploadData, error: flatUploadError } = await supabase.storage
      .from('avatars')
      .upload(flatFileName, testContent, {
        contentType: 'image/png',
        upsert: true
      })
    
    if (flatUploadError) {
      console.error('❌ Flat upload failed (expected):', flatUploadError.message)
      console.log('   This is expected - policy requires folder structure')
    } else {
      console.log('✅ Flat upload successful (unexpected)')
      console.log('   Path:', flatUploadData.path)
      
      // Clean up
      await supabase.storage.from('avatars').remove([flatFileName])
      console.log('✅ Test file removed')
    }

    console.log('\n✅ Tests completed')
  } catch (error) {
    console.error('\n❌ Unexpected error:', error)
  }
}

testConnection()
