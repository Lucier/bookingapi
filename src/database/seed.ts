import 'dotenv/config'
import { setDefaultResultOrder, resolve4 } from 'node:dns'
setDefaultResultOrder('ipv4first')
import { drizzle } from 'drizzle-orm/postgres-js'
import * as postgres from 'postgres'
import * as bcrypt from 'bcrypt'
import * as schema from './schema/index'

async function seed() {
  const postgresClient = (postgres as any).default || postgres
  const isLocal = process.env.DATABASE_URL?.includes('localhost')

  let connectionString = process.env.DATABASE_URL!
  if (!isLocal) {
    const url = new URL(connectionString)
    const ipv4 = await new Promise<string | null>((resolve) =>
      resolve4(url.hostname, (err, addrs) => resolve(err ? null : (addrs[0] ?? null)))
    )
    if (ipv4) {
      url.hostname = ipv4
      connectionString = url.toString()
    }
  }

  const client = postgresClient(connectionString, {
    ssl: isLocal ? false : 'require',
  })
  const db = drizzle(client, { schema })

  const passwordHash = await bcrypt.hash('admin123', 10)

  const [user] = await db
    .insert(schema.users)
    .values({
      name: 'Admin',
      email: 'admin@booking.com',
      passwordHash,
      role: 'ADMIN',
    })
    .onConflictDoNothing()
    .returning()

  if (user) {
    console.log(`Admin user created: ${user.email} (id: ${user.id})`)
  } else {
    console.log('Admin user already exists, skipped.')
  }

  await client.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
