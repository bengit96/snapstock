import { generatePageMetadata } from '@/lib/seo/metadata'

export const metadata = generatePageMetadata({
  title: 'Dashboard',
  description: 'Your SnapPChart trading dashboard. View your chart analyses, track trade performance, and manage your subscription.',
  path: '/dashboard',
  noIndex: true, // Private page, don't index
})
