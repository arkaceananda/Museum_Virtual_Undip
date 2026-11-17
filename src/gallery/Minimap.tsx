import { useEffect, useMemo, useRef } from 'react'
import type { MinimapProps } from './types'
import { CORRIDOR, FIRST_Z, PER_SIDE, SPACING, START_Z } from './layout'
import { PORTRAITS } from './data/portraits'

/**
 * 2D top-down minimap of the corridor (plain React + SVG, no WebGL).
 *
 * The corridor is drawn as a vertical floor plan: gallery end at the top,
 * entrance at the bottom. A marker shows the player's position and yaw —
 * both read every animation frame from the SAME `playerRef` the 3D scene
 * writes to, so there is no second movement state to drift out of sync.
 * Updates are applied straight to the DOM (no React re-renders).
 *
 * The layout is derived from the corridor constants, so it stays correct
 * when the portrait data grows or shrinks the gallery.
 */

const MAP_W = 96
const MAP_H = 176
const PAD = 10
const INNER_W = MAP_W - PAD * 2
const INNER_H = MAP_H - PAD * 2

/** World X → map X (left wall on the left, right wall on the right). */
function mapX(x: number): number {
  return PAD + ((x + CORRIDOR.halfWidth) / (CORRIDOR.halfWidth * 2)) * INNER_W
}

/** World Z → map Y (gallery end at the top, entrance at the bottom). */
function mapY(z: number): number {
  return PAD + ((z - CORRIDOR.zBack) / (CORRIDOR.zFront - CORRIDOR.zBack)) * INNER_H
}

interface Tick {
  key: string
  x1: number
  x2: number
  y: number
}

export function Minimap({ playerRef }: MinimapProps) {
  const markerRef = useRef<SVGGElement>(null)

  // Static geometry, computed once: portrait ticks along both walls.
  const ticks = useMemo<Tick[]>(() => {
    const list: Tick[] = []
    const inset = 7
    const leftWall = mapX(-CORRIDOR.halfWidth)
    const rightWall = mapX(CORRIDOR.halfWidth)
    const slotZ = (index: number) => FIRST_Z - index * SPACING
    const rightCount = PORTRAITS.length - PER_SIDE

    for (let i = 0; i < PER_SIDE; i++) {
      list.push({ key: `l${i}`, x1: leftWall + 2, x2: leftWall + 2 + inset, y: mapY(slotZ(i)) })
    }
    for (let i = 0; i < rightCount; i++) {
      list.push({ key: `r${i}`, x1: rightWall - 2, x2: rightWall - 2 - inset, y: mapY(slotZ(i)) })
    }
    return list
  }, [])

  // Live marker: read the shared player state and write the transform
  // directly to the DOM on every frame — zero React renders per frame.
  useEffect(() => {
    let frame = 0
    const tick = () => {
      const marker = markerRef.current
      if (marker) {
        const { position, yaw } = playerRef.current
        const rotation = (-yaw * 180) / Math.PI // world yaw → map angle
        marker.setAttribute(
          'transform',
          `translate(${mapX(position.x).toFixed(2)} ${mapY(position.z).toFixed(2)}) rotate(${rotation.toFixed(1)})`,
        )
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [playerRef])

  return (
    <div
      className="gr-minimap"
      role="img"
      aria-label="Top-down map of the gallery corridor"
      id="gr-minimap"
    >
      <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden="true">
        {/* Corridor floor */}
        <rect
          className="gr-mm-floor"
          x={PAD}
          y={PAD}
          width={INNER_W}
          height={INNER_H}
          rx={4}
        />
        {/* Walkway centre line */}
        <line
          className="gr-mm-center"
          x1={mapX(0)}
          y1={PAD + 4}
          x2={mapX(0)}
          y2={PAD + INNER_H - 4}
        />
        {/* Entrance (bottom edge) */}
        <line
          className="gr-mm-entrance"
          x1={mapX(-1.5)}
          y1={mapY(CORRIDOR.zFront)}
          x2={mapX(1.5)}
          y2={mapY(CORRIDOR.zFront)}
        />
        {/* Portrait slots along the walls */}
        {ticks.map((tick) => (
          <line
            key={tick.key}
            className="gr-mm-tick"
            x1={tick.x1}
            y1={tick.y}
            x2={tick.x2}
            y2={tick.y}
          />
        ))}
        {/* Player marker: dot + forward arrow, rotated by camera yaw */}
        <g
          ref={markerRef}
          className="gr-mm-player"
          transform={`translate(${mapX(0)} ${mapY(START_Z)})`}
        >
          <circle r={5.5} />
          <path d="M0,-9 L4.8,3 L0,0.6 L-4.8,3 Z" />
        </g>
      </svg>
    </div>
  )
}
