'use client'

import sitePlan from '@/lib/sitePlan.json'
import { AreaMesh } from './AreaMesh'
import { SplineArea } from './SplineArea'

// Areas that add no visual value as meshes (boundary line only)
const SKIP_AREAS = new Set(['perimetro-sito'])

interface SceneMeshesProps {
  hoveredZonaId: string | null
  scrollProgressRef?: { current: number }
  onEnter?: (zonaId: string) => void
  onLeave?: () => void
  onNavigate?: (href: string) => void
}

export function SceneMeshes({
  hoveredZonaId,
  scrollProgressRef,
  onEnter,
  onLeave,
  onNavigate,
}: SceneMeshesProps) {
  return (
    <>
      {sitePlan.areas.map((area) => {
        if (SKIP_AREAS.has(area.areaId)) return null

        // Spline area (road)
        if (!area.vertices2D && area.splineControlPoints) {
          return (
            <SplineArea
              key={area.areaId}
              controlPoints={area.splineControlPoints as [number, number][]}
              width={(area as { splineWidth: number }).splineWidth}
            />
          )
        }

        // Polygon area
        if (!area.vertices2D) return null

        return (
          <AreaMesh
            key={area.areaId}
            areaId={area.areaId}
            category={area.category}
            vertices2D={area.vertices2D as [number, number][]}
            holes={(area.holes ?? []).map((h) => ({
              vertices2D: (h as unknown as { vertices2D: [number, number][] }).vertices2D,
            }))}
            hoveredZonaId={hoveredZonaId}
            scrollProgressRef={scrollProgressRef}
            onEnter={onEnter}
            onLeave={onLeave}
            onNavigate={onNavigate}
          />
        )
      })}
    </>
  )
}
