"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { LoginModal } from "@/components/modals/login-modal";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";

export default function PublicAnalyzePage() {
  const { status } = useSession();
  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [modalWasOpened, setModalWasOpened] = useState(false);

  // Check for uploaded image from landing page
  useEffect(() => {
    const storedImageUrl = sessionStorage.getItem("pendingAnalysisImageUrl");
    if (storedImageUrl) {
      setUploadedImage(storedImageUrl);

      // If already authenticated, redirect to protected analyze page
      if (status === "authenticated") {
        console.log(
          "🔄 Already authenticated, redirecting to dashboard/analyze"
        );
        setIsRedirecting(true);
        router.push("/dashboard/analyze");
      } else if (status === "unauthenticated" && !isAuthenticating) {
        // Show login modal for unauthenticated users (but not if we're in the process of authenticating)
        console.log("🔐 Not authenticated, showing login modal");
        setIsLoginModalOpen(true);
        setModalWasOpened(true);
      }
    } else if (!isAuthenticating && !isRedirecting) {
      // No image uploaded, redirect to home (but not if we're authenticating/redirecting)
      console.log("❌ No pending image, redirecting to home");
      router.push("/");
    }
  }, [status, router, isAuthenticating, isRedirecting]);

  // Handle successful login
  const handleLoginSuccess = () => {
    console.log("✅ Login successful, setting authenticating flag");
    setIsAuthenticating(true);
    setModalWasOpened(false); // Reset modal state since login succeeded
    setIsLoginModalOpen(false);

    // Wait for session to be fully established before redirecting
    // Increased timeout to ensure session is ready
    setTimeout(() => {
      const pendingImage = sessionStorage.getItem("pendingAnalysisImageUrl");
      console.log(
        "🔄 Redirecting to dashboard/analyze with pending image:",
        pendingImage
      );
      setIsRedirecting(true);
      router.push("/dashboard/analyze");
    }, 500); // Wait 0.5 seconds for session to propagate
  };

  // Handle login modal close
  const handleLoginModalChange = (open: boolean) => {
    setIsLoginModalOpen(open);

    // Only redirect to home if user closed modal without authenticating
    // AND we're not in the process of authenticating
    // AND the modal was actually opened (not just closed on page load)
    if (
      !open &&
      status === "unauthenticated" &&
      !isAuthenticating &&
      modalWasOpened
    ) {
      console.log("❌ Login modal closed without authentication");
      router.push("/");
    }
  };

  if (status === "loading" || !uploadedImage) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md mx-auto">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Redirecting...
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Taking you to analyze your chart
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-purple-900/20">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-20 mt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center px-4 w-full max-w-3xl"
        >
          {/* Success State */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 md:p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.1 }}
              className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center"
            >
              <Check className="w-8 h-8 text-white" />
            </motion.div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Chart Uploaded Successfully!
            </h2>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sign in to get your instant AI analysis
            </p>

            <div className="relative rounded-xl overflow-hidden shadow-lg mb-6 max-w-2xl mx-auto">
              <img
                src={uploadedImage}
                alt="Uploaded chart"
                className="w-full h-auto"
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Your chart is ready for analysis. Sign in to receive instant
                AI-powered insights and trading recommendations.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </main>
      <Footer />

      {/* Login Modal */}
      <LoginModal
        open={isLoginModalOpen}
        onOpenChange={handleLoginModalChange}
        callbackUrl="/dashboard/analyze"
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
