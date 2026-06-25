import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s — Ilham Pamungkas',
    default: 'Ilham Pamungkas',
  },
  description: 'Writing about photography, building things, and the space between.',
}

// Inline script runs before React hydration — prevents flash of wrong theme
const themeScript = `
(function() {
  try {
    var saved = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var dark = saved === 'dark' || (!saved && systemDark) || (saved === 'system' && systemDark);
    if (dark) document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      {children}
    </>
  )
}
