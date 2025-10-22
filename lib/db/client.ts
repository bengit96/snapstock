import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * Database Client Singleton
 * Ensures we only create one database connection pool
 */
class DatabaseClient {
  private static instance: DatabaseClient
  private client: postgres.Sql
  public db: ReturnType<typeof drizzle>

  private constructor() {
    const connectionString = process.env.DATABASE_URL!

    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    // Create postgres client with connection pooling
    this.client = postgres(connectionString, {
      max: 10, // Maximum number of connections
      idle_timeout: 30, // Close idle connections after 30 seconds
      connect_timeout: 10, // Connection timeout in seconds
    })

    // Create drizzle instance
    this.db = drizzle(this.client, { schema })
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient()
    }
    return DatabaseClient.instance
  }

  /**
   * Close all database connections
   */
  public async close(): Promise<void> {
    await this.client.end()
  }

  /**
   * Health check for database connection
   */
  public async healthCheck(): Promise<boolean> {
    try {
      await this.client`SELECT 1`
      return true
    } catch (error) {
      console.error('Database health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const dbClient = DatabaseClient.getInstance()
export const db = dbClient.db

// Export types
export type Database = typeof db
export type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0]