'use client'
import { useState } from 'react'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'

interface ImageUploaderProps {
  endpoint: keyof OurFileRouter
  onUpload: (url: string) => void
  label?: string
}

export function ImageUploader({ endpoint, onUpload, label = 'Upload image' }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="space-y-3">
      <p className="label-stamped" style={{ color: 'var(--color-smudge)' }}>{label}</p>

      <UploadButton<OurFileRouter, typeof endpoint>
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          const url = res[0].url
          setPreview(url)
          setError(null)
          onUpload(url)
        }}
        onUploadError={(err) => setError(err.message)}
        appearance={{
          button:
            'label-stamped px-4 py-2 transition-opacity hover:opacity-80',
          allowedContent: 'label-stamped mt-1',
        }}
        content={{
          button: 'Upload',
          allowedContent: 'Image up to 4MB',
        }}
      />

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
