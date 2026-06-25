import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s — Ilham Pamungkas',
    default: 'Ilham Pamungkas',
  },
  description: 'Writing about photography, building things, and the space between.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
