'use client'

import { useRef, useState } from 'react'
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

const ease = [0.22, 1, 0.36, 1] as const

interface Entry {
  id: string
  index: string
  label: string
  headline: string
  description: string
  href: string
  imgSrc: string
  imgAlt: string
}

const entries: Entry[] = [
  {
    id: 'ristorante',
    index: '01',
    label: 'Cucina Abruzzese',
    headline: 'Ristorante',
    description:
      'La cucina del territorio reinterpretata con rigore e poesia. Materie prime locali, stagionalità assoluta.',
    href: '/ristorante',
    imgSrc:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2560&q=85',
    imgAlt: 'Tavola apparecchiata al ristorante della tenuta',
  },
  {
    id: 'sport',
    index: '02',
    label: 'Sport & Svago',
    headline: 'Campi Sportivi',
    description:
      'Calcio a 5, padel, beach volley. Strutture professionali in un paesaggio naturale unico.',
    href: '/campi-sportivi',
    imgSrc:
      'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=2560&q=85',
    imgAlt: 'Campo sportivo con vista sulle colline abruzzesi',
  },
  {
    id: 'cerimonie',
    index: '03',
    label: 'Matrimoni & Privé',
    headline: 'Eventi & Cerimonie',
    description:
      'Matrimoni, eventi aziendali, celebrazioni private. Ogni momento diventa un ricordo indelebile.',
    href: '/eventi-cerimonie',
    imgSrc:
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2560&q=85',
    imgAlt: 'Allestimento per cerimonia elegante in terrazza',
  },
  {
    id: 'outdoor',
    index: '04',
    label: 'Natura & Avventura',
    headline: "Attività all'Aperto",
    description:
      'Trekking, picnic nei boschi, esperienze stagionali a contatto con la natura selvaggia abruzzese.',
    href: '/attivita-allaperto',
    imgSrc:
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2560&q=85',
    imgAlt: 'Sentiero tra i boschi della tenuta in autunno',
  },
]

// Wider reveal windows for softer, more organic transitions
// Spring physics adds additional smoothing on top
const REVEALS: ([number, number] | null)[] = [
  null,          // panel 0: visible from start
  [0.18, 0.36],  // panel 1 — wider range = smoother feel
  [0.43, 0.61],  // panel 2
  [0.68, 0.86],  // panel 3
]

interface PanelProps {
  entry: Entry
  panelIndex: number
  springProgress: MotionValue<number>
}

function Panel({ entry, panelIndex, springProgress }: PanelProps) {
  const reveal = REVEALS[panelIndex]
  const isFirst = panelIndex === 0

  // Map the spring progress to a normalized 0→1 for this panel
  const normalizedRange = reveal ?? [0, 0.001]
  const normalized = useTransform(springProgress, normalizedRange, isFirst ? [1, 1] : [0, 1], {
    clamp: true,
  })

  // Clip path: expands horizontally from center
  const clipPath = useTransform(
    normalized,
    [0, 1],
    isFirst
      ? ['inset(0 0% 0 0%)', 'inset(0 0% 0 0%)']
      : ['inset(0 50% 0 50%)', 'inset(0 0% 0 0%)']
  )

  // Image parallax (global drift through section)
  const imageY = useTransform(springProgress, [0, 1], ['-7%', '7%'])

  // Content slides in from left as panel expands — tied to normalized so it syncs with clip
  const contentX = useTransform(normalized, [0, 1], isFirst ? ['0px', '0px'] : ['60px', '0px'])
  const contentOpacity = useTransform(normalized, [0, 0.5], isFirst ? [1, 1] : [0, 1], {
    clamp: true,
  })

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        clipPath,
        zIndex: (panelIndex + 1) * 10,
      }}
    >
      {/* Parallax image */}
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: 1.12 }}>
        <Image
          src={entry.imgSrc}
          alt={entry.imgAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={isFirst}
        />
      </motion.div>

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(105deg, rgba(6,14,26,0.93) 0%, rgba(6,14,26,0.68) 38%, rgba(6,14,26,0.28) 65%, rgba(6,14,26,0.05) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, rgba(6,14,26,0.5) 0%, transparent 40%)',
        }}
      />

      {/* Ghost index */}
      <div
        className="absolute right-6 lg:right-14 bottom-6 select-none pointer-events-none"
        aria-hidden
      >
        <span
          className="font-serif text-ivory/[0.035] leading-none block"
          style={{ fontSize: 'clamp(8rem, 22vw, 20rem)' }}
        >
          {entry.index}
        </span>
      </div>

      {/* Content */}
      <motion.div
        className="absolute inset-0 flex items-center"
        style={{ opacity: contentOpacity, x: contentX }}
      >
        <div className="max-w-content mx-auto px-8 lg:px-16 w-full">
          <div className="max-w-[520px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-6 h-px bg-gold" />
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold/70">
                {entry.index} — {entry.label}
              </span>
            </div>

            <h2 className="font-serif text-display text-ivory leading-[1.05] mb-5">
              {entry.headline}
            </h2>

            <div className="w-10 h-px bg-gold/50 mb-6" />

            <p className="font-sans text-[1.0625rem] text-ivory/60 leading-relaxed mb-10 max-w-[38ch]">
              {entry.description}
            </p>

            <Link
              href={entry.href}
              className="inline-flex items-center gap-4 group font-sans text-[10px] tracking-[0.25em] uppercase text-ivory/60 hover:text-ivory transition-colors duration-300 cursor-pointer"
            >
              <span>Scopri</span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-8 h-px bg-ivory/35 group-hover:w-16 transition-all duration-500"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
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
        </div>
      </motion.div>
    </motion.div>
  )
}

