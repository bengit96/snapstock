import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/security';
import { ApiResponse } from '@/lib/utils/api-response';
import { logger } from '@/lib/utils/logger';
import { db } from '@/lib/db';
import { discountCodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

// PATCH - Update a promo code (toggle active status or update fields)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;
    const body = await request.json();

    // Check if code exists
    const existing = await db
      .select()
      .from(discountCodes)
      .where(eq(discountCodes.id, id))
      .limit(1);

    if (existing.length === 0) {
      return ApiResponse.notFound('Promo code not found');
    }

    // Update the code
    const updated = await db
      .update(discountCodes)
      .set({
        active: body.active !== undefined ? body.active : existing[0].active,
        maxUses: body.maxUses !== undefined ? body.maxUses : existing[0].maxUses,
        validUntil: body.validUntil !== undefined
          ? (body.validUntil ? new Date(body.validUntil) : null)
          : existing[0].validUntil,
        description: body.description !== undefined ? body.description : existing[0].description,
        updatedAt: new Date(),
      })
      .where(eq(discountCodes.id, id))
      .returning();

    logger.info('Promo code updated', { id, code: updated[0].code });

    return ApiResponse.success({ code: updated[0] });
  } catch (error) {
    logger.error('Error updating promo code', error);

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError('Failed to update promo code');
  }
}

// DELETE - Delete a promo code
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const { id } = params;

    const deleted = await db
      .delete(discountCodes)
      .where(eq(discountCodes.id, id))
      .returning();

    if (deleted.length === 0) {
      return ApiResponse.notFound('Promo code not found');
    }

    logger.info('Promo code deleted', { id, code: deleted[0].code });

    return ApiResponse.success({ message: 'Promo code deleted successfully' });
  } catch (error) {
    logger.error('Error deleting promo code', error);

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError('Failed to delete promo code');
  }
}
