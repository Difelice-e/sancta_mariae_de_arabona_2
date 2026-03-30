'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

// ── Zone data ─────────────────────────────────────────────────────────
//
// Camera at [11, 15, 11] = SE isometric view.
// In the rendered image: −X/−Z → top-left (NW), +X/+Z → bottom-right (SE).
// Real layout from aerial photos:
//   - Soccer + padel fields: center-left (slightly −X, −Z)
//   - Building / restaurant:  right-center (+X, neutral Z)
//   - Parking / event area:   center-front (+Z)
//   - Wooded outdoor zone:    far left (very −X)

interface ZonaData {
  id: string
  index: string
  label: string
  headline: string
  description: string
  href: string
  hoverColor: string
  neutralColor: string
  pos: [number, number, number]
  size: [number, number, number]
}

const NEUTRAL = '#C8C2B4'

// ── Scroll-driven camera + zone highlight ────────────────────────────

// Camera target per step (camera position = target + isometric offset [11, 15, 11])
const STEP_CAMERAS = [
  { tx: 5.0, tz: 0.0, zoom: 42 },    // Ristorante — building
  { tx: -2.0, tz: -3.0, zoom: 40 },  // Campi — sports fields
  { tx: 1.0, tz: 5.0, zoom: 36 },    // Eventi — parking/events
  { tx: -8.0, tz: 0.0, zoom: 32 },   // Outdoor — forest
]
const STEP_ACTIVE_ZONES = ['ristorante', 'campi', 'eventi', 'outdoor']
const _camTarget = new THREE.Vector3()

// Per-step scene background colors (dark, tinted to match each experience)
const STANDALONE_BG = '#EDE5D4'
const STEP_BG_COLORS = ['#18120A', '#0E180A', '#14101A', '#0A140E']
const _bgColor = new THREE.Color()
const _stepA = new THREE.Color()
const _stepB = new THREE.Color()

const ZONE_DATA: ZonaData[] = [
  {
    id: 'campi',
    index: '01',
    label: 'Sport & Svago',
    headline: 'Campi Sportivi',
    description: 'Calcio a 5 e padel in un paesaggio naturale unico',
    href: '/campi-sportivi',
    hoverColor: '#7A9B62',
    neutralColor: NEUTRAL,
    // center-left, back portion — covers soccer field + 2 padel courts
    pos: [-2, 0.15, -3],
    size: [11, 0.45, 7],
  },
  {
    id: 'ristorante',
    index: '02',
    label: 'Cucina Abruzzese',
    headline: 'Ristorante',
    description: 'Materie prime locali, stagionalità assoluta',
    href: '/ristorante',
    hoverColor: '#C9A96E',
    neutralColor: NEUTRAL,
    // right side, center depth — building footprint
    pos: [6.5, 0.05, 0.5],
    size: [5.5, 0.35, 5],
  },
  {
    id: 'eventi',
    index: '03',
    label: 'Matrimoni & Privé',
    headline: 'Organizzazione Eventi',
    description: 'Spazio aperto e versatile per ogni celebrazione',
    href: '/eventi-cerimonie',
    hoverColor: '#8A7A9E',
    neutralColor: '#C0BAB0',
    // center-front — parking + open event area
    pos: [1.5, -0.05, 5.5],
    size: [15, 0.2, 5],
  },
  {
    id: 'outdoor',
    index: '04',
    label: "Natura & Avventura",
    headline: "Attività all'Aperto",
    description: 'Trekking, picnic e natura selvaggia abruzzese',
    href: '/attivita-allaperto',
    hoverColor: '#5A8A5E',
    neutralColor: '#C0BEAE',
    // far-left strip — wooded/natural zone
    pos: [-9.5, 0, 0],
    size: [4, 0.22, 20],
  },
]

// ── Camera helper ─────────────────────────────────────────────────────

