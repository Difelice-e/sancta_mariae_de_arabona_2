import Link from 'next/link'

const footerLinks = {
  Esperienze: [
    { label: 'Ristorante', href: '/ristorante' },
    { label: 'Campi Sportivi', href: '/campi-sportivi' },
    { label: 'Eventi & Cerimonie', href: '/eventi-cerimonie' },
    { label: 'Attività all\'aperto', href: '/attivita-allaperto' },
  ],
  Tenuta: [
    { label: 'Chi Siamo', href: '/chi-siamo' },
    { label: 'Galleria', href: '/galleria' },
    { label: 'Prenotazioni', href: '/contatti' },
  ],
  Informazioni: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookie' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-ivory/70 section-padding relative overflow-hidden" style={{ backgroundColor: '#060E1A' }}>
      {/* Grain */}
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
      }} />

      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gold/20" />

      <div className="max-w-content mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 lg:gap-8 mb-16">
          {/* Brand column */}
          <div className="space-y-5">
            <div>
              <p className="font-serif text-ivory text-2xl leading-none tracking-tight">SMA</p>
              <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-ivory/40 mt-1">
                Sancta Mariae de Arabona
              </p>
            </div>
            <p className="font-sans text-sm leading-relaxed text-ivory/50 max-w-[28ch]">
              Una tenuta esclusiva immersa nei boschi e nelle colline dell&apos;entroterra abruzzese.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] tracking-[0.15em] uppercase text-ivory/40 hover:text-gold transition-colors duration-300"
                aria-label="Instagram"
              >
                Instagram
              </a>
              <span className="text-ivory/20">·</span>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-[10px] tracking-[0.15em] uppercase text-ivory/40 hover:text-gold transition-colors duration-300"
                aria-label="Facebook"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="font-sans text-[10px] tracking-[0.18em] uppercase text-gold/80 mb-5">
                {group}
              </p>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-sans text-sm text-ivory/50 hover:text-ivory transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-ivory/10 to-transparent mb-8" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-sans text-[11px] tracking-[0.06em] text-ivory/30">
              Contrada Arabona, Manoppello (PE) — Abruzzo, Italia
            </p>
            <a
              href="tel:+39XXXXXXXXXX"
              className="font-sans text-[11px] tracking-[0.06em] text-ivory/30 hover:text-gold transition-colors"
            >
              +39 000 000 0000
            </a>
          </div>
          <p className="font-sans text-[10px] tracking-[0.08em] text-ivory/20">
            © {new Date().getFullYear()} Sancta Mariae de Arabona. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  )
}
