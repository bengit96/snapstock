'use client'

import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import { LogOut, BarChart3 } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'
import type { User } from '@/lib/types'

interface HeaderProps {
  user?: User | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">{APP_NAME} Dashboard</h1>
          </div>
          {user?.email && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Welcome, {user.email}
            </p>
          )}
        </div>

        {user && (
          <Button
            variant="outline"
            onClick={() => signOut({ callbackUrl: '/' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        )}
      </div>
    </header>
  )
}