function CameraLookAt() {
  const { camera } = useThree()
  const done = useRef(false)
  useFrame(() => {
    if (!done.current) {
      camera.lookAt(0, 0, 0)
      done.current = true
    }
  })
  return null
}

function ScrollCameraController({
  scrollProgressRef,
}: {
  scrollProgressRef: { current: number }
}) {
  const { camera } = useThree()
  const initialized = useRef(false)

  useFrame(() => {
    const stepFloat = Math.min(3.9999, scrollProgressRef.current * 4)
    const si = Math.floor(stepFloat)
    const ni = Math.min(3, si + 1)
    const blend = THREE.MathUtils.smoothstep(stepFloat - si, 0.8, 1.0)

    const cur = STEP_CAMERAS[si]
    const nxt = STEP_CAMERAS[ni]
    const tx = cur.tx + (nxt.tx - cur.tx) * blend
    const tz = cur.tz + (nxt.tz - cur.tz) * blend
    const zoom = cur.zoom + (nxt.zoom - cur.zoom) * blend

    _camTarget.set(tx + 11, 15, tz + 11)
    if (!initialized.current) {
      camera.position.copy(_camTarget)
      initialized.current = true
    } else {
      camera.position.lerp(_camTarget, 0.08)
    }
    camera.lookAt(tx, 0, tz)

    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom += (zoom - camera.zoom) * 0.08
      camera.updateProjectionMatrix()
    }
  })

  return null
}

// ── Scene background controllers ─────────────────────────────────────

// Standalone mode: set scene background to ivory once (fixes black edges beyond ground plane)
function StandaloneBackground() {
  const { scene } = useThree()
  const done = useRef(false)
  useFrame(() => {
    if (!done.current) {
      scene.background = new THREE.Color(STANDALONE_BG)
      done.current = true
    }
  })
  return null
}

// Scroll mode: lerp scene background between per-step dark colors.
// Also lerps from ivory → step color during the entry phase so there's no hard cut
// when the map transitions from full-width to the right half.
function SceneBackgroundController({
  scrollProgressRef,
  entryProgressRef,
}: {
  scrollProgressRef: { current: number }
  entryProgressRef?: { current: number }
}) {
  const { scene } = useThree()

  useFrame(() => {
    const stepFloat = Math.min(3.9999, scrollProgressRef.current * 4)
    const si = Math.floor(stepFloat)
    const ni = Math.min(3, si + 1)
    const blend = THREE.MathUtils.smoothstep(stepFloat - si, 0.8, 1.0)

    // Interpolate between current and next step color
    _stepA.set(STEP_BG_COLORS[si])
    _stepB.set(STEP_BG_COLORS[ni])
    _stepA.lerp(_stepB, blend)

    // During entry phase, crossfade from ivory into the step color
    const entry = entryProgressRef ? THREE.MathUtils.clamp(entryProgressRef.current, 0, 1) : 1
    _bgColor.set(STANDALONE_BG).lerp(_stepA, entry)

    if (!(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color()
    }
    ;(scene.background as THREE.Color).copy(_bgColor)
  })

  return null
}

// ── Zone mesh ─────────────────────────────────────────────────────────

interface ZoneMeshProps {
  zona: ZonaData
  isHovered: boolean
  scrollProgressRef?: { current: number }
  onEnter?: (id: string) => void
  onLeave?: () => void
  onNavigate?: (href: string) => void
}

function ZoneMesh({ zona, isHovered, scrollProgressRef, onEnter, onLeave, onNavigate }: ZoneMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)
  const baseY = zona.pos[1]

  useFrame((_, dt) => {
    if (!meshRef.current || !matRef.current) return
    const speed = Math.min(dt * 9, 1)

    let isActive = false
    if (scrollProgressRef) {
      const step = Math.min(3, Math.floor(scrollProgressRef.current * 4))
      isActive = STEP_ACTIVE_ZONES[step] === zona.id
    }
    const shouldHighlight = isHovered || isActive

    const targetY = baseY + (shouldHighlight ? 0.4 : 0)
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * speed

    const targetColor = new THREE.Color(shouldHighlight ? zona.hoverColor : zona.neutralColor)
    matRef.current.color.lerp(targetColor, speed)

    const targetRoughness = shouldHighlight ? 0.65 : 0.88
    matRef.current.roughness += (targetRoughness - matRef.current.roughness) * speed
  })

  return (
    <mesh
      ref={meshRef}
      position={zona.pos}
      onPointerEnter={onEnter ? (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onEnter(zona.id) } : undefined}
      onPointerLeave={onLeave ? () => onLeave() : undefined}
      onClick={onNavigate ? (e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onNavigate(zona.href) } : undefined}
      castShadow
      receiveShadow
    >
      <boxGeometry args={zona.size} />
      <meshStandardMaterial
        ref={matRef}
        color={zona.neutralColor}
        roughness={0.88}
        metalness={0.0}
      />
    </mesh>
  )
}

