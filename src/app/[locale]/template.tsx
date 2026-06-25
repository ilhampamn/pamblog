'use client'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { useRef } from 'react'

export default function Template({ children }: { children: React.ReactNode }) {
  const pageRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Reduced motion: leave the page in its final (visible) state, no fade.
    if (prefersReducedMotion()) {
      gsap.set(pageRef.current, { opacity: 1, filter: 'none', y: 0 })
      return
    }
    gsap.fromTo(
      pageRef.current,
      { opacity: 0, filter: 'blur(4px)', y: 8 },
      {
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        duration: 0.45,
        ease: 'power2.out',
        clearProps: 'filter',
      }
    )
  })

  return <div ref={pageRef}>{children}</div>
}
