import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/utils/security';
import { ApiResponse } from '@/lib/utils/api-response';
import { logger } from '@/lib/utils/logger';
import { db } from '@/lib/db';
import { users, discountCodes } from '@/lib/db/schema';
import { inArray, eq } from 'drizzle-orm';
import { sendMarketingEmail } from '@/lib/services/admin-email.service';

export const dynamic = 'force-dynamic';

interface SendEmailRequest {
  userIds: string[];
  subject: string;
  message: string;
  promoCode?: string;
  batchSize?: number;
}

// POST - Send batch emails to selected users
export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body: SendEmailRequest = await request.json();
    const {
      userIds,
      subject,
      message,
      promoCode,
      batchSize = 50 // Send 50 emails at a time to avoid rate limits
    } = body;

    // Validate required fields
    if (!userIds || userIds.length === 0) {
      return ApiResponse.badRequest('At least one user must be selected');
    }

    if (!subject || !message) {
      return ApiResponse.badRequest('Subject and message are required');
    }

    // Validate promo code if provided
    let discountPercent = 0;
    if (promoCode) {
      const codeResult = await db
        .select()
        .from(discountCodes)
        .where(eq(discountCodes.code, promoCode.toUpperCase()))
        .limit(1);

      if (codeResult.length === 0) {
        return ApiResponse.badRequest('Invalid promo code');
      }

      const code = codeResult[0];
      if (!code.active) {
        return ApiResponse.badRequest('Promo code is not active');
      }

      if (code.validUntil && new Date(code.validUntil) < new Date()) {
        return ApiResponse.badRequest('Promo code has expired');
      }

      discountPercent = code.discountType === 'percentage' ? parseFloat(code.discountValue) : 0;
    }

    // Fetch users
    const selectedUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(inArray(users.id, userIds));

    if (selectedUsers.length === 0) {
      return ApiResponse.notFound('No users found');
    }

    // Send emails in batches
    const results = {
      total: selectedUsers.length,
      sent: 0,
      failed: 0,
      errors: [] as Array<{ email: string; error: string }>,
    };

    logger.info('Starting batch email send', {
      totalUsers: selectedUsers.length,
      batchSize,
      hasPromoCode: !!promoCode,
    });

    // Process in batches with delay
    for (let i = 0; i < selectedUsers.length; i += batchSize) {
      const batch = selectedUsers.slice(i, i + batchSize);

      const batchPromises = batch.map(async (user) => {
        try {
          const result = await sendMarketingEmail({
            to: user.email,
            userName: user.name,
            subject,
            message,
            promoCode: promoCode?.toUpperCase(),
            discountPercent,
          });

          if (result.success) {
            results.sent++;
            logger.info('Email sent successfully', {
              email: user.email,
              messageId: result.messageId,
            });
          } else {
            results.failed++;
            results.errors.push({
              email: user.email,
              error: result.error || 'Unknown error',
            });
            logger.error('Failed to send email', {
              email: user.email,
              error: result.error,
            });
          }
        } catch (error) {
          results.failed++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          results.errors.push({
            email: user.email,
            error: errorMsg,
          });
          logger.error('Error sending email', { email: user.email, error: errorMsg });
        }
      });

      // Wait for batch to complete
      await Promise.all(batchPromises);

      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < selectedUsers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      }
    }

    logger.info('Batch email send completed', {
      total: results.total,
      sent: results.sent,
      failed: results.failed,
    });

    return ApiResponse.success({
      message: `Emails sent: ${results.sent}/${results.total}`,
      results,
    });
  } catch (error) {
    logger.error('Error sending batch emails', error);

    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message);
    }

    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message);
    }

    return ApiResponse.serverError('Failed to send batch emails');
  }
}
