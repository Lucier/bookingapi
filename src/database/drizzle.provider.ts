import { drizzle } from 'drizzle-orm/postgres-js'
import * as postgres from 'postgres'
import * as schema from './schema/index'

export const DRIZZLE = Symbol('DRIZZLE')

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: () => {
    const postgresClient = (postgres as any).default || postgres
    const isLocal = process.env.DATABASE_URL?.includes('localhost')
    const client = postgresClient(process.env.DATABASE_URL!, {
      ssl: isLocal ? false : 'require',
    })
    return drizzle(client, { schema })
  },
}
