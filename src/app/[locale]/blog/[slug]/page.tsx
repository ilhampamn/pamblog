import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { ProgressBar } from '@/components/ProgressBar'
import { PostBody } from '@/components/PostBody'
import { NewsletterWidget } from '@/components/NewsletterWidget'
import { getPostBySlug, getPostsByLocale } from '@/lib/posts'
import { t, type Locale } from '@/lib/i18n'
import { formatDate } from '@/lib/date'

const LOCALES = ['en', 'id'] as const

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getPostsByLocale(locale).map((post) => ({ locale, slug: post.slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string }
}): Promise<Metadata> {
  const post = getPostBySlug(params.locale as Locale, params.slug)
  if (!post) return {}

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ilhampamungkas.com'
  const ogUrl = `${BASE_URL}/og?title=${encodeURIComponent(post.title)}&tag=${encodeURIComponent(post.tag)}&rt=${post.readingTime}`

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogUrl],
    },
  }
}

// Placeholder prose — replaced when Velite + MDX is wired
function DummyPostContent({ locale }: { locale: Locale }) {
  if (locale === 'id') {
    return (
      <>
        <p>
          Foto pertama yang pernah saya ambil dan benar-benar saya banggakan ternyata overexposed.
          Subjeknya — sebuah jendela, sore hari, cahaya yang mengubah debu menjadi emas —
          hampir seluruhnya blown out. Tidak ada detail di langit.
        </p>
        <p>
          Guru fotografi saya waktu itu melingkarinya dengan pulpen merah dan menulis:{' '}
          <em>terlalu banyak.</em> Secara teknis, beliau benar. Tapi saya terus memandanginya.
        </p>
        <h2>Eksposur adalah sebuah keputusan</h2>
        <p>
          Inilah yang kini saya percayai: fotografi bukan teknologi perekam. Ini adalah teknologi
          penyunting. Kamera tidak menunjukkan apa yang ada — ia menunjukkan apa yang Anda putuskan
          untuk dibiarkan masuk.
        </p>
        <blockquote>
          Memotret adalah mengambil alih objek yang dipotret. — Susan Sontag
        </blockquote>
        <h2>Apa yang sebenarnya saya pelajari</h2>
        <p>
          Pelajaran praktis itu butuh bertahun-tahun untuk menjadi berguna: belajarlah membaca
          cahaya sebelum mengangkat kamera. Sebelum mengambil foto sekarang, saya meluangkan waktu
          sejenak untuk hanya melihat.
        </p>
        <p>
          Kamera naik terakhir. Melihat terjadi lebih dulu. Saya pikir ini juga berlaku untuk
          menulis. Dan untuk sebagian besar hal yang layak dilakukan.
        </p>
      </>
    )
  }

  return (
    <>
      <p>
        The first photograph I ever took that I was genuinely proud of was overexposed. The
        subject — a window, late afternoon, the kind of light that turns dust into gold — was
        almost entirely blown out. There was no detail in the sky.
      </p>
      <p>
        My photography teacher at the time circled it in red pen and wrote: <em>too much.</em>{' '}
        He was technically right. But I kept looking at it.
      </p>
      <h2>Exposure is a decision</h2>
      <p>
        Here is what I have come to believe: photography is not a recording technology. It is an
        editing technology. The camera does not show you what is there — it shows you what you
        decided to let in.
      </p>
      <p>
        Every time you raise a camera, you are making a series of small choices that the viewer
        will never see: what to include in the frame, how much light to allow, what to hold in
        focus, and when, exactly, to press the shutter. None of these are neutral decisions.
        They are all acts of interpretation.
      </p>
      <h2>Shadow is not the absence of light</h2>
      <p>
        I spent my first two years as a photographer trying to eliminate shadow. I wanted clean,
        evenly lit images. The photographs were accurate. They were also lifeless.
      </p>
      <blockquote>
        To photograph is to appropriate the thing photographed. — Susan Sontag
      </blockquote>
      <p>
        Shadow is not the absence of light. It is the presence of depth. It is what tells your
        eye that something exists in three dimensions, that there is a side of this object you
        cannot see, that the world continues past the edge of the frame.
      </p>
      <h2>What I actually learned</h2>
      <p>
        The practical lesson took years to become useful: learn to read light before you raise the
        camera. Before I take a photograph now, I spend a moment just looking. Where is the light
        coming from? What is it hitting first? What is it skipping?
      </p>
      <p>
        The camera comes up last. The seeing happens first. This is, I think, also true of
        writing. And of most things worth doing.
      </p>
    </>
  )
}

