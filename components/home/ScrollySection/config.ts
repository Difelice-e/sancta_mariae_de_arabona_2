export type PanelConfig = {
  id: string
  image: string
  title: string
  subtitle: string
  body: string
  cta: { label: string; href: string }
  bg: string
}

export const panels: PanelConfig[] = [
  {
    id: "ristorante",
    image: "/images/scroll_1.png",
    title: "Fuoco e Sapori",
    subtitle: "Braceria artigianale · Prodotti del territorio",
    body: "Sapori autentici intorno al fuoco, dalla brace alla tavola.",
    cta: { label: "Scopri il ristorante", href: "/ristorante" },
    bg: "#2A0E06",
  },
  {
    id: "sport",
    image: "/images/scroll_2.png",
    title: "Il Campo è Aperto",
    subtitle: "Calcetto · Padel",
    body: "Sfida i tuoi amici su campi immersi nel verde.",
    cta: { label: "Prenota un campo", href: "/sport" },
    bg: "#0A1F12",
  },
  {
    id: "eventi",
    image: "/images/scroll_3.png",
    title: "Il Tuo Momento",
    subtitle: "Matrimoni · Ritiri aziendali · Feste private",
    body: "Ogni occasione merita uno scenario indimenticabile.",
    cta: { label: "Esplora gli eventi", href: "/eventi" },
    bg: "#1A0E24",
  },
  {
    id: "natura",
    image: "/images/scroll_4.png",
    title: "Radici e Respiro",
    subtitle: "Yoga · Equitazione · Fattoria didattica",
    body: "Rallenta. La natura ha tutto il tempo del mondo.",
    cta: { label: "Vivi la natura", href: "/natura" },
    bg: "#0D1A0A",
  },
]
