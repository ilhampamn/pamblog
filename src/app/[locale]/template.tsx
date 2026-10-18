/**
 * Route template. Pages arrive still: no fade, blur or rise on load or route
 * change — a fresh sheet shows itself through its marks being written
 * (design/specs/motion.md → "Still"; decisions 2026-10-18). The old GSAP page
 * fade lived here.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
