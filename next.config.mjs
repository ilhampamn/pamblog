/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'utfs.io' },         // Uploadthing CDN
      { protocol: 'https', hostname: 'uploadthing.com' },
    ],
  },
}

export default nextConfig
