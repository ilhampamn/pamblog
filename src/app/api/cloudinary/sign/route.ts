import { createHash } from 'node:crypto'
import { NextResponse } from 'next/server'

const SAFE_FOLDER = /^[a-zA-Z0-9/_-]{1,120}$/
const SAFE_TAG = /^[a-zA-Z0-9 _-]{1,80}$/

type SignRequest = {
  folder?: unknown
  tags?: unknown
}

function requiredEnv(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignRequest
    const folder =
      typeof body.folder === 'string' && SAFE_FOLDER.test(body.folder)
        ? body.folder
        : 'bookpamn'
    const tags = Array.isArray(body.tags)
      ? body.tags
          .filter((tag): tag is string => typeof tag === 'string' && SAFE_TAG.test(tag))
          .slice(0, 20)
          .sort()
      : []

    const timestamp = Math.floor(Date.now() / 1000)
    const assetFolder = folder.replace(/^\/+|\/+$/g, '')
    const parameters: Record<string, string | number> = {
      asset_folder: assetFolder,
      timestamp,
    }

    if (tags.length) parameters.tags = tags.join(',')

    const stringToSign = Object.entries(parameters)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, value]) => `${key}=${value}`)
      .join('&')

    const signature = createHash('sha1')
      .update(`${stringToSign}${requiredEnv('CLOUDINARY_API_SECRET')}`)
      .digest('hex')

    return NextResponse.json({
      signature,
      timestamp,
      cloudName: requiredEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
      apiKey: requiredEnv('CLOUDINARY_API_KEY'),
      assetFolder,
      tags,
    })
  } catch (error) {
    console.error('[cloudinary] Could not sign upload', error)
    return NextResponse.json({ error: 'Cloudinary is not configured' }, { status: 500 })
  }
}
