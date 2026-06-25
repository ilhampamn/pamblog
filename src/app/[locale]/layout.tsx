import { notFound } from 'next/navigation'
import { Inter, Playfair_Display, Lora, JetBrains_Mono } from 'next/font/google'
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
    <html
      lang={locale}
      className={`${inter.variable} ${playfair.variable} ${lora.variable} ${jetbrains.variable}`}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
