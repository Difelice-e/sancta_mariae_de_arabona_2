'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const highlights = [
  {
    index: '01',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 2C7.37 2 2 7.37 2 14s5.37 12 12 12 12-5.37 12-12S20.63 2 14 2zm0 22C8.48 24 4 19.52 4 14S8.48 4 14 4s10 4.48 10 10-4.48 10-10 10zm-1-15h2v6h-2zm0 8h2v2h-2z" fill="currentColor" fillOpacity="0.5"/>
        <circle cx="14" cy="14" r="5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3"/>
      </svg>
    ),
    headline: 'Cucina del Territorio',
    body: 'Il menu cambia con le stagioni, fedele ai produttori locali dell\'entroterra abruzzese. Dalla pasta fatta a mano alle carni allevate nei dintorni: ogni piatto è un atto d\'identità.',
    detail: 'Pranzo & Cena · Su prenotazione',
  },
  {
    index: '02',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="3" y="12" width="22" height="14" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <path d="M8 12V8a6 6 0 0112 0v4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        <circle cx="14" cy="19" r="2" fill="currentColor" opacity="0.6"/>
      </svg>
    ),
    headline: 'Esclusività & Riservatezza',
    body: 'La tenuta non è aperta al pubblico generico. Ogni accesso è su invito o prenotazione. Un luogo pensato per chi cerca qualità senza compromessi, lontano dalla confusione.',
    detail: 'Accesso privato · Solo su prenotazione',
  },
  {
    index: '03',
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M14 3L5 9v14h6v-7h6v7h6V9L14 3z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <path d="M11 16h6M11 12h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
      </svg>
    ),
    headline: 'Natura Integra, Abruzzo Autentico',
    body: 'Circondati da boschi di querce, campi coltivati e un orizzonte che arriva fino ai monti della Maiella. La natura non è scenografia, è parte dell\'esperienza.',
    detail: '200+ ettari · A 45 min dal mare',
  },
]

export default function Highlights() {
  const ref = useRef<HTMLDivElement>(null)
  const headerInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <section className="section-padding bg-navy relative overflow-hidden" aria-label="I punti di forza della tenuta">
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Subtle crimson glow bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none opacity-[0.04]"
        style={{ background: 'radial-gradient(ellipse, #C41E3A, transparent 70%)' }}
      />

      <div className="max-w-content mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16">
          <div>
            <motion.div
              className="flex items-center gap-3 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              <span className="block w-6 h-px bg-gold/60" />
              <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-ivory/40">
                03 — Perché Arabona
              </span>
            </motion.div>
            <motion.h2
              className="font-serif text-headline text-ivory"
              initial={{ opacity: 0, y: 20 }}
              animate={headerInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.08, ease }}
            >
              Non un luogo qualunque.
              <br />
              <em className="text-sand italic">Un&apos;eccezione</em>
            </motion.h2>
          </div>
          <motion.p
            className="font-sans text-sm text-ivory/40 max-w-[30ch] leading-relaxed lg:text-right"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease }}
          >
            Tre cose che rendono Sancta Mariae de Arabona diversa da qualsiasi altra destinazione.
          </motion.p>
        </div>

        {/* Highlight cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ivory/5">
          {highlights.map((item, i) => (
            <HighlightCard key={item.index} item={item} delay={0.1 + i * 0.12} />
          ))}
        </div>
      </div>
    </section>
  )
}

function HighlightCard({
  item,
  delay,
}: {
  item: (typeof highlights)[0]
  delay: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      className="bg-navy p-8 lg:p-10 flex flex-col gap-6 group hover:bg-navy-light transition-colors duration-500"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease }}
    >
      {/* Icon + index row */}
      <div className="flex items-start justify-between">
        <div className="text-ivory/40 group-hover:text-gold transition-colors duration-400">
          {item.icon}
        </div>
        <span className="font-serif text-[4rem] leading-none text-ivory/5 group-hover:text-ivory/8 transition-colors duration-500 select-none">
          {item.index}
        </span>
      </div>

      {/* Gold rule */}
      <div className="w-8 h-px bg-gold/30 group-hover:bg-gold/60 group-hover:w-14 transition-all duration-500" />

      {/* Headline */}
      <h3 className="font-serif text-subhead text-ivory leading-tight">
        {item.headline}
      </h3>

      {/* Body */}
      <p className="font-sans text-sm text-ivory/50 leading-relaxed flex-1">
        {item.body}
      </p>

      {/* Detail tag */}
      <div className="pt-4 border-t border-ivory/8">
        <span className="font-sans text-[10px] tracking-[0.14em] uppercase text-gold/60">
          {item.detail}
        </span>
      </div>
    </motion.div>
  )
}
