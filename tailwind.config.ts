import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A1628',
          light: '#0F2040',
          deep: '#060E1A',
          muted: '#1A2D4A',
        },
        crimson: {
          DEFAULT: '#C41E3A',
          light: '#D42545',
          dark: '#9E1830',
        },
        ivory: {
          DEFAULT: '#F5F0E8',
          warm: '#EDE5D4',
          cool: '#FAF7F2',
          dark: '#D9D0BC',
        },
        sand: {
          DEFAULT: '#D4C4A0',
          light: '#E2D6B8',
          dark: '#BFB088',
        },
        beige: {
          DEFAULT: '#E8DCC8',
          light: '#F0E8D8',
          dark: '#D4C4A8',
        },
        olive: {
          DEFAULT: '#6B7A4E',
          light: '#8A9B62',
          dark: '#4E5A38',
        },
        warm: {
          DEFAULT: '#B5A898',
          light: '#C8BDB0',
          dark: '#9A8E80',
        },
        gold: {
          DEFAULT: '#C9A96E',
          light: '#D9BC88',
          dark: '#B09050',
        },
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
        editorial: ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: {
        hero: ['clamp(3.25rem, 8vw, 7.5rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        display: ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        headline: ['clamp(1.875rem, 3vw, 3.25rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        subhead: ['clamp(1.25rem, 2vw, 1.625rem)', { lineHeight: '1.4' }],
      },
      spacing: {
        section: '7rem',
        'section-sm': '4rem',
        'section-xs': '2.5rem',
      },
      maxWidth: {
        content: '1440px',
        prose: '68ch',
        narrow: '50ch',
      },
      animation: {
        'scroll-cue': 'scrollCue 2.4s ease-in-out infinite',
        'fade-in': 'fadeIn 1.2s ease forwards',
      },
      keyframes: {
        scrollCue: {
          '0%, 100%': { opacity: '0.9', transform: 'translateY(0)' },
          '50%': { opacity: '0.3', transform: 'translateY(8px)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
    },
  },
  plugins: [],
}

export default config
