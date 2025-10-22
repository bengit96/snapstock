'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PricingCard } from '@/components/pricing/pricing-card'
import { Shield, Lock } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

interface PricingPlan {
  tier: 'monthly' | 'yearly' | 'lifetime'
  title: string
  price: number
  period: string
  description: string
  features: string[]
  badge?: string
  badgeVariant?: 'default' | 'popular' | 'lifetime'
  isPopular?: boolean
  savings?: string
  buttonVariant?: 'default' | 'outline'
  buttonText?: string
}

export function PricingSection() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const handleSubscribe = async (tier: 'monthly' | 'yearly' | 'lifetime') => {
    if (!session) {
      router.push(ROUTES.login)
      return
    }

    setLoadingTier(tier)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoadingTier(null)
    }
  }

  const plans: PricingPlan[] = [
    {
      tier: 'monthly',
      title: 'Monthly',
      price: 19.99,
      period: 'per month',
      description: 'Perfect for trying out the platform',
      features: [
        'Unlimited chart analyses',
        'All 40+ trading signals',
        'Real-time GPT-4 analysis',
        'Trade history tracking',
        'Cancel anytime'
      ],
      buttonVariant: 'outline',
      buttonText: 'Start Monthly'
    },
    {
      tier: 'yearly',
      title: 'Yearly',
      price: 99.99,
      period: 'per year',
      description: 'Most popular choice for serious traders',
      features: [
        'Everything in Monthly',
        'Priority AI processing',
        'Advanced analytics',
        'Export trade data',
        'Email support'
      ],
      badge: 'MOST POPULAR',
      badgeVariant: 'popular',
      isPopular: true,
      savings: 'Save 58%',
      buttonVariant: 'default',
      buttonText: 'Start Yearly - Best Value'
    },
    {
      tier: 'lifetime',
      title: 'Lifetime',
      price: 599,
      period: 'one-time payment',
      description: 'Ultimate value for committed traders',
      features: [
        'Everything in Yearly',
        'Lifetime updates',
        'Early access features',
        'Priority support',
        '1-on-1 onboarding'
      ],
      badge: 'LIFETIME ACCESS',
      badgeVariant: 'lifetime',
      buttonVariant: 'outline',
      buttonText: 'Get Lifetime Access'
    }
  ]

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto text-center">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your trading style
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PricingCard
              key={plan.tier}
              {...plan}
              onSubscribe={() => handleSubscribe(plan.tier)}
              isLoading={loadingTier === plan.tier}
            />
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include a 7-day money-back guarantee
          </p>
          <div className="flex justify-center items-center gap-4">
            <Shield className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Secure payment via Stripe</span>
            <Lock className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-500">Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}