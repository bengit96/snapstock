/**
 * Email Notification Service
 * Sends critical notifications via email
 */

import { discordService } from "./discord.service";

class EmailNotificationService {
  /**
   * Send error notification email
   */
  async sendErrorNotification(data: {
    error: string;
    context?: string;
    userId?: string;
    stackTrace?: string;
    timestamp?: Date;
  }): Promise<void> {
    try {
      discordService.notifyError({
        error: data.error,
        context: data.context,
        userId: data.userId,
      });
    } catch (error) {
      // Log but don't throw - email failures shouldn't break the app
      console.error("Failed to send error notification email:", error);
    }
  }

  /**
   * Send critical system alert
   */
  async sendCriticalAlert(data: {
    title: string;
    message: string;
    details?: Record<string, any>;
  }): Promise<void> {
    try {
      discordService.notifyError({
        error: data.title,
        context: data.message,
      });
    } catch (error) {
      console.error("Failed to send critical alert email:", error);
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService();
