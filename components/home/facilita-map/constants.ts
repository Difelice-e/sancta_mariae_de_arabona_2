import * as THREE from 'three'

// ── Zone display data (one entry per interactive zona) ──────────────────

export interface ZonaDisplayData {
  id: string
  index: string
  label: string
  headline: string
  description: string
  href: string
  hoverColor: string
  neutralColor: string
}

const NEUTRAL = '#C8C2B4'

export const ZONA_DISPLAY_DATA: Record<string, ZonaDisplayData> = {
  campi: {
    id: 'campi',
    index: '01',
    label: 'Sport & Svago',
    headline: 'Campi Sportivi',
    description: 'Calcio a 5 e padel in un paesaggio naturale unico',
    href: '/campi-sportivi',
    hoverColor: '#7A9B62',
    neutralColor: NEUTRAL,
  },
  ristorante: {
    id: 'ristorante',
    index: '02',
    label: 'Cucina Abruzzese',
    headline: 'Ristorante',
    description: 'Materie prime locali, stagionalità assoluta',
    href: '/ristorante',
    hoverColor: '#C9A96E',
    neutralColor: NEUTRAL,
  },
  eventi: {
    id: 'eventi',
    index: '03',
    label: 'Matrimoni & Privé',
    headline: 'Organizzazione Eventi',
    description: 'Spazio aperto e versatile per ogni celebrazione',
    href: '/eventi-cerimonie',
    hoverColor: '#8A7A9E',
    neutralColor: '#C0BAB0',
  },
  outdoor: {
    id: 'outdoor',
    index: '04',
    label: 'Natura & Avventura',
    headline: "Attività all'Aperto",
    description: 'Trekking, picnic e natura selvaggia abruzzese',
    href: '/attivita-allaperto',
    hoverColor: '#5A8A5E',
    neutralColor: '#C0BEAE',
  },
}

// ── Area-to-zona mapping (areaId → zonaId) ──────────────────────────────
// Areas not listed here are rendered as non-interactive decoration.

export const AREA_META: Record<string, { zonaId: string }> = {
  'campo-calcio-5': { zonaId: 'campi' },
  'padel-ovest':    { zonaId: 'campi' },
  'padel-est':      { zonaId: 'campi' },
  'ristorante-main':  { zonaId: 'ristorante' },
  'ristorante-gazebo': { zonaId: 'ristorante' },
  'zona-eventi':    { zonaId: 'eventi' },
  'zona-outdoor':   { zonaId: 'outdoor' },
}

// Non-interactive area base colors (areaId → hex)
export const STATIC_AREA_COLOR: Record<string, string> = {
  'servizi-nord':    '#D4C4A0',
  'perimetro-sito':  '#C8C0B0',
}

// ── Extrusion heights per category ──────────────────────────────────────

export const AREA_HEIGHTS: Record<string, number> = {
  boundary:    0.05,
  sport:       0.35,
  building:    3.5,
  restaurant:  4.0,
  events:      0.2,
  outdoor:     0.15,
  circulation: 0.1,
}

// ── Scroll-driven camera steps (metric coordinates) ─────────────────────

export const STEP_CAMERAS = [
  { tx: 24.0, tz: 37.0, zoom: 20 },  // Ristorante
  { tx: 15.0, tz: 22.0, zoom: 18 },  // Campi
  { tx: 21.0, tz: 57.0, zoom: 16 },  // Eventi
  { tx: 18.0, tz: 15.0, zoom: 14 },  // Outdoor
]
export const STEP_ACTIVE_ZONES = ['ristorante', 'campi', 'eventi', 'outdoor'] as const

// Camera isometric offset from look-at target
export const CAM_OFFSET: [number, number, number] = [55, 75, 55]

// ── Scene colors ─────────────────────────────────────────────────────────

export const STANDALONE_BG = '#EDE5D4'
export const STEP_BG_COLORS = ['#18120A', '#0E180A', '#14101A', '#0A140E']

// Pre-allocated THREE.Color instances (re-use across frames)
export const _bgColor = new THREE.Color()
export const _stepA = new THREE.Color()
export const _stepB = new THREE.Color()
export const _camTarget = new THREE.Vector3()
