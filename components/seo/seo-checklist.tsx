'use client'

import { useState } from 'react'
import { Check, X, AlertCircle } from 'lucide-react'

interface ChecklistItem {
  name: string
  status: 'done' | 'missing' | 'warning'
  description: string
  location?: string
}

export function SEOChecklist() {
  const [isOpen, setIsOpen] = useState(false)

  const checklist: ChecklistItem[] = [
    {
      name: 'Meta Title',
      status: 'done',
      description: 'Unique, descriptive title tag (50-60 chars)',
      location: 'app/layout.tsx',
    },
    {
      name: 'Meta Description',
      status: 'done',
      description: 'Compelling description with keywords (150-160 chars)',
      location: 'app/layout.tsx',
    },
    {
      name: 'Canonical URL',
      status: 'done',
      description: 'Canonical link to prevent duplicate content',
      location: 'app/layout.tsx',
    },
    {
      name: 'Structured Data',
      status: 'done',
      description: 'Organization, WebSite, WebApplication schemas',
      location: 'app/layout.tsx:92-156',
    },
    {
      name: 'OpenGraph Tags',
      status: 'done',
      description: 'OG tags for social media sharing',
      location: 'app/layout.tsx:59-74',
    },
    {
      name: 'Twitter Cards',
      status: 'done',
      description: 'Twitter card metadata',
      location: 'app/layout.tsx:75-81',
    },
    {
      name: 'Sitemap.xml',
      status: 'done',
      description: 'Dynamic sitemap for all pages',
      location: 'app/sitemap.ts',
    },
    {
      name: 'Robots.txt',
      status: 'done',
      description: 'Crawler directives and sitemap reference',
      location: 'app/robots.ts',
    },
    {
      name: 'FAQ Schema',
      status: 'done',
      description: 'FAQ structured data for rich results',
      location: 'app/contact/page.tsx:40',
    },
    {
      name: 'Product Schema',
      status: 'done',
      description: 'Product markup for pricing pages',
      location: 'app/pricing/page.tsx:135',
    },
    {
      name: 'Security.txt',
      status: 'done',
      description: 'Security contact information',
      location: 'public/.well-known/security.txt',
    },
    {
      name: 'Mobile Optimization',
      status: 'done',
      description: 'Viewport and responsive design',
      location: 'app/layout.tsx:54-57',
    },
    {
      name: 'Performance Hints',
      status: 'done',
      description: 'Preconnect and DNS prefetch',
      location: 'app/layout.tsx:162-165',
    },
    {
      name: 'H1 Hierarchy',
      status: 'done',
      description: 'Proper heading structure (H1 -> H2 -> H3)',
      location: 'components/home/*',
    },
    {
      name: 'Alt Text',
      status: 'done',
      description: 'Descriptive alt text for images',
      location: 'All components',
    },
    {
      name: 'Page Load Speed',
      status: 'warning',
      description: 'Core Web Vitals optimization - test in production',
      location: 'Various',
    },
    {
      name: 'SSL Certificate',
      status: 'warning',
      description: 'HTTPS enabled - verify in production',
      location: 'Hosting',
    },
  ]

  const doneCount = checklist.filter((item) => item.status === 'done').length
  const totalCount = checklist.length
  const percentage = Math.round((doneCount / totalCount) * 100)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors z-50"
      >
        SEO Checklist ({percentage}%)
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-96 max-h-[600px] overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
      <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">SEO Checklist</h3>
          <p className="text-sm text-purple-100">
            {doneCount} of {totalCount} completed ({percentage}%)
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto max-h-[500px] p-4 space-y-3">
        {checklist.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex-shrink-0 mt-0.5">
              {item.status === 'done' && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {item.status === 'missing' && (
                <X className="w-5 h-5 text-red-500" />
              )}
              {item.status === 'warning' && (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                {item.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {item.description}
              </p>
              {item.location && (
                <code className="text-xs text-purple-600 dark:text-purple-400 mt-1 block">
                  {item.location}
                </code>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-2">Next Steps:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Test with Google Rich Results Test</li>
            <li>Submit sitemap to Search Console</li>
            <li>Monitor Core Web Vitals</li>
            <li>Set up Google Analytics 4</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
