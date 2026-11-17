import type { Camera } from 'three'
import { Vector3 } from 'three'
import type { CorridorBounds } from './types'
import { WALK_SPEED } from './layout'

/**
 * Single source of truth for walking. The corridor only allows movement
 * along its longitudinal (world Z) axis, so both the keyboard and the
 * mobile joystick feed the same helpers here — there is no second copy
 * of the movement maths anywhere else.
 *
 * Sign convention: input > 0 means "move where the camera looks".
 */

/** Within this projection the camera looks mostly across the corridor. */
const AXIS_DEADZONE = 0.2

/** Reused every frame to avoid per-frame allocations. */
const _forward = new Vector3()

/**
 * Signed fraction of walking speed in the direction the camera faces,
 * projected onto the corridor's Z axis:
 *   -1 → looking toward -Z (into the gallery), +1 → toward +Z (entrance).
 *
 * - The Y component is zeroed before normalising, so camera pitch never
 *   affects horizontal movement.
 * - The result ramps up from 0 across AXIS_DEADZONE so looking sideways
 *   doesn't cause twitchy full-speed movement; everywhere else the speed
 *   is constant regardless of orientation.
 */
export function forwardAlongCorridor(camera: Camera): number {
  camera.getWorldDirection(_forward)
  _forward.y = 0
  if (_forward.lengthSq() < 1e-8) return 0
  _forward.normalize()
  const projected = _forward.z // corridor runs along Z
  const ramp = Math.min(1, Math.abs(projected) / AXIS_DEADZONE)
  return projected < 0 ? -ramp : ramp
}

/** Clamp a Z position inside the walkable corridor. */
export function clampToCorridor(z: number, bounds: CorridorBounds): number {
  return Math.min(bounds.maxZ, Math.max(bounds.minZ, z))
}

/**
 * Advance one frame along the corridor axis.
 *
 * @param input -1..1 combined input (+1 = forward): keyboard W/↑ or joystick up.
 * @param forwardFactor signed factor from {@link forwardAlongCorridor}.
 * @param deltaSeconds clamped frame time, in seconds.
 */
export function stepAlongCorridor(
  currentZ: number,
  input: number,
  forwardFactor: number,
  deltaSeconds: number,
  bounds: CorridorBounds,
): number {
  const distance = input * forwardFactor * WALK_SPEED * deltaSeconds
  return clampToCorridor(currentZ + distance, bounds)
}
