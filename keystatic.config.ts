import { config, collection, fields } from '@keystatic/core'

export default config({
  storage:
    process.env.KEYSTATIC_GITHUB_CLIENT_ID
      ? { kind: 'github', repo: 'ilhampamn/pamblog' }
      : { kind: 'local' },

  collections: {
    postsEn: collection({
      label: 'Posts — English',
      slugField: 'title',
      path: 'content/posts/en/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        publishedAt: fields.date({ label: 'Published date' }),
        tag: fields.select({
          label: 'Tag',
          options: [
            { label: 'Essay', value: 'essay' },
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Note', value: 'note' },
            { label: 'Review', value: 'review' },
          ],
          defaultValue: 'essay',
        }),
        coverImage: fields.image({
          label: 'Cover image',
          directory: 'public/images/posts',
          publicPath: '/images/posts',
        }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        content: fields.mdx({ label: 'Content' }),
      },
    }),

    postsId: collection({
      label: 'Posts — Indonesian',
      slugField: 'title',
      path: 'content/posts/id/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Judul' } }),
        publishedAt: fields.date({ label: 'Tanggal terbit' }),
        tag: fields.select({
          label: 'Tag',
          options: [
            { label: 'Essay', value: 'essay' },
            { label: 'Tutorial', value: 'tutorial' },
            { label: 'Catatan', value: 'catatan' },
            { label: 'Ulasan', value: 'review' },
          ],
          defaultValue: 'essay',
        }),
        coverImage: fields.image({
          label: 'Gambar sampul',
          directory: 'public/images/posts',
          publicPath: '/images/posts',
        }),
        excerpt: fields.text({ label: 'Kutipan', multiline: true }),
        content: fields.mdx({ label: 'Konten' }),
      },
    }),
  },
})
