/**
 * Email Notification Service
 * Sends critical notifications via email
 */

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = 'benlohtechbiz@gmail.com'
const FROM_EMAIL = process.env.EMAIL_FROM || 'onboarding@resend.dev'

class EmailNotificationService {
  /**
   * Send error notification email
   */
  async sendErrorNotification(data: {
    error: string
    context?: string
    userId?: string
    stackTrace?: string
    timestamp?: Date
  }): Promise<void> {
    try {
      const timestamp = data.timestamp || new Date()

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #6b7280; }
              .value { margin-top: 5px; padding: 10px; background-color: white; border-radius: 3px; border: 1px solid #e5e7eb; }
              .stack-trace { font-family: monospace; font-size: 12px; white-space: pre-wrap; word-wrap: break-word; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">🔴 SnapPChart Error Alert</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Error Message:</div>
                  <div class="value">${this.escapeHtml(data.error)}</div>
                </div>

                ${data.context ? `
                  <div class="field">
                    <div class="label">Context:</div>
                    <div class="value">${this.escapeHtml(data.context)}</div>
                  </div>
                ` : ''}

                ${data.userId ? `
                  <div class="field">
                    <div class="label">User ID:</div>
                    <div class="value">${this.escapeHtml(data.userId)}</div>
                  </div>
                ` : ''}

                <div class="field">
                  <div class="label">Timestamp:</div>
                  <div class="value">${timestamp.toISOString()}</div>
                </div>

                ${data.stackTrace ? `
                  <div class="field">
                    <div class="label">Stack Trace:</div>
                    <div class="value stack-trace">${this.escapeHtml(data.stackTrace)}</div>
                  </div>
                ` : ''}

                <div class="footer">
                  This is an automated error notification from SnapPChart.
                </div>
              </div>
            </div>
          </body>
        </html>
      `

      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🔴 SnapPChart Error: ${data.error.substring(0, 50)}...`,
        html: htmlContent,
      })
    } catch (error) {
      // Log but don't throw - email failures shouldn't break the app
      console.error('Failed to send error notification email:', error)
    }
  }

  /**
   * Send critical system alert
   */
  async sendCriticalAlert(data: {
    title: string
    message: string
    details?: Record<string, any>
  }): Promise<void> {
    try {
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #dc2626; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
              .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
              .message { padding: 15px; background-color: white; border-radius: 3px; margin: 15px 0; }
              .details { margin-top: 15px; padding: 10px; background-color: white; border-radius: 3px; font-family: monospace; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">⚠️ ${this.escapeHtml(data.title)}</h1>
              </div>
              <div class="content">
                <div class="message">
                  ${this.escapeHtml(data.message)}
                </div>

                ${data.details ? `
                  <div class="details">
                    ${JSON.stringify(data.details, null, 2)}
                  </div>
                ` : ''}

                <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
                  Timestamp: ${new Date().toISOString()}
                </p>
              </div>
            </div>
          </body>
        </html>
      `

      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `⚠️ SnapPChart Alert: ${data.title}`,
        html: htmlContent,
      })
    } catch (error) {
      console.error('Failed to send critical alert email:', error)
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService()
