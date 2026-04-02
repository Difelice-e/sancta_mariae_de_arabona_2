'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useSpring, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

import DiamondIntro from './DiamondIntro'
import Panel from './Panel'
import { panels, type PanelConfig } from './config'

// --- Constants ---

const STICKY_WRAPPER_STYLE: React.CSSProperties = {
  position: 'sticky',
  top: 0,
  height: '100vh',
  overflow: 'hidden',
}

const PANEL_RANGES: [number, number][] = [
  [0.12, 0.30],
  [0.30, 0.48],
  [0.48, 0.66],
  [0.66, 1.0],
]

// --- MobilePanelItem ---

function MobilePanelItem({ config }: { config: PanelConfig }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { margin: '-20% 0px', once: false })

  return (
    <div
      ref={ref}
      style={{
        height: '100vh',
        backgroundColor: config.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '2rem',
        overflow: 'hidden',
      }}
    >
      {/* Image — enters from right */}
      <motion.div
        animate={{ x: isInView ? 0 : 60, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'flex', justifyContent: 'center' }}
      >
        <Image
          src={config.image}
          alt={config.title}
          width={280}
          height={280}
          style={{
            objectFit: 'contain',
            width: '60vw',
            height: 'auto',
            maxWidth: '280px',
            ...(config.blendMode ? { mixBlendMode: config.blendMode } : {}),
          }}
        />
      </motion.div>

      {/* Text — enters from left */}
      <motion.div
        animate={{ x: isInView ? 0 : -40, opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <div style={{ width: '40px', height: '1px', backgroundColor: '#C9A96E' }} />
        <p
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontSize: 'clamp(1rem, 4vw, 1.3rem)',
            color: '#C9A96E',
            margin: 0,
          }}
        >
          {config.subtitle}
        </p>
        <h2
          style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 'clamp(2rem, 8vw, 3rem)',
            color: '#FAF7F2',
            fontWeight: 700,
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          {config.title}
        </h2>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(0.9rem, 3.5vw, 1rem)',
            color: '#EDE5D4',
            fontWeight: 300,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {config.body}
        </p>
        <Link
          href={config.cta.href}
          style={{
            fontFamily: 'Inter, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            fontSize: '0.75rem',
            color: '#C9A96E',
            textDecoration: 'none',
            borderBottom: '1px solid #C9A96E',
            paddingBottom: '2px',
          }}
        >
          {config.cta.label}
        </Link>
      </motion.div>
    </div>
  )
}

// --- ScrollySection ---

export default function ScrollySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    setMounted(true)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 80, damping: 20 })

  if (!mounted) return null

  return (
    <div ref={containerRef} style={{ position: 'relative', height: isMobile ? `${panels.length * 100}vh` : `${panels.length * 150}vh` }}>
      {isMobile ? (
        panels.map((panel) => <MobilePanelItem key={panel.id} config={panel} />)
      ) : (
        <div style={STICKY_WRAPPER_STYLE}>
          <DiamondIntro panels={panels} progress={smoothProgress} />
          {panels.map((panel, i) => (
            <Panel
              key={panel.id}
              config={panel}
              progress={smoothProgress}
              range={PANEL_RANGES[i]}
              prevBg={i > 0 ? panels[i - 1].bg : undefined}
              isFirst={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  )
}
