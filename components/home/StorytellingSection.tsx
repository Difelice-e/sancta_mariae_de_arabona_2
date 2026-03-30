'use client'

import { useRef, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValueEvent,
  MotionValue,
} from 'framer-motion'

const FacilitaMap = dynamic(() => import('./FacilitaMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full" style={{ background: '#EDE5D4' }} />,
})

const ease = [0.22, 1, 0.36, 1] as const

// Steps aligned with STEP_ACTIVE_ZONES / STEP_CAMERAS in FacilitaMap.tsx
const STEPS = [
  {
    id: 'ristorante',
    index: '01',
    label: 'Cucina Abruzzese',
    headline: 'Ristorante',
    description:
      'La cucina del territorio reinterpretata con rigore e poesia. Materie prime locali, stagionalità assoluta.',
    href: '/ristorante',
    accent: '#C9A96E',
    bgGradient: 'linear-gradient(160deg, #1a0e05 0%, #0A1628 70%)',
    imgSrc:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2560&q=85',
  },
  {
    id: 'campi',
    index: '02',
    label: 'Sport & Svago',
    headline: 'Campi Sportivi',
    description:
      'Calcio a 5, padel, beach volley. Strutture professionali in un paesaggio naturale unico.',
    href: '/campi-sportivi',
    accent: '#7A9B62',
    bgGradient: 'linear-gradient(160deg, #081408 0%, #0A1628 70%)',
    imgSrc:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=2560&q=85',
  },
  {
    id: 'cerimonie',
    index: '03',
    label: 'Matrimoni & Privé',
    headline: 'Eventi & Cerimonie',
    description:
      'Matrimoni, eventi aziendali, celebrazioni private. Ogni momento diventa un ricordo indelebile.',
    href: '/eventi-cerimonie',
    accent: '#8A7A9E',
    bgGradient: 'linear-gradient(160deg, #100814 0%, #0A1628 70%)',
    imgSrc:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2560&q=85',
  },
  {
    id: 'outdoor',
    index: '04',
    label: 'Natura & Avventura',
    headline: "Attività all'Aperto",
    description:
      'Trekking, picnic nei boschi, esperienze stagionali a contatto con la natura selvaggia abruzzese.',
    href: '/attivita-allaperto',
    accent: '#5A8A5E',
    bgGradient: 'linear-gradient(160deg, #051208 0%, #0A1628 70%)',
    imgSrc:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2560&q=85',
  },
]

type Step = (typeof STEPS)[0]

// ── Step background ───────────────────────────────────────────────────

function StepBackground({
  step,
  index,
  springProgress,
}: {
  step: Step
  index: number
  springProgress: MotionValue<number>
}) {
  const start = index * 0.25
  const end = (index + 1) * 0.25
  const isFirst = index === 0
  const isLast = index === 3
  const fw = 0.06 // fade window half-width

  const inputRange = isFirst
    ? [0, end - fw, end + fw]
    : isLast
      ? [start - fw, start + fw, 1]
      : [start - fw, start + fw, end - fw, end + fw]

  const outputVals = isFirst
    ? [1, 1, 0]
    : isLast
      ? [0, 1, 1]
      : [0, 1, 1, 0]

  const opacity = useTransform(springProgress, inputRange, outputVals, { clamp: true })

  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: step.bgGradient, opacity }}
    />
  )
}

// ── Step content panel ────────────────────────────────────────────────

