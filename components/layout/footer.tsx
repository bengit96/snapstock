'use client'

import Link from 'next/link'
import { LogoIcon } from '@/components/common/logo'
import { APP_NAME, DISCORD_INVITE_URL } from '@/lib/constants'

interface FooterLinkProps {
  href: string
  children: React.ReactNode
}

interface FooterSectionProps {
  title: string
  links: { href: string; label: string }[]
}

function FooterLink({ href, children }: FooterLinkProps) {
  const isExternal = href.startsWith('http')
  const linkClassName = "inline-block py-1 hover:text-purple-400 transition-colors duration-200"

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  )
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((link, index) => (
          <li key={index}>
            <FooterLink href={link.href}>{link.label}</FooterLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  const sections: FooterSectionProps[] = [
    {
      title: 'Product',
      links: [
        { href: '/#features', label: 'Features' },
        { href: '/#pricing', label: 'Pricing' },
        { href: '/#how-it-works', label: 'How it Works' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { href: '/blog', label: 'Blog' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' }
      ]
    },
    {
      title: 'Community',
      links: [
        { href: DISCORD_INVITE_URL, label: '💬 Join Discord' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/disclaimer', label: 'Disclaimer' }
      ]
    }
  ]

  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section - Takes 2 columns */}
          <div className="col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <LogoIcon className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              AI-powered trading analysis based on proven strategies.
            </p>
          </div>

          {/* Footer Sections - Each takes 1 column */}
          {sections.map((section, index) => (
            <FooterSection key={index} {...section} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {currentYear} {APP_NAME}. All rights reserved. Trading involves risk. Past performance does not guarantee future results.</p>
        </div>
      </div>
    </footer>
  )
}