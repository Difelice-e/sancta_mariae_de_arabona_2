'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  index?: string          // e.g. "01"
  overline?: string       // small caps label above headline
  headline: string        // main heading
  subtext?: string        // optional body text
  align?: 'left' | 'center'
  light?: boolean         // for dark backgrounds
  className?: string
}

const ease = [0.22, 1, 0.36, 1] as const

export default function SectionHeader({
  index,
  overline,
  headline,
  subtext,
  align = 'left',
  light = false,
  className,
}: SectionHeaderProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12% 0px' })

  const textColor = light ? 'text-ivory' : 'text-navy'
  const mutedColor = light ? 'text-ivory/50' : 'text-warm'

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      {/* Index + overline row */}
      {(index || overline) && (
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease }}
        >
          {index && (
            <span className={cn('font-sans text-[10px] tracking-[0.2em] uppercase', mutedColor)}>
              {index}
            </span>
          )}
          {index && overline && (
            <span className={cn('block w-8 h-px', light ? 'bg-gold/60' : 'bg-gold')} aria-hidden="true" />
          )}
          {overline && (
            <span className={cn('font-sans text-[10px] tracking-[0.18em] uppercase', mutedColor)}>
              {overline}
            </span>
          )}
        </motion.div>
      )}

      {/* Headline */}
      <motion.h2
        className={cn('font-serif text-headline', textColor)}
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.75, delay: 0.08, ease }}
      >
        {headline}
      </motion.h2>

      {/* Subtext */}
      {subtext && (
        <motion.p
          className={cn('font-sans text-base leading-relaxed max-w-prose', mutedColor)}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.16, ease }}
        >
          {subtext}
        </motion.p>
      )}
    </div>
  )
}
