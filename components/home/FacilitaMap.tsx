'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrthographicCamera } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { SceneMeshes } from './facilita-map/SceneMeshes'
import { SceneDecorations } from './facilita-map/SceneDecorations'
import {
  ZONA_DISPLAY_DATA,
  type ZonaDisplayData,
  STEP_CAMERAS,
  CAM_OFFSET,
  STANDALONE_BG,
  STEP_BG_COLORS,
  _bgColor,
  _stepA,
  _stepB,
  _camTarget,
} from './facilita-map/constants'

// ── Camera helpers ────────────────────────────────────────────────────────

function CameraLookAt() {
  const { camera } = useThree()
  const done = useRef(false)
  useFrame(() => {
    if (!done.current) {
      const s = STEP_CAMERAS[0]
      camera.lookAt(s.tx, 0, s.tz)
      done.current = true
    }
  })
  return null
}

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

    _camTarget.set(tx + CAM_OFFSET[0], CAM_OFFSET[1], tz + CAM_OFFSET[2])
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

    _stepA.set(STEP_BG_COLORS[si])
    _stepB.set(STEP_BG_COLORS[ni])
    _stepA.lerp(_stepB, blend)

    const entry = entryProgressRef ? THREE.MathUtils.clamp(entryProgressRef.current, 0, 1) : 1
    _bgColor.set(STANDALONE_BG).lerp(_stepA, entry)

    if (!(scene.background instanceof THREE.Color)) {
      scene.background = new THREE.Color()
    }
    ;(scene.background as THREE.Color).copy(_bgColor)
  })

  return null
}

// ── Tooltip ───────────────────────────────────────────────────────────────

function Tooltip({ zona, x, y }: { zona: ZonaDisplayData; x: number; y: number }) {
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
        <span
          className="block font-sans text-[9px] tracking-[0.3em] uppercase mb-2"
          style={{ color: 'rgba(201,169,110,0.75)' }}
        >
          {zona.index} — {zona.label}
        </span>
        <h3
          className="font-serif text-[1.1rem] leading-tight mb-1.5"
          style={{ color: '#F5F0E8' }}
        >
          {zona.headline}
        </h3>
        <div className="w-6 h-px mb-3" style={{ background: 'rgba(201,169,110,0.4)' }} />
        <p
          className="font-sans text-xs leading-relaxed mb-4"
          style={{ color: 'rgba(245,240,232,0.5)' }}
        >
          {zona.description}
        </p>
        <span
          className="inline-flex items-center gap-2 font-sans text-[9px] tracking-[0.22em] uppercase"
          style={{ color: '#C9A96E' }}
        >
          Scopri
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path
              d="M1 4H11M8 1L11 4L8 7"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </motion.div>
  )
}

// ── Props ─────────────────────────────────────────────────────────────────

interface FacilitaMapProps {
  scrollProgressRef?: { current: number }
  entryProgressRef?: { current: number }
  onZoneClick?: (zoneId: string) => void
  fillHeight?: boolean
}

// ── Main export ───────────────────────────────────────────────────────────

export default function FacilitaMap({
  scrollProgressRef,
  entryProgressRef,
  onZoneClick,
  fillHeight,
}: FacilitaMapProps = {}) {
  const [hoveredZonaId, setHoveredZonaId] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const leaveTimer = useRef<ReturnType<typeof setTimeout>>()
  const router = useRouter()

  const hoveredZona = hoveredZonaId ? (ZONA_DISPLAY_DATA[hoveredZonaId] ?? null) : null

  const handleEnter = useCallback((zonaId: string) => {
    clearTimeout(leaveTimer.current)
    setHoveredZonaId(zonaId)
  }, [])

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setHoveredZonaId(null), 60)
  }, [])

  const handleClick = useCallback(
    (href: string) => {
      if (onZoneClick) {
        const zona = Object.values(ZONA_DISPLAY_DATA).find((z) => z.href === href)
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

  // Initial camera position: first step target + isometric offset
  const s0 = STEP_CAMERAS[0]
  const initCamPos: [number, number, number] = [
    s0.tx + CAM_OFFSET[0],
    CAM_OFFSET[1],
    s0.tz + CAM_OFFSET[2],
  ]

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        height: fillHeight ? '100%' : 'clamp(420px, 65vh, 700px)',
        cursor: hoveredZonaId ? 'pointer' : 'default',
      }}
      onMouseMove={handleMouseMove}
    >
      <Canvas shadows gl={{ antialias: true, alpha: false }}>
        <OrthographicCamera
          makeDefault
          position={initCamPos}
          zoom={s0.zoom}
          near={0.1}
          far={500}
        />

        {/* Camera & background controllers */}
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
          position={[60, 90, 50]}
          intensity={1.6}
          color="#FFF8EE"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-80}
          shadow-camera-right={80}
          shadow-camera-top={80}
          shadow-camera-bottom={-80}
          shadow-bias={-0.001}
        />
        <directionalLight position={[-30, 40, -30]} intensity={0.35} color="#C8DCFF" />

        {/* Ground plane — covers full site + margin */}
        <mesh position={[22, -0.1, 33.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[90, 110]} />
          <meshStandardMaterial color="#D8D2C0" roughness={0.96} />
        </mesh>

        {/* Data-driven area meshes */}
        <SceneMeshes
          hoveredZonaId={hoveredZonaId}
          scrollProgressRef={scrollProgressRef}
          onEnter={handleEnter}
          onLeave={handleLeave}
          onNavigate={handleClick}
        />

        {/* Decorative geometry */}
        <SceneDecorations />
      </Canvas>

      <div className="absolute inset-0 pointer-events-none select-none" />

      <AnimatePresence>
        {hoveredZona && <Tooltip zona={hoveredZona} x={mousePos.x} y={mousePos.y} />}
      </AnimatePresence>
    </div>
  )
}
