import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@snappchart.app';

export interface EmailTemplate {
  subject: string;
  html: string;
}

/**
 * Generate email template for trial users with promo code
 */
export function generateTrialPromoEmail(
  userName: string | null,
  promoCode: string,
  discountPercent: number = 25
): EmailTemplate {
  const displayName = userName || 'there';

  return {
    subject: `${displayName}, here's ${discountPercent}% off to continue your SnapPChart journey`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Special Offer from SnapPChart</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SnapPChart</h1>
          </div>
          <div style="background: white; padding: 30px; border: 1px solid #e1e1e1; border-top: none;">
            <h2 style="margin-top: 0; color: #333;">Hey ${displayName}!</h2>
            <p style="font-size: 16px; color: #555;">
              We noticed you tried out SnapPChart yesterday. We hope you enjoyed the powerful chart analysis!
            </p>
            <p style="font-size: 16px; color: #555;">
              To help you continue making smarter trading decisions, we'd like to offer you an exclusive <strong>${discountPercent}% discount</strong> on any subscription plan.
            </p>

            <div style="background: #f8f4ff; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px dashed #667eea;">
              <p style="font-size: 14px; color: #667eea; font-weight: 600; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Exclusive Promo Code</p>
              <div style="background: white; padding: 15px; border-radius: 5px; margin: 10px 0;">
                <span style="font-size: 28px; font-weight: bold; letter-spacing: 3px; color: #667eea;">
                  ${promoCode}
                </span>
              </div>
              <p style="font-size: 12px; color: #888; margin: 10px 0 0 0;">Use this code at checkout to claim your discount</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://snappchart.app'}/billing" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: 600; font-size: 16px; display: inline-block;">
                Claim Your Discount
              </a>
            </div>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 25px 0;">
              <h3 style="margin-top: 0; color: #333; font-size: 16px;">What you'll get:</h3>
              <ul style="margin: 10px 0; padding-left: 20px; color: #555;">
                <li style="margin: 8px 0;">Unlimited AI-powered chart analysis</li>
                <li style="margin: 8px 0;">Advanced technical pattern recognition</li>
                <li style="margin: 8px 0;">Entry, stop-loss, and take-profit recommendations</li>
                <li style="margin: 8px 0;">Risk/reward ratio calculations</li>
                <li style="margin: 8px 0;">Priority support from our team</li>
              </ul>
            </div>

            <p style="font-size: 14px; color: #888;">
              This offer is available for a limited time. Don't miss out on making smarter trades with SnapPChart!
            </p>

            <hr style="border: none; border-top: 1px solid #e1e1e1; margin: 30px 0;">

            <p style="font-size: 12px; color: #999; text-align: center;">
              © ${new Date().getFullYear()} SnapPChart. All rights reserved.
            </p>
            <p style="font-size: 11px; color: #aaa; text-align: center;">
              If you no longer wish to receive these emails, you can unsubscribe from your account settings.
            </p>
          </div>
        </body>
      </html>
    `,
  };
}

/**
 * Send an email via Resend
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error in sendEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred while sending email',
    };
  }
}

/**
 * Send trial promo email to a user
 */
export async function sendTrialPromoEmail(
  email: string,
  userName: string | null,
  promoCode: string,
  discountPercent?: number
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  const template = generateTrialPromoEmail(userName, promoCode, discountPercent);
  return sendEmail(email, template.subject, template.html);
}
