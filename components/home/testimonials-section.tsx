'use client'

import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

interface TestimonialProps {
  quote: string
  author: string
  role: string
  rating?: number
  index?: number
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ quote, author, role, rating, index = 0 }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px", amount: 0.3 }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="border-2 hover:border-purple-500 transition-all hover:shadow-lg h-full">
        <CardContent className="pt-6">
          <StarRating rating={rating} />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            "{quote}"
          </p>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function TestimonialsSection() {
  const testimonials: TestimonialProps[] = [
    {
      quote: "As someone who follows Ross Cameron's strategies, SnapPChart is perfect for momentum trading. The AI catches patterns I would have missed. My win rate improved by 40%!",
      author: "Sarah K.",
      role: "Momentum Trader",
      rating: 5
    },
    {
      quote: "The strategy is very similar to Ross Cameron's approach. The grading system is brilliant. I only take A and B+ trades now. It's like having a mentor watching over my shoulder.",
      author: "Michael R.",
      role: "Momentum Trader",
      rating: 5
    },
    {
      quote: "I've been using Ross Cameron's techniques for years, and SnapPChart aligns perfectly with momentum trading principles. The risk/reward calculations alone saved me from countless bad trades!",
      author: "James L.",
      role: "Momentum Trader",
      rating: 5
    },
    {
      quote: "As a beginner momentum trader learning from Ross Cameron's style, SnapPChart's grading system helped me avoid costly mistakes. The AI analysis breaks down complex patterns into actionable insights.",
      author: "Emma T.",
      role: "Momentum Trader",
      rating: 5
    },
    {
      quote: "The strategies are similar to what Ross Cameron teaches. The screenshot analysis feature is a game changer for momentum trades. I can quickly validate my setup before entering. Very intuitive and fast!",
      author: "David P.",
      role: "Momentum Trader",
      rating: 4
    },
    {
      quote: "I've tried several trading tools, but SnapPChart's AI is on another level. The pattern recognition is incredibly accurate and saves me hours of chart analysis.",
      author: "Lisa M.",
      role: "Momentum Trader",
      rating: 5
    },
    {
      quote: "Great tool for backtesting setups. The risk/reward calculator has completely changed how I approach position sizing. Highly recommend!",
      author: "Robert C.",
      role: "Momentum Trader",
      rating: 5
    },
    {
      quote: "The monthly subscription pays for itself with just one good trade. The AI insights have helped me become more disciplined and selective.",
      author: "Jennifer W.",
      role: "Momentum Trader",
      rating: 4
    },
    {
      quote: "Finally, a tool that understands technical analysis at a professional level. The grade explanations teach you as you trade. Love it!",
      author: "Alex H.",
      role: "Momentum Trader",
      rating: 5
    }
  ]

  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px", amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            Trusted by Thousands of Traders
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Join the community making smarter trades every day
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                </svg>
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">4.9 out of 5</span>
            <span className="text-gray-500 dark:text-gray-400">from 2,400+ reviews</span>
          </div>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}