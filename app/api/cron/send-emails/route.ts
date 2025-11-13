import { NextRequest, NextResponse } from 'next/server';
import { processPendingEmails } from '@/lib/services/scheduled-email.service';

/**
 * Cron job endpoint to process scheduled emails
 *
 * This endpoint should be called periodically (e.g., every 15 minutes or hourly)
 * to check for and send pending scheduled emails.
 *
 * Security:
 * - Protect this endpoint with a secret token in production
 * - Use Vercel Cron Jobs or an external cron service
 *
 * Example Vercel cron configuration (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/send-emails",
 *     "schedule": "0 * * * *"  // Every hour
 *   }]
 * }
 *
 * Example usage with curl:
 * curl -X POST https://your-domain.com/api/cron/send-emails \
 *   -H "Authorization: Bearer YOUR_CRON_SECRET"
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authorization (optional but recommended)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret) {
      if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        console.warn('[Cron] Unauthorized attempt to access send-emails endpoint');
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    console.log('[Cron] Starting scheduled email processing...');

    // Process pending emails
    const result = await processPendingEmails();

    console.log('[Cron] Email processing complete:', {
      processed: result.processed,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors.length,
    });

    // Return success response with details
    return NextResponse.json({
      success: result.success,
      processed: result.processed,
      sent: result.sent,
      failed: result.failed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Error processing scheduled emails:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint for manual testing (can be removed in production)
 */
export async function GET(request: NextRequest) {
  // Only allow in development or with proper authorization
  if (process.env.NODE_ENV === 'production') {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'This endpoint is not available via GET in production' },
        { status: 405 }
      );
    }
  }

  // In development, allow GET for easy testing
  return POST(request);
}
