import { gsap } from 'gsap'
import { Draggable } from 'gsap/Draggable'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(Draggable, ScrollTrigger)

// True when the user has asked the OS to minimise motion. Components should
// honour this by jumping elements to their FINAL state rather than animating.
// NOTE: we must never freeze the global timeline (timeScale 0) — that traps
// fade-in animations at opacity:0 and leaves the page blank.
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, Draggable, ScrollTrigger }
