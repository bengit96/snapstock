import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SnapPChart - AI-Powered Stock Trading Analysis',
  description: 'Analyze stock charts and get AI-powered trade recommendations based on Ross Cameron\'s proven trading strategy',
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
  openGraph: {
    title: 'SnapPChart - AI-Powered Stock Trading Analysis',
    description: 'Analyze stock charts and get AI-powered trade recommendations based on Ross Cameron\'s proven trading strategy',
    type: 'website',
    locale: 'en_US',
    siteName: 'SnapPChart',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapPChart - AI-Powered Stock Trading Analysis',
    description: 'Analyze stock charts and get AI-powered trade recommendations',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}