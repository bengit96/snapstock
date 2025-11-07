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
    // Brand Variations
    'SnapPChart',
    'SnapChart',
    'Snap P Chart',
    'snappchart app',
    'snappchart.app',
    'snap pchart',
    'snapp chart',

    // Core Product Terms
    'AI stock chart analysis',
    'stock chart analyzer',
    'chart analysis software',
    'stock chart reader',
    'AI trading assistant',
    'chart pattern analyzer',
    'stock chart scanner',
    'trading chart analysis',

    // Technical Analysis Terms
    'technical analysis AI',
    'AI chart analysis',
    'automated technical analysis',
    'MACD analysis tool',
    'EMA indicator analysis',
    'VWAP trading tool',
    'volume analysis trading',
    'RSI indicator tool',
    'fibonacci retracement tool',
    'support resistance finder',
    'chart pattern recognition',
    'candlestick pattern analyzer',

    // Trading Styles & Strategies
    'day trading tools',
    'momentum trading',
    'momentum trading strategy',
    'scalping trading tools',
    'swing trading analysis',
    'intraday trading tools',
    'short term trading',
    'active trading software',

    // Stock Types
    'low float stocks',
    'low float stock scanner',
    'penny stock analysis',
    'small cap stocks trading',
    'volatile stocks scanner',
    'high momentum stocks',
    'breakout stocks finder',
    'gapper stocks analysis',

    // Trading Signals & Recommendations
    'trading signals',
    'buy sell signals',
    'trade recommendations',
    'entry exit points',
    'stop loss calculator',
    'profit target calculator',
    'risk reward calculator',

    // AI & Automation
    'AI stock analysis',
    'AI trading bot',
    'algorithmic trading',
    'automated trading analysis',
    'machine learning trading',
    'GPT trading analysis',
    'AI powered trading',

    // Competitor Alternatives
    'TradingView alternative',
    'Trade Ideas alternative',
    'Benzinga alternative',
    'StockCharts alternative',
    'Finviz alternative',
    'TC2000 alternative',
    'ThinkOrSwim alternative',

    // Use Cases & Problems Solved
    'how to analyze stock charts',
    'how to read stock charts',
    'best trading analysis tool',
    'chart analysis for beginners',
    'stock analysis software',
    'trading chart software',
    'stock screener',
    'momentum stock scanner',

    // Platform Features
    'real-time chart analysis',
    'live stock analysis',
    'instant chart analysis',
    'chart upload analysis',
    'screenshot chart analysis',

    // Target Audience
    'day trader tools',
    'retail trader software',
    'beginner trading tools',
    'professional trading software',
    'stock trader analysis',

    // Market Analysis
    'stock market analysis',
    'stock trading analysis',
    'equity analysis tool',
    'market scanner',
    'pre market scanner',
    'after hours trading',

    // Chart Types
    'candlestick chart analysis',
    'price action analysis',
    'volume profile trading',
    'level 2 analysis',
    'time and sales analysis',

    // Financial Technology
    'fintech trading tools',
    'trading technology',
    'stock analysis API',
    'trading analytics platform',

    // Long-tail Keywords
    'best AI stock chart analysis',
    'AI stock chart pattern recognition',
    'automated stock chart analysis',
    'upload stock chart for analysis',
    'AI momentum trading tool',
    'low float stock trading tool',
    'day trading chart analysis',
    'real-time trading signals',
  ],
  authors: [{ name: 'SnapPChart', url: 'https://snappchart.app' }],
  creator: 'SnapPChart',
  publisher: 'SnapPChart',
  applicationName: 'SnapPChart',
  referrer: 'origin-when-cross-origin',
  category: 'Finance',
  classification: 'Financial Technology, Trading Software, AI Analysis Tools',
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
  verification: {
    // Add your verification codes here after getting them from:
    // google: 'YOUR_GOOGLE_VERIFICATION_CODE',
    // yandex: 'YOUR_YANDEX_VERIFICATION_CODE',
    // bing: 'YOUR_BING_VERIFICATION_CODE',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SnapPChart',
    'application-name': 'SnapPChart',
    'msapplication-TileColor': '#667eea',
    'theme-color': '#667eea',
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
        type: 'image/png',
      },
    ],
    locale: 'en_US',
    type: 'website',
    emails: ['ben@snappchart.app'],
    determiner: 'the',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapPChart - AI-Powered Stock Trading Analysis',
    description: 'Analyze stock charts and get AI-powered trade recommendations',
    images: ['/twitter-image.png?v=2'],
    creator: '@snappchart',
    site: '@snappchart',
    creatorId: '@snappchart',
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
        alternateName: ['Snap P Chart', 'SnapChart', 'Snappchart'],
        legalName: 'SnapPChart',
        url: 'https://snappchart.app',
        description: 'AI-powered stock chart analysis platform for momentum traders, specializing in technical analysis of low float stocks.',
        foundingDate: '2024',
        slogan: 'AI-Powered Stock Chart Analysis for Day Trading',
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
        knowsAbout: [
          'Stock Trading',
          'Technical Analysis',
          'Artificial Intelligence',
          'Chart Analysis',
          'Day Trading',
          'Momentum Trading',
        ],
      },
      {
        '@type': 'BrandPage',
        '@id': 'https://snappchart.app/#brandpage',
        url: 'https://snappchart.app',
        name: 'SnapPChart',
        description: 'SnapPChart is an AI-powered stock chart analysis platform for momentum traders',
        brand: {
          '@type': 'Brand',
          name: 'SnapPChart',
          slogan: 'AI-Powered Stock Chart Analysis for Day Trading',
          logo: 'https://snappchart.app/logo.png',
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
        '@type': 'SoftwareApplication',
        '@id': 'https://snappchart.app/#softwareapplication',
        name: 'SnapPChart',
        alternateName: ['Snap P Chart', 'SnapChart', 'Snappchart'],
        url: 'https://snappchart.app',
        applicationCategory: ['FinanceApplication', 'BusinessApplication'],
        applicationSubCategory: 'Stock Trading Analysis',
        operatingSystem: 'Web Browser, iOS, Android',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        description: 'AI-powered stock chart analysis tool for momentum traders. Upload trading charts and receive instant AI-powered analysis with trade recommendations, entry points, stop losses, and profit targets.',
        screenshot: 'https://snappchart.app/og-image.png',
        featureList: [
          'AI-powered chart analysis',
          'Technical indicator recognition (MACD, EMA, VWAP)',
          'Trade recommendations with entry/exit points',
          'Low float stock specialization',
          'Real-time analysis',
          'Chart pattern recognition',
        ],
        offers: [
          {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free trial with 1 chart analysis',
            availability: 'https://schema.org/InStock',
            url: 'https://snappchart.app/pricing',
          },
          {
            '@type': 'Offer',
            price: '47',
            priceCurrency: 'USD',
            description: 'Pro Plan - Unlimited chart analyses',
            priceValidUntil: '2025-12-31',
            availability: 'https://schema.org/InStock',
            url: 'https://snappchart.app/pricing',
          },
        ],
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '95',
          bestRating: '5',
          worstRating: '1',
          reviewCount: '78',
        },
        author: {
          '@id': 'https://snappchart.app/#organization',
        },
        publisher: {
          '@id': 'https://snappchart.app/#organization',
        },
        inLanguage: 'en-US',
        softwareVersion: '1.0',
        datePublished: '2024-01-01',
        dateModified: new Date().toISOString().split('T')[0],
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

        {/* Additional SEO Meta Tags */}
        <meta name="application-name" content="SnapPChart" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="geo.region" content="US" />
        <meta name="rating" content="General" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="target" content="all" />
        <meta name="HandheldFriendly" content="True" />
        <meta name="revisit-after" content="7 days" />
        <meta httpEquiv="Content-Language" content="en" />

        {/* Brand-specific keywords in meta tags */}
        <meta property="og:site_name" content="SnapPChart" />
        <meta name="twitter:image:alt" content="SnapPChart - AI-Powered Stock Chart Analysis" />
        <meta name="twitter:label1" content="Category" />
        <meta name="twitter:data1" content="Financial Technology" />
        <meta name="twitter:label2" content="Price" />
        <meta name="twitter:data2" content="Free trial available" />

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