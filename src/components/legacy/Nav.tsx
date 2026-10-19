import { Ex2Nav, type Ex2NavItem } from '@/components/experiment2/Ex2Nav'
import type { Locale } from '@/lib/i18n'

interface NavProps {
  locale: Locale
  ui: {
    blog: string
    explore: string
    gallery: string
    about: string
    uses: string
  }
}

/**
 * Shared site navigation.
 *
 * The route-aware interaction stays inside Ex2Nav's small client boundary;
 * this wrapper only prepares localized, serializable link data on the server.
 */
export function Nav({ locale, ui }: NavProps) {
  const items: Ex2NavItem[] = [
    {
      href: '',
      label: locale === 'id' ? 'Beranda' : locale === 'zh' ? '首页' : 'Home',
      icon: 'home',
    },
    { href: '/blog', label: ui.blog, icon: 'write' },
    {
      href: '/about',
      label: locale === 'id' ? 'Tentang saya' : locale === 'zh' ? '关于我' : 'About me',
      icon: 'smiley',
    },
    { href: '/gallery', label: ui.gallery, icon: 'book' },
  ]

  return <Ex2Nav locale={locale} items={items} />
}
