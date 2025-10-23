'use client'

import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Lock, TrendingUp, Zap } from 'lucide-react'
import { ROUTES } from '@/lib/constants'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const router = useRouter()

  const handleLogin = () => {
    router.push(ROUTES.login)
  }

  const handleSignup = () => {
    router.push(ROUTES.login)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Login to See Your Results
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Create a free account to analyze your chart and get instant AI-powered trading insights
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {/* Benefits */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">1 Free Analysis</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Test drive with your first chart free
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Results in Under 5 Seconds</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Get instant trade recommendations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-2 pt-2">
            <Button
              onClick={handleSignup}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              size="lg"
            >
              Sign Up Free
            </Button>
            <Button
              onClick={handleLogin}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Already have an account? Login
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
