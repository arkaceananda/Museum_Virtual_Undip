import type { Camera } from 'three'
import { Vector3 } from 'three'
import type { AxisBounds } from './types'
import { WALK_SPEED } from './layout'

/**
 * Single source of truth for walking. The corridor only allows movement
 * inside its walkable box (X between the walls, Z between the entrance
 * and the end wall), so the keyboard and the mobile joystick both feed
 * the same helpers here — there is no second copy of the movement maths
 * anywhere else.
 *
 * Sign convention: input > 0 means "move where the camera looks"
 * (forward / screen right).
 */

/** Within this projection the camera looks mostly across the corridor. */
const AXIS_DEADZONE = 0.2

/** Reused every frame to avoid per-frame allocations. */
const _forward = new Vector3()

function ramp(projected: number): number {
  return Math.sign(projected) * Math.min(1, Math.abs(projected) / AXIS_DEADZONE)
}

/** Camera-relative factors for both walkable axes. */
export interface CorridorFactors {
  /**
   * -1..1 along +Z: how far the horizontal camera forward points down
   * the corridor. -1 = looking into the gallery, +1 = toward the entrance.
   */
  forward: number
  /**
   * -1..1 along +X: how far the camera's right vector (forward × up)
   * points across the corridor — this is what A/D (or joystick x) use.
   */
  strafe: number
}

/**
 * Signed fractions of walking speed for the current camera orientation,
 * each projected onto its walkable axis:
 *
 * - Pitch never affects movement: Y is zeroed before normalising.
 * - Turning the camera around flips the signs, so W/S and A/D always
 *   follow the screen direction the player sees.
 * - Within AXIS_DEADZONE the value ramps up from 0, so looking straight
 *   at a wall doesn't cause twitchy full-speed movement; elsewhere the
 *   speed is constant regardless of orientation.
 */
export function corridorFactors(camera: Camera): CorridorFactors {
  camera.getWorldDirection(_forward)
  _forward.y = 0
  if (_forward.lengthSq() < 1e-8) return { forward: 0, strafe: 0 }
  _forward.normalize()

  // Camera right (horizontal) = forward × up → x component is -forward.z.
  const forward = ramp(_forward.z) // projection onto the corridor (Z) axis
  const strafe = -forward // projection of screen-right onto the X axis
  return { forward, strafe }
}

/** Clamp a position inside the walkable bounds of one axis. */
export function clampToAxis(value: number, bounds: AxisBounds): number {
  return Math.min(bounds.max, Math.max(bounds.min, value))
}

/**
 * Advance one frame along a walkable axis.
 *
 * @param input -1..1 combined input for this axis (keyboard or joystick).
 * @param factor signed factor from {@link corridorFactors}.
 * @param deltaSeconds clamped frame time, in seconds.
 */
export function stepAlongAxis(
  current: number,
  input: number,
  factor: number,
  deltaSeconds: number,
  bounds: AxisBounds,
): number {
  const distance = input * factor * WALK_SPEED * deltaSeconds
  return clampToAxis(current + distance, bounds)
}
