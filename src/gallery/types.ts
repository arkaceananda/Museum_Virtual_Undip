import type { RefObject } from 'react'

export interface Portrait {
  id: string
  name: string
  /** Year of office / relevant years, e.g. "1945–1967". */
  years: string
  /** Optional local image path. Falls back to a generated placeholder when missing. */
  imagePath?: string
}

export interface PortraitFrameProps {
  portrait: Portrait
  position: [number, number, number]
  rotationY: number
  isSelected: boolean
  isHovered: boolean
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export interface PortraitLabelProps {
  portrait: Portrait
}

export interface GalleryWallsProps {
  portraits: Portrait[]
  selectedId: string | null
  hoveredId: string | null
  onSelect: (id: string) => void
  onHover: (id: string | null) => void
}

export interface GalleryLightingProps {
  castShadows: boolean
}

/* ------------------------------------------------------------
   Player state — written by FirstPersonControls every frame,
   read by the 2D minimap (single source of truth, no duplicates).
   ------------------------------------------------------------ */

/** World position of the player's eyes, in meters. */
export interface PlayerPosition {
  x: number
  y: number
  z: number
}

/**
 * Live player state shared between the 3D scene and the 2D minimap.
 * Mutated in place from `useFrame` so updates never trigger re-renders.
 */
export interface PlayerState {
  position: PlayerPosition
  /** Camera yaw in radians (0 = looking down -Z, into the gallery). */
  yaw: number
  /** Camera pitch in radians (clamped; unused by the minimap). */
  pitch: number
}

export type PlayerStateRef = RefObject<PlayerState>

/** Walkable bounds along one world axis, in meters. */
export interface AxisBounds {
  min: number
  max: number
}

/** Walkable bounds of the corridor (a box the player can never leave). */
export interface CorridorBounds {
  /** X axis — between the left and right walls. */
  lateral: AxisBounds
  /** Z axis — between the entrance and the end wall. */
  longitudinal: AxisBounds
}

/**
 * Combined movement input, -1..1 per axis (keyboard or virtual joystick).
 * Both desktop and mobile feed this same structure into one code path.
 */
export interface MoveInput {
  /** -1 = left, +1 = screen right. */
  x: number
  /** -1 = backward, +1 = forward (where the camera looks). */
  y: number
}

export interface FirstPersonControlsProps {
  resetSignal: number
  moveInputRef: RefObject<MoveInput>
  hoveredRef: RefObject<string | null>
  panelOpenRef: RefObject<boolean>
  draggedRef: RefObject<boolean>
  /** Shared state published each frame for the minimap. */
  playerRef: PlayerStateRef
}

/* ------------------------------------------------------------
   Minimap (2D top-down overlay, plain React + SVG)
   ------------------------------------------------------------ */

export interface MinimapProps {
  playerRef: PlayerStateRef
}

export interface MinimapToggleProps {
  open: boolean
  onToggle: () => void
}

export interface MobileControlsProps {
  moveInputRef: RefObject<MoveInput>
  visible: boolean
  onReset: () => void
  onBack?: () => void
}

export interface PortraitInformationPanelProps {
  portrait: Portrait | null
  index: number
  total: number
  onClose: () => void
}
