'use client'

import { useEffect } from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQSchemaProps {
  faqs: FAQItem[]
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    script.id = 'faq-schema'
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('faq-schema')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [faqs])

  return null
}
