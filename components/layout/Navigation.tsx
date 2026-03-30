'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Ristorante', href: '/ristorante' },
  { label: 'Campi Sportivi', href: '/campi-sportivi' },
  { label: 'Eventi', href: '/eventi-cerimonie' },
  { label: 'Attività', href: '/attivita-allaperto' },
  { label: 'Chi Siamo', href: '/chi-siamo' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 72)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-600',
          scrolled
            ? 'bg-navy/96 backdrop-blur-md border-b border-white/5'
            : 'bg-transparent'
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav className="max-w-content mx-auto px-6 lg:px-10 h-18 flex items-center justify-between" style={{ height: '72px' }}>
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none group" aria-label="Sancta Mariae de Arabona — Home">
            <span className="font-serif text-ivory text-xl tracking-tight leading-none group-hover:text-gold transition-colors duration-300">
              SMA
            </span>
            <span className="font-sans text-[10px] tracking-[0.18em] uppercase text-ivory/50 mt-0.5">
              Arabona
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="nav-link font-sans text-[11px] tracking-[0.12em] uppercase text-ivory/70 hover:text-ivory transition-colors duration-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href="/contatti"
              className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5 bg-crimson text-ivory font-sans text-[11px] tracking-[0.12em] uppercase hover:bg-crimson-dark transition-colors duration-300"
            >
              Prenota
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
              aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'}
              aria-expanded={menuOpen}
            >
              <span className="sr-only">{menuOpen ? 'Chiudi' : 'Menu'}</span>
              <div className="w-5 flex flex-col gap-[5px]">
                <motion.span
                  className="block h-px bg-ivory origin-center"
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  className="block h-px bg-ivory"
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-px bg-ivory origin-center"
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Full-Screen Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-navy flex flex-col justify-center px-8"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Grain on overlay */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            }} />

            <nav className="relative z-10">
              <ul className="flex flex-col gap-1">
                {[...navLinks, { label: 'Galleria', href: '/galleria' }].map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block font-serif text-headline text-ivory hover:text-gold transition-colors duration-300 py-3 border-b border-white/5"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                className="mt-8"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <Link
                  href="/contatti"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-crimson text-ivory font-sans text-sm tracking-[0.1em] uppercase"
                >
                  Prenota ora
                </Link>
              </motion.div>

              <motion.p
                className="mt-10 font-sans text-xs tracking-[0.1em] uppercase text-ivory/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Manoppello, Abruzzo — Italia
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