export default function PostPage({
  params,
}: {
  params: { locale: string; slug: string }
}) {
  const locale = params.locale as Locale
  if (!LOCALES.includes(locale as Locale)) notFound()

  const post = getPostBySlug(locale, params.slug)
  if (!post) notFound()

  const ui = t(locale)
  const allPosts = getPostsByLocale(locale)

  // Related posts: same tag, exclude current
  const related = allPosts
    .filter((p) => p.tag === post.tag && p.slug !== post.slug)
    .slice(0, 3)

  const isLongPost = post.readingTime > 8 // placeholder for word-count gate

  return (
    <>
      <ProgressBar />
      <Nav locale={locale} ui={ui.nav} />

      <main
        className="pt-32 pb-0"
        style={{ backgroundColor: 'var(--color-paper)' }}
      >
        {/* ── Post header ── */}
        <header className="px-8 mb-16">
          <div className="max-w-[var(--prose-width)] mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href={`/${locale}/blog/tag/${post.tag}`}
                className="label-stamped hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-blush)' }}
              >
                {post.tag}
              </Link>
              <span style={{ color: 'var(--color-torn)' }} aria-hidden="true">·</span>
              <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                {formatDate(post.publishedAt, locale)}
              </span>
              <span style={{ color: 'var(--color-torn)' }} aria-hidden="true">·</span>
              <span className="label-stamped" style={{ color: 'var(--color-smudge)' }}>
                {post.readingTime} {ui.post.readingTime}
              </span>
            </div>

            <h1
              className="text-4xl md:text-5xl font-black leading-tight text-balance"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--color-ink)' }}
            >
              {post.title}
            </h1>

            {post.excerpt && (
              <p
                className="mt-4 text-lg"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
              >
                {post.excerpt}
              </p>
            )}

            {/* Divider */}
            <div
              className="mt-10 h-px"
              style={{ backgroundColor: 'var(--color-torn)' }}
            />
          </div>
        </header>

        <div className="relative px-8">
          {/* Optional sticky ToC placeholder (visible ≥ 1280px on long posts) */}
          {isLongPost && (
            <aside
              className="hidden xl:block absolute left-8 top-0 w-48"
              style={{ color: 'var(--color-smudge)' }}
            >
              <p className="label-stamped mb-3">Contents</p>
              <nav className="space-y-2">
                <a
                  href="#exposure-is-a-decision"
                  className="block text-sm hover:text-[var(--color-ink)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Exposure is a decision
                </a>
                <a
                  href="#shadow-is-not-the-absence-of-light"
                  className="block text-sm hover:text-[var(--color-ink)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  Shadow &amp; light
                </a>
                <a
                  href="#what-i-actually-learned"
                  className="block text-sm hover:text-[var(--color-ink)] transition-colors"
                  style={{ fontFamily: 'var(--font-ui)' }}
                >
                  What I learned
                </a>
              </nav>
            </aside>
          )}

          {/* ── Post body ── */}
          <PostBody>
            {/* CTA 1: after intro — compact newsletter */}
            <div
              className="my-10 py-6 border-y"
              style={{ borderColor: 'var(--color-torn)' }}
            >
              <NewsletterWidget
                cta={ui.newsletter.cta}
                placeholder={ui.newsletter.placeholder}
                button={ui.newsletter.button}
                variant="inline"
              />
            </div>

            <DummyPostContent locale={locale} />

            {/* CTA 3: end of post — full newsletter card */}
            <div className="mt-16">
              <NewsletterWidget
                cta={ui.newsletter.cta}
                placeholder={ui.newsletter.placeholder}
                button={ui.newsletter.button}
                variant="card"
              />
            </div>
          </PostBody>
        </div>

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <section className="px-8 mt-24 pt-12 border-t" style={{ borderColor: 'var(--color-torn)' }}>
            <div className="max-w-[var(--prose-width)] mx-auto">
              <p className="label-stamped mb-8">{ui.post.relatedPosts}</p>
              <ul className="space-y-6">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/${locale}/blog/${p.slug}`}
                      className="group flex items-baseline gap-4"
                    >
                      <span className="label-stamped shrink-0" style={{ color: 'var(--color-smudge)' }}>
                        {p.tag}
                      </span>
                      <span
                        className="font-bold group-hover:underline"
                        style={{
                          fontFamily: 'var(--font-display)',
                          color: 'var(--color-ink)',
                          textDecorationColor: 'var(--color-torn)',
                        }}
                      >
                        {p.title}
                      </span>
                      <span className="label-stamped ml-auto shrink-0" style={{ color: 'var(--color-smudge)' }}>
                        {p.readingTime} {ui.post.readingTime}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Back to all posts */}
              <div className="mt-12">
                <Link
                  href={`/${locale}/blog`}
                  className="label-stamped hover:text-[var(--color-ink)] transition-colors"
                  style={{ color: 'var(--color-smudge)' }}
                >
                  ← {locale === 'id' ? 'Semua tulisan' : 'All posts'}
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer locale={locale} />
    </>
  )
}
