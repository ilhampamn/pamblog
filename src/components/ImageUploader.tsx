'use client'
import { useRef, useState, type ChangeEvent } from 'react'

interface ImageUploaderProps {
  folder?: string
  tags?: string[]
  onUpload: (url: string) => void
  label?: string
  maxSizeMb?: number
}

type CloudinaryUpload = {
  secure_url: string
  public_id: string
  asset_id: string
}

type UploadSignature = {
  signature: string
  timestamp: number
  cloudName: string
  apiKey: string
  assetFolder: string
  tags: string[]
  error?: string
}

export function ImageUploader({
  folder = 'bookpamn',
  tags = [],
  onUpload,
  label = 'Upload image',
  maxSizeMb = 8,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`Image must be smaller than ${maxSizeMb}MB.`)
      return
    }

    setUploading(true)
    try {
      const signatureResponse = await fetch('/api/cloudinary/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, tags }),
      })
      const signed = (await signatureResponse.json()) as UploadSignature
      if (!signatureResponse.ok) throw new Error(signed.error || 'Could not prepare upload')

      const form = new FormData()
      form.append('file', file)
      form.append('api_key', signed.apiKey)
      form.append('timestamp', String(signed.timestamp))
      form.append('signature', signed.signature)
      form.append('asset_folder', signed.assetFolder)
      if (signed.tags.length) form.append('tags', signed.tags.join(','))

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
        { method: 'POST', body: form },
      )
      const uploaded = (await uploadResponse.json()) as CloudinaryUpload & { error?: { message: string } }
      if (!uploadResponse.ok) throw new Error(uploaded.error?.message || 'Upload failed')

      setPreview(uploaded.secure_url)
      onUpload(uploaded.secure_url)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <p className="label-stamped" style={{ color: 'var(--color-smudge)' }}>{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={uploadImage}
        disabled={uploading}
      />
      <button
        type="button"
        className="label-stamped px-4 py-2 transition-opacity hover:opacity-80 disabled:opacity-50"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
      <p className="label-stamped mt-1">Image up to {maxSizeMb}MB</p>

      {error && (
        <p className="label-stamped" style={{ color: 'var(--color-blush)' }}>
          {error}
        </p>
      )}

      {preview && (
        <div
          className="overflow-hidden mt-2"
          style={{ borderRadius: 'var(--radius-card)', maxWidth: 200 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Upload preview" className="w-full h-auto object-cover" />
        </div>
      )}
    </div>
  )
}
