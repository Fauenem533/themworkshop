export type Product = {
  id: string
  name: string
  tagline: string
  description: string
  price: number
  /** Cena przed obniżką — gdy ustawiona i większa od price, produkt jest na wyprzedaży */
  compareAtPrice?: number
  category: string
  maker: string
  images: string[]
  specs: { label: string; value: string }[]
  featured?: boolean
  onSale?: boolean
  sourceUrl?: string
}

export function isOnSale(product: Product): boolean {
  return Boolean(
    product.onSale ||
      (product.compareAtPrice != null && product.compareAtPrice > product.price),
  )
}

export function salePercent(product: Product): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return null
  return Math.round((1 - product.price / product.compareAtPrice) * 100)
}

/** Prefiksuje ścieżki assetów base path (GitHub Pages: /themworkshop/). */
export function resolveAsset(path: string): string {
  if (!path) return ''
  if (/^(https?:|data:|blob:)/i.test(path)) return path
  const base = import.meta.env.BASE_URL || '/'
  if (path.startsWith(base)) return path
  return `${base}${path.replace(/^\//, '')}`
}

const img = (...files: string[]) => files.map((f) => resolveAsset(`products/${f}`))

/** Domyślna oferta — noże kuchenne warsztatu @themworkshop (Marek Kania). Ceny startowe do edycji w panelu. */
export const defaultProducts: Product[] = [
  {
    id: 'gyuto-220',
    name: 'Gyuto 220',
    tagline: 'Nóż szefa kuchni',
    description:
      'Klasyczny gyuto z warsztatu themworkshop — uniwersalne ostrze do krojenia, siekania i filetowania. Wykonany ręcznie przez Marka Kanię.',
    price: 890,
    category: 'Nóż szefa',
    maker: 'themworkshop',
    featured: true,
    sourceUrl: 'https://www.instagram.com/p/CbQp4gsDyN-/',
    images: img('tw-hero.jpg', 'tw-01.jpg', 'tw-02.jpg'),
    specs: [
      { label: 'Typ', value: 'Gyuto / Chef' },
      { label: 'Długość ostrza', value: '~220 mm' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Warsztat', value: '@themworkshop' },
    ],
  },
  {
    id: 'santoku-180',
    name: 'Santoku 180',
    tagline: 'Uniwersalny nóż kuchenny',
    description:
      'Santoku o zbalansowanej geometrii — mięso, warzywa, zioła. Kompaktowa długość idealna do codziennej pracy w kuchni.',
    price: 590,
    compareAtPrice: 790,
    onSale: true,
    category: 'Santoku',
    maker: 'themworkshop',
    featured: true,
    sourceUrl: 'https://www.instagram.com/themworkshop/',
    images: img('tw-03.jpg', 'tw-04.jpg', 'tw-01.jpg'),
    specs: [
      { label: 'Typ', value: 'Santoku' },
      { label: 'Długość ostrza', value: '~180 mm' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Warsztat', value: '@themworkshop' },
    ],
  },
  {
    id: 'petty-135',
    name: 'Petty 135',
    tagline: 'Nóż użytkowy',
    description:
      'Mały nóż petty do precyzyjnych zadań — obieranie, przycinanie, detale. Lekki, zwinny, zawsze pod ręką.',
    price: 390,
    compareAtPrice: 490,
    onSale: true,
    category: 'Petty',
    maker: 'themworkshop',
    featured: true,
    sourceUrl: 'https://www.instagram.com/themworkshop/',
    images: img('tw-05.jpg', 'tw-06.jpg', 'tw-02.jpg'),
    specs: [
      { label: 'Typ', value: 'Petty / Utility' },
      { label: 'Długość ostrza', value: '~135 mm' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Warsztat', value: '@themworkshop' },
    ],
  },
  {
    id: 'nakiri-165',
    name: 'Nakiri 165',
    tagline: 'Nóż do warzyw',
    description:
      'Proste ostrze nakiri zaprojektowane pod warzywa — czyste pchnięcia i kontrola na desce. Sylwetka inspirowana japońską klasyką.',
    price: 540,
    compareAtPrice: 720,
    onSale: true,
    category: 'Nakiri',
    maker: 'themworkshop',
    sourceUrl: 'https://www.instagram.com/themworkshop/',
    images: img('tw-07.jpg', 'tw-08.jpg', 'tw-03.jpg'),
    specs: [
      { label: 'Typ', value: 'Nakiri' },
      { label: 'Długość ostrza', value: '~165 mm' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Warsztat', value: '@themworkshop' },
    ],
  },
  {
    id: 'bread-240',
    name: 'Bread 240',
    tagline: 'Nóż do chleba',
    description:
      'Długie ząbkowane ostrze do bochenków i wypieków — bez zgniatania miękiszu. Solidna rękojeść z warsztatu themworkshop.',
    price: 490,
    compareAtPrice: 650,
    onSale: true,
    category: 'Chleb',
    maker: 'themworkshop',
    sourceUrl: 'https://www.instagram.com/themworkshop/',
    images: img('tw-02.jpg', 'tw-05.jpg', 'tw-08.jpg'),
    specs: [
      { label: 'Typ', value: 'Bread knife' },
      { label: 'Długość ostrza', value: '~240 mm' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Warsztat', value: '@themworkshop' },
    ],
  },
  {
    id: 'paring-90',
    name: 'Paring 90',
    tagline: 'Nóż do obierania',
    description:
      'Krótki paring do owoców i drobnych prac. Precyzja w palcach — od warsztatu noży kuchennych themworkshop.',
    price: 420,
    category: 'Paring',
    maker: 'themworkshop',
    sourceUrl: 'https://www.instagram.com/themworkshop/',
    images: img('tw-04.jpg', 'tw-06.jpg', 'tw-07.jpg'),
    specs: [
      { label: 'Typ', value: 'Paring' },
      { label: 'Długość ostrza', value: '~90 mm' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Warsztat', value: '@themworkshop' },
    ],
  },
  {
    id: 'custom-commission',
    name: 'Custom Commission',
    tagline: 'Nóż na zamówienie',
    description:
      'Indywidualne zlecenie — dobór stali, rękojeści i geometrii pod Twoją kuchnię. Cena orientacyjna; finalna wycena po konsultacji.',
    price: 1200,
    category: 'Custom',
    maker: 'themworkshop',
    featured: true,
    sourceUrl: 'https://www.instagram.com/themworkshop/',
    images: img('tw-06.jpg', 'tw-01.jpg', 'tw-03.jpg'),
    specs: [
      { label: 'Typ', value: 'Na zamówienie' },
      { label: 'Czas', value: 'Indywidualny' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Kontakt', value: '@themworkshop' },
    ],
  },
  {
    id: 'chef-set',
    name: 'Chef Set',
    tagline: 'Zestaw kuchenny',
    description:
      'Zestaw warsztatowy: gyuto + petty + nakiri. Spójna linia noży do pełnej pracy w kuchni — od themworkshop.',
    price: 1890,
    category: 'Zestaw',
    maker: 'themworkshop',
    sourceUrl: 'https://www.instagram.com/themworkshop/',
    images: img('tw-08.jpg', 'tw-01.jpg', 'tw-05.jpg'),
    specs: [
      { label: 'Zawartość', value: 'Gyuto · Petty · Nakiri' },
      { label: 'Wykonanie', value: 'Handmade' },
      { label: 'Warsztat', value: '@themworkshop' },
    ],
  },
]

export const products = defaultProducts

export function getProduct(id: string): Product | undefined {
  return defaultProducts.find((p) => p.id === id)
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    maximumFractionDigits: 0,
  }).format(value)
}

export function createEmptyProduct(): Product {
  return {
    id: `product-${Date.now()}`,
    name: 'Nowy nóż',
    tagline: 'Opis krótki',
    description: 'Dodaj opis produktu…',
    price: 0,
    category: 'Kuchenne',
    maker: 'themworkshop',
    images: [resolveAsset('products/tw-01.jpg')],
    specs: [
      { label: 'Typ', value: '' },
      { label: 'Wykonanie', value: 'Handmade' },
    ],
    featured: false,
    sourceUrl: 'https://www.instagram.com/themworkshop/',
  }
}
