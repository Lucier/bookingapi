import { drizzle } from 'drizzle-orm/postgres-js'
import * as postgres from 'postgres'
import * as schema from './schema/index'

export const DRIZZLE = Symbol('DRIZZLE')

export const drizzleProvider = {
  provide: DRIZZLE,
  useFactory: () => {
    const postgresClient = (postgres as any).default || postgres
    const client = postgresClient(process.env.DATABASE_URL!)
    return drizzle(client, { schema })
  },
}
