// scripts/sync-db.js
const { execSync } = require('child_process');
const path = require('path');

console.log('🔄 Syncing Prisma schema with database...\n');

try {
  // Generate Prisma client
  console.log('1️⃣ Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  // Push schema to database
  console.log('2️⃣ Pushing schema to database...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database schema updated\n');

  console.log('🎉 Database sync completed successfully!');
} catch (error) {
  console.error('❌ Error syncing database:', error.message);
  process.exit(1);
}
