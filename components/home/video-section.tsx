'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export function VideoSection() {
  return (
    <section className="py-20 px-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">
            See SnapPChart in Action
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Watch how easy it is to analyze momentum stocks in under 5 seconds
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative w-full"
        >
          {/* Aspect ratio container for 16:9 video */}
          <div className="relative w-full pb-[56.25%] rounded-2xl overflow-hidden shadow-2xl bg-gray-100 dark:bg-gray-800">
            {/* Replace src with your actual video URL */}
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="SnapPChart Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Fallback placeholder if no video URL is set */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
              <div className="text-center text-white">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-10 h-10" />
                </div>
                <p className="text-lg font-semibold">Demo Video Coming Soon</p>
                <p className="text-sm opacity-90 mt-2">Replace iframe src with your video URL</p>
              </div>
            </div>
          </div>

          {/* Decorative glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl blur-xl -z-10" />
        </motion.div>
      </div>
    </section>
  )
}
