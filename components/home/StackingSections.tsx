'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const sections = [
  {
    id: 'ristorante',
    index: '01',
    category: 'Ristorante & Braceria',
    headline: ['Il fuoco che', 'racconta la terra'],
    body: "Carni selezionate, prodotti del territorio, brace viva e ricette tramandate. Un'esperienza gastronomica autentica nell'entroterra abruzzese.",
    tags: ['Braceria', 'Cucina locale', 'Degustazione vini', 'Cena privata'],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=2560&q=90',
    imageAlt: 'Braceria e ristorante della tenuta',
    accent: '#C9A96E',
    href: '/ristorante',
  },
  {
    id: 'sport',
    index: '02',
    category: 'Sport',
    headline: ["L'adrenalina", 'nel verde'],
    body: "Campi da calcio e padel immersi nella natura abruzzese. Lo sport diventa un'esperienza unica, lontano dal rumore della città.",
    tags: ['Calcio a 5', 'Padel', 'Tornei', 'Team Building'],
    image: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=2560&q=90',
    imageAlt: 'Campi sportivi della tenuta',
    accent: '#8A9B62',
    href: '/sport',
  },
  {
    id: 'eventi',
    index: '03',
    category: 'Cerimonie & Eventi',
    headline: ['Ogni momento', 'merita un posto', 'straordinario'],
    body: 'Matrimoni, compleanni, ritiri aziendali: organizziamo ogni celebrazione con cura artigianale in un contesto senza eguali.',
    tags: ['Matrimoni', 'Compleanni', 'Ritiri aziendali', 'Feste esclusive'],
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2560&q=90',
    imageAlt: 'Cerimonie ed eventi alla tenuta',
    accent: '#C41E3A',
    href: '/eventi',
  },
  {
    id: 'natura',
    index: '04',
    category: 'Natura & Territorio',
    headline: ['Radici profonde,', 'orizzonti aperti'],
    body: "Cavalli, yoga all'alba, fattoria didattica e sentieri nascosti. Un modo diverso di abitare il paesaggio abruzzese.",
    tags: ['Equitazione', 'Yoga', 'Fattoria didattica', 'Trekking'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2560&q=90',
    imageAlt: 'Natura e territorio abruzzese',
    accent: '#6B7A4E',
    href: '/natura',
  },
]

type Section = (typeof sections)[number]

function StackCard({ section, stackIndex }: { section: Section; stackIndex: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <div
      ref={ref}
      className="sticky top-0 h-screen overflow-hidden"
      style={{ zIndex: stackIndex + 1 }}
    >
      {/* ── Background image ─────────────────────────── */}
      <div className="absolute inset-0">
        <Image
          src={section.image}
          alt={section.imageAlt}
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ── Gradient overlay (left-heavy) ─────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to right, rgba(6,14,26,0.97) 0%, rgba(6,14,26,0.88) 28%, rgba(6,14,26,0.55) 55%, rgba(6,14,26,0.15) 80%, transparent 100%)',
        }}
      />
      {/* Top vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, rgba(6,14,26,0.45) 0%, transparent 22%)',
        }}
      />
      {/* Bottom vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(6,14,26,0.75) 0%, transparent 30%)',
        }}
      />

      {/* ── Card index top-right ───────────────────────── */}
      <motion.div
        className="absolute top-7 right-8 z-20 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.5, ease }}
        aria-hidden="true"
      >
        <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-ivory/20">
          {section.index}&nbsp;/&nbsp;{String(sections.length).padStart(2, '0')}
        </span>
      </motion.div>

      {/* ── Main content ──────────────────────────────── */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-content mx-auto px-6 lg:px-14 w-full">
          <div className="max-w-[52ch]">

            {/* Overline: number + category */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease }}
            >
              <motion.span
                className="block h-px"
                style={{ backgroundColor: section.accent }}
                initial={{ width: 0 }}
                animate={inView ? { width: 32 } : {}}
                transition={{ duration: 0.9, delay: 0.15, ease }}
              />
              <span
                className="font-sans text-[10px] tracking-[0.28em] uppercase"
                style={{ color: section.accent }}
              >
                {section.index} — {section.category}
              </span>
            </motion.div>

            {/* Headline */}
            <h2 className="font-serif text-display text-ivory leading-[1.08] mb-7">
              {section.headline.map((line, i) => (
                <div key={i} className="overflow-hidden block">
                  <motion.div
                    initial={{ y: '110%' }}
                    animate={inView ? { y: '0%' } : {}}
                    transition={{ duration: 1.0, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line}
                  </motion.div>
                </div>
              ))}
            </h2>

            {/* Body */}
            <motion.p
              className="font-sans text-base text-ivory/55 leading-relaxed mb-8 max-w-[42ch]"
              initial={{ opacity: 0, y: 14 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, delay: 0.45, ease }}
            >
              {section.body}
            </motion.p>

            {/* Tags */}
            <motion.div
              className="flex flex-wrap gap-2 mb-10"
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.55, ease }}
            >
              {section.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-sans text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 border text-ivory/45"
                  style={{ borderColor: `${section.accent}35` }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.65, ease }}
            >
              <Link
                href={section.href}
                className="inline-flex items-center gap-3 group"
              >
                <span
                  className="font-sans text-[11px] tracking-[0.22em] uppercase transition-colors duration-300"
                  style={{ color: section.accent }}
                >
                  Scopri
                </span>
                <span
                  className="relative overflow-hidden block h-px w-10 transition-all duration-500 group-hover:w-16"
                  style={{ backgroundColor: `${section.accent}60` }}
                >
                  <motion.span
                    className="absolute inset-0 h-full"
                    style={{ backgroundColor: section.accent }}
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 2.0, repeat: Infinity, ease: 'linear', delay: 1 }}
                  />
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: section.accent }}
                >
                  <path
                    d="M1 6h10M7 2l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Decorative corner bracket (bottom-right) ───── */}
      <div
        className="absolute bottom-8 right-8 w-12 h-12 border-b border-r pointer-events-none"
        style={{ borderColor: `${section.accent}20` }}
        aria-hidden="true"
      />
    </div>
  )
}

export default function StackingSections() {
  return (
    <div style={{ height: `${sections.length * 100}vh` }} className="relative">
      {sections.map((section, i) => (
        <StackCard key={section.id} section={section} stackIndex={i} />
      ))}
    </div>
  )
}
