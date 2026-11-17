import type { MinimapToggleProps } from './types'

/**
 * Show/hide button for the collapsible minimap (mobile only).
 * 44×44 px touch target; stays in the top-left dock, so it remains
 * reachable whether the minimap is open or hidden.
 */
export function MinimapToggle({ open, onToggle }: MinimapToggleProps) {
  return (
    <button
      type="button"
      className="gr-minimap-toggle"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls="gr-minimap"
      aria-label={open ? 'Hide minimap' : 'Show minimap'}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
