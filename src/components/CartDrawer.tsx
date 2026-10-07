import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatPrice, resolveAsset } from '../data/products'
import { useCart } from '../context/CartContext'
import './CartDrawer.css'

export function CartDrawer() {
  const { items, isOpen, close, remove, setQty, total } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            className="cart-backdrop"
            aria-label="Zamknij koszyk"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Koszyk"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 32 }}
          >
            <div className="cart-head">
              <h2 className="display">Koszyk</h2>
              <button className="cart-close" onClick={close}>
                Zamknij
              </button>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <p>Twój koszyk jest pusty.</p>
                <button className="btn btn-ghost" onClick={close}>
                  Wróć do kolekcji
                </button>
              </div>
            ) : (
              <>
                <ul className="cart-list">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.li
                        key={item.product.id}
                        className="cart-item"
                        layout
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="cart-item-media">
                          <img
                            src={resolveAsset(item.product.images[0])}
                            alt=""
                          />
                        </div>
                        <div className="cart-item-body">
                          <div className="cart-item-top">
                            <div>
                              <h3>{item.product.name}</h3>
                              <p>{item.product.tagline}</p>
                            </div>
                            <strong>{formatPrice(item.product.price)}</strong>
                          </div>
                          <div className="cart-item-actions">
                            <div className="qty">
                              <button
                                onClick={() =>
                                  setQty(item.product.id, item.quantity - 1)
                                }
                                aria-label="Zmniejsz ilość"
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() =>
                                  setQty(item.product.id, item.quantity + 1)
                                }
                                aria-label="Zwiększ ilość"
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="remove"
                              onClick={() => remove(item.product.id)}
                            >
                              Usuń
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Razem</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  <Link to="/checkout" className="btn btn-primary cart-checkout" onClick={close}>
                    Przejdź do płatności
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
