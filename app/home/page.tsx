import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { AnalysisHistory } from '@/components/home/analysis-history'
import { Footer } from '@/components/layout/footer'

export default async function HomePage() {
  const session = await auth()

  if (!session) {
    redirect(ROUTES.login)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <AuthenticatedHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <AnalysisHistory userId={session.user.id} />
      </main>

      <Footer />
    </div>
  )
}