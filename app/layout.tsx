import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PageLoader from '@/components/PageLoader'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Sancta Mariae de Arabona — Tenuta di Charme in Abruzzo',
    template: '%s | Sancta Mariae de Arabona',
  },
  description:
    'Un rifugio esclusivo immerso nella natura incontaminata dell\'Abruzzo. Ristorante, campi sportivi, cerimonie e attività all\'aperto in una tenuta di charme.',
  keywords: ['tenuta abruzzo', 'agriturismo lusso', 'ristorante abruzzo', 'eventi cerimonie abruzzo', 'Marco Verratti'],
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    siteName: 'Sancta Mariae de Arabona',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body>
        <PageLoader />
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
