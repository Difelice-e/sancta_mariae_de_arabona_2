'use client'

import { motion, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'
import { PanelConfig } from './config'

type Props = {
  panels: PanelConfig[]
  progress: MotionValue<number>
}

// Static style objects — defined at module level to avoid recreation on every render

const imageStyle: React.CSSProperties = {
  objectFit: 'contain',
  width: '100%',
  height: 'auto',
}

const itemStyle: React.CSSProperties = {
  width: 'clamp(200px, 20vw, 320px)',
}

// Static positioning for each diamond slot
// translateX/Y are valid motion style values on motion.div but not in React.CSSProperties,
// so we type these as a plain object and let framer-motion accept them.
const pos0 = {
  position: 'absolute' as const,
  bottom: '10%',
  left: '50%',
  translateX: '-50%',
  ...itemStyle,
}

const pos1 = {
  position: 'absolute' as const,
  top: '50%',
  right: '8%',
  translateY: '-50%',
  ...itemStyle,
}

const pos2 = {
  position: 'absolute' as const,
  top: '50%',
  left: '8%',
  translateY: '-50%',
  ...itemStyle,
}

const pos3 = {
  position: 'absolute' as const,
  top: '8%',
  left: '50%',
  translateX: '-50%',
  ...itemStyle,
}

export default function DiamondIntro({ panels, progress }: Props) {
  if (panels.length < 4) return null

  // Wrapper opacity — fade out as panel 1 enters
  const wrapperOpacity = useTransform(progress, [0.25, 0.32], [1, 0])

  // panels[0] — ristorante, BASSO — ingrandisce al centro
  const scale0 = useTransform(progress, [0, 0.08, 0.12, 0.30], [0.6, 1, 1, 2.2])
  const opacity0 = useTransform(progress, [0, 0.08], [0, 1])
  const y0 = useTransform(progress, [0, 0.12, 0.30], ['0%', '0%', '-35%'])

  // panels[1] — sport, DESTRA — vola a destra
  const opacity1 = useTransform(progress, [0, 0.08, 0.18, 0.30], [0, 1, 1, 0])
  const x1 = useTransform(progress, [0, 0.12, 0.30], ['0vw', '0vw', '120vw'])

  // panels[2] — eventi, SINISTRA — vola a sinistra
  const opacity2 = useTransform(progress, [0, 0.08, 0.18, 0.30], [0, 1, 1, 0])
  const x2 = useTransform(progress, [0, 0.12, 0.30], ['0vw', '0vw', '-120vw'])

  // panels[3] — natura, ALTO — vola in alto
  const opacity3 = useTransform(progress, [0, 0.08, 0.18, 0.30], [0, 1, 1, 0])
  const y3 = useTransform(progress, [0, 0.12, 0.30], ['0vh', '0vh', '-80vh'])

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        opacity: wrapperOpacity,
      }}
    >
      {/* panels[0] — ristorante — BASSO */}
      <motion.div style={{ ...pos0, scale: scale0, opacity: opacity0, y: y0 }}>
        <Image
          src={panels[0].image}
          alt={panels[0].title}
          width={320}
          height={320}
          style={{ ...imageStyle, ...(panels[0].blendMode ? { mixBlendMode: panels[0].blendMode } : {}) }}
        />
      </motion.div>

      {/* panels[1] — sport — DESTRA */}
      <motion.div style={{ ...pos1, opacity: opacity1, x: x1 }}>
        <Image
          src={panels[1].image}
          alt={panels[1].title}
          width={320}
          height={320}
          style={{ ...imageStyle, ...(panels[1].blendMode ? { mixBlendMode: panels[1].blendMode } : {}) }}
        />
      </motion.div>

      {/* panels[2] — eventi — SINISTRA */}
      <motion.div style={{ ...pos2, opacity: opacity2, x: x2 }}>
        <Image
          src={panels[2].image}
          alt={panels[2].title}
          width={320}
          height={320}
          style={{ ...imageStyle, ...(panels[2].blendMode ? { mixBlendMode: panels[2].blendMode } : {}) }}
        />
      </motion.div>

      {/* panels[3] — natura — ALTO */}
      <motion.div style={{ ...pos3, opacity: opacity3, y: y3 }}>
        <Image
          src={panels[3].image}
          alt={panels[3].title}
          width={320}
          height={320}
          style={{ ...imageStyle, ...(panels[3].blendMode ? { mixBlendMode: panels[3].blendMode } : {}) }}
        />
      </motion.div>
    </motion.div>
  )
}
