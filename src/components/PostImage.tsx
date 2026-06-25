import Image from 'next/image'

interface PostImageProps {
  src: string
  alt: string
  caption?: string
  priority?: boolean
}

export function PostImage({ src, alt, caption, priority = false }: PostImageProps) {
  return (
    <figure className="my-10">
      <div
        className="overflow-hidden"
        style={{ borderRadius: 'var(--radius-card)' }}
      >
        <Image
          src={src}
          alt={alt}
          width={660}
          height={440}
          className="w-full h-auto object-cover"
          priority={priority}
          style={{ display: 'block' }}
        />
      </div>
      {caption && (
        <figcaption
          className="mt-3 text-sm text-center italic"
          style={{ fontFamily: 'var(--font-body)', color: 'var(--color-smudge)' }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
