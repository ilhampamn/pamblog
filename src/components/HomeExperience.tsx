'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Canvas, type CanvasProps } from './Canvas'
import { HomeList } from './HomeList'

type MobileView = 'canvas' | 'list'

export function HomeExperience(props: CanvasProps) {
  const [mobileView, setMobileView] = useState<MobileView>('list')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = window.localStorage.getItem('bookpamn-home-view')
    if (saved === 'canvas' || saved === 'list') setMobileView(saved)
  }, [])

  function selectView(view: MobileView) {
    setMobileView(view)
    window.localStorage.setItem('bookpamn-home-view', view)

    if (view === 'canvas') {
      // The canvas may have mounted while display:none in List mode. Trigger
      // its existing resize handler after it becomes visible so it recentres.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
      })
    }
  }

  return (
    <>
      {mounted &&
        createPortal(
          <span className="fixed bottom-5 left-1/2 z-[70] -translate-x-1/2 md:hidden">
            <div
              className="flex rounded-full border p-1"
              style={{
                borderColor: 'var(--color-torn)',
                backgroundColor: 'var(--color-paper)',
                boxShadow: '0 2px 8px rgba(28, 25, 23, 0.08)',
              }}
              role="group"
              aria-label="Home page view"
            >
              {(['canvas', 'list'] as const).map((view) => {
                const active = mobileView === view
                return (
                  <button
                    key={view}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectView(view)}
                    className="rounded-full px-3 py-1.5 text-[11px] uppercase tracking-[0.1em] transition-colors"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      backgroundColor: active ? 'var(--color-ink)' : 'transparent',
                      color: active ? 'var(--color-paper)' : 'var(--color-smudge)',
                    }}
                  >
                    {view}
                  </button>
                )
              })}
            </div>
          </span>,
          document.body,
        )}

      <div className={mobileView === 'canvas' ? 'block' : 'hidden md:block'}>
        <Canvas {...props} allowMobileInteraction />
      </div>

      <div className={mobileView === 'list' ? 'block md:hidden' : 'hidden'}>
        <HomeList {...props} />
      </div>
    </>
  )
}
