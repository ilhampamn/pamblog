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
  // Listed explicitly: once `icons` is set here, Next stops adding the link
  // for app/icon.png on its own, and tabs fell back to a missing favicon.ico.
  icons: {
    icon: [
      { url: '/brand/favicon-pam-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-pam-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/brand/favicon-pam-180.png', sizes: '180x180' }],
  },
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
