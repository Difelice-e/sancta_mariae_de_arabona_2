'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

interface SplineAreaProps {
  controlPoints: [number, number][]  // [x, z] pairs from sitePlan.json
  width: number                       // splineWidth in meters
  color?: string
}

export function SplineArea({ controlPoints, width, color = '#C8C0B0' }: SplineAreaProps) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      controlPoints.map(([x, z]) => new THREE.Vector3(x, 0.0, z))
    )
    return new THREE.TubeGeometry(curve, 30, width / 2, 6, false)
  }, [controlPoints, width])

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color={color} roughness={0.96} metalness={0} />
    </mesh>
  )
}
