'use client'

interface StepProps {
  number: number
  title: string
  description: string
  showConnector?: boolean
}

function Step({ number, title, description, showConnector }: StepProps) {
  return (
    <div className="relative">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>

      {showConnector && (
        <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></div>
      )}
    </div>
  )
}

export function HowItWorksSection() {
  const steps: Omit<StepProps, 'showConnector'>[] = [
    {
      number: 1,
      title: 'Upload Your Chart',
      description: 'Simply screenshot any stock chart from your preferred trading platform and upload it to SnapStock.'
    },
    {
      number: 2,
      title: 'AI Analyzes Instantly',
      description: 'Our GPT-4 powered AI examines 40+ signals, patterns, and confluence zones in seconds.'
    },
    {
      number: 3,
      title: 'Execute with Confidence',
      description: 'Receive your grade (A-F), exact entry point, stop loss, and profit target to trade like a pro.'
    }
  ]

  return (
    <section id="how-it-works" className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Three Simple Steps to Better Trading
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            From chart to trade plan in seconds
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Step
                key={index}
                {...step}
                showConnector={index < steps.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}