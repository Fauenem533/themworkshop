import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  createEmptyProduct,
  defaultProducts,
  type Product,
} from '../data/products'

const STORAGE_KEY = 'themworkshop_products_v2'
const AUTH_KEY = 'themworkshop_admin_auth'
export const ADMIN_PASSWORD = 'themworkshop'

type ProductsContextValue = {
  products: Product[]
  getById: (id: string) => Product | undefined
  upsert: (product: Product) => void
  remove: (id: string) => void
  resetDefaults: () => void
  createDraft: () => Product
  isAdmin: boolean
  login: (password: string) => boolean
  logout: () => void
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProducts
    const parsed = JSON.parse(raw) as Product[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultProducts
    return parsed
  } catch {
    return defaultProducts
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => loadProducts())
  const [isAdmin, setIsAdmin] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === '1',
  )

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  }, [products])

  const getById = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products],
  )

  const upsert = useCallback((product: Product) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id)
      if (idx === -1) return [product, ...prev]
      const next = [...prev]
      next[idx] = product
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const resetDefaults = useCallback(() => {
    setProducts(defaultProducts)
  }, [])

  const createDraft = useCallback(() => createEmptyProduct(), [])

  const login = useCallback((password: string) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setIsAdmin(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY)
    setIsAdmin(false)
  }, [])

  const value = useMemo(
    () => ({
      products,
      getById,
      upsert,
      remove,
      resetDefaults,
      createDraft,
      isAdmin,
      login,
      logout,
    }),
    [
      products,
      getById,
      upsert,
      remove,
      resetDefaults,
      createDraft,
      isAdmin,
      login,
      logout,
    ],
  )

  return (
    <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
  )
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider')
  return ctx
}
