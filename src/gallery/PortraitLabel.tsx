import type { PortraitLabelProps } from './types'
import { getCachedLabelTexture } from './assets'

/**
 * Ivory information label under a portrait: name and years.
 * The texture is shared from the module-level cache and must not be
 * disposed on unmount — it is reused across visits.
 */
export function PortraitLabel({ portrait }: PortraitLabelProps) {
  const texture = getCachedLabelTexture(portrait)

  return (
    <mesh position={[0, -1.32, -0.05]}>
      <planeGeometry args={[1.5, 0.52]} />
      <meshStandardMaterial map={texture} roughness={0.85} />
    </mesh>
  )
}
