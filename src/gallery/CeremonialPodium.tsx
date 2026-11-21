import { useMemo } from 'react'
import * as THREE from 'three'
import type { CeremonialPodiumProps } from './types'
import {
  createPresidentTexture,
  createVicePresidentTexture,
  createPrasastiTexture,
  createIndonesianFlagTexture,
  createUndipFlagTexture,
  createUndipWallTypographyTexture,
  createOfficialUndipLogoTexture,
} from './textures'
import { GarudaPancasila } from './GarudaPancasila'
import { HALL } from './layout'
import { assetCache } from './cache'

/**
 * Static Curved Fabric Flag Component (Lightweight, Zero Animation Overhead)
 * Pre-computes smooth draped folds once with useMemo. Zero CPU load during render loop.
 */
interface StaticFlagProps {
  position: [number, number, number]
  width?: number
  height?: number
  texture?: THREE.Texture | null
}

function StaticCurvedFlag({
  position,
  width = 1.08,
  height = 0.72,
  texture,
}: StaticFlagProps) {
  const geom = useMemo(() => {
    const g = new THREE.PlaneGeometry(width, height, 16, 8)
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i)
      const v = pos.getY(i)
      const factor = Math.max(0, (u + width / 2) / width)
      const wave =
        Math.sin(factor * Math.PI * 2.2) * 0.065 * factor +
        Math.sin(factor * Math.PI * 1.4 + v * 1.8) * 0.025 * factor
      pos.setZ(i, wave)
    }
    g.computeVertexNormals()
    return g
  }, [width, height])

  return (
    <mesh position={position} geometry={geom} castShadow>
      <meshStandardMaterial
        map={texture}
        roughness={0.45}
        metalness={0.08}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

/**
 * Universitas Diponegoro Ceremonial Dais & Stage Installation
 * Features:
 * 1. Royal Navy Blue architectural wall (#142e56) with gilded wainscoting and pilasters.
 * 2. Golden Garuda Pancasila sculpture at the top center.
 * 3. Official framed portraits of President & Vice-President flanking Garuda.
 * 4. Official Shield Logo of Universitas Diponegoro & "UNIVERSITAS DIPONEGORO" 3D title.
 * 5. Monumental Black & Gold Prasasti Pendirian & Peresmian Universitas Diponegoro.
 * 6. Naturally waving ceremonial flags (Indonesia & Pataka Undip) fluttering in the air.
 * 7. Carved teakwood ceremonial podium (without glitchy blue board) on 2-tier dais.
 */
export function CeremonialPodium({
  position,
  isSelected,
  isHovered,
  onSelect,
  onHover,
  onSelectPrasasti,
}: CeremonialPodiumProps) {
  const presTexture = useMemo(() => createPresidentTexture(), [])
  const vpTexture = useMemo(() => createVicePresidentTexture(), [])
  const prasastiTexture = useMemo(() => createPrasastiTexture(), [])
  const wallTitleTexture = useMemo(() => createUndipWallTypographyTexture(), [])
  const indoFlagTexture = useMemo(() => createIndonesianFlagTexture(), [])
  const undipFlagTexture = useMemo(() => createUndipFlagTexture(), [])

  // Load the official Undip shield logo from the user's reference photo (auto-cleaned background)
  const officialLogoTexture = useMemo(() => createOfficialUndipLogoTexture(), [])

  const baseMaterials = useMemo(() => {
    return {
      teakWood: assetCache.getMaterial(
        'pod-teak-wood',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#3d2516',
            roughness: 0.45,
            metalness: 0.12,
          }),
      ),
      darkTeakCarved: assetCache.getMaterial(
        'pod-dark-teak',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#2a180e',
            roughness: 0.5,
            metalness: 0.1,
          }),
      ),
      navyWallPanel: assetCache.getMaterial(
        'pod-navy-wall-vibrant',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#142e56',
            roughness: 0.35,
            metalness: 0.22,
          }),
      ),
      navyPanel: assetCache.getMaterial(
        'pod-navy-panel-vibrant',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#1a3b6c',
            roughness: 0.35,
            metalness: 0.25,
          }),
      ),
      goldTrim: assetCache.getMaterial(
        'pod-gold-trim',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#d4af37',
            roughness: 0.25,
            metalness: 0.88,
          }),
      ),
      goldBright: assetCache.getMaterial(
        'pod-gold-bright',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#f9d342',
            emissive: '#ffd700',
            emissiveIntensity: 0.2,
            roughness: 0.2,
            metalness: 0.9,
          }),
      ),
      blackGranite: assetCache.getMaterial(
        'pod-black-granite',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#0e1117',
            roughness: 0.2,
            metalness: 0.3,
          }),
      ),
      redVelvet: assetCache.getMaterial(
        'pod-red-velvet',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#8b151b',
            roughness: 0.9,
            metalness: 0.05,
          }),
      ),
      goldBrass: assetCache.getMaterial(
        'pod-gold-brass',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#c59f48',
            roughness: 0.3,
            metalness: 0.85,
          }),
      ),
      leatherBlotter: assetCache.getMaterial(
        'pod-leather-blotter',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#1c140d',
            roughness: 0.7,
            metalness: 0.1,
          }),
      ),
      parchment: assetCache.getMaterial(
        'pod-parchment',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#f4ecd8',
            roughness: 0.8,
          }),
      ),
      microphoneChrome: assetCache.getMaterial(
        'pod-mic-chrome',
        () =>
          new THREE.MeshStandardMaterial({
            color: '#e2e8f0',
            roughness: 0.2,
            metalness: 0.9,
          }),
      ),
    }
  }, [])

  const materials = baseMaterials

  const halfW = HALL.halfWidth
  const height = HALL.height
  const backWallZ = HALL.zBack - position[2] // relative to podium group

  return (
    <group position={position}>
      {/* ============================================================
          1. BACK FOCAL WALL ARCHITECTURE & WAINSCOTING (Royal Navy)
          ============================================================ */}
      <group position={[0, height / 2, backWallZ + 0.05]}>
        {/* Navy Wall Wainscoting Panel Frame */}
        <mesh position={[0, 0, 0.02]} receiveShadow>
          <boxGeometry args={[halfW * 2 - 0.2, height - 0.4, 0.04]} />
          <primitive object={materials.navyWallPanel} attach="material" />
        </mesh>

        {/* Lower Wainscot Dado Rail (Teak & Gold) */}
        <mesh position={[0, -height / 2 + 1.15, 0.05]}>
          <boxGeometry args={[halfW * 2 - 0.1, 0.12, 0.05]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
        <mesh position={[0, -height / 2 + 1.22, 0.07]}>
          <boxGeometry args={[halfW * 2 - 0.1, 0.03, 0.03]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Upper Cornice Gold Molding */}
        <mesh position={[0, height / 2 - 0.25, 0.05]}>
          <boxGeometry args={[halfW * 2 - 0.1, 0.14, 0.06]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Left & Right Flanking Gold Pilasters */}
        {[-halfW + 0.06, halfW - 0.06].map((cx, ci) => (
          <mesh key={ci} position={[cx, 0, 0.03]}>
            <boxGeometry args={[0.16, height, 0.08]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        ))}

        {/* Interior Gold Pilasters Framing the Center Dais */}
        {[-4.6, 4.6].map((px, pi) => (
          <group key={`pila-${pi}`} position={[px, 0, 0.03]}>
            <mesh>
              <boxGeometry args={[0.14, height - 0.5, 0.04]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>
            <mesh position={[0, height / 2 - 0.4, 0.02]}>
              <boxGeometry args={[0.22, 0.15, 0.06]} />
              <primitive object={materials.goldBright} attach="material" />
            </mesh>
            <mesh position={[0, -height / 2 + 0.35, 0.02]}>
              <boxGeometry args={[0.22, 0.15, 0.06]} />
              <primitive object={materials.goldBright} attach="material" />
            </mesh>
          </group>
        ))}

        {/* ============================================================
            2. PATUNG LAMBANG GARUDA PANCASILA (TOP CENTER)
            ============================================================ */}
        <GarudaPancasila position={[0, 2.7, 0.15]} scale={1.65} />

        {/* ============================================================
            3. DUA FOTO RESMI: PRESIDEN & WAKIL PRESIDEN RI
            ============================================================ */}
        {/* Foto Presiden RI (Sisi Kiri Penonton) */}
        <group position={[-2.7, 0.8, 0.12]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.76, 0.08]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.025]} receiveShadow>
            <boxGeometry args={[1.2, 1.6, 0.05]} />
            <primitive object={materials.navyPanel} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.12, 1.52]} />
            <meshStandardMaterial map={presTexture} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.96, 0.05]}>
            <boxGeometry args={[1.05, 0.1, 0.02]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        </group>

        {/* Foto Wakil Presiden RI (Sisi Kanan Penonton) */}
        <group position={[2.7, 0.8, 0.12]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.35, 1.76, 0.08]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.025]} receiveShadow>
            <boxGeometry args={[1.2, 1.6, 0.05]} />
            <primitive object={materials.navyPanel} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.045]}>
            <planeGeometry args={[1.12, 1.52]} />
            <meshStandardMaterial map={vpTexture} roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.96, 0.05]}>
            <boxGeometry args={[1.05, 0.1, 0.02]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>
        </group>

        {/* ============================================================
            4. PROMINENT GRAND OFFICIAL UNDIP LOGO & "UNIVERSITAS DIPONEGORO"
            Matching the official shield emblem from user reference photo
            ============================================================ */}
        <group position={[0, 0.8, 0.16]}>
          {/* Subtle Backplate Cushion with Gilded Rim for the Shield Emblem */}
          <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
            <planeGeometry args={[1.72, 2.02]} />
            <meshStandardMaterial
              color="#0e223f"
              roughness={0.4}
              metalness={0.2}
            />
          </mesh>
          {/* Official Shield Face with Undip Emblem */}
          <mesh position={[0, 0.45, 0.015]}>
            <planeGeometry args={[1.7, 2.0]} />
            <meshStandardMaterial
              map={officialLogoTexture}
              transparent
              roughness={0.2}
              metalness={0.3}
            />
          </mesh>

          {/* ============================================================
              GRAND ARCHITECTURAL TYPOGRAPHY: "UNIVERSITAS DIPONEGORO"
              ============================================================ */}
          <group position={[0, -0.95, 0.04]}>
            {/* Gold Architectural Plaque Frame */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[6.6, 0.72, 0.05]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>
            {/* Deep Navy Inner Inset */}
            <mesh position={[0, 0, 0.028]}>
              <boxGeometry args={[6.46, 0.58, 0.02]} />
              <primitive object={materials.navyWallPanel} attach="material" />
            </mesh>
            {/* Gilded 3D Inscription Text */}
            <mesh position={[0, 0.02, 0.042]}>
              <planeGeometry args={[6.3, 0.52]} />
              <meshStandardMaterial
                map={wallTitleTexture}
                transparent
                roughness={0.2}
                metalness={0.85}
              />
            </mesh>

            {/* Subtitle Ribbon: "SEMARANG • DIES NATALIS 15 OKTOBER 1957" */}
            <mesh position={[0, -0.46, 0.02]}>
              <boxGeometry args={[4.4, 0.2, 0.03]} />
              <primitive object={materials.goldBright} attach="material" />
            </mesh>
            <mesh position={[0, -0.46, 0.038]}>
              <boxGeometry args={[4.28, 0.15, 0.01]} />
              <primitive object={materials.navyWallPanel} attach="material" />
            </mesh>
          </group>
        </group>
      </group>

      {/* ============================================================
          5. STAGE DAIS & CEREMONIAL PODIUM
          ============================================================ */}
      <group
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover('podium')
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          onHover(null)
        }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect()
        }}
      >
        {/* Tier 1 Stage Platform */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 0.2, 3.6]} />
          <primitive object={materials.teakWood} attach="material" />
        </mesh>
        <mesh position={[0, 0.19, 1.8]}>
          <boxGeometry args={[5.64, 0.02, 0.04]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Tier 2 Stage Platform */}
        <mesh position={[0, 0.26, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[4.8, 0.16, 2.8]} />
          <primitive object={materials.darkTeakCarved} attach="material" />
        </mesh>
        <mesh position={[0, 0.33, 1.2]}>
          <boxGeometry args={[4.84, 0.02, 0.04]} />
          <primitive object={materials.goldTrim} attach="material" />
        </mesh>

        {/* Red Carpet on Stage Top */}
        <mesh position={[0, 0.345, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.6, 2.4]} />
          <primitive object={materials.redVelvet} attach="material" />
        </mesh>

        {/* Ceremonial Carved Teakwood Podium Structure */}
        <group position={[0, 0.34, 0.35]}>
          {/* Base Plinth */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 0.1, 0.8]} />
            <primitive object={materials.darkTeakCarved} attach="material" />
          </mesh>
          <mesh position={[0, 0.105, 0]}>
            <boxGeometry args={[1.16, 0.015, 0.76]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>

          {/* Podium Column Body */}
          <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.0, 0.86, 0.65]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>

          {/* Carved Teak Front Frame (Clean, no weird blue plate) */}
          <mesh position={[0, 0.58, 0.328]}>
            <boxGeometry args={[0.84, 0.72, 0.015]} />
            <primitive object={materials.darkTeakCarved} attach="material" />
          </mesh>
          <mesh position={[0, 0.58, 0.334]}>
            <boxGeometry args={[0.82, 0.7, 0.008]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>

          {/* Official Undip Shield Emblem on Podium Front */}
          <mesh position={[0, 0.64, 0.342]}>
            <planeGeometry args={[0.38, 0.44]} />
            <meshStandardMaterial
              map={officialLogoTexture}
              transparent
              roughness={0.25}
              metalness={0.5}
            />
          </mesh>
          <mesh position={[0, 0.34, 0.34]}>
            <boxGeometry args={[0.7, 0.07, 0.015]} />
            <primitive object={materials.goldBrass} attach="material" />
          </mesh>

          {/* Slanted Reading Desk (Cleaned up: Zero vertical glitch boards) */}
          <group position={[0, 1.05, 0]} rotation={[0.22, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.12, 0.08, 0.75]} />
              <primitive object={materials.darkTeakCarved} attach="material" />
            </mesh>

            {/* Inset Leather Desk Blotter (Properly flat in XZ plane) */}
            <mesh position={[0, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.96, 0.6]} />
              <primitive object={materials.leatherBlotter} attach="material" />
            </mesh>

            {/* Document Retaining Rail */}
            <mesh position={[0, 0.055, 0.35]}>
              <boxGeometry args={[1.0, 0.03, 0.03]} />
              <primitive object={materials.goldTrim} attach="material" />
            </mesh>

            {/* Diplomatic Address Parchment Scroll (Properly flat in XZ plane) */}
            <mesh position={[0, 0.045, 0.04]} rotation={[-Math.PI / 2, 0, 0.02]}>
              <planeGeometry args={[0.38, 0.48]} />
              <primitive object={materials.parchment} attach="material" />
            </mesh>

            {/* Condenser Studio Gooseneck Microphone */}
            <group position={[0.26, 0.05, -0.15]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.04, 0.05, 0.025, 16]} />
                <primitive object={materials.goldTrim} attach="material" />
              </mesh>
              <mesh position={[0, 0.16, 0.05]} rotation={[0.3, 0, 0]} castShadow>
                <cylinderGeometry args={[0.009, 0.009, 0.3, 10]} />
                <primitive object={materials.microphoneChrome} attach="material" />
              </mesh>
              <group position={[0, 0.32, 0.12]} rotation={[0.4, 0, 0]}>
                <mesh castShadow>
                  <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
                  <primitive object={materials.microphoneChrome} attach="material" />
                </mesh>
                <mesh position={[0, 0.04, 0]}>
                  <sphereGeometry args={[0.018, 16, 16]} />
                  <primitive object={materials.microphoneChrome} attach="material" />
                </mesh>
              </group>
            </group>
          </group>
        </group>

        {/* ============================================================
            6. MONUMENTAL PRASASTI PENDIRIAN & PERESMIAN UNDIP
            ============================================================ */}
        <group
          position={[-3.8, 0, -1.8]}
          onPointerOver={(e) => {
            e.stopPropagation()
            onHover('prasasti')
          }}
          onPointerOut={(e) => {
            e.stopPropagation()
            onHover(null)
          }}
          onClick={(e) => {
            e.stopPropagation()
            if (onSelectPrasasti) {
              onSelectPrasasti()
            }
          }}
        >
          {/* Carved Teakwood Monument Base */}
          <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.75, 0.28, 1.35]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>
          <mesh position={[0, 0.285, 0]}>
            <boxGeometry args={[1.7, 0.02, 1.3]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>

          {/* Stepped Pedestal Tier 2 */}
          <mesh position={[0, 0.44, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 0.3, 1.1]} />
            <primitive object={materials.darkTeakCarved} attach="material" />
          </mesh>

          {/* Slanted Polished Black Granite Inscription Slab */}
          <group position={[0, 0.72, -0.05]} rotation={[-0.42, 0, 0]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[1.42, 0.12, 1.08]} />
              <primitive object={materials.blackGranite} attach="material" />
            </mesh>

            <mesh position={[0, 0.065, 0]}>
              <boxGeometry args={[1.44, 0.02, 1.1]} />
              <primitive object={materials.goldBright} attach="material" />
            </mesh>

            <mesh position={[0, 0.066, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[1.36, 1.02]} />
              <meshStandardMaterial
                map={prasastiTexture}
                roughness={0.25}
                metalness={0.65}
              />
            </mesh>

            {/* Corner Gilded Brass Brackets */}
            {[-0.64, 0.64].map((bx, bi) =>
              [-0.48, 0.48].map((bz, bzi) => (
                <mesh key={`brk-${bi}-${bzi}`} position={[bx, 0.075, bz]} castShadow>
                  <boxGeometry args={[0.06, 0.03, 0.06]} />
                  <primitive object={materials.goldBright} attach="material" />
                </mesh>
              )),
            )}
          </group>

          {/* Interactive Highlight Ring when hovering over Prasasti */}
          {(isHovered || isSelected) && (
            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[1.1, 1.25, 32]} />
              <meshBasicMaterial color="#f9d342" transparent opacity={0.8} />
            </mesh>
          )}
        </group>

        {/* ============================================================
            7. NATURALLY WAVING CEREMONIAL FLAGS (INDONESIA & PATAKA UNDIP)
            Fluttering softly in the air like real woven silk
            ============================================================ */}
        <group position={[-3.2, 0, -2.35]}>
          {/* Polished Teakwood & Gold Stand */}
          <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.4, 0.16, 0.8]} />
            <primitive object={materials.teakWood} attach="material" />
          </mesh>
          <mesh position={[0, 0.165, 0]}>
            <boxGeometry args={[2.34, 0.02, 0.74]} />
            <primitive object={materials.goldTrim} attach="material" />
          </mesh>

          {[-0.55, 0.55].map((sx, si) => (
            <mesh key={si} position={[sx, 0.22, 0]} castShadow>
              <cylinderGeometry args={[0.065, 0.085, 0.12, 16]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
          ))}

          {/* 7A. BENDERA MERAH PUTIH (WAVING SILK) */}
          <group position={[-0.55, 0.22, 0]}>
            {/* Brass Flagpole */}
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 3.6, 16]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            <mesh position={[0, 3.65, 0]}>
              <coneGeometry args={[0.055, 0.18, 12]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            {/* Static Curved Fabric Mesh (Pre-draped silk, zero animation overhead) */}
            <StaticCurvedFlag
              position={[0.54, 2.7, 0]}
              width={1.08}
              height={0.72}
              texture={indoFlagTexture}
            />
          </group>

          {/* 7B. BENDERA PATAKA UNDIP (STATIC CURVED SILK WITH OFFICIAL CREST) */}
          <group position={[0.55, 0.22, 0]}>
            {/* Brass Flagpole */}
            <mesh position={[0, 1.8, 0]} castShadow>
              <cylinderGeometry args={[0.022, 0.022, 3.6, 16]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            <mesh position={[0, 3.65, 0]}>
              <coneGeometry args={[0.055, 0.18, 12]} />
              <primitive object={materials.goldBrass} attach="material" />
            </mesh>
            {/* Static Curved Fabric Mesh (Pre-draped silk, zero animation overhead) */}
            <StaticCurvedFlag
              position={[0.54, 2.7, 0]}
              width={1.08}
              height={0.72}
              texture={undipFlagTexture}
            />
          </group>
        </group>

        {/* Hover Highlight Ring around podium */}
        {(isHovered || isSelected) && (
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.8, 2.95, 32]} />
            <meshBasicMaterial color="#d4af37" transparent opacity={0.7} />
          </mesh>
        )}
      </group>
    </group>
  )
}
