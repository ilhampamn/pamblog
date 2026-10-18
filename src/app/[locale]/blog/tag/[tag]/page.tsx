import { notFound, redirect } from 'next/navigation'
import { isLocale } from '@/lib/i18n'

/**
 * Old tag pages: the Stories index filters by tag now (?tag=…), so keep
 * these links working by sending them there.
 */
export default function TagPage({ params }: { params: { locale: string; tag: string } }) {
  if (!isLocale(params.locale)) notFound()
  redirect(`/${params.locale}/blog?tag=${encodeURIComponent(decodeURIComponent(params.tag))}`)
}
