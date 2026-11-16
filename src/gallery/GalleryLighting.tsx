import type { GalleryLightingProps } from './types'

/**
 * Warm museum lighting: ambient fill, pools of light along the corridor,
 * a soft key light, and (desktop only) one shadow-casting spotlight.
 */
export function GalleryLighting({ castShadows }: GalleryLightingProps) {
  return (
    <group>
      <ambientLight intensity={0.5} color={0xfff1de} />

      {/* Warm pools of light along the corridor */}
      {[-20, -14, -8, -2, 4, 10].map((z) => (
        <pointLight
          key={z}
          position={[0, 3.6, z]}
          intensity={0.35}
          distance={14}
          decay={2}
          color={0xffd7a0}
        />
      ))}

      {/* Soft directional key */}
      <directionalLight position={[2, 4.5, 6]} intensity={0.35} color={0xfff4e6} />

      {/* Single shadow-casting spotlight (desktop only for performance) */}
      {castShadows && (
        <spotLight
          position={[0, 4.2, 4]}
          angle={0.7}
          penumbra={0.8}
          intensity={0.6}
          distance={30}
          decay={1.6}
          color={0xffe2b8}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0004}
        />
      )}
    </group>
  )
}
