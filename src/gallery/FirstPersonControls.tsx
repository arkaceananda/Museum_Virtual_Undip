import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import type { FirstPersonControlsProps } from './types'
import { corridorFactors, stepAlongAxis } from './movement'
import {
  DRAG_SENSITIVITY,
  DRAG_THRESHOLD,
  EYE_HEIGHT,
  LOOK_SENSITIVITY,
  MOVE_BOUNDS,
  PITCH_LIMIT,
  START_Z,
} from './layout'

const FORWARD_KEYS = new Set(['KeyW', 'ArrowUp'])
const BACKWARD_KEYS = new Set(['KeyS', 'ArrowDown'])
const LEFT_KEYS = new Set(['KeyA', 'ArrowLeft'])
const RIGHT_KEYS = new Set(['KeyD', 'ArrowRight'])

/**
 * Constrained first-person controls (renders no DOM of its own):
 * - Desktop: click empty space to lock the mouse, move the mouse to look,
 *   W/S (or ↑/↓) walk forward/backward, A/D (or ←/→) strafe left/right,
 *   ESC to release.
 * - Touch: drag anywhere on the scene to look; the joystick drives both
 *   axes through the same movement maths.
 *
 * Movement is camera-relative (see movement.ts): W moves where the camera
 * looks projected onto the corridor axis, D moves screen-right projected
 * onto the walls — turning around reverses all of them. Input stays
 * clamped inside the walkable box; pitch is clamped to a comfortable
 * range. Each frame it publishes position/yaw to `playerRef`, the single
 * state the minimap reads.
 */
export function FirstPersonControls({
  resetSignal,
  moveInputRef,
  hoveredRef,
  panelOpenRef,
  draggedRef,
  playerRef,
}: FirstPersonControlsProps) {
  const { camera, gl } = useThree()
  const keys = useRef(new Set<string>())
  const yaw = useRef(0)
  const pitch = useRef(0)
  const x = useRef(0)
  const z = useRef(START_Z)
  const drag = useRef<{ id: number; x: number; y: number } | null>(null)

  // Keyboard
  useEffect(() => {
    const isMoveKey = (code: string) =>
      FORWARD_KEYS.has(code) ||
      BACKWARD_KEYS.has(code) ||
      LEFT_KEYS.has(code) ||
      RIGHT_KEYS.has(code)

    const onKeyDown = (event: KeyboardEvent) => {
      if (isMoveKey(event.code)) {
        event.preventDefault()
        keys.current.add(event.code)
      }
    }
    const onKeyUp = (event: KeyboardEvent) => {
      keys.current.delete(event.code)
    }
    window.addEventListener('keydown', onKeyDown, { passive: false })
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  // Pointer look (pointer lock on desktop, drag on touch/edge cases)
  useEffect(() => {
    const element = gl.domElement

    const onPointerDown = (event: PointerEvent) => {
      draggedRef.current = false
      if (event.button !== 0) return
      drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY }
      element.setPointerCapture?.(event.pointerId)
    }

    const onPointerMove = (event: PointerEvent) => {
      const locked = document.pointerLockElement === element
      if (locked) {
        yaw.current -= event.movementX * LOOK_SENSITIVITY
        pitch.current = THREEClamp(pitch.current - event.movementY * LOOK_SENSITIVITY)
        return
      }
      const active = drag.current
      if (!active || active.id !== event.pointerId) return
      const dx = event.clientX - active.x
      const dy = event.clientY - active.y
      if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) draggedRef.current = true
      yaw.current -= dx * DRAG_SENSITIVITY
      pitch.current = THREEClamp(pitch.current - dy * DRAG_SENSITIVITY)
      active.x = event.clientX
      active.y = event.clientY
    }

    const onPointerUp = (event: PointerEvent) => {
      if (drag.current?.id === event.pointerId) {
        drag.current = null
        element.releasePointerCapture?.(event.pointerId)
      }
    }

    const onClick = () => {
      // Only lock when clicking empty space (not a portrait) and no panel is open.
      if (panelOpenRef.current || hoveredRef.current) return
      if (document.pointerLockElement === element) return
      if (!window.matchMedia('(pointer: fine)').matches) return
      try {
        const result = element.requestPointerLock() as unknown as Promise<void> | undefined
        if (result && typeof result.catch === 'function') result.catch(() => {})
      } catch {
        // Pointer lock may be unavailable; drag-look still works.
      }
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointercancel', onPointerUp)
    element.addEventListener('click', onClick)
    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', onPointerUp)
      element.removeEventListener('pointercancel', onPointerUp)
      element.removeEventListener('click', onClick)
    }
  }, [camera, gl, panelOpenRef, hoveredRef, draggedRef])

  // Reset view
  useEffect(() => {
    if (resetSignal === 0) return
    yaw.current = 0
    pitch.current = 0
    x.current = 0
    z.current = START_Z
    keys.current.clear()
    moveInputRef.current.x = 0
    moveInputRef.current.y = 0
    drag.current = null
    if (document.pointerLockElement) document.exitPointerLock()
  }, [resetSignal, moveInputRef])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)

    // Combined input per axis: keyboard (W/S/↑/↓ forward-backward,
    // A/D/←/→ left-right) plus the mobile joystick, which uses the same
    // "positive = forward / screen right" convention.
    let forwardInput = 0
    let strafeInput = 0
    for (const code of keys.current) {
      if (FORWARD_KEYS.has(code)) forwardInput += 1
      else if (BACKWARD_KEYS.has(code)) forwardInput -= 1
      else if (LEFT_KEYS.has(code)) strafeInput -= 1
      else if (RIGHT_KEYS.has(code)) strafeInput += 1
    }
    forwardInput += moveInputRef.current.y
    strafeInput += moveInputRef.current.x
    forwardInput = Math.max(-1, Math.min(1, forwardInput))
    strafeInput = Math.max(-1, Math.min(1, strafeInput))

    // Camera-relative: W means "move where I am looking" and D "move to
    // screen right", each projected onto its walkable axis (pitch
    // excluded) and clamped inside the corridor box.
    const { forward, strafe } = corridorFactors(camera)
    z.current = stepAlongAxis(z.current, forwardInput, forward, dt, MOVE_BOUNDS.longitudinal)
    x.current = stepAlongAxis(x.current, strafeInput, strafe, dt, MOVE_BOUNDS.lateral)

    camera.position.set(x.current, EYE_HEIGHT, z.current)
    // 'YXZ' order keeps yaw/pitch intuitive for first-person look.
    camera.rotation.set(pitch.current, yaw.current, 0, 'YXZ')

    // Publish shared state for the minimap — mutated in place, no re-render.
    const state = playerRef.current
    state.position.x = x.current
    state.position.z = z.current
    state.yaw = yaw.current
    state.pitch = pitch.current
  })

  return null
}

function THREEClamp(value: number): number {
  return Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, value))
}
