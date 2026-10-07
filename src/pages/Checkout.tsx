import { AnimatePresence, motion } from 'framer-motion'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { MagneticButton } from '../components/MagneticButton'
import { PageTransition } from '../components/PageTransition'
import {
  PaymentMethods,
  type PaymentId,
  paymentMethods,
} from '../components/PaymentMethods'
import { useCart } from '../context/CartContext'
import { formatPrice, resolveAsset } from '../data/products'
import './Checkout.css'

export function Checkout() {
  const { items, total, clear, setQty, remove } = useCart()
  const [payment, setPayment] = useState<PaymentId>('blik')
  const [processing, setProcessing] = useState(false)
  const [done, setDone] = useState(false)
  const [blikCode, setBlikCode] = useState('')

  const methodName =
    paymentMethods.find((m) => m.id === payment)?.name ?? payment

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (items.length === 0) return
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1600))
    setProcessing(false)
    setDone(true)
    clear()
  }

  if (done) {
    return (
      <PageTransition>
        <div className="checkout-success container">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className="success-card"
          >
            <span className="success-mark" aria-hidden />
            <p className="eyebrow">Potwierdzenie</p>
            <h1 className="display">Zamówienie przyjęte</h1>
            <p>
              To demo — płatność przez <strong>{methodName}</strong> została
              zasymulowana. W produkcji podłączysz prawdziwe API bramki.
            </p>
            <Link to="/" className="btn btn-primary">
              Wróć do sklepu
            </Link>
          </motion.div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="checkout-page">
        <div className="container checkout-layout">
          <div>
            <p className="eyebrow">Zamówienie</p>
            <h1 className="display checkout-title">Finalizacja</h1>
            <p className="checkout-lead">
              Wybierz metodę płatności i uzupełnij dane dostawy. Wszystkie
              bramki działają w trybie prezentacyjnym.
            </p>

            {items.length === 0 ? (
              <div className="checkout-empty">
                <p>Koszyk jest pusty — dodaj produkt, aby przejść dalej.</p>
                <Link to="/" className="btn btn-primary">
                  Przejdź do kolekcji
                </Link>
              </div>
            ) : (
              <form className="checkout-form" onSubmit={onSubmit}>
                <section className="form-block">
                  <h2>Dane dostawy</h2>
                  <div className="form-grid">
                    <label>
                      Imię i nazwisko
                      <input name="name" required placeholder="Anna Kowalska" />
                    </label>
                    <label>
                      E‑mail
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="anna@example.com"
                      />
                    </label>
                    <label className="span-2">
                      Adres
                      <input
                        name="address"
                        required
                        placeholder="ul. Dźwiękowa 12"
                      />
                    </label>
                    <label>
                      Miasto
                      <input name="city" required placeholder="Warszawa" />
                    </label>
                    <label>
                      Kod pocztowy
                      <input name="zip" required placeholder="00-001" />
                    </label>
                  </div>
                </section>

                <section className="form-block">
                  <h2>Metoda płatności</h2>
                  <PaymentMethods value={payment} onChange={setPayment} />

                  <AnimatePresence mode="wait">
                    {payment === 'blik' && (
                      <motion.label
                        key="blik"
                        className="blik-field"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        Kod BLIK
                        <input
                          inputMode="numeric"
                          pattern="[0-9]{6}"
                          maxLength={6}
                          placeholder="••••••"
                          value={blikCode}
                          onChange={(e) =>
                            setBlikCode(e.target.value.replace(/\D/g, ''))
                          }
                          required
                        />
                      </motion.label>
                    )}
                    {payment === 'card' && (
                      <motion.div
                        key="card"
                        className="card-fields"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                      >
                        <label>
                          Numer karty
                          <input
                            required
                            placeholder="4242 4242 4242 4242"
                            inputMode="numeric"
                          />
                        </label>
                        <div className="card-row">
                          <label>
                            Ważność
                            <input required placeholder="MM/RR" />
                          </label>
                          <label>
                            CVC
                            <input required placeholder="123" inputMode="numeric" />
                          </label>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </section>

                <MagneticButton
                  type="submit"
                  className="btn btn-accent checkout-submit"
                  disabled={processing}
                >
                  {processing
                    ? 'Przetwarzanie…'
                    : `Zapłać ${formatPrice(total)} · ${methodName}`}
                </MagneticButton>
              </form>
            )}
          </div>

          <aside className="checkout-summary">
            <h2>Podsumowanie</h2>
            {items.length === 0 ? (
              <p className="muted">Brak produktów</p>
            ) : (
              <ul>
                {items.map((item) => (
                  <li key={item.product.id}>
                    <img
                      src={resolveAsset(item.product.images[0])}
                      alt=""
                    />
                    <div>
                      <strong>{item.product.name}</strong>
                      <div className="summary-qty">
                        <button
                          type="button"
                          onClick={() =>
                            setQty(item.product.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setQty(item.product.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="summary-remove"
                          onClick={() => remove(item.product.id)}
                        >
                          Usuń
                        </button>
                      </div>
                    </div>
                    <span>
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="summary-total">
              <span>Do zapłaty</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="summary-note">
              Obsługiwane: BLIK, karta, Apple Pay, Google Pay, PayPal,
              Przelewy24, PayU, Klarna, Stripe.
            </p>
          </aside>
        </div>
      </div>
    </PageTransition>
  )
}
