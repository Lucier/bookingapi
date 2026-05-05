import 'dotenv/config'
import { setDefaultResultOrder } from 'node:dns'
setDefaultResultOrder('ipv4first')
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!.trim(),
    ssl: !process.env.DATABASE_URL?.includes('localhost'),
  },
  verbose: true,
  strict: true,
})
