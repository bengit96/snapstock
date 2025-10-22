'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, Gift, Users, TrendingUp } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useReferralStats } from '@/lib/hooks/useApi'

interface ReferralSectionProps {
  userId: string
}

export function ReferralSection({ userId }: ReferralSectionProps) {
  const { data: stats, isLoading } = useReferralStats()
  const [copied, setCopied] = useState(false)

  const copyReferralLink = () => {
    const link = `${window.location.origin}?ref=${stats?.code}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyReferralCode = () => {
    if (stats?.code) {
      navigator.clipboard.writeText(stats.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner message="Loading referral stats..." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Referral Code Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gift className="w-5 h-5 mr-2 text-purple-600" />
            Your Referral Code
          </CardTitle>
          <CardDescription>
            Share your code and earn 20% off your next monthly payment for each friend who subscribes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={stats?.code || 'Loading...'}
              readOnly
              className="font-mono text-lg font-bold text-center"
            />
            <Button
              onClick={copyReferralCode}
              variant="outline"
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-sm font-medium mb-2">Share your referral link:</p>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}?ref=${stats?.code}`}
                readOnly
                className="text-sm"
              />
              <Button
                onClick={copyReferralLink}
                size="sm"
                className="flex-shrink-0"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-semibold mb-2">How it works:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Share your referral code or link with friends</li>
              <li>They sign up using your code</li>
              <li>When they subscribe, you get 20% off your next payment</li>
              <li>No limit on how many friends you can refer!</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total Referrals
                </p>
                <p className="text-3xl font-bold mt-1">
                  {stats?.totalReferrals || 0}
                </p>
              </div>
              <Users className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Converted
                </p>
                <p className="text-3xl font-bold mt-1 text-green-600">
                  {stats?.successfulReferrals || 0}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-600 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Rewards Available
                </p>
                <p className="text-3xl font-bold mt-1 text-purple-600">
                  {stats?.pendingRewards || 0}
                </p>
              </div>
              <Gift className="w-10 h-10 text-purple-600 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Rewards */}
      {(stats?.pendingRewards || 0) > 0 && (
        <Card className="border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>🎉 You have rewards available!</span>
              <Badge className="bg-purple-600 hover:bg-purple-700">
                {stats?.pendingRewards} rewards
              </Badge>
            </CardTitle>
            <CardDescription>
              Your rewards will be automatically applied to your next monthly payment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Next discount: </span>
                20% off your next monthly payment
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Rewards are applied automatically when your subscription renews
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
