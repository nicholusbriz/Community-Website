// prisma.config.ts
import { defineConfig } from 'prisma/config'
import 'dotenv/config'

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
    // @ts-ignore - directUrl is valid for Supabase connection pooler
    directUrl: process.env.DIRECT_URL,
  },
})