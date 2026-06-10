
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const client = postgres(Bun.env.DATABASE_URL!)

export type Database = typeof db

export const db = drizzle(client, { logger : true})
