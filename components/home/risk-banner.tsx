'use client'

import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

export function RiskBanner() {
  return (
    <div className="fixed top-[73px] w-full bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800 py-3 px-4 z-40">
      <div className="container mx-auto">
        <div className="flex items-center justify-center gap-3 text-sm text-yellow-800 dark:text-yellow-200">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p className="text-center">
            <strong>Risk Disclaimer:</strong> Trading involves substantial risk of loss. This tool is for educational purposes only and does not provide financial advice.{' '}
            <Link href={ROUTES.disclaimer} className="underline hover:no-underline font-semibold">
              Read full disclaimer
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
