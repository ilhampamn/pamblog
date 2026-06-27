import { getPostsByLocale } from '@/lib/posts'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://ilhampamungkas.com'

function escapeXml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const [enPosts, idPosts] = await Promise.all([
    getPostsByLocale('en'),
    getPostsByLocale('id'),
  ])
  const allPosts = [...enPosts, ...idPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const items = allPosts
    .map(
      (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${BASE_URL}/${post.locale}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/${post.locale}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      ${post.excerpt ? `<description>${escapeXml(post.excerpt)}</description>` : ''}
      <category>${escapeXml(post.tag)}</category>
      <language>${post.locale}</language>
    </item>`
    )
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ilham Pamungkas</title>
    <link>${BASE_URL}</link>
    <description>Writing about photography, building things, and the space between.</description>
    <language>en-US</language>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
