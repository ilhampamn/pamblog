import { createUploadthing, type FileRouter } from 'uploadthing/next'

const f = createUploadthing()

export const ourFileRouter = {
  // Blog post cover images
  postImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
    .middleware(() => ({}))
    .onUploadComplete(({ file }) => {
      console.log('Post image uploaded:', file.url)
      return { url: file.url }
    }),

  // /uses page item images
  usesImage: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(() => ({}))
    .onUploadComplete(({ file }) => {
      return { url: file.url }
    }),

  // Inline post images (photography-heavy posts)
  inlineImage: f({ image: { maxFileSize: '8MB', maxFileCount: 10 } })
    .middleware(() => ({}))
    .onUploadComplete(({ file }) => {
      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
