import dotenv from 'dotenv';
import path from 'path';
import { sql } from 'drizzle-orm';

// Load environment variables BEFORE importing db
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function migrate() {
  console.log('🔄 Adding chart_summary column...');

  // Import db after env variables are loaded
  const { db } = await import('../lib/db');

  try {
    // Add chart_summary column
    await db.execute(sql`ALTER TABLE "chart_analyses" ADD COLUMN IF NOT EXISTS "chart_summary" text`);
    console.log('✅ Added chart_summary column');

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
