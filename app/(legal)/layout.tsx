import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      {children}
      <Footer />
    </div>
  )
}
