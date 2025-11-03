'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PricingCard } from '@/components/pricing/pricing-card'
import { Shield, Lock } from 'lucide-react'
import { ROUTES } from '@/lib/constants'
import { motion } from 'framer-motion'

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
        '100 chart analyses per month',
        'All trading signals',
        'Real-time AI analysis',
        'Trade history tracking',
        'Cancel anytime'
      ],
      buttonVariant: 'outline',
      buttonText: 'Start Monthly'
    },
    {
      tier: 'yearly',
      title: 'Yearly',
      price: 199.99,
      period: 'per year',
      description: 'Most popular choice for serious traders',
      features: [
        '300 chart analyses per month',
        'Everything in Monthly',
        'Priority AI processing',
        'Advanced analytics',
        'Export trade data',
        'Email support'
      ],
      badge: 'MOST POPULAR',
      badgeVariant: 'popular',
      isPopular: true,
      savings: 'Save 17%',
      buttonVariant: 'default',
      buttonText: 'Start Yearly - Best Value'
    }
  ]

  return (
    <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto text-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px", amount: 0.3 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that fits your trading style
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px", amount: 0.2 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <PricingCard
                {...plan}
                onSubscribe={() => handleSubscribe(plan.tier)}
                isLoading={loadingTier === plan.tier}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
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