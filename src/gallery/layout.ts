/** Corridor dimensions in meters. */
export const CORRIDOR = {
  halfWidth: 3,
  height: 4.5,
  zBack: -24,
  zFront: 12,
} as const

export const EYE_HEIGHT = 1.6
export const START_Z = 8
export const MOVE_MIN_Z = CORRIDOR.zBack + 1.5
export const MOVE_MAX_Z = CORRIDOR.zFront - 1.5
export const WALK_SPEED = 3.2

/** Portrait placement. */
export const FRAME_Y = 2.3
export const WALL_X = 2.92
export const SPACING = 4.2
export const FIRST_Z = 6

/** Look constraints. */
export const PITCH_LIMIT = 0.62
export const LOOK_SENSITIVITY = 0.0022
export const DRAG_SENSITIVITY = 0.005
export const DRAG_THRESHOLD = 6
