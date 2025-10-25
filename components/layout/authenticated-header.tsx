'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/lib/constants'
import {
  ChevronDown,
  CreditCard,
  LogOut,
  Home,
  TrendingUp,
  Crown,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthenticatedHeader() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Get username without domain
  const username = session?.user?.email?.split('@')[0] || 'User'

  // Get first letter for avatar
  const avatarLetter = username[0].toUpperCase()

  // Determine subscription status
  const subscriptionTier = session?.user?.subscriptionTier
  const hasSubscription = subscriptionTier && subscriptionTier !== 'free'
  const isYearlyPlan = subscriptionTier === 'yearly'

  const tabs = [
    { name: 'Home', href: '/home', icon: Home },
    { name: 'Analyze', href: '/dashboard', icon: TrendingUp },
  ]

  const handleSignOut = async () => {
    await signOut({ callbackUrl: ROUTES.home })
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/home">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">SnapPChart</span>
            </motion.div>
          </Link>

          {/* Tabs - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = pathname === tab.href
              return (
                <Link key={tab.href} href={tab.href}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      className={cn(
                        "relative px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
                        isActive
                          ? "text-purple-600 dark:text-purple-400"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-lg -z-10"
                          transition={{ type: "spring", duration: 0.5 }}
                        />
                      )}
                    </button>
                  </motion.div>
                </Link>
              )
            })}
          </nav>

          {/* Right side - Upgrade button and User avatar */}
          <div className="flex items-center gap-3">
            {/* Upgrade Button - Only show if not on yearly plan */}
            {!isYearlyPlan && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden md:block"
              >
                <Link href="/billing">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md flex items-center gap-2"
                  >
                    {hasSubscription ? (
                      <>
                        <Zap className="w-4 h-4" />
                        Upgrade to Yearly
                      </>
                    ) : (
                      <>
                        <Crown className="w-4 h-4" />
                        Buy a Plan
                      </>
                    )}
                  </Button>
                </Link>
              </motion.div>
            )}

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {avatarLetter}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {username}
                </span>
                <ChevronDown className={cn(
                  "w-4 h-4 text-gray-500 transition-transform",
                  dropdownOpen && "rotate-180"
                )} />
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <>
                    {/* Backdrop for mobile */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 md:hidden"
                      onClick={() => setDropdownOpen(false)}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                    >
                      {/* Mobile tabs */}
                      <div className="md:hidden border-b border-gray-200 dark:border-gray-700 p-2">
                        {tabs.map((tab) => {
                          const Icon = tab.icon
                          const isActive = pathname === tab.href
                          return (
                            <Link key={tab.href} href={tab.href}>
                              <button
                                onClick={() => setDropdownOpen(false)}
                                className={cn(
                                  "w-full px-4 py-2 rounded-lg text-left flex items-center gap-3 transition-colors",
                                  isActive
                                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                                )}
                              >
                                <Icon className="w-4 h-4" />
                                {tab.name}
                              </button>
                            </Link>
                          )
                        })}
                      </div>

                      {/* Upgrade button mobile */}
                      {!isYearlyPlan && (
                        <div className="md:hidden p-2 border-b border-gray-200 dark:border-gray-700">
                          <Link href="/billing">
                            <button
                              onClick={() => setDropdownOpen(false)}
                              className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg flex items-center justify-center gap-2 font-medium"
                            >
                              {hasSubscription ? (
                                <>
                                  <Zap className="w-4 h-4" />
                                  Upgrade to Yearly
                                </>
                              ) : (
                                <>
                                  <Crown className="w-4 h-4" />
                                  Buy a Plan
                                </>
                              )}
                            </button>
                          </Link>
                        </div>
                      )}

                      {/* User info */}
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {avatarLetter}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {username}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {session?.user?.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu items */}
                      <div className="p-2">
                        <Link href="/billing">
                          <button
                            onClick={() => setDropdownOpen(false)}
                            className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <CreditCard className="w-4 h-4" />
                            Billing & Usage
                          </button>
                        </Link>

                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-red-600 dark:text-red-400"
                        >
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}