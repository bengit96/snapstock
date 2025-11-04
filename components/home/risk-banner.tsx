'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, X } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export function RiskBanner() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto-dismiss after 3 seconds on all devices
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed top-[73px] w-full bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 py-2 sm:py-3 px-2 sm:px-4 z-40">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 relative">
          <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          <p className="text-center flex-1 leading-tight sm:leading-normal">
            <strong className="font-semibold">Risk Disclaimer:</strong> Trading involves substantial risk of loss. This tool is for educational purposes only.{' '}
            <Link href={ROUTES.disclaimer} className="underline hover:no-underline font-semibold whitespace-nowrap">
              Read more
            </Link>
          </p>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-800/30 rounded-full transition-colors flex-shrink-0"
            aria-label="Close risk disclaimer"
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