// ── Conifer tree (wooded / outdoor zone) ──────────────────────────────

function Tree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18 * scale, 0]}>
        <cylinderGeometry args={[0.07 * scale, 0.11 * scale, 0.35 * scale, 6]} />
        <meshStandardMaterial color="#7A6A50" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.58 * scale, 0]}>
        <coneGeometry args={[0.4 * scale, 0.8 * scale, 7]} />
        <meshStandardMaterial color="#4A5835" roughness={0.8} />
      </mesh>
    </group>
  )
}

// ── Olive tree (right side / grove) ───────────────────────────────────

function OliveTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.18 * scale, 0]}>
        <cylinderGeometry args={[0.06 * scale, 0.1 * scale, 0.35 * scale, 5]} />
        <meshStandardMaterial color="#8A7A58" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.58 * scale, 0]}>
        <sphereGeometry args={[0.36 * scale, 7, 5]} />
        <meshStandardMaterial color="#7E9060" roughness={0.82} />
      </mesh>
    </group>
  )
}

// ── Building ──────────────────────────────────────────────────────────
// Masonry structure on the right side with a shallow pitched (gable) roof.
// Two thin panels meet at the ridge to simulate a real tiled roof.

function Building() {
  // Main body: center [6.5, 0.6, 0.5], size [4, 1.0, 3]
  // Wall top at y = 0.6 + 0.5 = 1.1
  // Ridge at y ≈ 1.64 (15° slope over half-width 2)
  // Left eave x = 6.5 - 2.1 = 4.4, right eave x = 6.5 + 2.1 = 8.6
  // Panel center y = (1.1 + 1.64) / 2 = 1.37
  // Panel half-length ≈ 1.1 (hypotenuse), rotation ±0.25 rad (~14.3°)
  return (
    <group>
      {/* Main body */}
      <mesh position={[6.5, 0.6, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[4, 1.0, 3]} />
        <meshStandardMaterial color="#D4C4A0" roughness={0.85} />
      </mesh>

      {/* Pitched roof — left panel */}
      <mesh position={[5.45, 1.37, 0.5]} rotation={[0, 0, 0.25]} castShadow>
        <boxGeometry args={[2.2, 0.1, 3.3]} />
        <meshStandardMaterial color="#6A5848" roughness={0.92} />
      </mesh>
      {/* Pitched roof — right panel (slightly darker face) */}
      <mesh position={[7.55, 1.37, 0.5]} rotation={[0, 0, -0.25]} castShadow>
        <boxGeometry args={[2.2, 0.1, 3.3]} />
        <meshStandardMaterial color="#5A4838" roughness={0.92} />
      </mesh>

      {/* Annexe / small outbuilding to the left of main body */}
      <mesh position={[4.0, 0.4, 1.8]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.65, 1.8]} />
        <meshStandardMaterial color="#C8B898" roughness={0.88} />
      </mesh>
      {/* Annexe roof — left panel */}
      <mesh position={[3.45, 0.86, 1.8]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[1.2, 0.09, 2.0]} />
        <meshStandardMaterial color="#6A5848" roughness={0.92} />
      </mesh>
      {/* Annexe roof — right panel */}
      <mesh position={[4.55, 0.86, 1.8]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[1.2, 0.09, 2.0]} />
        <meshStandardMaterial color="#5A4838" roughness={0.92} />
      </mesh>

      {/* Outdoor terrace / pergola floor in front of building */}
      <mesh position={[6.5, 0.08, 3.2]} receiveShadow>
        <boxGeometry args={[5.5, 0.1, 1.8]} />
        <meshStandardMaterial color="#C0B090" roughness={0.92} />
      </mesh>
      {/* Pergola posts */}
      {[-2, 0, 2].map((x) => (
        <mesh key={x} position={[6.5 + x, 0.55, 4.0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.95, 5]} />
          <meshStandardMaterial color="#8A7A68" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ── Sports field details ───────────────────────────────────────────────
// Positioned inside the `campi` zone (X: −7.5 to 3.5 / Z: −6.5 to 0.5).
// Soccer / calcio a 5: back-left portion.
// Two padel courts: side-by-side in the center-right portion.

function SportsDetails() {
  return (
    <group>
      {/* ─── Calcio a 5 / Soccer field (back-left) ─── */}
      <mesh position={[-3, 0.42, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.5, 3.8]} />
        <meshStandardMaterial color="#3A6E28" roughness={0.88} />
      </mesh>
      {/* Center line */}
      <mesh position={[-3, 0.43, -4.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.07, 3.8]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.9} opacity={0.55} transparent />
      </mesh>
      {/* Long border lines */}
      {[-1.85, 1.85].map((dz) => (
        <mesh key={dz} position={[-3, 0.43, -4.5 + dz]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[5.5, 0.07]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} opacity={0.35} transparent />
        </mesh>
      ))}

      {/* ─── Padel court 1 ─── */}
      <mesh position={[-0.8, 0.42, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 4.5]} />
        <meshStandardMaterial color="#3A7A60" roughness={0.85} />
      </mesh>
      {/* Net */}
      <mesh position={[-0.8, 0.60, -2.2]}>
        <boxGeometry args={[2.0, 0.16, 0.06]} />
        <meshStandardMaterial color="#E8E0CC" roughness={0.9} />
      </mesh>

      {/* ─── Padel court 2 ─── */}
      <mesh position={[1.6, 0.42, -2.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 4.5]} />
        <meshStandardMaterial color="#3A7A60" roughness={0.85} />
      </mesh>
      {/* Net */}
      <mesh position={[1.6, 0.60, -2.2]}>
        <boxGeometry args={[2.0, 0.16, 0.06]} />
        <meshStandardMaterial color="#E8E0CC" roughness={0.9} />
      </mesh>
    </group>
  )
}

// ── Parking / event area ───────────────────────────────────────────────
// Light gravel surface with stall markings inside the `eventi` zone.

function ParkingArea() {
  return (
    <group>
      {/* Gravel surface */}
      <mesh position={[3, 0.02, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 4.5]} />
        <meshStandardMaterial color="#D4CCC0" roughness={0.96} />
      </mesh>
      {/* Stall dividers */}
      {[-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8].map((dx) => (
        <mesh key={dx} position={[3 + dx, 0.04, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.06, 4]} />
          <meshStandardMaterial color="#B8B0A8" roughness={0.9} opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  )
}

// ── Scene ─────────────────────────────────────────────────────────────

interface SceneProps {
  hoveredId: string | null
  scrollProgressRef?: { current: number }
  entryProgressRef?: { current: number }
  onEnter?: (id: string) => void
  onLeave?: () => void
  onNavigate?: (href: string) => void
}

function FacilitaScene({ hoveredId, scrollProgressRef, entryProgressRef, onEnter, onLeave, onNavigate }: SceneProps) {
  return (
    <>
      {!scrollProgressRef && <CameraLookAt />}
      {!scrollProgressRef && <StandaloneBackground />}
      {scrollProgressRef && <ScrollCameraController scrollProgressRef={scrollProgressRef} />}
      {scrollProgressRef && (
        <SceneBackgroundController
          scrollProgressRef={scrollProgressRef}
          entryProgressRef={entryProgressRef}
        />
      )}

      {/* Lighting */}
      <ambientLight intensity={1.4} color="#F5F0E8" />
      <directionalLight
        position={[12, 18, 10]}
        intensity={1.6}
        color="#FFF8EE"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.001}
      />
      <directionalLight position={[-6, 8, -6]} intensity={0.35} color="#C8DCFF" />

      {/* Ground */}
      <mesh position={[0, -0.45, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[34, 28]} />
        <meshStandardMaterial color="#D8D2C0" roughness={0.96} />
      </mesh>

      {/* Interactive zones */}
      {ZONE_DATA.map((zona) => (
        <ZoneMesh
          key={zona.id}
          zona={zona}
          isHovered={hoveredId === zona.id}
          scrollProgressRef={scrollProgressRef}
          onEnter={onEnter}
          onLeave={onLeave}
          onNavigate={onNavigate}
        />
      ))}

      {/* Decorative geometry */}
      <Building />
      <SportsDetails />
      <ParkingArea />

      {/* ── Wooded outdoor zone — conifers (left strip) ─────────────── */}
      <Tree position={[-9.2, 0.22, -7.5]} scale={1.1} />
      <Tree position={[-8.6, 0.22, -5.5]} scale={0.95} />
      <Tree position={[-9.6, 0.22, -3.5]} scale={1.15} />
      <Tree position={[-8.8, 0.22, -1.5]} scale={0.88} />
      <Tree position={[-9.3, 0.22, 0.5]} scale={1.0} />
      <Tree position={[-8.7, 0.22, 2.5]} scale={1.05} />
      <Tree position={[-9.5, 0.22, 4.5]} scale={0.9} />
      <Tree position={[-8.9, 0.22, 6.5]} scale={1.1} />

      {/* ── Olive grove — right side along the road ──────────────────── */}
      <OliveTree position={[9.8, 0.22, -5.5]} scale={1.0} />
      <OliveTree position={[9.8, 0.22, -3.5]} scale={0.92} />
      <OliveTree position={[9.8, 0.22, -1.5]} scale={1.05} />
      <OliveTree position={[9.8, 0.22, 0.5]} scale={0.96} />
      <OliveTree position={[9.8, 0.22, 2.5]} scale={1.0} />
      <OliveTree position={[9.8, 0.22, 4.5]} scale={0.88} />
      <OliveTree position={[9.8, 0.22, 6.5]} scale={1.05} />

      {/* ── Olive grove — back-right (scattered) ─────────────────────── */}
      <OliveTree position={[5.5, 0.22, -7.5]} scale={0.9} />
      <OliveTree position={[7.5, 0.22, -7.5]} scale={1.0} />
      <OliveTree position={[9.0, 0.22, -7.5]} scale={0.85} />
      <OliveTree position={[6.5, 0.22, -9]} scale={0.92} />
      <OliveTree position={[8.5, 0.22, -9]} scale={0.88} />

      {/* ── Back perimeter — behind sports zone ──────────────────────── */}
      <Tree position={[-5.5, 0.22, -8.5]} scale={0.9} />
      <Tree position={[-2.5, 0.22, -8.5]} scale={0.85} />
      <Tree position={[0.5, 0.22, -8.5]} scale={0.95} />

      {/* ── Entry road (bottom-right, toward road) ───────────────────── */}
      <mesh position={[9.5, -0.44, 8]} rotation={[-Math.PI / 2, 0, -0.3]}>
        <planeGeometry args={[1.8, 5.5]} />
        <meshStandardMaterial color="#C8C0B0" roughness={0.95} />
      </mesh>
    </>
  )
}

// ── Tooltip ───────────────────────────────────────────────────────────

function Tooltip({
  zona,
  x,
  y,
}: {
  zona: ZonaData
  x: number
  y: number
}) {
  const tipX = typeof window !== 'undefined' && x + 240 > window.innerWidth ? x - 248 : x + 18
  const tipY = Math.max(16, y - 90)

  return (
    <motion.div
      key={zona.id}
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="fixed z-50 pointer-events-none"
      style={{ left: tipX, top: tipY }}
    >
      <div
        className="rounded-sm px-5 py-4 max-w-[230px] shadow-2xl"
        style={{
          background: 'rgba(10,22,40,0.96)',
          border: '1px solid rgba(201,169,110,0.25)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <span className="block font-sans text-[9px] tracking-[0.3em] uppercase mb-2"
          style={{ color: 'rgba(201,169,110,0.75)' }}>
          {zona.index} — {zona.label}
        </span>
        <h3 className="font-serif text-[1.1rem] leading-tight mb-1.5"
          style={{ color: '#F5F0E8' }}>
          {zona.headline}
        </h3>
        <div className="w-6 h-px mb-3" style={{ background: 'rgba(201,169,110,0.4)' }} />
        <p className="font-sans text-xs leading-relaxed mb-4"
          style={{ color: 'rgba(245,240,232,0.5)' }}>
          {zona.description}
        </p>
        <span className="inline-flex items-center gap-2 font-sans text-[9px] tracking-[0.22em] uppercase"
          style={{ color: '#C9A96E' }}>
          Scopri
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 4H11M8 1L11 4L8 7"
              stroke="currentColor" strokeWidth="1.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </motion.div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────

interface FacilitaMapProps {
  scrollProgressRef?: { current: number }
  entryProgressRef?: { current: number }
  onZoneClick?: (zoneId: string) => void
  fillHeight?: boolean
}

// ── Main export ───────────────────────────────────────────────────────

export default function FacilitaMap({ scrollProgressRef, entryProgressRef, onZoneClick, fillHeight }: FacilitaMapProps = {}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>()
  const router = useRouter()

  const hoveredZona = hoveredId ? ZONE_DATA.find((z) => z.id === hoveredId) ?? null : null

  const handleEnter = useCallback((id: string) => {
    clearTimeout(leaveTimer.current)
    setHoveredId(id)
  }, [])

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHoveredId(null), 60)
  }, [])

  // In scroll mode: click scrolls to the corresponding step via onZoneClick(id).
  // In standalone mode: click navigates to the zone's page.
  const handleClick = useCallback(
    (href: string) => {
      if (onZoneClick) {
        const zona = ZONE_DATA.find((z) => z.href === href)
        if (zona) onZoneClick(zona.id)
      } else {
        router.push(href)
      }
    },
    [onZoneClick, router],
  )

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => () => clearTimeout(leaveTimer.current), [])

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: fillHeight ? '100%' : 'clamp(420px, 65vh, 700px)',
        cursor: hoveredId ? 'pointer' : 'default',
      }}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <OrthographicCamera
          makeDefault
          position={[11, 15, 11]}
          zoom={34}
          near={0.1}
          far={250}
        />
        <FacilitaScene
          hoveredId={hoveredId}
          scrollProgressRef={scrollProgressRef}
          entryProgressRef={entryProgressRef}
          onEnter={handleEnter}
          onLeave={handleLeave}
          onNavigate={handleClick}
        />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none select-none" />

      <AnimatePresence>
        {hoveredZona && (
          <Tooltip zona={hoveredZona} x={mousePos.x} y={mousePos.y} />
        )}
      </AnimatePresence>
    </div>
  )
}