function StepPanel({
  step,
  index,
  springProgress,
}: {
  step: Step
  index: number
  springProgress: MotionValue<number>
}) {
  const start = index * 0.25
  const end = (index + 1) * 0.25
  const isFirst = index === 0
  const isLast = index === 3
  const fw = 0.06

  const inputRange = isFirst
    ? [0, end - fw, end + fw]
    : isLast
      ? [start - fw, start + fw, 1]
      : [start - fw, start + fw, end - fw, end + fw]

  const opacityVals = isFirst
    ? [1, 1, 0]
    : isLast
      ? [0, 1, 1]
      : [0, 1, 1, 0]

  const yVals = isFirst
    ? ['0px', '0px', '-24px']
    : isLast
      ? ['24px', '0px', '0px']
      : ['24px', '0px', '0px', '-24px']

  const opacity = useTransform(springProgress, inputRange, opacityVals, { clamp: true })
  const y = useTransform(springProgress, inputRange, yVals, { clamp: true })

  return (
    <motion.div
      className="absolute inset-0 flex items-center px-12 lg:px-16"
      style={{ opacity, y }}
    >
      <div className="max-w-[480px]">
        <div className="flex items-center gap-3 mb-6">
          <span className="block w-6 h-px" style={{ background: step.accent }} />
          <span
            className="font-sans text-[10px] tracking-[0.3em] uppercase"
            style={{ color: `${step.accent}B3` }}
          >
            {step.index} — {step.label}
          </span>
        </div>

        <h2 className="font-serif text-display text-ivory leading-[1.05] mb-5">
          {step.headline}
        </h2>

        <div className="w-10 h-px mb-6" style={{ background: `${step.accent}80` }} />

        <p className="font-sans text-[1.0625rem] text-ivory/60 leading-relaxed mb-10 max-w-[38ch]">
          {step.description}
        </p>

        <Link
          href={step.href}
          className="inline-flex items-center gap-4 group font-sans text-[10px] tracking-[0.25em] uppercase text-ivory/60 hover:text-ivory transition-colors duration-300 cursor-pointer"
        >
          <span>Scopri</span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-px group-hover:w-16 transition-all duration-500"
              style={{
                width: '2rem',
                background: 'rgba(245,240,232,0.35)',
                transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
              }}
            />
            <svg
              width="5"
              height="8"
              viewBox="0 0 5 8"
              fill="none"
              className="text-ivory/40 group-hover:text-ivory/70 transition-colors duration-300"
            >
              <path
                d="M1 1L4 4L1 7"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Link>
      </div>
    </motion.div>
  )
}

// ── Progress dots ─────────────────────────────────────────────────────

