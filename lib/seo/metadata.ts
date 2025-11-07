import { Metadata } from 'next'

const baseUrl = 'https://snappchart.app'

interface PageMetadataOptions {
  title: string
  description: string
  path: string
  keywords?: string[]
  ogImage?: string
  noIndex?: boolean
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    keywords = [],
    ogImage = '/og-image.png',
    noIndex = false,
  } = options

  const url = `${baseUrl}${path}`

  return {
    title: `${title} | SnapPChart`,
    description,
    keywords: [
      // Brand
      'SnapPChart',
      'SnapChart',
      'Snap P Chart',
      'snappchart app',
      'snappchart.app',
      // Core terms
      'stock trading analysis',
      'AI chart analysis',
      'momentum trading',
      'AI stock chart analysis',
      'stock chart analyzer',
      'chart analysis software',
      'trading chart analysis',
      'technical analysis AI',
      'day trading tools',
      'trading signals',
      'AI trading assistant',
      // Page-specific keywords
      ...keywords,
    ],
    authors: [{ name: 'SnapPChart', url: baseUrl }],
    creator: 'SnapPChart',
    publisher: 'SnapPChart',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | SnapPChart`,
      description,
      url,
      siteName: 'SnapPChart',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - SnapPChart`,
          type: 'image/png',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SnapPChart`,
      description,
      images: [ogImage],
      creator: '@snappchart',
      site: '@snappchart',
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  }
}
