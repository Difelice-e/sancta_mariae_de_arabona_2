'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

export default function CtaSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8% 0px' })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ minHeight: '520px' }}
      aria-label="Prenotazione — Sancta Mariae de Arabona"
    >
      {/* ── Background image (parallax) ──────────────────────────── */}
      <motion.div className="absolute inset-0 scale-110" style={{ y: imgY }}>
        {/*
          REPLACE WITH: Twilight or dusk photo of the estate from outside
          Mood: Warm lights from windows, silhouette of trees, sky gradient
        */}
        <Image
          src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=2000&q=80"
          alt="La tenuta di sera — luci calde, natura silenziosa"
          fill
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      {/* Overlay: heavy navy, bottom-up */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(6,14,26,0.97) 0%, rgba(6,14,26,0.88) 40%, rgba(6,14,26,0.65) 70%, rgba(6,14,26,0.4) 100%)',
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 section-padding">
        <div className="max-w-content mx-auto px-6 lg:px-10">
          <div className="max-w-[52ch]">
            {/* Overline */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease }}
            >
              <span className="block w-6 h-px bg-crimson" />
              <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-ivory/50">
                Il vostro momento vi aspetta
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="font-serif text-headline text-ivory mb-6 leading-tight"
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.1, ease }}
            >
              Ogni visita è un&apos;occasione
              <br />
              <em className="text-sand italic">che non si dimentica</em>
            </motion.h2>

            {/* Subtext */}
            <motion.p
              className="font-sans text-base text-ivory/55 leading-relaxed mb-10"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease }}
            >
              Che si tratti di una cena, una partita, un matrimonio o semplicemente di un giorno lontano
              da tutto — la tenuta è a vostra disposizione. Scriveteci: risponde una persona reale.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link
                href="/contatti"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-crimson text-ivory font-sans text-[11px] tracking-[0.14em] uppercase hover:bg-crimson-dark transition-colors duration-300"
              >
                Prenota ora
              </Link>
              <a
                href="https://wa.me/39XXXXXXXXXX"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-ivory font-sans text-[11px] tracking-[0.14em] uppercase border border-ivory/25 hover:border-ivory/60 hover:bg-white/5 transition-all duration-300"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.464 3.488"/>
                </svg>
                WhatsApp
              </a>
            </motion.div>

            {/* Contact details */}
            <motion.div
              className="flex items-center gap-6 mt-10 pt-8 border-t border-ivory/10"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5, ease }}
            >
              <div>
                <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-ivory/30 mb-1">Telefono</p>
                <a href="tel:+39XXXXXXXXXX" className="font-sans text-sm text-ivory/60 hover:text-ivory transition-colors">
                  +39 000 000 0000
                </a>
              </div>
              <div className="w-px h-8 bg-ivory/10" />
              <div>
                <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-ivory/30 mb-1">Email</p>
                <a href="mailto:info@arabona.it" className="font-sans text-sm text-ivory/60 hover:text-ivory transition-colors">
                  info@arabona.it
                </a>
              </div>
              <div className="w-px h-8 bg-ivory/10" />
              <div>
                <p className="font-sans text-[9px] tracking-[0.18em] uppercase text-ivory/30 mb-1">Posizione</p>
                <p className="font-sans text-sm text-ivory/60">Manoppello, PE</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
