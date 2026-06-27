import { notFound } from 'next/navigation'
import { Inter, Playfair_Display, Lora, JetBrains_Mono, Reenie_Beanie } from 'next/font/google'
import type { Locale } from '@/lib/i18n'
import { ThemeProvider } from '@/components/ThemeProvider'
import '../globals.css'

const LOCALES = ['en', 'id'] as const

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
  if (!LOCALES.includes(locale as Locale)) notFound()

  return (
    <div className={`${inter.variable} ${playfair.variable} ${lora.variable} ${jetbrains.variable} ${reenieBeanie.variable}`}>
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  )
}
