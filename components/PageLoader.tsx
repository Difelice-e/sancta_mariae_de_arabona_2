'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Logo = ({ className = '' }: { className?: string }) => (
  <svg
    viewBox="0 0 320 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* M — x: 33→103, gap-left: 33, gap-right: 32 */}
    <motion.path
      d="M33 100V20L68 60L103 20V100"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="square"
      strokeLinejoin="miter"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    />
    {/* V — x: 135→205, gap-left: 32, gap-right: 32 */}
    <motion.path
      d="M135 20L170 100L205 20"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="square"
      strokeLinejoin="miter"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
    />
    {/* 6 — x: 237→287, gap-left: 32, gap-right: 33 */}
    <motion.path
      d="M287 20 H237 V100 H287 V60 H237"
      stroke="currentColor"
      strokeWidth="12"
      strokeLinecap="square"
      strokeLinejoin="miter"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut', delay: 0.4 }}
    />
  </svg>
)

const ORIGIN = { x: 50, y: 50 }
// Expansion starts at 1.2s, transition lasts 1.8s
const EXPAND_DELAY = 1400
const TRANSITION_MS = 1800

export default function PageLoader() {
  const [expansion, setExpansion] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const t1 = setTimeout(() => setExpansion(100), EXPAND_DELAY)
    const t2 = setTimeout(() => {
      setDone(true)
      document.body.style.overflow = ''
    }, EXPAND_DELAY + TRANSITION_MS + 100)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  const holeSize = (expansion / 100) * 150
  const logoScale = 1 + (expansion / 100) * 29

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {/* Navy overlay with expanding radial hole + grain */}
      <motion.div
        className="absolute inset-0 bg-navy-deep"
        animate={{
          maskImage: `radial-gradient(circle ${holeSize}vw at ${ORIGIN.x}% ${ORIGIN.y}%, transparent 100%, black 100%)`,
          WebkitMaskImage: `radial-gradient(circle ${holeSize}vw at ${ORIGIN.x}% ${ORIGIN.y}%, transparent 100%, black 100%)`,
          // opacity: expansion >= 100 ? 0 : 1,
        }}
        transition={{ duration: TRANSITION_MS / 1000, ease: [0.77, 0, 0.175, 1] }}
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </motion.div>

      {/* Logo — scales up as hole expands */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden text-gold/80">
        <motion.div
          className="w-full max-w-md px-12 text-white flex flex-col items-center"
          style={{ transformOrigin: `${ORIGIN.x}% ${ORIGIN.y}%` }}
          animate={{
            scale: logoScale,
            opacity: expansion >= 98 ? 0 : 1,
          }}
          transition={{ duration: TRANSITION_MS / 1000, ease: [0.77, 0, 0.175, 1] }}
        >
          <Logo className="w-full text-gold/80" />
          <div className="flex items-center gap-3 mt-5 w-full px-2">
            <span className="flex-1 h-px bg-gold/50" />
            <p className="font-editorial text-[10px] uppercase tracking-[0.35em] text-gold/70 whitespace-nowrap">
              Sancta Mariae de Arabona
            </p>
            <span className="flex-1 h-px bg-gold/50" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
