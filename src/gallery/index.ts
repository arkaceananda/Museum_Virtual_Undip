/**
 * Museum Virtual Undip — Master Zone Registry
 * Scalable entry point for all virtual museum exhibition zones:
 * - Zone 1: Ruang Kehormatan & Sejarah (Founders Wing, History Archives, Ceremonial Dais)
 * - Future zones (Zone 2, Zone 3, etc.) will be cleanly registered here.
 */
export { Zone1, Zone1Scene, GalleryScene } from './Zone1/Zone1'
export { FoundersWing } from './Zone1/FoundersWing'
export { HistoryArchivesWing } from './Zone1/HistoryArchivesWing'
export { CeremonialPodium } from './Zone1/CeremonialPodium'
export { MiniatureMap } from './Zone1/MiniatureMap'
export { RedCarpet } from './Zone1/RedCarpet'
export { CeilingRoof } from './Zone1/CeilingRoof'
export { Chandelier } from './Zone1/Chandelier'
export { GalleryLighting } from './Zone1/GalleryLighting'
export { GalleryEnvironment } from './Zone1/GalleryEnvironment'
export { ExhibitInformationPanel } from './Zone1/ExhibitInformationPanel'
export { DirectoryBoard } from './Zone1/DirectoryBoard'
export { WayfindingPrompt } from './Zone1/WayfindingPrompt'
export { FirstPersonControls } from './Zone1/FirstPersonControls'
export { MobileControls } from './Zone1/MobileControls'
export { DesktopHints } from './Zone1/DesktopHints'
export { UNDIP_FOUNDERS, HISTORY_EXHIBITS } from './Zone1/data/exhibits'
export * from './Zone1/types'
export * from './Zone1/layout'
