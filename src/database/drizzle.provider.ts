import { resolve4 } from 'node:dns'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as postgres from 'postgres'
import * as schema from './schema/index'

export const DRIZZLE = Symbol('DRIZZLE')

async function resolveIPv4(hostname: string): Promise<string | null> {
  return new Promise((resolve) =>
    resolve4(hostname, (err, addrs) => resolve(err ? null : (addrs[0] ?? null)))
  )
}

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: async () => {
    const postgresClient = (postgres as any).default || postgres
    const isLocal = process.env.DATABASE_URL?.includes('localhost')

    let connectionString = process.env.DATABASE_URL!
    if (!isLocal) {
      const url = new URL(connectionString)
      const ipv4 = await resolveIPv4(url.hostname)
      if (ipv4) {
        url.hostname = ipv4
        connectionString = url.toString()
      }
    }

    const client = postgresClient(connectionString, {
      ssl: isLocal ? false : 'require',
    })
    return drizzle(client, { schema })
  },
}
