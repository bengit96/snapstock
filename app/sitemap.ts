import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://snappchart.app'

  const routes = [
    '',
    '/about',
    '/analyze',
    '/auth/login',
    '/blog',
    '/contact',
    '/dashboard',
    '/disclaimer',
    '/pricing',
    '/privacy',
    '/settings',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : route === '/blog' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : route === '/pricing' || route === '/analyze' ? 0.9 : 0.7,
  }))
}
