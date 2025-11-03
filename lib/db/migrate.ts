import { migrate } from 'drizzle-orm/postgres-js/migrator'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables FIRST
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Validate DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in environment variables')
  console.error('Please add DATABASE_URL to your .env file')
  process.exit(1)
}

async function main() {
  console.log('Running migrations...')

  // Import DB after env is loaded
  const { db } = await import('./index')

  await migrate(db, { migrationsFolder: './drizzle' })

  console.log('✅ Migrations completed!')
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Migration failed!')
  console.error(err)
  process.exit(1)
})