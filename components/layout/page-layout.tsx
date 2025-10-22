'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageLayoutProps {
  children: ReactNode
  title?: string
  description?: string
  backUrl?: string
  backText?: string
  className?: string
  containerClassName?: string
}

export function PageLayout({
  children,
  title,
  description,
  backUrl,
  backText = 'Back',
  className,
  containerClassName
}: PageLayoutProps) {
  return (
    <div className={cn('min-h-screen', className)}>
      <div className={cn('container mx-auto px-4 py-8', containerClassName)}>
        {/* Back Link */}
        {backUrl && (
          <Link
            href={backUrl}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-8 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backText}
          </Link>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
                {title}
              </h1>
            )}
            {description && (
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  )
}