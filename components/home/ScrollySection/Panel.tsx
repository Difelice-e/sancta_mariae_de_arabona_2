'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useTransform, type MotionValue } from 'framer-motion'
import type { PanelConfig } from './config'

// --- Module-level style constants ---

const wrapperStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
}

const innerLayoutStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: '100%',
  padding: '0 6vw',
  gap: '4vw',
}

const textSideStyle: React.CSSProperties = {
  flex: '0 0 auto',
  maxWidth: '45%',
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
}

const goldRuleStyle: React.CSSProperties = {
  width: '40px',
  height: '1px',
  backgroundColor: '#C9A96E',
}

const subtitleStyle: React.CSSProperties = {
  fontFamily: 'Cormorant Garamond, serif',
  fontStyle: 'italic',
  fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
  color: '#C9A96E',
  fontWeight: 400,
  margin: 0,
}

const titleStyle: React.CSSProperties = {
  fontFamily: 'Playfair Display, serif',
  fontSize: 'clamp(3rem, 6vw, 5.5rem)',
  color: '#FAF7F2',
  fontWeight: 700,
  lineHeight: 1.1,
  margin: 0,
}

const bodyStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
  color: '#EDE5D4',
  fontWeight: 300,
  lineHeight: 1.6,
  margin: 0,
}

const ctaStyle: React.CSSProperties = {
  fontFamily: 'Inter, sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  fontSize: '0.8rem',
  color: '#C9A96E',
  textDecoration: 'none',
  borderBottom: '1px solid #C9A96E',
  paddingBottom: '2px',
  alignSelf: 'flex-start',
}

const imageSideStyle: React.CSSProperties = {
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const IMAGE_BASE_STYLE = {
  objectFit: 'contain' as const,
  width: 'clamp(280px, 35vw, 520px)',
  height: 'auto',
} satisfies React.CSSProperties

// ---

type Props = {
  config: PanelConfig
  progress: MotionValue<number>
  range: [number, number]
  prevBg?: string
  isFirst?: boolean
}

export default function Panel({ config, progress, range, prevBg, isFirst }: Props) {
  const [s, e] = range
  const quarter = (e - s) * 0.25
  const enterStart = s
  const enterEnd = s + quarter
  const exitStart = e - quarter
  const exitEnd = e

  const bg = useTransform(progress, [enterStart, enterEnd], [prevBg ?? '#000000', config.bg])

  const panelOpacity = useTransform(
    progress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0],
  )

  const imageY = useTransform(progress, [enterStart, enterEnd], ['60px', '0px'])
  const imageX = useTransform(progress, [enterStart, enterEnd], ['110vw', '0vw'])

  const textX = useTransform(progress, [enterStart, enterEnd], ['-40px', '0px'])
  const textOpacity = useTransform(progress, [enterStart, enterEnd], [0, 1])

  const imageStyle = {
    ...IMAGE_BASE_STYLE,
    ...(config.blendMode ? { mixBlendMode: config.blendMode } : {}),
  }

  return (
    <motion.div style={{ ...wrapperStyle, backgroundColor: bg, opacity: panelOpacity }}>
      <div style={innerLayoutStyle}>
        <motion.div style={{ ...textSideStyle, x: textX, opacity: textOpacity }}>
          <div style={goldRuleStyle} />
          <p style={subtitleStyle}>{config.subtitle}</p>
          <h2 style={titleStyle}>{config.title}</h2>
          <p style={bodyStyle}>{config.body}</p>
          <Link href={config.cta.href} style={ctaStyle}>
            {config.cta.label}
          </Link>
        </motion.div>

        <motion.div
          style={{
            ...imageSideStyle,
            ...(isFirst ? { y: imageY } : { x: imageX }),
          }}
        >
          <Image
            src={config.image}
            alt={config.title}
            width={520}
            height={520}
            style={imageStyle}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
