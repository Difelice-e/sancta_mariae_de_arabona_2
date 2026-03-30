import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: React.ReactNode
  className?: string
}

interface LinkButtonProps {
  href: string
  variant?: Variant
  size?: Size
  children: React.ReactNode
  className?: string
  external?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-sans tracking-[0.12em] uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold'

const variants: Record<Variant, string> = {
  primary: 'bg-crimson text-ivory hover:bg-crimson-dark active:scale-[0.98]',
  secondary: 'bg-navy text-ivory hover:bg-navy-light active:scale-[0.98]',
  ghost: 'bg-transparent text-navy hover:text-crimson border-b border-current pb-0.5 rounded-none',
  outline: 'bg-transparent text-ivory border border-ivory/40 hover:border-ivory hover:bg-white/5',
}

const sizes: Record<Size, string> = {
  sm: 'text-[10px] px-4 py-2',
  md: 'text-[11px] px-6 py-3',
  lg: 'text-[12px] px-8 py-4',
}

export function Button({ variant = 'primary', size = 'md', children, className, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  )
}

export function LinkButton({ href, variant = 'primary', size = 'md', children, className, external }: LinkButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className)

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}

// Arrow link — text + animated arrow
export function ArrowLink({
  href,
  children,
  className,
  light = false,
}: {
  href: string
  children: React.ReactNode
  className?: string
  light?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        'group inline-flex items-center gap-2 font-sans text-xs tracking-[0.14em] uppercase transition-colors duration-300',
        light ? 'text-ivory/70 hover:text-ivory' : 'text-navy/60 hover:text-navy',
        className
      )}
    >
      {children}
      <span
        className="inline-block transition-transform duration-300 ease-luxury group-hover:translate-x-1.5"
        aria-hidden="true"
      >
        →
      </span>
    </Link>
  )
}
