'use client'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  function toggle() {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggle}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="label-stamped transition-colors hover:text-[var(--color-ink)]"
      style={{ color: 'var(--color-smudge)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      {resolvedTheme === 'dark' ? '○' : '●'}
    </button>
  )
}
