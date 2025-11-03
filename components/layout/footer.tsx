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

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block py-2 hover:text-white transition"
      >
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className="inline-block py-2 hover:text-white transition">
      {children}
    </Link>
  )
}

function FooterSection({ title, links }: FooterSectionProps) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">
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
      title: 'Community',
      links: [
        { href: DISCORD_INVITE_URL, label: '💬 Join Discord' },
        { href: '/about', label: 'About Us' },
        { href: '/contact', label: 'Contact' }
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
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="container mx-auto">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <LogoIcon className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </div>
            <p className="text-sm">
              AI-powered trading analysis based on proven strategies.
            </p>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <FooterSection key={index} {...section} />
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {currentYear} {APP_NAME}. All rights reserved.</p>
          <p className="mt-2 text-xs">
            Trading involves risk. Past performance does not guarantee future results.
          </p>
        </div>
      </div>
    </footer>
  )
}