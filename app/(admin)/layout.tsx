import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ROUTES } from '@/lib/constants'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect(ROUTES.login)
  }

  // Check if user is admin
  if (session.user.role !== 'admin') {
    redirect(ROUTES.unauthorized)
  }

  return <>{children}</>
}
