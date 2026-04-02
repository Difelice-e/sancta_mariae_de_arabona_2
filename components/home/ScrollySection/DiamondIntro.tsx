'use client'

import { motion, useTransform, MotionValue } from 'framer-motion'
import Image from 'next/image'
import { PanelConfig } from './config'

type Props = {
  panels: PanelConfig[]
  progress: MotionValue<number>
}

export default function DiamondIntro({ panels, progress }: Props) {
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

  const imageStyle = {
    objectFit: 'contain' as const,
    width: '100%',
    height: 'auto',
  }

  const itemStyle = {
    width: 'clamp(200px, 20vw, 320px)',
  }

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
      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          translateX: '-50%',
          scale: scale0,
          opacity: opacity0,
          y: y0,
          ...itemStyle,
        }}
      >
        <Image
          src={panels[0].image}
          alt={panels[0].title}
          width={320}
          height={320}
          style={imageStyle}
        />
      </motion.div>

      {/* panels[1] — sport — DESTRA */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          right: '8%',
          translateY: '-50%',
          opacity: opacity1,
          x: x1,
          ...itemStyle,
        }}
      >
        <Image
          src={panels[1].image}
          alt={panels[1].title}
          width={320}
          height={320}
          style={imageStyle}
        />
      </motion.div>

      {/* panels[2] — eventi — SINISTRA */}
      <motion.div
        style={{
          position: 'absolute',
          top: '50%',
          left: '8%',
          translateY: '-50%',
          opacity: opacity2,
          x: x2,
          ...itemStyle,
        }}
      >
        <Image
          src={panels[2].image}
          alt={panels[2].title}
          width={320}
          height={320}
          style={imageStyle}
        />
      </motion.div>

      {/* panels[3] — natura — ALTO */}
      <motion.div
        style={{
          position: 'absolute',
          top: '8%',
          left: '50%',
          translateX: '-50%',
          opacity: opacity3,
          y: y3,
          ...itemStyle,
        }}
      >
        <Image
          src={panels[3].image}
          alt={panels[3].title}
          width={320}
          height={320}
          style={{ ...imageStyle, mixBlendMode: 'screen' }}
        />
      </motion.div>
    </motion.div>
  )
}
