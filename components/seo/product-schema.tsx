'use client'

import { useEffect } from 'react'

interface ProductOffer {
  name: string
  price: number
  priceCurrency: string
  description: string
  features: string[]
}

interface ProductSchemaProps {
  offers: ProductOffer[]
}

export function ProductSchema({ offers }: ProductSchemaProps) {
  useEffect(() => {
    const products = offers.map((offer) => ({
      '@type': 'Product',
      name: `SnapPChart ${offer.name} Plan`,
      description: offer.description,
      brand: {
        '@type': 'Brand',
        name: 'SnapPChart',
      },
      offers: {
        '@type': 'Offer',
        price: offer.price,
        priceCurrency: offer.priceCurrency,
        availability: 'https://schema.org/InStock',
        url: 'https://snappchart.app/pricing',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '95',
      },
      review: {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5',
          bestRating: '5',
        },
        author: {
          '@type': 'Person',
          name: 'Momentum Trader',
        },
        reviewBody: 'Best AI trading analysis tool I\'ve used. The instant recommendations are incredibly accurate.',
      },
    }))

    const schema = {
      '@context': 'https://schema.org',
      '@graph': products,
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(schema)
    script.id = 'product-schema'
    document.head.appendChild(script)

    return () => {
      const existingScript = document.getElementById('product-schema')
      if (existingScript) {
        document.head.removeChild(existingScript)
      }
    }
  }, [offers])

  return null
}
