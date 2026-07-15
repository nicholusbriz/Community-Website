// prisma.config.ts
import 'dotenv/config'

export default {
  datasource: {
    // ✅ Use DIRECT_URL for all Prisma CLI commands
    url: process.env.DIRECT_URL!,
  },
  // Optional: Keep DATABASE_URL for your app
  // Your app will still use DATABASE_URL via prisma.ts
}