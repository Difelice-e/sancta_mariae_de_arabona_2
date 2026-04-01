'use client'

import * as THREE from 'three'

// ── Conifer tree ──────────────────────────────────────────────────────────

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

// ── Olive tree ────────────────────────────────────────────────────────────

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

// ── Building roof (ristorante-main centroid [24.0, 36.6], wallHeight=4m) ─

function RestaurantRoof() {
  // Pitched roof panels sitting on top of the 4m ristorante-main extrusion.
  // Ristorante footprint ≈ 21.6m × 11.7m, rotation -3.7°.
  const rotY = THREE.MathUtils.degToRad(-3.7)
  return (
    <group position={[24.0, 4.0, 36.6]} rotation={[0, rotY, 0]}>
      {/* Left roof panel */}
      <mesh position={[-5.4, 1.0, 0]} rotation={[0, 0, 0.22]} castShadow>
        <boxGeometry args={[11.5, 0.25, 12.5]} />
        <meshStandardMaterial color="#6A5848" roughness={0.92} />
      </mesh>
      {/* Right roof panel */}
      <mesh position={[5.4, 1.0, 0]} rotation={[0, 0, -0.22]} castShadow>
        <boxGeometry args={[11.5, 0.25, 12.5]} />
        <meshStandardMaterial color="#5A4838" roughness={0.92} />
      </mesh>
      {/* Outdoor terrace/pergola in front (south side, +z) */}
      <mesh position={[0, -3.8, 9]} receiveShadow>
        <boxGeometry args={[18, 0.2, 6]} />
        <meshStandardMaterial color="#C0B090" roughness={0.92} />
      </mesh>
      {/* Pergola posts */}
      {[-6, 0, 6].map((dx) => (
        <mesh key={dx} position={[dx, -1.6, 11.5]}>
          <cylinderGeometry args={[0.2, 0.2, 4.5, 5]} />
          <meshStandardMaterial color="#8A7A68" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// ── Sports field surface markings ─────────────────────────────────────────
// campo-calcio-5 centroid [21.5, 10.0], rotation -3.7°
// padel-ovest centroid [4.1, 32.7], rotation -32°
// padel-est centroid [9.9, 42.1], rotation -32°

function SportsDetails() {
  const fieldRot = THREE.MathUtils.degToRad(-3.7)
  const padelRot = THREE.MathUtils.degToRad(-32)

  return (
    <group>
      {/* ── Football field surface ── */}
      <group position={[21.5, 0, 10.0]} rotation={[0, fieldRot, 0]}>
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[40, 20]} />
          <meshStandardMaterial color="#3A6E28" roughness={0.88} />
        </mesh>
        {/* Center line */}
        <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.2, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.9} opacity={0.5} transparent />
        </mesh>
        {/* Long border lines */}
        {[-9.5, 9.5].map((dz) => (
          <mesh key={dz} position={[0, 0.37, dz]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[40, 0.2]} />
            <meshStandardMaterial color="#FFFFFF" roughness={0.9} opacity={0.35} transparent />
          </mesh>
        ))}
      </group>

      {/* ── Padel court 1 (padel-ovest) ── */}
      <group position={[4.1, 0, 32.7]} rotation={[0, padelRot, 0]}>
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 18]} />
          <meshStandardMaterial color="#3A7A60" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[9, 0.4, 0.18]} />
          <meshStandardMaterial color="#E8E0CC" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Padel court 2 (padel-est) ── */}
      <group position={[9.9, 0, 42.1]} rotation={[0, padelRot, 0]}>
        <mesh position={[0, 0.36, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[9, 18]} />
          <meshStandardMaterial color="#3A7A60" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[9, 0.4, 0.18]} />
          <meshStandardMaterial color="#E8E0CC" roughness={0.9} />
        </mesh>
      </group>
    </group>
  )
}

// ── Parking stalls (zona-eventi centroid [21.0, 57.0]) ───────────────────

function ParkingArea() {
  return (
    <group position={[21.0, 0, 57.0]}>
      {/* Gravel surface */}
      <mesh position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[38, 14]} />
        <meshStandardMaterial color="#D4CCC0" roughness={0.96} />
      </mesh>
      {/* Stall dividers */}
      {[-14, -10, -6, -2, 2, 6, 10, 14].map((dx) => (
        <mesh key={dx} position={[dx, 0.3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, 13]} />
          <meshStandardMaterial color="#B8B0A8" roughness={0.9} opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  )
}

// ── Main export ───────────────────────────────────────────────────────────

export function SceneDecorations() {
  return (
    <>
      <RestaurantRoof />
      <SportsDetails />
      <ParkingArea />

      {/* ── Conifers — zona-outdoor west strip (X: -8 to 0, Z: 5 to 40) ── */}
      <Tree position={[-6,   0.05,  5]}  scale={1.1} />
      <Tree position={[-5,   0.05, 10]}  scale={0.95} />
      <Tree position={[-7,   0.05, 15]}  scale={1.15} />
      <Tree position={[-6,   0.05, 20]}  scale={0.88} />
      <Tree position={[-7.5, 0.05, 25]}  scale={1.0} />
      <Tree position={[-5.5, 0.05, 30]}  scale={1.05} />
      <Tree position={[-7,   0.05, 35]}  scale={0.9} />
      <Tree position={[-6,   0.05, 40]}  scale={1.1} />

      {/* ── Olive trees — east road (X: 50, Z: 0–60) ── */}
      <OliveTree position={[50, 0.05,  0]}  scale={1.0} />
      <OliveTree position={[50, 0.05, 10]}  scale={0.92} />
      <OliveTree position={[50, 0.05, 20]}  scale={1.05} />
      <OliveTree position={[50, 0.05, 30]}  scale={0.96} />
      <OliveTree position={[50, 0.05, 40]}  scale={1.0} />
      <OliveTree position={[50, 0.05, 50]}  scale={0.88} />
      <OliveTree position={[50, 0.05, 60]}  scale={1.05} />

      {/* ── Olive trees — north perimeter scatter (behind sports) ── */}
      <OliveTree position={[25, 0.05, -3]}  scale={0.9} />
      <OliveTree position={[32, 0.05, -3]}  scale={1.0} />
      <OliveTree position={[40, 0.05, -3]}  scale={0.85} />
      <OliveTree position={[28, 0.05, -7]}  scale={0.92} />
      <OliveTree position={[36, 0.05, -7]}  scale={0.88} />

      {/* ── Conifers — back north-west edge ── */}
      <Tree position={[-2, 0.05, -3]}  scale={0.9} />
      <Tree position={[ 8, 0.05, -3]}  scale={0.85} />
      <Tree position={[16, 0.05, -3]}  scale={0.95} />
    </>
  )
}
