import { AuthenticatedHeader } from "@/components/layout/authenticated-header";
import { Footer } from "@/components/layout/footer";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <AuthenticatedHeader />
        {children}
        <Footer />
      </div>
    </AuthGuard>
  );
}
