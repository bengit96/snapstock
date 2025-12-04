"use client";

import { Navigation } from "@/components/layout/navigation";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FAQSchema } from "@/components/seo/faq-schema";

const faqs = [
  {
    question: "What is SnapPChart?",
    answer:
      "SnapPChart is an AI-powered trading analysis tool that analyzes stock charts and provides instant trade recommendations based on momentum trading strategies.",
  },
  {
    question: "How does the free analysis work?",
    answer:
      "New users get 5 free chart analyses to try out the platform. Simply upload a chart screenshot, create an account, and receive your AI-powered analysis. After your free analyses, you can subscribe for unlimited access.",
  },
  {
    question: "What types of charts can I analyze?",
    answer:
      "SnapPChart works with any stock chart screenshot from popular trading platforms. For best results, your chart should include MACD (Moving Average Convergence Divergence), Volume Profile, EMA 9, EMA 20, EMA 200 (Exponential Moving Averages), and VWAP (Volume Weighted Average Price). The AI analyzes candlestick patterns, support/resistance levels, and over 40 technical signals to provide comprehensive trade recommendations.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes! You can cancel your subscription at any time from your account settings. Your access will continue until the end of your current billing period.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use industry-standard encryption and secure payment processing through Stripe. Your chart images and trading data are stored securely and never shared with third parties.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Due to the nature of our AI-powered service and the instant delivery of analysis, we do not offer refunds. However, we encourage you to try our free analysis first to ensure SnapPChart meets your needs.",
  },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <FAQSchema faqs={faqs} />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              We&apos;re here to help with any questions about SnapPChart
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="w-6 h-6 text-purple-600" />
                    <CardTitle>Email Support</CardTitle>
                  </div>
                  <CardDescription>
                    Get help from our support team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    For technical support, billing questions, or general
                    inquiries, email us at:
                  </p>
                  <a
                    href="mailto:ben@snappchart.app"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-lg"
                  >
                    ben@snappchart.app
                  </a>
                  <p className="text-sm text-gray-500 mt-3">
                    We typically respond within 24 hours
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                    <CardTitle>Business Inquiries</CardTitle>
                  </div>
                  <CardDescription>
                    Partnerships, press, or business questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    For partnerships, media inquiries, or business-related
                    questions:
                  </p>
                  <a
                    href="mailto:ben@snappchart.app"
                    className="text-purple-600 hover:text-purple-700 font-semibold text-lg"
                  >
                    ben@snappchart.app
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  What is SnapPChart?
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  SnapPChart is an AI-powered trading analysis tool that
                  analyzes stock charts and provide instant trade
                  recommendations based on momentum trading strategies.
                </p>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  How does the free analysis work?
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  New users get 5 free chart analyses to try out the platform.
                  Simply upload a chart screenshot, create an account, and
                  receive your AI-powered analysis. After your free analyses,
                  you can subscribe for unlimited access.
                </p>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  What types of charts can I analyze?
                </h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">
                  SnapPChart works with any stock chart screenshot from popular
                  trading platforms. For best results, your chart should include
                  these indicators:
                </p>
                <ul className="space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">•</span>
                    <strong>MACD</strong> (Moving Average Convergence
                    Divergence)
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">•</span>
                    <strong>Volume Profile</strong>
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">•</span>
                    <strong>EMA 9, EMA 20, EMA 200</strong> (Exponential Moving
                    Averages)
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-600 mr-2">•</span>
                    <strong>VWAP</strong> (Volume Weighted Average Price)
                  </li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-3">
                  The AI analyzes candlestick patterns, support/resistance
                  levels, and over 40 technical signals to provide comprehensive
                  trade recommendations.
                </p>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  Can I cancel my subscription anytime?
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Yes! You can cancel your subscription at any time from your
                  account settings. Your access will continue until the end of
                  your current billing period.
                </p>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  Is my data secure?
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Absolutely. We use industry-standard encryption and secure
                  payment processing through Stripe. Your chart images and
                  trading data are stored securely and never shared with third
                  parties.
                </p>
              </div>

              <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">
                  Do you offer refunds?
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Due to the nature of our AI-powered service and the instant
                  delivery of analysis, we do not offer refunds. However, we
                  encourage you to try our free analysis first to ensure
                  SnapPChart meets your needs.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Still Have Questions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center p-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white"
          >
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg mb-6">
              Don&apos;t hesitate to reach out. We&apos;re here to help you
              succeed.
            </p>
            <a
              href="mailto:ben@snappchart.app"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Email Us
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
