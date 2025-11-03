'use client'

import { usePathname } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Lock } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  callbackUrl?: string
  onSuccess?: () => void
}

export function LoginModal({ open, onOpenChange, callbackUrl, onSuccess }: LoginModalProps) {
  const pathname = usePathname()
  const redirectUrl = callbackUrl || pathname

  const handleLoginSuccess = () => {
    onOpenChange(false)
    onSuccess?.()
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
            Sign In to Continue
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Create a free account to analyze your chart and get instant AI-powered trading insights
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <LoginForm redirectTo={redirectUrl} onSuccess={handleLoginSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
