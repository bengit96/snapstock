import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { db } from '@/lib/db'
import { chartAnalyses } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { AnalysisResult } from '@/components/analysis/analysis-result'
import { Footer } from '@/components/layout/footer'

interface AnalysisPageProps {
  params: {
    id: string
  }
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const session = await auth()

  if (!session) {
    redirect(ROUTES.login)
  }

  // Fetch the analysis - ensure it belongs to the user
  const analysis = await db
    .select()
    .from(chartAnalyses)
    .where(
      and(
        eq(chartAnalyses.id, params.id),
        eq(chartAnalyses.userId, session.user.id)
      )
    )
    .limit(1)

  if (!analysis || analysis.length === 0) {
    redirect('/home')
  }

  const analysisData = analysis[0]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <AuthenticatedHeader />

      <main className="flex-1 container mx-auto px-4 py-8">
        <AnalysisResult analysis={analysisData} />
      </main>

      <Footer />
    </div>
  )
}