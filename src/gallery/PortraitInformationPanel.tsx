import { useEffect, useRef } from 'react'
import type { PortraitInformationPanelProps } from './types'

/**
 * Portrait detail panel. Desktop: side panel. Mobile: bottom sheet.
 * Rendered outside the Canvas as regular HTML.
 */
export function PortraitInformationPanel({
  portrait,
  index,
  total,
  onClose,
}: PortraitInformationPanelProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (portrait) closeRef.current?.focus()
  }, [portrait])

  useEffect(() => {
    if (!portrait) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [portrait, onClose])

  if (!portrait) return null

  return (
    <>
      <div className="gr-scrim" onClick={onClose} aria-hidden="true" />
      <aside
        className="gr-panel"
        role="dialog"
        aria-label={`Portrait information: ${portrait.name}`}
      >
        <header className="gr-panel-head">
          <div className="gr-panel-title">
            <h2 className="gr-name">{portrait.name}</h2>
            <p className="gr-years">{portrait.years}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="gr-close"
            onClick={onClose}
            aria-label="Close information panel"
          >
            ×
          </button>
        </header>

        <div className="gr-panel-body">
          <div className="gr-meta">
            <span className="gr-meta-label">Position</span>
            <span className="gr-meta-value">{portrait.position}</span>
          </div>
          {portrait.description && <p className="gr-desc">{portrait.description}</p>}
          <div className="gr-index">
            Portrait {index + 1} of {total}
          </div>
        </div>

        <footer className="gr-panel-foot">
          <button type="button" className="gr-continue" onClick={onClose}>
            Continue exploring
          </button>
        </footer>
      </aside>
    </>
  )
}