function ProgressDots({ springProgress }: { springProgress: MotionValue<number> }) {
  const [active, setActive] = useState(0)

  useMotionValueEvent(springProgress, 'change', (v) => {
    setActive(Math.min(3, Math.floor(v * 4)))
  })

  return (
    <div className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {STEPS.map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-500"
          style={{
            width: i === active ? '6px' : '5px',
            height: i === active ? '6px' : '5px',
            backgroundColor:
              i === active ? 'rgba(201,169,110,1)' : 'rgba(245,240,232,0.22)',
            transform: i === active ? 'scale(1.4)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  )
}

// ── Mobile card ───────────────────────────────────────────────────────

function MobileCard({ step, index }: { step: Step; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-8% 0px' })

  return (
    <motion.div
      ref={ref}
      className="relative overflow-hidden"
      style={{ height: '72vw', minHeight: 260 }}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay: index * 0.08, ease }}
    >
      <Image
        src={step.imgSrc}
        alt={step.headline}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(6,14,26,0.92) 0%, rgba(6,14,26,0.3) 55%, rgba(6,14,26,0.05) 100%)',
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        <span
          className="font-sans text-[9px] tracking-[0.25em] uppercase mb-2"
          style={{ color: `${step.accent}B3` }}
        >
          {step.index} — {step.label}
        </span>
        <h3 className="font-serif text-2xl text-ivory mb-3">{step.headline}</h3>
        <p className="font-sans text-sm text-ivory/55 leading-relaxed mb-4 max-w-[36ch]">
          {step.description}
        </p>
        <Link
          href={step.href}
          className="inline-flex items-center gap-3 font-sans text-[10px] tracking-[0.2em] uppercase text-ivory/60 hover:text-ivory transition-colors cursor-pointer"
        >
          <span>Scopri</span>
          <span className="w-6 h-px bg-ivory/35" />
        </Link>
      </div>
    </motion.div>
  )
}

// Zone IDs in step order — must match STEP_ACTIVE_ZONES in FacilitaMap.tsx
const STEP_ZONE_IDS = ['ristorante', 'campi', 'eventi', 'outdoor']

// ── Main export ───────────────────────────────────────────────────────

export default function StorytellingSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<number>(0)
  const entryProgressRef = useRef<number>(0)
  const headerInView = useInView(headerRef, { once: true, margin: '-8% 0px' })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Single spring on raw scroll, then split into two phases
  const spring = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.0005,
  })

  // Entry phase: first 15% of total scroll → 0..1 (drives layout animation)
  const springEntry = useTransform(spring, [0, 0.15], [0, 1], { clamp: true })

  // Steps phase: remaining 85% of scroll → 0..1 (drives content crossfade + camera)
  const springSteps = useTransform(spring, [0.15, 1.0], [0, 1], { clamp: true })

  // Write progress values to refs — consumed by R3F useFrame, zero re-renders
  useMotionValueEvent(springSteps, 'change', (v) => {
    scrollProgressRef.current = v
  })
  useMotionValueEvent(springEntry, 'change', (v) => {
    entryProgressRef.current = v
  })

  // Layout motion values derived from entry phase
  const mapWidth = useTransform(springEntry, [0, 1], ['100%', '50%'])
  const mapLeft = useTransform(springEntry, [0, 1], ['0%', '50%'])
  const contentOpacity = useTransform(springEntry, [0.3, 1], [0, 1], { clamp: true })

  // Click on a 3D zone scrolls to its step in the storytelling sequence
  const scrollToStep = useCallback((zoneId: string) => {
    const stepIndex = STEP_ZONE_IDS.indexOf(zoneId)
    if (stepIndex === -1 || !containerRef.current) return

    const containerTop =
      containerRef.current.getBoundingClientRect().top + window.scrollY
    const containerHeight = containerRef.current.scrollHeight

    // Steps phase occupies 15%–100% of scroll. Each step = 85%/4 = 21.25%.
    // Target 30% into the step so the content is fully settled when scroll lands.
    const stepStart = 0.15 + stepIndex * (0.85 / 4)
    const stepTarget = stepStart + (0.85 / 4) * 0.3

    window.scrollTo({
      top: containerTop + containerHeight * stepTarget - window.innerHeight * 0.5,
      behavior: 'smooth',
    })
  }, [])

  return (
    <div aria-label="Esperienze della tenuta">
      {/* ── Section header (scrolls normally above the sticky viewport) ── */}
      <div className="bg-ivory">
        <div ref={headerRef} className="max-w-content mx-auto px-6 lg:px-12 pt-24 pb-16">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease }}
          >
            <span className="block w-6 h-px bg-gold" />
            <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-warm">
              Vivere la Tenuta
            </span>
          </motion.div>

          <div className="flex items-end justify-between gap-8">
            <motion.h2
              className="font-serif text-headline text-navy"
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease }}
            >
              Quattro esperienze,
              <br />
              <em className="text-warm">un&apos;anima sola</em>
            </motion.h2>

            <motion.p
              className="hidden lg:block font-sans text-sm text-warm max-w-[28ch] text-right leading-relaxed flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={headerInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease }}
            >
              Ogni esperienza è pensata per far sentire i nostri ospiti esattamente nel posto
              giusto.
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: Sticky storytelling sequence (lg+) ── */}
      {/* 600vh: ~90vh entry phase + 510vh for 4 steps */}
      <div ref={containerRef} className="hidden lg:block" style={{ height: '600vh' }}>
        <div className="relative sticky top-0 h-screen overflow-hidden">

          {/* Left: content panels — invisible during entry, fades in as map shrinks */}
          <motion.div
            className="absolute top-0 left-0 bottom-0 overflow-hidden"
            style={{ width: '50%', opacity: contentOpacity }}
          >
            {STEPS.map((step, i) => (
              <StepBackground key={step.id} step={step} index={i} springProgress={springSteps} />
            ))}
            {STEPS.map((step, i) => (
              <StepPanel key={step.id} step={step} index={i} springProgress={springSteps} />
            ))}
          </motion.div>

          {/* Right: 3D map — starts full-width, animates to right 50% during entry */}
          <motion.div
            className="absolute top-0 bottom-0 overflow-hidden"
            style={{ left: mapLeft, width: mapWidth }}
          >
            <FacilitaMap
              scrollProgressRef={scrollProgressRef}
              entryProgressRef={entryProgressRef}
              onZoneClick={scrollToStep}
              fillHeight
            />
          </motion.div>

          {/* Progress indicators — appear together with the content panel */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{ opacity: contentOpacity }}
          >
            <ProgressDots springProgress={springSteps} />
            <div className="absolute bottom-0 left-0 right-0 z-50 h-px bg-ivory/[0.06]">
              <motion.div
                className="h-full bg-gold/35"
                style={{ scaleX: springSteps, transformOrigin: 'left' }}
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── MOBILE: Card stack (< lg) ── */}
      <div className="lg:hidden flex flex-col gap-2 bg-navy pb-2">
        {STEPS.map((step, i) => (
          <MobileCard key={step.id} step={step} index={i} />
        ))}
      </div>
    </div>
  )
}
