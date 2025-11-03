import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants'
import { AuthenticatedHeader } from '@/components/layout/authenticated-header'
import { Footer } from '@/components/layout/footer'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect(ROUTES.login)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <AuthenticatedHeader />
      {children}
      <Footer />
    </div>
  )
}
