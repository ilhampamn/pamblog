import 'server-only'

export interface CloudinaryAsset {
  assetId: string
  publicId: string
  url: string
  width: number
  height: number
  alt: string
  caption?: string
}

interface CloudinaryResource {
  asset_id: string
  public_id: string
  secure_url: string
  width: number
  height: number
  context?: {
    custom?: {
      alt?: string
      caption?: string
    }
  }
}

interface CloudinaryResourcesResponse {
  resources?: CloudinaryResource[]
  error?: { message?: string }
}

function getCloudinaryCredentials() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) return null
  return { cloudName, apiKey, apiSecret }
}

function titleFromPublicId(publicId: string) {
  const filename = publicId.split('/').at(-1) ?? publicId
  return filename.replace(/[-_]+/g, ' ').trim()
}

function optimizedDeliveryUrl(url: string) {
  return url.replace('/image/upload/', '/image/upload/f_auto,q_auto/')
}

export async function getCloudinaryImagesByTag(
  tag: string,
): Promise<CloudinaryAsset[]> {
  const credentials = getCloudinaryCredentials()
  if (!credentials) {
    console.warn('[cloudinary] Gallery credentials are not configured')
    return []
  }

  const endpoint = new URL(
    `https://api.cloudinary.com/v1_1/${credentials.cloudName}/resources/image/tags/${encodeURIComponent(tag)}`,
  )
  endpoint.searchParams.set('max_results', '100')
  endpoint.searchParams.set('context', 'true')

  try {
    const authorization = Buffer.from(
      `${credentials.apiKey}:${credentials.apiSecret}`,
    ).toString('base64')
    const response = await fetch(endpoint, {
      headers: { Authorization: `Basic ${authorization}` },
      next: { revalidate: 300 },
    })
    const data = (await response.json()) as CloudinaryResourcesResponse

    if (!response.ok) {
      throw new Error(data.error?.message || `Cloudinary returned ${response.status}`)
    }

    return (data.resources ?? []).map((asset) => {
      const fallbackTitle = titleFromPublicId(asset.public_id)
      return {
        assetId: asset.asset_id,
        publicId: asset.public_id,
        // f_auto converts sources such as HEIC into a format supported by the
        // requesting browser; q_auto reduces delivery size without changing
        // the original asset stored in Cloudinary.
        url: optimizedDeliveryUrl(asset.secure_url),
        width: asset.width,
        height: asset.height,
        alt: asset.context?.custom?.alt || asset.context?.custom?.caption || fallbackTitle,
        caption: asset.context?.custom?.caption,
      }
    })
  } catch (error) {
    console.error('[cloudinary] Could not load gallery assets', error)
    return []
  }
}
