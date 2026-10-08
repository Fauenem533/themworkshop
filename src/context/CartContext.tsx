import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
  type ReactNode,
} from 'react'
import type { Product } from '../data/products'

export type CartItem = {
  product: Product
  quantity: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type Action =
  | { type: 'ADD'; product: Product; openDrawer?: boolean }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'TOGGLE' }
  | { type: 'HYDRATE'; items: CartItem[] }

const STORAGE_KEY = 'tw-cart-v1'

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) => item?.product?.id && typeof item.quantity === 'number' && item.quantity > 0,
    )
  } catch {
    return []
  }
}

function cartReducer(state: CartState, action: Action): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.items }
    case 'ADD': {
      const openDrawer = action.openDrawer !== false
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          ...state,
          isOpen: openDrawer ? true : state.isOpen,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        }
      }
      return {
        ...state,
        isOpen: openDrawer ? true : state.isOpen,
        items: [...state.items, { product: action.product, quantity: 1 }],
      }
    }
    case 'REMOVE':
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.id),
      }
    case 'SET_QTY':
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((i) => i.product.id !== action.id),
        }
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.id ? { ...i, quantity: action.quantity } : i,
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    case 'TOGGLE':
      return { ...state, isOpen: !state.isOpen }
    default:
      return state
  }
}

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  count: number
  total: number
  add: (product: Product, options?: { openDrawer?: boolean }) => void
  remove: (id: string) => void
  setQty: (id: string, quantity: number) => void
  clear: () => void
  open: () => void
  close: () => void
  toggle: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false)
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  useEffect(() => {
    dispatch({ type: 'HYDRATE', items: loadCart() })
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
  }, [state.items, hydrated])

  const value = useMemo<CartContextValue>(() => {
    const count = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const total = state.items.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    )
    return {
      items: state.items,
      isOpen: state.isOpen,
      count,
      total,
      add: (product, options) =>
        dispatch({
          type: 'ADD',
          product,
          openDrawer: options?.openDrawer,
        }),
      remove: (id) => dispatch({ type: 'REMOVE', id }),
      setQty: (id, quantity) => dispatch({ type: 'SET_QTY', id, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
      open: () => dispatch({ type: 'OPEN' }),
      close: () => dispatch({ type: 'CLOSE' }),
      toggle: () => dispatch({ type: 'TOGGLE' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
