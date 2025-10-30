/**
 * Logger utility for consistent logging across the application
 * 
 * In production, consider using a proper logging service like:
 * - Winston
 * - Pino
 * - Logtail
 * - Datadog
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private isProduction = process.env.NODE_ENV === 'production'

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    }

    // In development, use console for better readability
    if (this.isDevelopment) {
      const emoji = {
        debug: '🐛',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level]

      console[level === 'debug' ? 'log' : level](
        `${emoji} [${timestamp}] ${level.toUpperCase()}: ${message}`,
        context ? JSON.stringify(context, null, 2) : ''
      )
      return
    }

    // In production, use structured logging
    if (this.isProduction) {
      // TODO: Send to logging service
      // For now, use console but with structured format
      console[level === 'debug' ? 'log' : level](JSON.stringify(logEntry))
    } else {
      // Other environments (test, etc.)
      console[level === 'debug' ? 'log' : level](logEntry)
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context)
    }
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context)
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context)
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = {
      ...context,
    }

    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    } else if (error) {
      errorContext.error = error
    }

    this.log('error', message, errorContext)
  }
}

// Export singleton instance
export const logger = new Logger()

// Export type for use in other modules
export type { LogContext }
