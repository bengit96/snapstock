"use client";

import { Navigation } from "@/components/layout/navigation";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "momentum-trading-strategy",
    title: "Understanding Momentum Trading: A Practical Approach",
    excerpt: "Momentum trading has become one of the most talked-about strategies in day trading circles. Learn how to identify stocks in play and execute profitable trades.",
    date: "Nov 8, 2025",
    readTime: "8 min read",
    category: "Trading Strategy"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
            <h1 className="text-5xl font-bold mb-4">SnapPChart Blog</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Trading insights, platform updates, and momentum trading
              strategies
            </p>
          </motion.div>

          {/* Blog Posts */}
          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                      <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:gap-3 transition-all">
                      Read more
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
