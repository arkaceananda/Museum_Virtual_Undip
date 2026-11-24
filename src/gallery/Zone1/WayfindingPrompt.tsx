import { useState } from 'react'
import type { SectionType } from './types'

interface WayfindingPromptProps {
  visible: boolean
  onTeleport: (section: SectionType) => void
  onDismiss?: () => void
}

/**
 * Interactive Wayfinding Prompt: "Mau kemana??"
 * Appears ONLY when the visitor approaches the 3D Directory Board near the entrance.
 * Disappears automatically when stepping away.
 */
export function WayfindingPrompt({
  visible,
  onTeleport,
  onDismiss,
}: WayfindingPromptProps) {
  const [dismissed, setDismissed] = useState(false)

  // Reset dismissed state when visitor leaves and re-enters the board area
  if (!visible && dismissed) {
    setDismissed(false)
  }

  if (!visible || dismissed) return null

  const handleSelect = (section: SectionType) => {
    onTeleport(section)
    setDismissed(true)
  }

  return (
    <div className="gr-wayfind-overlay" role="dialog" aria-label="Panduan Petunjuk Arah">
      <div className="gr-wayfind-card">
        <header className="gr-wayfind-head">
          <div className="gr-wayfind-tag">
            <span>📍 Papan Petunjuk Arah</span>
          </div>
          <button
            type="button"
            className="gr-wayfind-close"
            onClick={() => {
              setDismissed(true)
              onDismiss?.()
            }}
            aria-label="Tutup pilihan"
          >
            ×
          </button>
        </header>

        <div className="gr-wayfind-body">
          <h3 className="gr-wayfind-question">Mau kemana??</h3>
          <p className="gr-wayfind-subtitle">
            Pilih area museum yang ingin Anda kunjungi secara langsung:
          </p>

          <div className="gr-wayfind-grid">
            <button
              type="button"
              className="gr-wayfind-btn gr-wayfind-gold"
              onClick={() => handleSelect('founders')}
            >
              <span className="gr-btn-icon">👥</span>
              <div className="gr-btn-text">
                <strong>5 Pendiri & 13 Rektorat</strong>
                <small>Sayap Kiri • 5 Tokoh Utama & 13 Rektorat</small>
              </div>
            </button>

            <button
              type="button"
              className="gr-wayfind-btn gr-wayfind-gold"
              onClick={() => handleSelect('podium')}
            >
              <span className="gr-btn-icon">🎙️</span>
              <div className="gr-btn-text">
                <strong>Podium Kehormatan Undip</strong>
                <small>Ujung Karpet Merah • Panggung Seremonial</small>
              </div>
            </button>

            <button
              type="button"
              className="gr-wayfind-btn gr-wayfind-gold"
              onClick={() => handleSelect('history')}
            >
              <span className="gr-btn-icon">📜</span>
              <div className="gr-btn-text">
                <strong>Sejarah & Arsip Resmi</strong>
                <small>Sayap Kanan • SK 1961, Foto Awal, Pidato Bung Karno</small>
              </div>
            </button>

            <button
              type="button"
              className="gr-wayfind-btn gr-wayfind-gold"
              onClick={() => handleSelect('prasasti')}
            >
              <span className="gr-btn-icon">🏛️</span>
              <div className="gr-btn-text">
                <strong>Prasasti Pendirian Undip</strong>
                <small>Area Podium • Batu Marmer Hitam Obsidian</small>
              </div>
            </button>

            <button
              type="button"
              className="gr-wayfind-btn gr-wayfind-subtle"
              onClick={() => handleSelect('entrance')}
            >
              <span className="gr-btn-icon">🏛️</span>
              <div className="gr-btn-text">
                <strong>Pintu Masuk Utama</strong>
                <small>Kembali ke titik awal koridor</small>
              </div>
            </button>
          </div>
        </div>

        <footer className="gr-wayfind-foot">
          <span className="gr-wayfind-hint">
            💡 Panduan ini muncul otomatis saat Anda mendekati papan petunjuk arah.
          </span>
        </footer>
      </div>
    </div>
  )
}
