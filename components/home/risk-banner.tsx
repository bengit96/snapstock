'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, X } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export function RiskBanner() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 3 seconds on mobile devices
    const isMobile = window.innerWidth < 768

    if (isMobile) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-[73px] w-full bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 py-3 px-4 z-40">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 text-sm text-yellow-800 dark:text-yellow-200 relative">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p className="text-center flex-1">
            <strong>Risk Disclaimer:</strong> Trading involves substantial risk of loss. This tool is for educational purposes only and does not provide financial advice.{' '}
            <Link href={ROUTES.disclaimer} className="underline hover:no-underline font-semibold">
              Read full disclaimer
            </Link>
          </p>

          {/* Close button - only show on mobile */}
          <button
            onClick={() => setIsVisible(false)}
            className="md:hidden p-1 hover:bg-yellow-100 dark:hover:bg-yellow-800/30 rounded-full transition-colors"
            aria-label="Close risk disclaimer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
