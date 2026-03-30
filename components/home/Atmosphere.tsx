'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const stats = [
  { value: 200, suffix: '+', label: 'Ettari', sublabel: 'di natura incontaminata' },
  { value: 5, suffix: '', label: 'Esperienze', sublabel: 'pensate per voi' },
  { value: 12, suffix: ' km', label: 'dai Monaci', sublabel: 'Cistercensi di Arabona' },
]

/* ── Animated counter ──────────────────────────────────────────────── */
function AnimatedCounter({ value, suffix, trigger }: { value: number; suffix: string; trigger: boolean }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!trigger) return
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    })
    return controls.stop
  }, [trigger, value])

  return (
    <>
      {display}
      {suffix}
    </>
  )
}

/* ── Single stat item ──────────────────────────────────────────────── */
function StatItem({
  value,
  suffix,
  label,
  sublabel,
  delay,
  trigger,
}: {
  value: number
  suffix: string
  label: string
  sublabel: string
  delay: number
  trigger: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  return (
    <motion.div
      ref={ref}
      className="flex flex-col items-center text-center px-3 lg:px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
    >
      {/* Number */}
      <div className="relative mb-3">
        <span
          className="font-serif text-crimson leading-none tabular-nums"
          style={{ fontSize: 'clamp(2.8rem, 5vw, 3.75rem)' }}
        >
          <AnimatedCounter value={value} suffix={suffix} trigger={inView && trigger} />
        </span>
        {/* Animated gold underline */}
        <motion.span
          className="absolute left-0 -bottom-1.5 h-px bg-gradient-to-r from-gold/70 to-gold/20"
          initial={{ width: '0%' }}
          animate={inView ? { width: '100%' } : {}}
          transition={{ duration: 0.9, delay: delay + 0.35, ease }}
        />
      </div>

      {/* Label */}
      <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-navy/70 mt-1">
        {label}
      </p>

      {/* Sublabel */}
      <p className="font-sans text-[10px] text-warm/70 mt-0.5 leading-snug">
        {sublabel}
      </p>
    </motion.div>
  )
}

/*
  IMAGES: Replace with actual estate photography
  - Large: Wide shot of the estate property at golden hour or dusk
  - Small top: Architectural detail — stone wall, arched doorway, etc.
  - Small bottom: Close-up of local produce, wine glass, or table detail
*/

export default function Atmosphere() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-5% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const largeImgY = useTransform(scrollYProgress, [0, 1], ['-5%', '5%'])
  const smallImgY = useTransform(scrollYProgress, [0, 1], ['3%', '-3%'])

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-ivory-warm relative overflow-hidden"
      aria-label="L'anima del luogo"
    >
      {/* Noise grain on background */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="max-w-content mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-12 lg:gap-16 items-start">

          {/* ── Left column: Images ─────────────────────────────────── */}
          <div className="relative">
            {/* Large image */}
            <motion.div
              className="relative overflow-hidden"
              style={{ aspectRatio: '4/5', y: largeImgY }}
              initial={{ opacity: 0, x: -24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 1, ease }}
            >
              <Image
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1200&q=80"
                alt="La tenuta Sancta Mariae de Arabona al tramonto"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(6,14,26,0.08) 0%, transparent 50%)' }}
              />
            </motion.div>

            {/* Floating small image */}
            <motion.div
              className="absolute -bottom-8 -right-4 lg:-right-12 w-[44%] overflow-hidden shadow-2xl border-4 border-ivory"
              style={{ aspectRatio: '1/1', y: smallImgY }}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.2, ease }}
            >
              <Image
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80"
                alt="Dettaglio della cucina della tenuta"
                fill
                className="object-cover"
                sizes="25vw"
              />
            </motion.div>

            {/* Year badge */}
            <motion.div
              className="absolute top-6 -left-4 lg:-left-8 bg-navy px-4 py-3"
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.35, ease }}
            >
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-gold">Est. 2018</p>
              <p className="font-serif text-ivory text-2xl leading-none mt-0.5">Arabona</p>
            </motion.div>
          </div>

          {/* ── Vertical divider (desktop only) ──────────────────────── */}
          <motion.div
            className="hidden lg:block w-px bg-gradient-to-b from-transparent via-gold/30 to-transparent self-stretch"
            initial={{ scaleY: 0 }}
            animate={inView ? { scaleY: 1 } : {}}
            transition={{ duration: 1, delay: 0.4, ease }}
          />

          {/* ── Right column: Text ───────────────────────────────────── */}
          <div className="lg:pt-16 flex flex-col gap-8">
            {/* Overline */}
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15, ease }}
            >
              <span className="block w-6 h-px bg-gold" />
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-warm">
                02 — L&apos;Anima del Luogo
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="font-serif text-headline text-navy leading-[1.15]"
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.25, ease }}
            >
              Ogni stagione porta{' '}
              <em className="text-olive italic">la sua grazia</em>
            </motion.h2>

            {/* Pull quote */}
            <motion.blockquote
              className="border-l-2 border-crimson pl-6"
              initial={{ opacity: 0, x: 16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease }}
            >
              <p className="font-editorial italic text-subhead text-navy/70 leading-relaxed">
                &ldquo;Abbiamo scelto l&apos;Abruzzo perché qui la terra parla ancora. Non l&apos;abbiamo costruito, l&apos;abbiamo ascoltato.&rdquo;
              </p>
            </motion.blockquote>

            {/* Body copy */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.45, ease }}
            >
              <p className="font-sans text-base text-warm-dark leading-relaxed">
                Sancta Mariae de Arabona nasce dalla volontà di creare uno spazio autentico, dove l&apos;ospitalità è un atto quotidiano di cura. La tenuta sorge nell&apos;entroterra pescarese, in una zona di silenzi profondi e paesaggi inattesi.
              </p>
              <p className="font-sans text-base text-warm-dark leading-relaxed">
                Qui il tempo rallenta. I profumi del bosco, la cucina che racconta il territorio, lo sport praticato all&apos;aria aperta: tutto concorre a creare un&apos;esperienza che rimane.
              </p>
            </motion.div>

            {/* ── Stats row with animated counters ──────────────────── */}
            <div ref={statsRef} className="pt-6 mt-2 border-t border-sand/60">
              {/* Animated reveal line on the border */}
              <motion.div
                className="absolute left-0 h-px bg-gradient-to-r from-gold/0 via-gold/40 to-gold/0"
                style={{ width: '100%', marginTop: '-1px' }}
                initial={{ scaleX: 0 }}
                animate={statsInView ? { scaleX: 1 } : {}}
                transition={{ duration: 1.2, delay: 0.2, ease }}
              />

              <div className="grid grid-cols-3 divide-x divide-sand/50">
                {stats.map(({ value, suffix, label, sublabel }, i) => (
                  <StatItem
                    key={label}
                    value={value}
                    suffix={suffix}
                    label={label}
                    sublabel={sublabel}
                    delay={0.1 + i * 0.12}
                    trigger={statsInView}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
