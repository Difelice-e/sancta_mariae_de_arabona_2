'use client'

import dynamic from 'next/dynamic'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const FacilitaMap = dynamic(() => import('./FacilitaMap'), {
  ssr: false,
  loading: () => (
    <div
      className="w-full bg-ivory-warm"
      style={{ height: 'clamp(420px, 65vh, 700px)' }}
    />
  ),
})

const ease = [0.22, 1, 0.36, 1] as const

export default function MapSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true, margin: '-8% 0px' })

  return (
    <section aria-label="Mappa interattiva della tenuta" className="bg-ivory">
      {/* Header */}
      <div ref={headerRef} className="max-w-content mx-auto px-6 lg:px-12 pt-24 pb-10">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          <span className="block w-6 h-px bg-gold" />
          <span className="font-sans text-[10px] tracking-[0.22em] uppercase text-warm">
            La Tenuta
          </span>
        </motion.div>

        <div className="flex items-end justify-between gap-8">
          <motion.h2
            className="font-serif text-headline text-navy"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            Esplora gli spazi,
            <br />
            <em className="text-warm">scopri ogni esperienza</em>
          </motion.h2>

          <motion.p
            className="hidden lg:block font-sans text-sm text-warm max-w-[32ch] text-right leading-relaxed flex-shrink-0"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease }}
          >
            Passa il mouse sulle zone per esplorare la struttura.
            <br />
            Clicca per accedere alla sezione dedicata.
          </motion.p>
        </div>
      </div>

      {/* 3D map */}
      <FacilitaMap />

      {/* Bottom legend */}
      <div className="max-w-content mx-auto px-6 lg:px-12 py-8">
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            { label: 'Campi Sportivi', color: '#7A9B62' },
            { label: 'Ristorante', color: '#C9A96E' },
            { label: 'Organizzazione Eventi', color: '#8A7A9E' },
            { label: "Attività all'Aperto", color: '#5A8A5E' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ background: color }}
              />
              <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-warm/70">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
