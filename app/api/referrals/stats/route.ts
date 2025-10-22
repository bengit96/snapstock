import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { referralService } from '@/lib/services/referral.service'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get or create referral code for user
    const code = await referralService.getOrCreateReferralCode(
      session.user.id,
      session.user.email!
    )

    // Get referral stats
    const stats = await referralService.getReferralStats(session.user.id)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching referral stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    )
  }
}
