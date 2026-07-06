import { notFound } from 'next/navigation'
import { Inter, Playfair_Display, Lora, JetBrains_Mono, Reenie_Beanie } from 'next/font/google'
import { LOCALES, isLocale } from '@/lib/i18n'
import { ThemeProvider } from '@/components/ThemeProvider'
import '../globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['700', '900'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
  weight: ['400', '500'],
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
  weight: ['400', '500'],
})

const reenieBeanie = Reenie_Beanie({
  subsets: ['latin'],
  variable: '--font-reenie',
  display: 'swap',
  weight: '400',
})

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = params
  if (!isLocale(locale)) notFound()

  return (
    <div className={`${inter.variable} ${playfair.variable} ${lora.variable} ${jetbrains.variable} ${reenieBeanie.variable}`}>
      <ThemeProvider>
        {/* Global paper noise texture — fixed overlay, applies on all pages & screen sizes */}
        <svg
          aria-hidden
          className="pointer-events-none fixed inset-0 w-full h-full z-[999]"
          style={{ opacity: 0.04 }}
        >
          <filter id="global-paper-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#global-paper-noise)" />
        </svg>
        {children}
      </ThemeProvider>
    </div>
  )
}
