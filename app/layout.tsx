import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#667eea',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://snappchart.app'),
  title: {
    default: 'SnapPChart - AI-Powered Stock Chart Analysis for Day Trading',
    template: '%s | SnapPChart'
  },
  description: 'AI-powered chart analysis for momentum traders. Specializing in low float, fast-moving stocks ($2-$20) with explosive potential. Get instant trade recommendations with advanced technical analysis using MACD, EMA, and volume indicators.',
  keywords: [
    'stock trading analysis',
    'AI chart analysis',
    'momentum trading',
    'low float stocks',
    'day trading tools',
    'technical analysis AI',
    'stock chart patterns',
    'trading signals',
    'AI stock analysis',
    'chart pattern recognition',
    'momentum stock scanner',
    'MACD analysis',
    'volume profile trading',
    'real-time chart analysis',
    'trading bot',
    'algorithmic trading',
    'penny stock trading',
    'swing trading analysis',
    'stock screener',
    'trade recommendations',
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
  openGraph: {
    title: 'SnapPChart - AI-Powered Stock Trading Analysis',
    description: 'AI-powered chart analysis for momentum traders. Specializing in low float, fast-moving stocks ($2-$20) with explosive potential.',
    url: 'https://snappchart.app',
    siteName: 'SnapPChart',
    images: [
      {
        url: '/og-image.png?v=2',
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
    images: ['/twitter-image.png?v=2'],
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
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is SnapPChart and how does it work?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SnapPChart is an AI-powered stock chart analysis tool designed for momentum traders. Simply upload a screenshot of your trading chart, and our advanced AI analyzes technical indicators like MACD, EMA, volume, and VWAP to provide instant trade recommendations with entry points, stop losses, and profit targets.',
            },
          },
          {
            '@type': 'Question',
            name: 'What type of stocks does SnapPChart analyze best?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SnapPChart specializes in low float, momentum stocks typically priced between $2-$20 with explosive potential. We recommend stocks with 10-50M float, strong relative volume (2x+), clear price action, and decent liquidity for day trading and swing trading strategies.',
            },
          },
          {
            '@type': 'Question',
            name: 'What technical indicators should be on my chart?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'For optimal analysis, your chart should include: 1-5 minute timeframe, MACD indicator, EMA 9, 20, and 200, volume bars, and VWAP. These indicators help our AI provide accurate momentum analysis and trade recommendations.',
            },
          },
          {
            '@type': 'Question',
            name: 'Can I upload historical charts for practice?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No, SnapPChart is designed exclusively for live, current charts from your trading platform. The analysis provides real-time trading decisions, not historical reviews. Only upload charts showing current market conditions for accurate recommendations.',
            },
          },
          {
            '@type': 'Question',
            name: 'How accurate is the AI chart analysis?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'SnapPChart uses advanced GPT-4 Vision AI trained on technical analysis principles including MACD crossovers, EMA positioning, volume patterns, and VWAP levels. The AI provides probabilistic assessments with confidence scores, but trading always carries risk. Use the analysis as a tool to support your own trading decisions.',
            },
          },
          {
            '@type': 'Question',
            name: 'What do the analysis grades mean?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Charts receive grades from A+ to F based on bullish signals, no-go conditions, and confluence of indicators. A+ grades indicate optimal setups with strong momentum signals and minimal red flags. Lower grades suggest caution or potential bearish conditions. Each grade comes with a clear recommendation: Strong Buy, Buy, Hold, Caution, or No Trade.',
            },
          },
        ],
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