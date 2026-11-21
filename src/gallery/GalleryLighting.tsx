
interface GalleryLightingProps {
  castShadows: boolean
}

/**
 * Museum Virtual Undip - Low-Light Cinematic Exhibition Lighting
 * Features:
 * - Moody, high-contrast cinematic atmosphere
 * - Soft warm wall-grazing track spotlights creating dramatic falloffs around artwork
 * - Rich shadows cast by objects and furniture onto the marble floor and carpet
 * - Ambient warm golden glow from the PVC cove lighting and crystal chandeliers
 * - Cinematic low light on walls (vignette-style darkness at corners)
 */
export function GalleryLighting({ castShadows }: GalleryLightingProps) {
  return (
    <group>
      {/* 1. Ambient Fill Light - Bright & Crisp to give high contrast to Royal Navy walls */}
      <ambientLight color="#f5eadc" intensity={0.62} />

      {/* 2. Primary Architectural Overhead Key Light
          Positioned directly above the center of the hall to cast true-to-geometry vertical shadows
          directly beneath objects (matching realistic silhouettes without angular distortion) */}
      <directionalLight
        position={[0.3, 14.8, -7.0]}
        target-position={[0, 0, -7.0]}
        color="#fffaf0"
        intensity={1.2}
        castShadow={castShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1.0}
        shadow-camera-far={26.0}
        shadow-camera-left={-8.5}
        shadow-camera-right={8.5}
        shadow-camera-top={21.0}
        shadow-camera-bottom={-21.0}
        shadow-bias={-0.00008}
      />

      {/* 3. Subtle Counter-Fill from ceiling for natural architectural illumination */}
      <directionalLight
        position={[-0.3, 12.0, -7.0]}
        color="#d8e8f8"
        intensity={0.3}
      />

      {/* 4. Left Wall (13 Founders) - Wall-Grazing Track Spotlights */}
      {[-20, -15.5, -10, -4.5, 0.5, 5.5].map((z, i) => (
        <group key={`left-spot-${i}`} position={[-5.0, 5.8, z]}>
          <spotLight
            position={[0, 0, 0]}
            target-position={[-2.4, -3.5, 0]}
            color="#ffe8c8"
            intensity={24}
            angle={0.6}
            penumbra={0.85}
            distance={10.5}
            decay={2}
          />
        </group>
      ))}

      {/* 5. Right Wall (History & Archives Salon) - Track Spotlights */}
      {[-20, -15.5, -10, -4.5, 0.5, 5.5].map((z, i) => (
        <group key={`right-spot-${i}`} position={[5.0, 5.8, z]}>
          <spotLight
            position={[0, 0, 0]}
            target-position={[2.4, -3.5, 0]}
            color="#ffe8c8"
            intensity={24}
            angle={0.6}
            penumbra={0.85}
            distance={10.5}
            decay={2}
          />
        </group>
      ))}

      {/* 7. Dedicated Warm Yellow Spotlights for Campus Maket & Muladi Dome (Lampu Gantung Sorot Kuning) */}
      <spotLight
        position={[0, 5.2, -3.5]}
        target-position={[0, 0.9, -3.5]}
        color="#ffdf88"
        intensity={68}
        angle={0.58}
        penumbra={0.65}
        distance={10.0}
        decay={2}
      />
      {/* Front & Rear Maket Table Warm Accents */}
      <spotLight
        position={[0, 5.2, -1.9]}
        target-position={[0, 0.85, -1.9]}
        color="#ffe79e"
        intensity={45}
        angle={0.52}
        penumbra={0.7}
        distance={9.5}
        decay={2}
      />
      <spotLight
        position={[0, 5.2, -5.1]}
        target-position={[0, 0.85, -5.1]}
        color="#ffe79e"
        intensity={45}
        angle={0.52}
        penumbra={0.7}
        distance={9.5}
        decay={2}
      />

      {/* 8. Ceremonial Podium Stage Accent Light */}
      <spotLight
        position={[0, 6.8, -15.0]}
        target-position={[0, 2.2, -18.2]}
        color="#fff4da"
        intensity={55}
        angle={0.58}
        penumbra={0.72}
        distance={13.0}
        decay={2}
      />

      {/* 9. Dedicated Spotlight on the Grand Prasasti Pendirian Undip */}
      <spotLight
        position={[-3.8, 6.2, -15.0]}
        target-position={[-3.8, 1.2, -18.2]}
        color="#fff4d4"
        intensity={48}
        angle={0.5}
        penumbra={0.65}
        distance={12.0}
        decay={2}
      />

      {/* 10. Grand Focal Back Wall Illumination: Logo Undip & "Universitas Diponegoro" Typography */}
      <spotLight
        position={[0, 7.2, -19.5]}
        target-position={[0, 4.8, -25.8]}
        color="#fff9ec"
        intensity={65}
        angle={0.68}
        penumbra={0.75}
        distance={15.0}
        decay={2}
      />

      {/* Back Wall Architectural Wall-Washing Flood Lights (Eliminating dark gloomy back) */}
      {[-4.6, 0, 4.6].map((wx, wi) => (
        <spotLight
          key={`back-wash-${wi}`}
          position={[wx, 7.6, -21.0]}
          target-position={[wx, 4.2, -25.8]}
          color="#ffeed0"
          intensity={40}
          angle={0.72}
          penumbra={0.8}
          distance={14.0}
          decay={2}
        />
      ))}

      {/* 11. Warm Corner Uplights & Fills at the Back Corners */}
      <pointLight position={[-6.2, 3.2, -24.0]} color="#ffeed8" intensity={22} distance={10} decay={2} />
      <pointLight position={[6.2, 3.2, -24.0]} color="#ffeed8" intensity={22} distance={10} decay={2} />

      {/* 12. Entrance Area Welcome Warm Light */}
      <pointLight
        position={[0, 5.5, 10.5]}
        color="#ffeedd"
        intensity={20}
        distance={12}
        decay={2}
      />
    </group>
  )
}
