import dotenv from 'dotenv';
import path from 'path';
import { sql } from 'drizzle-orm';

// Load environment variables BEFORE importing db
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function migrate() {
  console.log('🔄 Migrating analysis_reason to analysis_reasons...');

  // Import db after env variables are loaded
  const { db } = await import('../lib/db');

  try {
    // Step 1: Add new column
    await db.execute(sql`ALTER TABLE "chart_analyses" ADD COLUMN IF NOT EXISTS "analysis_reasons" jsonb DEFAULT '[]'::jsonb`);
    console.log('✅ Added analysis_reasons column');

    // Step 2: Migrate existing data
    await db.execute(sql`
      UPDATE "chart_analyses"
      SET "analysis_reasons" = (
        SELECT jsonb_agg(trim(elem))
        FROM unnest(string_to_array("analysis_reason", '. ')) AS elem
        WHERE trim(elem) != ''
      )
      WHERE "analysis_reason" IS NOT NULL AND "analysis_reason" != ''
    `);
    console.log('✅ Migrated existing data');

    // Step 3: Set empty array for null values
    await db.execute(sql`
      UPDATE "chart_analyses"
      SET "analysis_reasons" = '[]'::jsonb
      WHERE "analysis_reasons" IS NULL
    `);
    console.log('✅ Set default empty arrays');

    // Step 4: Drop old column
    await db.execute(sql`ALTER TABLE "chart_analyses" DROP COLUMN IF EXISTS "analysis_reason"`);
    console.log('✅ Dropped old analysis_reason column');

    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
