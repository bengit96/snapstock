import { Resend } from "resend";
import { marked } from "marked";

const resend = new Resend(process.env.RESEND_API_KEY);
const EMAIL_FROM = process.env.EMAIL_FROM || "noreply@snappchart.app";

interface MarketingEmailOptions {
  to: string;
  userName: string | null;
  subject: string;
  message: string;
  promoCode?: string;
  discountPercent?: number;
}

/**
 * Generate HTML template for marketing email with optional promo code
 */
function generateMarketingEmailHTML(
  userName: string | null,
  message: string,
  promoCode?: string,
  discountPercent?: number
): string {
  const displayName = userName || "there";
  const appUrl = process.env.APP_URL || "https://snappchart.app";

  // Convert markdown to HTML
  const formattedMessage = marked.parse(message, {
    async: false,
    breaks: true,
    gfm: true,
  }) as string;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>SnapPChart</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">SnapPChart</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 14px;">AI-Powered Chart Analysis</p>
        </div>

        <div style="background: white; padding: 40px 30px; border-left: 1px solid #e1e1e1; border-right: 1px solid #e1e1e1;">
          <div style="font-size: 16px; color: #555; line-height: 1.8;">
            ${formattedMessage}
          </div>

          ${
            promoCode
              ? `
            <div style="background: linear-gradient(135deg, #f8f4ff 0%, #fff4f4 100%); padding: 30px; border-radius: 12px; text-align: center; margin: 35px 0; border: 2px solid #667eea; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.1);">
              <p style="font-size: 14px; color: #667eea; font-weight: 700; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 2px;">Your Exclusive Promo Code</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                <span style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #667eea; font-family: 'Courier New', monospace;">
                  ${promoCode}
                </span>
              </div>
              ${
                discountPercent
                  ? `
                <p style="font-size: 18px; color: #764ba2; font-weight: 600; margin: 15px 0 5px 0;">
                  Save ${discountPercent}% on any plan!
                </p>
              `
                  : ""
              }
              <p style="font-size: 13px; color: #888; margin: 10px 0 0 0;">Copy this code and use it at checkout</p>
            </div>

            <div style="text-align: center; margin: 35px 0;">
              <a href="${appUrl}/billing" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 45px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3); transition: transform 0.2s;">
                Claim Your Discount →
              </a>
            </div>
          `
              : `
            <div style="text-align: center; margin: 35px 0;">
              <a href="${appUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 45px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.3);">
                Visit SnapPChart →
              </a>
            </div>
          `
          }

          <div style="background: #f9fafb; padding: 25px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #667eea;">
            <h3 style="margin-top: 0; color: #333; font-size: 18px; font-weight: 600;">What you get with SnapPChart:</h3>
            <ul style="margin: 15px 0; padding-left: 20px; color: #555;">
              <li style="margin: 10px 0;">🎯 Unlimited AI-powered chart analysis</li>
              <li style="margin: 10px 0;">📊 Advanced technical pattern recognition</li>
              <li style="margin: 10px 0;">💡 Entry, stop-loss, and take-profit recommendations</li>
              <li style="margin: 10px 0;">📈 Risk/reward ratio calculations</li>
              <li style="margin: 10px 0;">⚡ Priority support from our team</li>
            </ul>
          </div>

          <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 14px; color: #6b7280; margin: 0;">
              Have questions? We're here to help! Just reply to this email and our team will get back to you.
            </p>
          </div>
        </div>

        <div style="background: #f9fafb; padding: 25px 30px; border-radius: 0 0 10px 10px; border: 1px solid #e1e1e1; border-top: none;">
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0 0 10px 0;">
            © ${new Date().getFullYear()} SnapPChart. All rights reserved.
          </p>
          <p style="font-size: 11px; color: #d1d5db; text-align: center; margin: 0;">
            You're receiving this email because you signed up for SnapPChart.<br>
            If you no longer wish to receive these emails, you can manage your preferences in your account settings.
          </p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Send a marketing email to a user
 */
export async function sendMarketingEmail(
  options: MarketingEmailOptions
): Promise<{ success: boolean; error?: string; messageId?: string }> {
  try {
    const html = generateMarketingEmailHTML(
      options.userName,
      options.message,
      options.promoCode,
      options.discountPercent
    );

    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html,
    });

    if (error) {
      console.error("Failed to send marketing email:", error);
      return { success: false, error: error.message || "Failed to send email" };
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error("Error in sendMarketingEmail:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while sending email",
    };
  }
}
