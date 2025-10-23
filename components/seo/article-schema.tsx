'use client'

import { useEffect } from 'react'

interface ArticleSchemaProps {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  author?: string
  image?: string
  keywords?: string[]
}

export function ArticleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author = 'SnapPChart Team',
  image = 'https://snappchart.app/og-image.png',
  keywords = [],
}: ArticleSchemaProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: description,
      image: image,
      datePublished: datePublished,
      dateModified: dateModified || datePublished,
      author: {
        '@type': 'Organization',
        name: author,
        url: 'https://snappchart.app',
      },
      publisher: {
        '@type': 'Organization',
        name: 'SnapPChart',
        logo: {
          '@type': 'ImageObject',
          url: 'https://snappchart.app/logo.png',
        },
      },
      keywords: keywords.join(', '),
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://snappchart.app/blog',
      },
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    script.id = 'article-schema'
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('article-schema')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [title, description, datePublished, dateModified, author, image, keywords])

  return null
}
