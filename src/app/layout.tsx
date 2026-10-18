import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s — Travel Pam',
    default: 'Travel Pam',
  },
  description: 'Travel stories, itineraries and photographs by Ilham Pamungkas.',
  // The favicon is src/app/icon.png: the logo's "Pam." block (decisions 2026-10-18).
  icons: { apple: [{ url: '/brand/favicon-pam-180.png', sizes: '180x180' }] },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
