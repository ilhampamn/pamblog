'use client'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import 'gsap/ScrollTrigger'

export function PostBody({ children }: { children: React.ReactNode }) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>(
      'p, h2, h3, blockquote, pre, figure',
      bodyRef.current
    )
    // Reduced motion: keep the article fully visible, skip scroll reveals.
    if (prefersReducedMotion()) {
      gsap.set(els, { opacity: 1, y: 0 })
      return
    }
    els.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        }
      )
    })
  }, { scope: bodyRef })

  return (
    <div
      ref={bodyRef}
      className="prose-body mx-auto"
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: 'var(--text-body)',
        lineHeight: 'var(--leading-body)',
        color: 'var(--color-ink)',
        maxWidth: 'var(--prose-width)',
      }}
    >
      {children}
    </div>
  )
}
