'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { BarChart3, Menu, X } from 'lucide-react'
import { APP_NAME, ROUTES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
  className?: string
  showAuth?: boolean
}

export function Navigation({ className, showAuth = true }: NavigationProps) {
  const pathname = usePathname()
  const isAnalyzePage = pathname === '/analyze'
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav className={cn(
      'fixed top-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg z-50 border-b border-gray-200 dark:border-gray-800',
      className
    )}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href={ROUTES.landing} className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {!isAnalyzePage && (
            <>
              <a
                href="#features"
                onClick={(e) => handleScrollTo(e, '#features')}
                className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition cursor-pointer"
              >
                Features
              </a>
              <a
                href="#pricing"
                onClick={(e) => handleScrollTo(e, '#pricing')}
                className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition cursor-pointer"
              >
                Pricing
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => handleScrollTo(e, '#how-it-works')}
                className="text-sm font-medium text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 transition cursor-pointer"
              >
                How it Works
              </a>
            </>
          )}

          {/* Auth Buttons */}
          {showAuth && (
            <>
              <Link href={ROUTES.login}>
                <Button variant="outline" className="font-medium h-11 px-6">
                  Sign In
                </Button>
              </Link>
              {!isAnalyzePage && (
                <Link href={ROUTES.analyze}>
                  <Button className="font-medium h-11 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25">
                    Get Started Free
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg z-50 md:hidden"
            >
              <div className="container mx-auto px-4 py-4 space-y-4">
                {/* Navigation Links */}
                {!isAnalyzePage && (
                  <div className="flex flex-col space-y-2">
                    <a
                      href="#features"
                      onClick={(e) => handleScrollTo(e, '#features')}
                      className="px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#pricing"
                      onClick={(e) => handleScrollTo(e, '#pricing')}
                      className="px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      Pricing
                    </a>
                    <a
                      href="#how-it-works"
                      onClick={(e) => handleScrollTo(e, '#how-it-works')}
                      className="px-4 py-3 text-base font-medium text-gray-700 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      How it Works
                    </a>
                  </div>
                )}

                {/* Auth Buttons */}
                {showAuth && (
                  <div className="flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link href={ROUTES.login} onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-12 font-medium">
                        Sign In
                      </Button>
                    </Link>
                    {!isAnalyzePage && (
                      <Link href={ROUTES.analyze} onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full h-12 font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                          Get Started Free
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}