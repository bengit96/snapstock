import { auth } from '@/lib/auth'
import { AnalysisHistory } from '@/components/home/analysis-history'

export default async function HomePage() {
  const session = await auth()

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <AnalysisHistory userId={session!.user.id} />
    </main>
  )
}