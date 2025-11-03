import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, chartAnalyses } from '@/lib/db/schema'
import { count, desc } from 'drizzle-orm'
import { requireAdmin } from '@/lib/utils/security'
import { ApiResponse } from '@/lib/utils/api-response'
import { logger } from '@/lib/utils/logger'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await requireAdmin()

    // Fetch all users with their analysis counts
    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        subscriptionStatus: users.subscriptionStatus,
        subscriptionTier: users.subscriptionTier,
        subscriptionEndDate: users.subscriptionEndDate,
        freeAnalysesUsed: users.freeAnalysesUsed,
        freeAnalysesLimit: users.freeAnalysesLimit,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    // Fetch analysis counts for each user
    const userAnalysisCounts = await db
      .select({
        userId: chartAnalyses.userId,
        totalAnalyses: count(),
      })
      .from(chartAnalyses)
      .groupBy(chartAnalyses.userId)

    // Create a map of userId -> analysis count
    const analysisCountMap = new Map(
      userAnalysisCounts.map((item) => [item.userId, item.totalAnalyses])
    )

    // Combine user data with analysis counts
    const usersWithStats = allUsers.map((user) => ({
      ...user,
      totalAnalyses: analysisCountMap.get(user.id) || 0,
    }))

    // Calculate summary statistics
    const totalUsers = usersWithStats.length
    const totalAdmins = usersWithStats.filter((u) => u.role === 'admin').length
    const activeSubscriptions = usersWithStats.filter(
      (u) => u.subscriptionStatus === 'active'
    ).length
    const totalAnalyses = Array.from(analysisCountMap.values()).reduce(
      (sum, count) => sum + count,
      0
    )

    return ApiResponse.success({
      users: usersWithStats,
      stats: {
        totalUsers,
        totalAdmins,
        activeSubscriptions,
        totalAnalyses,
      },
    })
  } catch (error) {
    logger.error('Error fetching admin users data', error)
    
    // Handle authorization errors
    if (error instanceof Error && error.message.includes('Admin access required')) {
      return ApiResponse.forbidden(error.message)
    }
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return ApiResponse.unauthorized(error.message)
    }

    return ApiResponse.serverError('Failed to fetch users data')
  }
}
