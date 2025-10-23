'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BarChart3 } from 'lucide-react'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface NavigationProps {
  className?: string
  showAuth?: boolean
}

export function Navigation({ className, showAuth = true }: NavigationProps) {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className={cn(
      'fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b',
      className
    )}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href={ROUTES.home} className="flex items-center">
          <img src="/logo.svg" alt="SnapPChart" className="h-10" />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">
          <a
            href="#features"
            onClick={(e) => handleScrollTo(e, '#features')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleScrollTo(e, '#pricing')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
          >
            Pricing
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleScrollTo(e, '#how-it-works')}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition cursor-pointer"
          >
            How it Works
          </a>

          {/* Auth Buttons */}
          {showAuth && (
            <>
              <Link href={ROUTES.login}>
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href={ROUTES.analyze}>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}