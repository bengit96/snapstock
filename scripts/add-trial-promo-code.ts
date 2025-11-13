/**
 * Script to add the TRIAL25 promo code to the database
 *
 * Usage:
 *   npx tsx scripts/add-trial-promo-code.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env file
config({ path: resolve(__dirname, '../.env') });

import { db } from '../lib/db/client';
import { discountCodes } from '../lib/db/schema/pricing';
import { eq } from 'drizzle-orm';

async function addTrialPromoCode() {
  console.log('Adding TRIAL25 promo code...');

  try {
    // Check if code already exists
    const existing = await db
      .select()
      .from(discountCodes)
      .where(eq(discountCodes.code, 'TRIAL25'))
      .limit(1);

    if (existing.length > 0) {
      console.log('✓ TRIAL25 promo code already exists');
      console.log('Current details:', {
        id: existing[0].id,
        code: existing[0].code,
        discountType: existing[0].discountType,
        discountValue: existing[0].discountValue,
        active: existing[0].active,
        usedCount: existing[0].usedCount,
        maxUses: existing[0].maxUses,
      });
      return;
    }

    // Add the promo code
    const result = await db
      .insert(discountCodes)
      .values({
        code: 'TRIAL25',
        description: 'Trial user discount - 25% off any subscription plan',
        discountType: 'percentage',
        discountValue: '25.00',
        applicablePlans: null, // Applies to all plans
        minimumPurchase: null,
        maxUses: null, // Unlimited uses
        usedCount: 0,
        active: true,
        validFrom: new Date(),
        validUntil: null, // No expiration
      })
      .returning();

    console.log('✓ TRIAL25 promo code added successfully!');
    console.log('Details:', {
      id: result[0].id,
      code: result[0].code,
      discountType: result[0].discountType,
      discountValue: result[0].discountValue,
      description: result[0].description,
    });
  } catch (error) {
    console.error('Error adding promo code:', error);
    throw error;
  }
}

// Run the script
addTrialPromoCode()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
