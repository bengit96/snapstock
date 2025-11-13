# Email Sequences with QStash

This document explains how to set up and use the automated email sequence system for re-engaging users.

## Overview

The email sequence system allows you to schedule multi-step email campaigns that automatically send emails at specified intervals. It uses **Upstash QStash** for reliable scheduling and automatically cancels sequences when users subscribe.

## Setup

### 1. Install QStash (if not already installed)

The system uses Upstash QStash for scheduling. No additional npm packages needed - it works via HTTP API.

### 2. Configure Environment Variables

Add these to your `.env` file:

```bash
# QStash Configuration
QSTASH_TOKEN=your_qstash_token_here
QSTASH_URL=https://qstash.upstash.io/v2/publish
QSTASH_CURRENT_SIGNING_KEY=your_current_signing_key
QSTASH_NEXT_SIGNING_KEY=your_next_signing_key

# App URL (required for QStash callbacks)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

**Get your QStash credentials:**
1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a QStash instance (free tier available)
3. Copy your token and signing keys

### 3. Database Schema

The system uses the existing `scheduledEmails` table in your schema. No migrations needed if you already have it.

## How It Works

### Architecture

```
Admin Panel → Schedule Sequence → Database + QStash
                                        ↓
                                  QStash waits...
                                        ↓
                            Webhook: /api/cron/send-scheduled-email
                                        ↓
                                  Send email via Resend
                                        ↓
                            Update status in database
```

### Sequence Flow

1. **Admin selects users** in `/admin/users`
2. **Clicks "Email Sequence"** button
3. **Previews sequence** with all emails and timing
4. **Confirms** - System schedules all emails in database
5. **QStash schedules** each email for delayed delivery
6. **Emails send automatically** at specified times
7. **Auto-cancellation** if user subscribes

### Smart Cancellation

When a user subscribes:
- All pending emails in their sequence are automatically cancelled
- No manual intervention needed
- Prevents sending promotional emails to paying customers

## Using the System

### 1. Select Users in Admin Panel

Go to `/admin/users` and:
1. Filter users (e.g., "Never Used", "Free Tier Exhausted")
2. Select users by clicking on rows
3. Click **"Email Sequence"** button

### 2. Preview the Sequence

The modal shows:
- **Sequence name and description**
- **Timeline** of all emails (Day 0, Day 3, Day 7, Day 14)
- **Full preview** of each email (click to expand)
- **What will happen** explanation

### 3. Schedule the Sequence

Click **"Schedule for X Users"** to:
- Create all scheduled emails in database
- Schedule them with QStash
- Start the automated sequence

## Available Sequences

### One Analysis Wonder Recovery

**Target:** Users who did 1 free analysis and stopped  
**Goal:** Re-engage with pricing objection handling  
**Duration:** 14 days  
**Emails:** 4

**Timeline:**
- **Day 0:** Offer 2 more free analyses + 30% discount code
- **Day 3:** Check-in reminder about free analyses
- **Day 7:** Urgency - discount code expires tonight
- **Day 14:** Final feedback request

This recovery flow is also **auto-enrolled** when a free user completes their **first** analysis. The system schedules the first email 24 hours after the analysis and queues the remaining steps via QStash. If the user upgrades before any email sends, the pending emails are cancelled automatically.

## Creating New Sequences

Edit `/lib/services/email-sequence.service.ts`:

```typescript
export const EMAIL_SEQUENCES: Record<string, EmailSequence> = {
  YOUR_SEQUENCE_ID: {
    id: 'your_sequence_id',
    name: 'Your Sequence Name',
    description: 'What this sequence does',
    targetSegment: 'one_time_users',
    steps: [
      {
        id: 'step_1',
        delayDays: 0, // Send immediately
        subject: 'Your subject line',
        message: `Your email message...`,
        promoCode: 'PROMO30',
        discountPercent: 30,
      },
      // Add more steps...
    ],
  },
}
```

**Template Variables:**
- `{{firstName}}` - User's first name
- `{{dashboardUrl}}` - Link to dashboard
- `{{checkoutUrl}}` - Link to pricing/checkout

## Monitoring

### View Scheduled Emails

Query the database:

```sql
SELECT 
  id,
  recipient_email,
  email_type,
  scheduled_for,
  status,
  sent_at
FROM scheduled_emails
WHERE status = 'pending'
ORDER BY scheduled_for ASC;
```

### Check Logs

Look for these log entries:
- `Scheduling email sequence`
- `Published to QStash`
- `Scheduled email sent successfully`
- `User subscribed - cancelling sequence`

### Status Values

- `pending` - Scheduled, waiting to send
- `sent` - Successfully sent
- `cancelled` - Cancelled (user subscribed or manual)
- `failed` - Send attempt failed

## Testing

### Test Locally with ngrok

1. Start your dev server: `npm run dev`
2. Start ngrok: `ngrok http 3000`
3. Update `.env`: `NEXT_PUBLIC_APP_URL=https://your-ngrok-url.ngrok.io`
4. Schedule a test sequence with short delays
5. Watch QStash call your webhook

### Test Webhook Manually

```bash
curl -X POST http://localhost:3000/api/cron/send-scheduled-email \
  -H "Content-Type: application/json" \
  -H "upstash-signature: test" \
  -d '{"emailId": "your_email_id_here"}'
```

## Troubleshooting

### Emails Not Sending

1. **Check QStash token** - Verify `QSTASH_TOKEN` is correct
2. **Check app URL** - `NEXT_PUBLIC_APP_URL` must be publicly accessible
3. **Check webhook** - QStash needs to reach `/api/cron/send-scheduled-email`
4. **Check Resend** - Verify `RESEND_API_KEY` is working

### Sequence Not Cancelling

1. **Check user subscription status** - Must be `active`
2. **Check metadata** - Scheduled emails need `sequenceId` in metadata
3. **Check logs** - Look for "User subscribed - cancelling sequence"

### QStash Signature Verification Failing

For production, implement proper signature verification in `/lib/services/qstash.service.ts`:

```typescript
import { verifySignature } from '@upstash/qstash'

export function verifyQStashSignature(
  signature: string,
  body: string
): boolean {
  const signingKey = process.env.QSTASH_CURRENT_SIGNING_KEY
  const nextSigningKey = process.env.QSTASH_NEXT_SIGNING_KEY
  
  return verifySignature({
    signature,
    body,
    signingKey,
    nextSigningKey,
  })
}
```

## Best Practices

1. **Test with yourself first** - Always test new sequences with your own email
2. **Monitor the first batch** - Watch logs when sending to real users
3. **Keep sequences short** - 3-4 emails over 7-14 days is optimal
4. **Personalize messages** - Use template variables for names
5. **Clear value props** - Each email should have one clear purpose
6. **Easy unsubscribe** - Include unsubscribe option (handled by Resend)
7. **Track results** - Monitor open rates and conversions in Resend dashboard

## Costs

**QStash Free Tier:**
- 500 messages/day
- 10,000 messages/month
- Perfect for getting started

**Scaling:**
- If you need more, upgrade to QStash Pro
- Or implement your own scheduler with cron jobs

## Future Enhancements

Potential improvements:
- A/B testing different subject lines
- Dynamic content based on user behavior
- Sequence performance analytics
- Visual sequence builder UI
- Pause/resume sequences
- Custom delay times per user

