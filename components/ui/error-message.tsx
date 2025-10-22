import { AlertCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ErrorMessageProps {
  message: string
  variant?: 'error' | 'warning'
  onDismiss?: () => void
  className?: string
}

export function ErrorMessage({
  message,
  variant = 'error',
  onDismiss,
  className
}: ErrorMessageProps) {
  const Icon = variant === 'error' ? XCircle : AlertCircle

  const variantClasses = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600 dark:text-yellow-400',
  }

  return (
    <div className={cn(
      'p-3 rounded-md border flex items-start gap-2',
      variantClasses[variant],
      className
    )}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}