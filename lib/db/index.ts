// Re-export everything from client (singleton)
export { db, dbClient, type Database, type DbTransaction } from './client'

// Re-export schema
export * from './schema'

// Type exports for convenience
import type * as schema from './schema'

export type User = typeof schema.users.$inferSelect
export type NewUser = typeof schema.users.$inferInsert
export type ChartAnalysis = typeof schema.chartAnalyses.$inferSelect
export type NewChartAnalysis = typeof schema.chartAnalyses.$inferInsert
export type Trade = typeof schema.trades.$inferSelect
export type NewTrade = typeof schema.trades.$inferInsert
export type OTPCode = typeof schema.otpCodes.$inferSelect
export type NewOTPCode = typeof schema.otpCodes.$inferInsert
export type Session = typeof schema.sessions.$inferSelect
export type Account = typeof schema.accounts.$inferSelect