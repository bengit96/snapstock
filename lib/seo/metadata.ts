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
      'stock trading analysis',
      'AI chart analysis',
      'momentum trading',
      ...keywords,
    ],
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
          alt: title,
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
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  }
}
