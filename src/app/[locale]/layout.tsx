import { notFound } from 'next/navigation'
import {
  Newsreader,
  Nanum_Pen_Script,
  Inter,
  Playfair_Display,
  Lora,
  JetBrains_Mono,
  Reenie_Beanie,
  Caveat,
} from 'next/font/google'
import { LOCALES, isLocale } from '@/lib/i18n'
import { ThemeProvider } from '@/components/ThemeProvider'
import '../globals.css'

/* The read-back proof (DESIGN.md → Type): one serif for everything typeset,
   one hand for pen notes. The fonts below them serve pages not yet rebuilt. */
const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-newsreader',
  display: 'swap',
})

const nanumPen = Nanum_Pen_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-nanum-pen',
  display: 'swap',
})

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

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  weight: ['500', '600', '700'],
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
    <div
      lang={locale}
      className={`tp-root ${newsreader.variable} ${nanumPen.variable} ${inter.variable} ${playfair.variable} ${lora.variable} ${jetbrains.variable} ${reenieBeanie.variable} ${caveat.variable}`}
    >
      {/* No generated noise overlay: the paper's tooth is a real scan, under
          content, never over photographs (DESIGN.md → Layers). */}
      <ThemeProvider>{children}</ThemeProvider>
    </div>
  )
}
