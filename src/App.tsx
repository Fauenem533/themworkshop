import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { CartDrawer } from './components/CartDrawer'
import { CustomCursor } from './components/CustomCursor'
import { Header } from './components/Header'
import { Preloader } from './components/Preloader'
import { SmoothScroll } from './components/SmoothScroll'
import { CartProvider } from './context/CartContext'
import { ProductsProvider } from './context/ProductsContext'
import { Admin } from './pages/Admin'
import { Checkout } from './pages/Checkout'
import { Home } from './pages/Home'
import { ProductDetail } from './pages/ProductDetail'
import { Sale } from './pages/Sale'

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <SmoothScroll>
      <ProductsProvider>
        <CartProvider>
          <Preloader />
          {!isAdmin && <CustomCursor />}
          {!isAdmin && <Header />}
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/produkt/:id" element={<ProductDetail />} />
              <Route path="/wyprzedaz" element={<Sale />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </AnimatePresence>
          {!isAdmin && <CartDrawer />}
        </CartProvider>
      </ProductsProvider>
    </SmoothScroll>
  )
}
