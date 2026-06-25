import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Draggable, ScrollTrigger)

// Freeze all animations for users who prefer reduced motion (browser-only)
if (typeof window !== 'undefined') {
  gsap.matchMedia().add('(prefers-reduced-motion: reduce)', () => {
    gsap.globalTimeline.timeScale(0)
  })
}

export { gsap, Draggable, ScrollTrigger }
