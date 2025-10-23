import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, chartAnalyses } from '@/lib/db/schema'
import { count, desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    }

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

    return NextResponse.json({
      users: usersWithStats,
      stats: {
        totalUsers,
        totalAdmins,
        activeSubscriptions,
        totalAnalyses,
      },
    })
  } catch (error) {
    console.error('Error fetching admin users data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
