import { createUploadthing, type FileRouter } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  // Blog post cover images
  postImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => {
      console.log('[uploadthing] postImage upload started')
      return {}
    })
    .onUploadComplete(({ file }) => {
      console.log('[uploadthing] postImage complete:', file.url)
      return { url: file.url }
    }),

  usesImage: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(() => {
      console.log('[uploadthing] usesImage upload started')
      return {}
    })
    .onUploadComplete(({ file }) => {
      console.log('[uploadthing] usesImage complete:', file.url)
      return { url: file.url }
    }),

  inlineImage: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
    .middleware(() => {
      console.log('[uploadthing] inlineImage upload started')
      return {}
    })
    .onUploadComplete(({ file }) => {
      console.log('[uploadthing] inlineImage complete:', file.url)
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
