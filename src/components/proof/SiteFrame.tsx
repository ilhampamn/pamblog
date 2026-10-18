import Link from 'next/link'
import type { ReactNode } from 'react'
import { SiteShell, type RailFolder } from './SiteShell'
import { BlockButton } from './BlockButton'
import { getPostsByLocale, type Post } from '@/lib/posts.sanity'
import { LANGUAGES, t, type Locale } from '@/lib/i18n'
import { fmt } from './content'

/**
 * The frame every rebuilt page sits in (DESIGN.md → Components): the sticky
 * top bar (menu, logo, Subscribe), the two-rail sidebar with the Stories
 * folder tree, and the footer. Server component: it fetches the posts that
 * fill the tree, so the directory grows as Ilham publishes.
 *
 * `path` is the current page's path without the locale (e.g. "/blog/x"), so
 * the language links in the rail point at the same page in each language.
 */

/** Seasons with chapters (in chapter order), then Essays. Empty folders don't appear. */
function buildFolders(posts: Post[], base: string, labels: { season: string; essays: string }): RailFolder[] {
  const seasons = new Map<number, { n: number; title: string; href: string }[]>()
  for (const p of posts.filter((x) => x.tag === 'stories')) {
    const num = p.storyChapter?.season?.seasonNumber ?? 1
    const list = seasons.get(num) ?? []
    list.push({ n: p.storyChapter?.chapterNumber ?? list.length + 1, title: p.title, href: `${base}/blog/${p.slug}` })
    seasons.set(num, list)
  }
  const folders: RailFolder[] = Array.from(seasons.entries())
    .sort(([a], [b]) => a - b)
    .map(([num, items]) => ({
      key: `season-${num}`,
      label: fmt(labels.season, { n: num }),
      items: items.sort((x, y) => x.n - y.n).map(({ title, href }) => ({ title, href })),
    }))
  const essays = posts.filter((x) => x.tag === 'essay')
  if (essays.length) {
    folders.push({
      key: 'essays',
      label: labels.essays,
      items: essays.map((p) => ({ title: p.title, href: `${base}/blog/${p.slug}` })),
    })
  }
  return folders
}

export async function SiteFrame({
  locale,
  current,
  path = '',
  children,
}: {
  locale: Locale
  current: 'home' | 'stories' | 'explore' | 'gallery' | 'about'
  path?: string
  children: ReactNode
}) {
  const ui = t(locale).proof
  const base = `/${locale}`
  const posts = await getPostsByLocale(locale).catch(() => [] as Post[])

  return (
    <SiteShell
      base={base}
      current={current}
      labels={ui}
      folders={buildFolders(posts, base, ui)}
      brand={
        // The logo, used as-is (DESIGN.md → Layers: printed).
        <Link href={base} className="tp-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/travel-pam-logo-480.webp"
            srcSet="/brand/travel-pam-logo-480.webp 1x, /brand/travel-pam-logo-960.webp 2x"
            width={480}
            height={231}
            alt="Travel Pam"
          />
        </Link>
      }
      actions={
        <BlockButton id="topbar:subscribe" href={`${base}/newsletter`} small>
          {ui.subscribe}
        </BlockButton>
      }
      footer={
        <nav aria-label={ui.languages} className="tp-langs">
          {LANGUAGES.map((l) => (
            <Link
              key={l.id}
              href={`/${l.id}${path}`}
              hrefLang={l.id}
              aria-current={l.id === locale ? 'true' : undefined}
              className="tp-quiet"
            >
              {l.title}
            </Link>
          ))}
        </nav>
      }
    >
      {children}
      <SiteFooter locale={locale} />
    </SiteShell>
  )
}

/** The footer: typeset links, the Lange line, the name. One soft rule above. */
function SiteFooter({ locale }: { locale: Locale }) {
  const ui = t(locale).proof
  const base = `/${locale}`
  return (
    <footer className="tp-footer">
      <nav className="tp-footer__links" aria-label="Footer">
        <Link href={`${base}/blog`} className="tp-quiet">
          {ui.stories}
        </Link>
        <Link href={`${base}/about`} className="tp-quiet">
          {ui.about}
        </Link>
        <Link href={`${base}/uses`} className="tp-quiet">
          {ui.uses}
        </Link>
        <Link href={`${base}/newsletter`} className="tp-quiet">
          {ui.newsletter}
        </Link>
        <a href="/rss.xml" className="tp-quiet">
          RSS
        </a>
      </nav>
      <p className="tp-footer__quote">
        &ldquo;The camera is an instrument that teaches people how to see without a camera.&rdquo;
        <span className="tp-label"> — Dorothea Lange</span>
      </p>
      <p className="tp-label">© {new Date().getFullYear()} Travel Pam · Ilham Pamungkas</p>
    </footer>
  )
}
