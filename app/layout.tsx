import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://snappchart.app'),
  title: 'SnapPChart - AI-Powered Stock Trading Analysis',
  description: 'AI-powered chart analysis for momentum traders. Specializing in low float, fast-moving stocks ($2-$20) with explosive potential. Get instant trade recommendations with GPT-4 Vision analysis.',
  keywords: [
    'stock trading analysis',
    'AI chart analysis',
    'momentum trading',
    'low float stocks',
    'day trading tools',
    'technical analysis AI',
    'stock chart patterns',
    'trading signals',
    'GPT-4 stock analysis',
    'chart pattern recognition',
    'momentum stock scanner',
    'MACD analysis',
    'volume profile trading',
  ],
  authors: [{ name: 'SnapPChart' }],
  creator: 'SnapPChart',
  publisher: 'SnapPChart',
  robots: {
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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  themeColor: '#667eea',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    title: 'SnapPChart - AI-Powered Stock Trading Analysis',
    description: 'AI-powered chart analysis for momentum traders. Specializing in low float, fast-moving stocks ($2-$20) with explosive potential.',
    url: 'https://snappchart.app',
    siteName: 'SnapPChart',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SnapPChart - AI-Powered Stock Trading Analysis',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapPChart - AI-Powered Stock Trading Analysis',
    description: 'Analyze stock charts and get AI-powered trade recommendations',
    images: ['/twitter-image.png'],
    creator: '@snappchart',
  },
  alternates: {
    canonical: 'https://snappchart.app',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://snappchart.app/#organization',
        name: 'SnapPChart',
        url: 'https://snappchart.app',
        logo: {
          '@type': 'ImageObject',
          url: 'https://snappchart.app/logo.png',
          width: 512,
          height: 512,
        },
        sameAs: [
          'https://twitter.com/snappchart',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'ben@snappchart.app',
          contactType: 'Customer Service',
          areaServed: 'US',
          availableLanguage: 'English',
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://snappchart.app/#website',
        url: 'https://snappchart.app',
        name: 'SnapPChart',
        description: 'AI-powered chart analysis for momentum traders. Specializing in low float, fast-moving stocks ($2-$20) with explosive potential.',
        publisher: {
          '@id': 'https://snappchart.app/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://snappchart.app/analyze?q={search_term_string}',
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        name: 'SnapPChart',
        url: 'https://snappchart.app',
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web Browser',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free trial with 1 chart analysis',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '95',
          bestRating: '5',
          worstRating: '1',
        },
      },
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.openai.com" />
        <link rel="dns-prefetch" href="https://vercel.blob.core.windows.net" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}