function ProgressDots({ springProgress }: { springProgress: MotionValue<number> }) {
  const [active, setActive] = useState(0)

  useMotionValueEvent(springProgress, 'change', (v) => {
    if (v >= 0.68) setActive(3)
    else if (v >= 0.43) setActive(2)
    else if (v >= 0.18) setActive(1)
    else setActive(0)
  })

  return (
    <div className="absolute right-5 lg:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {entries.map((e, i) => (
        <div
          key={e.id}
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

/* ── Mobile card (fallback for small screens) ─────────────────────── */
function MobileCard({ entry, index }: { entry: Entry; index: number }) {
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
        src={entry.imgSrc}
        alt={entry.imgAlt}
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
        <span className="font-sans text-[9px] tracking-[0.25em] uppercase text-gold/70 mb-2">
          {entry.index} — {entry.label}
        </span>
        <h3 className="font-serif text-2xl text-ivory mb-3">{entry.headline}</h3>
        <p className="font-sans text-sm text-ivory/55 leading-relaxed mb-4 max-w-[36ch]">
          {entry.description}
        </p>
        <Link
          href={entry.href}
          className="inline-flex items-center gap-3 font-sans text-[10px] tracking-[0.2em] uppercase text-ivory/60 hover:text-ivory transition-colors cursor-pointer"
        >
          <span>Scopri</span>
          <span className="w-6 h-px bg-ivory/35" />
        </Link>
      </div>
    </motion.div>
  )
}

export default function EntryPoints() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true, margin: '-8% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Spring smoothing: adds natural momentum so transitions feel organic, not mechanical
  const springProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 22,
    restDelta: 0.0005,
  })

  return (
    <div aria-label="Esperienze della tenuta">
      {/* ── Section Header (scrolls normally above the sticky panels) ── */}
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

      {/* ── DESKTOP: Sticky Parallax Panels (lg+) ─────────────────────── */}
      <div ref={sectionRef} className="hidden lg:block" style={{ height: '500vh' }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {entries.map((entry, i) => (
            <Panel
              key={entry.id}
              entry={entry}
              panelIndex={i}
              springProgress={springProgress}
            />
          ))}
          <ProgressDots springProgress={springProgress} />

          {/* Bottom scroll progress bar */}
          <div className="absolute bottom-0 left-0 right-0 z-50 h-px bg-ivory/[0.06]">
            <motion.div
              className="h-full bg-gold/35"
              style={{ scaleX: springProgress, transformOrigin: 'left' }}
            />
          </div>
        </div>
      </div>

      {/* ── MOBILE: Card Stack (< lg) ──────────────────────────────────── */}
      <div className="lg:hidden flex flex-col gap-2 bg-navy pb-2">
        {entries.map((entry, i) => (
          <MobileCard key={entry.id} entry={entry} index={i} />
        ))}
      </div>
    </div>
  )
}
