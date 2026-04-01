'use client'

import { useRef, useMemo } from 'react'
import { useFrame, ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import {
  AREA_HEIGHTS,
  AREA_META,
  ZONA_DISPLAY_DATA,
  STATIC_AREA_COLOR,
  STEP_ACTIVE_ZONES,
} from './constants'

interface SitePlanHole {
  vertices2D: [number, number][]
}

export interface AreaMeshProps {
  areaId: string
  category: string
  vertices2D: [number, number][]
  holes?: SitePlanHole[]
  hoveredZonaId: string | null
  scrollProgressRef?: { current: number }
  onEnter?: (zonaId: string) => void
  onLeave?: () => void
  onNavigate?: (href: string) => void
}

// Build THREE.Shape from [x, z] vertex array.
// Sign-flip on Z: shape.y = -z so that after mesh.rotation.x = -π/2,
// world X = shape.x = site.x, world Z = -shape.y = site.z.
function buildShape(vertices: [number, number][], holes: SitePlanHole[] = []): THREE.Shape {
  const shape = new THREE.Shape()
  shape.moveTo(vertices[0][0], -vertices[0][1])
  for (let i = 1; i < vertices.length; i++) {
    shape.lineTo(vertices[i][0], -vertices[i][1])
  }
  shape.closePath()

  for (const hole of holes) {
    const path = new THREE.Path()
    path.moveTo(hole.vertices2D[0][0], -hole.vertices2D[0][1])
    for (let i = 1; i < hole.vertices2D.length; i++) {
      path.lineTo(hole.vertices2D[i][0], -hole.vertices2D[i][1])
    }
    path.closePath()
    shape.holes.push(path)
  }

  return shape
}

export function AreaMesh({
  areaId,
  category,
  vertices2D,
  holes = [],
  hoveredZonaId,
  scrollProgressRef,
  onEnter,
  onLeave,
  onNavigate,
}: AreaMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshStandardMaterial>(null)

  const meta = AREA_META[areaId]
  const zonaId = meta?.zonaId ?? null
  const zona = zonaId ? ZONA_DISPLAY_DATA[zonaId] : null
  const isInteractive = !!meta && !!zona

  const height = AREA_HEIGHTS[category] ?? 0.2
  const neutralColor = zona?.neutralColor ?? STATIC_AREA_COLOR[areaId] ?? '#C8C2B4'
  const hoverColor = zona?.hoverColor ?? neutralColor

  const geometry = useMemo(() => {
    const shape = buildShape(vertices2D, holes)
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: height,
      bevelEnabled: false,
    })
    return geo
  }, [vertices2D, holes, height])

  useFrame((_, dt) => {
    if (!meshRef.current || !matRef.current) return
    const speed = Math.min(dt * 9, 1)

    let isActive = false
    if (scrollProgressRef && zonaId) {
      const step = Math.min(3, Math.floor(scrollProgressRef.current * 4))
      isActive = STEP_ACTIVE_ZONES[step] === zonaId
    }
    const shouldHighlight = (hoveredZonaId === zonaId && zonaId !== null) || isActive

    const targetY = shouldHighlight ? 0.4 : 0
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * speed

    const targetColor = new THREE.Color(shouldHighlight ? hoverColor : neutralColor)
    matRef.current.color.lerp(targetColor, speed)

    const targetRoughness = shouldHighlight ? 0.65 : 0.88
    matRef.current.roughness += (targetRoughness - matRef.current.roughness) * speed
  })

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[-Math.PI / 2, 0, 0]}
      castShadow
      receiveShadow
      onPointerEnter={
        isInteractive && onEnter
          ? (e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation()
              onEnter(zonaId!)
            }
          : undefined
      }
      onPointerLeave={isInteractive && onLeave ? () => onLeave() : undefined}
      onClick={
        isInteractive && onNavigate && zona
          ? (e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation()
              onNavigate(zona.href)
            }
          : undefined
      }
    >
      <meshStandardMaterial
        ref={matRef}
        color={neutralColor}
        roughness={0.88}
        metalness={0.0}
      />
    </mesh>
  )
}
