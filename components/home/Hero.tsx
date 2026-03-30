'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as const

const slides = [
  {
    id: 'tenuta',
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2560&q=90',
    alt: 'Panorama delle colline abruzzesi — Sancta Mariae de Arabona',
    label: 'La Tenuta',
  },
  {
    id: 'ristorante',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=2560&q=90',
    alt: 'Ristorante della tenuta',
    label: 'Ristorante',
  },
  {
    id: 'sport',
    src: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&w=2560&q=90',
    alt: 'Campi sportivi della tenuta',
    label: 'Sport',
  },
  {
    id: 'natura',
    src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2560&q=90',
    alt: "Natura dell'entroterra abruzzese",
    label: 'Natura',
  },
  {
    id: 'cerimonie',
    src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2560&q=90',
    alt: 'Cerimonie ed eventi alla tenuta',
    label: 'Cerimonie',
  },
]

const SLIDE_DURATION = 5500

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)
  const [currentSlide, setCurrentSlide] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.45], ['0%', '-10%'])

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 })
  const imageRotateX = useTransform(smoothY, [0, 1], [1.5, -1.5])
  const imageRotateY = useTransform(smoothX, [0, 1], [-2, 2])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((s) => (s + 1) % slides.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[600px] overflow-hidden"
      aria-label="Hero — Sancta Mariae de Arabona"
      onMouseMove={handleMouseMove}
    >
      {/* ── CINEMATIC REVEAL BARS ─────────────────────────── */}
      <motion.div
        className="absolute top-0 inset-x-0 z-[100] origin-top"
        style={{ height: '50vh', backgroundColor: '#060E1A' }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.4, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="absolute bottom-0 inset-x-0 z-[100] origin-bottom"
        style={{ height: '50vh', backgroundColor: '#060E1A' }}
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 1.4, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
      />

      {/* ── AMBIENT LIGHT ORBS ────────────────────────────── */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.14) 0%, transparent 65%)' }}
          animate={{ x: [0, 40, -30, 0], y: [0, -30, 50, 0], scale: [1, 1.08, 0.96, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-[10%] -right-[5%] w-[50vw] h-[50vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(196,30,58,0.09) 0%, transparent 65%)' }}
          animate={{ x: [0, -50, 20, 0], y: [0, 30, -40, 0], scale: [1, 0.9, 1.12, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
        />
        <motion.div
          className="absolute top-[30%] right-[10%] w-[40vw] h-[40vw] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 65%)' }}
          animate={{ x: [0, 20, -40, 0], y: [0, -50, 20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        />
      </div>

      {/* ── BACKGROUND SLIDESHOW (3D tilt + scroll parallax + Ken Burns) ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          y: imageY,
          rotateX: imageRotateX,
          rotateY: imageRotateY,
          scale: 1.12,
          perspective: 1000,
        }}
      >
        <AnimatePresence mode="sync">
          {slides.map((slide, i) =>
            i === currentSlide ? (
              <motion.div
                key={slide.id}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: 'easeInOut' }}
              >
                {/* Ken Burns per-slide zoom */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.0 }}
                  animate={{ scale: 1.07 }}
                  transition={{ duration: (SLIDE_DURATION + 1400) / 1000, ease: 'linear' }}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    className="object-cover object-center"
                    sizes="100vw"
                    priority={i === 0}
                  />
                </motion.div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── GRADIENT OVERLAYS ─────────────────────────────── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(6,14,26,0.97) 0%, rgba(6,14,26,0.62) 32%, rgba(6,14,26,0.2) 60%, rgba(6,14,26,0.08) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(6,14,26,0.65) 0%, transparent 28%)' }}
      />
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 40% at 50% 95%, rgba(201,169,110,0.08) 0%, transparent 100%)',
        }}
      />

      {/* ── DECORATIVE FRAME (corner brackets + line) ─────── */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        {(
          [
            { pos: 'top-6 left-6', b: 'border-t border-l' },
            { pos: 'top-6 right-6', b: 'border-t border-r' },
            { pos: 'bottom-14 left-6', b: 'border-b border-l' },
            { pos: 'bottom-14 right-6', b: 'border-b border-r' },
          ] as const
        ).map(({ pos, b }, i) => (
          <motion.div
            key={i}
            className={`absolute w-14 h-14 ${pos} ${b} border-gold/25`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.7 + i * 0.06, ease }}
          />
        ))}
        <motion.div
          className="absolute left-0 right-0 h-px"
          style={{
            top: '18%',
            background:
              'linear-gradient(to right, transparent 5%, rgba(201,169,110,0.12) 30%, rgba(201,169,110,0.12) 70%, transparent 95%)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2.4, delay: 1.6, ease }}
        />
      </div>

      {/* ── ACTIVE SLIDE LABEL (top-right) ────────────────── */}
      <motion.div
        className="absolute top-7 right-6 lg:right-12 z-[4] flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.0 }}
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={slides[currentSlide].id}
            className="font-sans text-[9px] tracking-[0.28em] uppercase text-gold/50"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.45, ease }}
          >
            {slides[currentSlide].label}
          </motion.span>
        </AnimatePresence>
        <span className="font-sans text-[9px] text-ivory/15">
          {currentSlide + 1}/{slides.length}
        </span>
      </motion.div>

      {/* ── HERO CONTENT ──────────────────────────────────── */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-24"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        <div className="max-w-content mx-auto px-6 lg:px-12 w-full">
          {/* Overline */}
          <motion.div
            className="flex items-center gap-4 mb-7"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 1.5, ease }}
          >
            <motion.span
              className="block h-px bg-gold"
              initial={{ width: 0 }}
              animate={{ width: 36 }}
              transition={{ duration: 1, delay: 1.5, ease }}
            />
            <span className="font-sans text-[10px] tracking-[0.32em] uppercase text-ivory/45">
              Tenuta di Charme · Abruzzo, Italia
            </span>
          </motion.div>

          {/* Headline — line-by-line clip reveal */}
          <h1 className="font-serif text-hero text-ivory leading-[1.04] mb-8">
            {[
              { text: 'Dove la natura', dim: false },
              { text: "incontra l'eccellenza", dim: true },
            ].map((line, i) => (
              <div key={i} className="overflow-hidden block">
                <motion.div
                  className={line.dim ? 'text-ivory/80' : ''}
                  initial={{ y: '110%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.1, delay: 1.3 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  {line.text}
                </motion.div>
              </div>
            ))}
          </h1>

          {/* Subtext + CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-end gap-7 sm:gap-16"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.85, ease }}
          >
            <p className="font-editorial italic text-subhead text-ivory/50 max-w-[34ch] leading-relaxed">
              Un rifugio esclusivo immerso tra i boschi e i silenzi dell&apos;entroterra abruzzese.
            </p>
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                href="/chi-siamo"
                className="inline-flex items-center px-8 py-3.5 bg-crimson text-ivory font-sans text-[11px] tracking-[0.16em] uppercase hover:bg-crimson-dark transition-colors duration-300"
              >
                Scopri la Tenuta
              </Link>
              <Link
                href="/contatti"
                className="inline-flex items-center px-8 py-3.5 font-sans text-[11px] tracking-[0.16em] uppercase border border-ivory/25 text-ivory/70 hover:border-gold/50 hover:text-ivory hover:bg-white/[0.04] transition-all duration-300"
              >
                Prenota
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── SLIDE DOTS (bottom-left) ──────────────────────── */}
      <motion.div
        className="absolute bottom-8 left-6 lg:left-12 z-10 flex items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4 }}
        aria-hidden="true"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrentSlide(i)}
            className="cursor-pointer transition-all duration-500"
            style={{
              width: i === currentSlide ? '20px' : '5px',
              height: '2px',
              backgroundColor:
                i === currentSlide ? 'rgba(201,169,110,0.8)' : 'rgba(245,240,232,0.2)',
              borderRadius: '1px',
            }}
          />
        ))}
      </motion.div>

      {/* ── ANIMATED SCROLL LINE (bottom-center) ─────────── */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.4 }}
        aria-hidden="true"
      >
        <span className="font-sans text-[9px] tracking-[0.28em] uppercase text-ivory/25">Scorri</span>
        <div className="w-px h-12 overflow-hidden">
          <motion.div
            className="w-px h-full bg-gradient-to-b from-gold/60 to-transparent"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 2.6 }}
          />
        </div>
      </motion.div>

      {/* ── COORDINATES (bottom-right) ────────────────────── */}
      <motion.div
        className="absolute bottom-8 right-6 lg:right-12 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
        aria-hidden="true"
      >
        <p className="font-sans text-[9px] tracking-[0.22em] uppercase text-ivory/20 text-right">
          42.2547° N, 14.0711° E
        </p>
        <p className="font-sans text-[9px] tracking-[0.22em] uppercase text-ivory/20 text-right mt-1">
          Manoppello — Pescara
        </p>
      </motion.div>
    </section>
  )
}
