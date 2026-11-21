import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import type { SelectedExhibit, SectionType } from './types'
import type { Founder, HistoryExhibit } from './data/exhibits'
import {
  MINIATURE_MAP_POS,
  PODIUM_POS,
  SECTION_TARGETS,
  START_POSITION,
} from './layout'
import { GalleryEnvironment } from './GalleryEnvironment'
import { GalleryLighting } from './GalleryLighting'
import { FoundersWing } from './FoundersWing'
import { HistoryArchivesWing } from './HistoryArchivesWing'
import { MiniatureMap } from './MiniatureMap'
import { CeremonialPodium } from './CeremonialPodium'
import { FirstPersonControls } from './FirstPersonControls'
import { DesktopHints } from './DesktopHints'
import { MobileControls } from './MobileControls'
import { ExhibitInformationPanel } from './ExhibitInformationPanel'
import { WayfindingPrompt } from './WayfindingPrompt'
import './gallery.css'

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth <= 820 || window.matchMedia('(pointer: coarse)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

/**
 * Museum Virtual Undip - Master 3D Gallery Scene
 * Requirements implemented:
 * - Minimal-space large area divided into side sections
 * - 13 Photos of founders on the left, UNDIP history & archives on the right
 * - Red carpet, miniature map of Undip, and ceremonial podium on the center axis
 * - Rectangular ceiling roof with alternating large and small rectangular gaps
 * - Palette: Navy Blue, Gold, Ivory, Heritage Brown
 * - Sidebar preserved on right with expand/contract button (diagonal arrows)
 *   to expand into a large centered modal with clear text
 * - Proximity-based directory board: "Mau kemana??" appears when near the board
 * - Added 3D assets: Archival bookshelves, glass tables, visitor armchairs
 * - Aesthetic museum mood lighting & warm downlights
 */
export function GalleryScene() {
  const isMobile = useIsMobile()
  const [selectedExhibit, setSelectedExhibit] = useState<SelectedExhibit | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const [targetPosition, setTargetPosition] = useState<[number, number, number] | null>(null)
  const [isNearDirectory, setIsNearDirectory] = useState(false)

  const moveInputRef = useRef<{ forward: number; strafe: number }>({ forward: 0, strafe: 0 })
  const hoveredRef = useRef<string | null>(null)
  const panelOpenRef = useRef(false)
  const draggedRef = useRef(false)

  useEffect(() => {
    hoveredRef.current = hoveredId
    document.body.style.cursor = hoveredId ? 'pointer' : ''
    return () => {
      document.body.style.cursor = ''
    }
  }, [hoveredId])

  useEffect(() => {
    panelOpenRef.current = selectedExhibit !== null
  }, [selectedExhibit])

  const handleSelectFounder = useCallback((founder: Founder) => {
    if (draggedRef.current) return
    setSelectedExhibit({ type: 'founder', data: founder })
  }, [])

  const handleSelectHistory = useCallback((exhibit: HistoryExhibit) => {
    if (draggedRef.current) return
    setSelectedExhibit({ type: 'history', data: exhibit })
  }, [])

  const handleSelectMap = useCallback(() => {
    if (draggedRef.current) return
    setSelectedExhibit({
      type: 'miniature-map',
      data: {
        id: 'miniature-map',
        title: 'Maket 3D Kampus Terpadu Undip',
        subtitle: 'Kawasan Tembalang & Pleburan',
        description: 'Model arsitektur masterplan kampus Universitas Diponegoro.',
      },
    })
  }, [])

  const handleSelectPodium = useCallback(() => {
    if (draggedRef.current) return
    setSelectedExhibit({
      type: 'podium',
      data: {
        id: 'ceremonial-podium',
        title: 'Podium Kehormatan Universitas Diponegoro',
        subtitle: 'Simbol Wibawa & Tradisi Dies Natalis',
        description: 'Podium resmi upacara akademik dan orasi ilmiah universitas.',
      },
    })
  }, [])

  const handleSelectPrasasti = useCallback(() => {
    if (draggedRef.current) return
    setSelectedExhibit({
      type: 'prasasti',
      data: {
        id: 'prasasti-undip',
        title: 'Prasasti Pendirian & Peresmian Universitas Diponegoro',
        subtitle: 'Batu Marmer Hitam Obsidian • 9 Januari 1957',
        description: 'Prasasti bersejarah peresmian Universitas Diponegoro oleh Presiden Sukarno.',
      },
    })
  }, [])

  const handleHover = useCallback((id: string | null) => setHoveredId(id), [])
  const handleReset = useCallback(() => {
    setResetSignal((signal) => signal + 1)
    setTargetPosition(null)
  }, [])
  const handleClose = useCallback(() => setSelectedExhibit(null), [])

  const handleTeleport = useCallback((section: SectionType) => {
    setTargetPosition(SECTION_TARGETS[section])
  }, [])

  const selectedFounderId =
    selectedExhibit?.type === 'founder' ? (selectedExhibit.data as Founder).id : null
  const selectedHistoryId =
    selectedExhibit?.type === 'history' ? (selectedExhibit.data as HistoryExhibit).id : null

  return (
    <div className={`gr-root${isMobile ? ' is-mobile' : ''}`}>
      <Canvas
        shadows={!isMobile}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => setSelectedExhibit(null)}
      >
        <color attach="background" args={['#0e1724']} />
        <fog attach="fog" args={['#0e1724', 45, 95]} />

        <PerspectiveCamera
          makeDefault
          position={START_POSITION}
          fov={isMobile ? 66 : 56}
          near={0.1}
          far={140}
        />

        <Suspense fallback={null}>
          <GalleryLighting castShadows={!isMobile} />
          <GalleryEnvironment isNearDirectory={isNearDirectory} />

          {/* Section 1 (Left Side): 13 Photos of UNDIP Founders */}
          <FoundersWing
            selectedFounderId={selectedFounderId}
            hoveredId={hoveredId}
            onSelectFounder={handleSelectFounder}
            onHover={handleHover}
          />

          {/* Section 2 (Right Side): UNDIP's History, Early Photos, Founding Decree, & Archives */}
          <HistoryArchivesWing
            selectedExhibitId={selectedHistoryId}
            hoveredId={hoveredId}
            onSelectExhibit={handleSelectHistory}
            onHover={handleHover}
          />

          {/* Center: 3D Miniature Map of UNDIP with Red Carpet Underneath */}
          <MiniatureMap
            position={MINIATURE_MAP_POS}
            isSelected={selectedExhibit?.type === 'miniature-map'}
            isHovered={hoveredId === 'miniature-map'}
            onSelect={handleSelectMap}
            onHover={handleHover}
          />

          {/* Center End: Ceremonial Dais & Podium with Inscription Plaque (Prasasti) */}
          <CeremonialPodium
            position={PODIUM_POS}
            isSelected={selectedExhibit?.type === 'podium'}
            isHovered={hoveredId === 'podium'}
            onSelect={handleSelectPodium}
            onSelectPrasasti={handleSelectPrasasti}
            onHover={handleHover}
          />
        </Suspense>

        <FirstPersonControls
          resetSignal={resetSignal}
          targetPosition={targetPosition}
          moveInputRef={moveInputRef}
          hoveredRef={hoveredRef}
          panelOpenRef={panelOpenRef}
          draggedRef={draggedRef}
          onProximityChange={setIsNearDirectory}
        />
      </Canvas>

      {/* Subtle Desktop Hints */}
      {!isMobile && <DesktopHints />}

      {/* Mobile Touch Controls */}
      {isMobile && (
        <MobileControls
          moveInputRef={moveInputRef}
          visible={selectedExhibit === null}
          onReset={handleReset}
          onTeleport={handleTeleport}
        />
      )}

      {/* Interactive Wayfinding Prompt: Appears ONLY when near the Directory Board */}
      <WayfindingPrompt
        visible={isNearDirectory && selectedExhibit === null}
        onTeleport={handleTeleport}
      />

      {/* Information Panel: Default right sidebar, expandable to large center modal */}
      <ExhibitInformationPanel
        selected={selectedExhibit}
        onClose={handleClose}
      />
    </div>
  )
}
