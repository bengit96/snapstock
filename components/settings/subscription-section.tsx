'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CreditCard, ExternalLink, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants'
import { useCreatePortal } from '@/lib/hooks/useApi'

interface SubscriptionSectionProps {
  user: any
}

export function SubscriptionSection({ user }: SubscriptionSectionProps) {
  const createPortal = useCreatePortal({
    onSuccess: (url) => {
      window.location.href = url
    },
    onError: (error) => {
      console.error('Error:', error)
      alert('Failed to open billing portal. Please try again.')
    },
  })

  const isActive = user.subscriptionStatus === 'active'
  const tier = user.subscriptionTier || 'free'

  const handleManageSubscription = () => {
    createPortal.mutate()
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Plan</span>
            {isActive ? (
              <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
            ) : (
              <Badge variant="outline">Free Trial</Badge>
            )}
          </CardTitle>
          <CardDescription>
            {isActive
              ? `You're subscribed to the ${tier} plan`
              : 'Upgrade to unlock unlimited analyses'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div>
              <p className="font-semibold text-lg capitalize">
                {tier === 'free' ? 'Free Trial' : `${tier} Plan`}
              </p>
              {tier === 'free' && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  3 free chart analyses included
                </p>
              )}
            </div>
            {isActive && (
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${tier === 'monthly' ? '19.99' : tier === 'yearly' ? '199.99' : '599'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tier === 'lifetime' ? 'one-time' : `per ${tier === 'yearly' ? 'year' : 'month'}`}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!isActive ? (
              <Link href={ROUTES.pricing} className="flex-1">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Upgrade Now
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  onClick={handleManageSubscription}
                  disabled={createPortal.isPending}
                  variant="outline"
                  className="flex-1"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {createPortal.isPending ? 'Loading...' : 'Manage Billing'}
                </Button>
                {tier !== 'lifetime' && (
                  <Link href={ROUTES.pricing} className="flex-1">
                    <Button className="w-full" variant="default">
                      Change Plan
                    </Button>
                  </Link>
                )}
              </>
            )}
          </div>

          {isActive && user.subscriptionEndDate && (
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              {tier === 'lifetime' ? (
                'Valid for lifetime'
              ) : (
                <>
                  Next billing date:{' '}
                  {new Date(user.subscriptionEndDate).toLocaleDateString()}
                </>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card>
        <CardHeader>
          <CardTitle>Your Features</CardTitle>
          <CardDescription>
            What's included in your current plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {tier === 'free' ? (
              <>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3" />
                  3 free chart analyses
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-purple-600 rounded-full mr-3" />
                  AI-powered grading system
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                  Unlimited analyses (upgrade required)
                </li>
                <li className="flex items-center text-sm text-gray-400">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3" />
                  Trade history tracking (upgrade required)
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  Unlimited chart analyses
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  Advanced AI analysis
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  All 40+ trading signals
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                  Trade history tracking
                </li>
                {(tier === 'yearly' || tier === 'lifetime') && (
                  <>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                      Priority AI processing
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                      Advanced analytics
                    </li>
                  </>
                )}
                {tier === 'lifetime' && (
                  <>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                      Lifetime updates
                    </li>
                    <li className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3" />
                      Priority support
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
