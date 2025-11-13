import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/security';
import { ApiResponse } from '@/lib/utils/api-response';
import { logger } from '@/lib/utils/logger';
import { db } from '@/lib/db';
import { discountCodes } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

export const dynamic = 'force-dynamic';

// GET - List all promo codes
export async function GET() {
  try {
    await requireAdmin();

    const codes = await db
      .select()
      .from(discountCodes)
      .orderBy(desc(discountCodes.createdAt));

    return ApiResponse.success({ codes });
  } catch (error) {
    logger.error('Error fetching promo codes', error);

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError('Failed to fetch promo codes');
  }
}

// POST - Create a new promo code
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      code,
      discountPercent,
      maxUses = null,
      validUntil = null,
      description = null
    } = body;

    // Validate required fields
    if (!code || !discountPercent) {
      return ApiResponse.badRequest('Code and discount percent are required');
    }

    if (discountPercent < 0 || discountPercent > 100) {
      return ApiResponse.badRequest('Discount percent must be between 0 and 100');
    }

    // Check if code already exists
    const existing = await db
      .select()
      .from(discountCodes)
      .where(eq(discountCodes.code, code.toUpperCase()))
      .limit(1);

    if (existing.length > 0) {
      return ApiResponse.badRequest('Promo code already exists');
    }

    // Create the promo code
    const newCode = await db
      .insert(discountCodes)
      .values({
        code: code.toUpperCase(),
        discountType: 'percentage',
        discountValue: discountPercent.toString(),
        maxUses,
        usedCount: 0,
        validUntil: validUntil ? new Date(validUntil) : null,
        active: true,
        description,
      })
      .returning();

    logger.info('Promo code created', { code: code.toUpperCase() });

    return ApiResponse.success({ code: newCode[0] }, undefined, 201);
  } catch (error) {
    logger.error('Error creating promo code', error);

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError('Failed to create promo code');
  }
}
