'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useEffect } from 'react'

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  useEffect(() => {
    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://snappchart.app',
        },
        ...items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 2,
          name: item.label,
          item: `https://snappchart.app${item.href}`,
        })),
      ],
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(breadcrumbList)
    script.id = 'breadcrumb-schema'
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('breadcrumb-schema')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [items])

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
            {index === items.length - 1 ? (
              <span className="text-gray-900 dark:text-white font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
