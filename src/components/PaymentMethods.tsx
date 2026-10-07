import { motion } from 'framer-motion'
import './PaymentMethods.css'

export type PaymentId =
  | 'blik'
  | 'card'
  | 'apple'
  | 'google'
  | 'paypal'
  | 'przelewy24'
  | 'payu'
  | 'klarna'
  | 'stripe'

export const paymentMethods: {
  id: PaymentId
  name: string
  desc: string
}[] = [
  { id: 'blik', name: 'BLIK', desc: 'Kod z aplikacji bankowej' },
  { id: 'card', name: 'Karta', desc: 'Visa · Mastercard · Maestro' },
  { id: 'apple', name: 'Apple Pay', desc: 'Szybka płatność Apple' },
  { id: 'google', name: 'Google Pay', desc: 'Portfel Google' },
  { id: 'paypal', name: 'PayPal', desc: 'Konto lub karta PayPal' },
  { id: 'przelewy24', name: 'Przelewy24', desc: 'Przelew online PL' },
  { id: 'payu', name: 'PayU', desc: 'Popularne metody PL' },
  { id: 'klarna', name: 'Klarna', desc: 'Zapłać później' },
  { id: 'stripe', name: 'Stripe', desc: 'Bezpieczny checkout' },
]

type Props = {
  value: PaymentId
  onChange: (id: PaymentId) => void
}

export function PaymentMethods({ value, onChange }: Props) {
  return (
    <div className="payments" role="radiogroup" aria-label="Metoda płatności">
      {paymentMethods.map((method, i) => {
        const selected = value === method.id
        return (
          <motion.button
            key={method.id}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`payment-option ${selected ? 'is-selected' : ''}`}
            onClick={() => onChange(method.id)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className={`payment-icon payment-icon--${method.id}`} aria-hidden />
            <span className="payment-copy">
              <strong>{method.name}</strong>
              <small>{method.desc}</small>
            </span>
            <span className="payment-check" aria-hidden />
          </motion.button>
        )
      })}
    </div>
  )
}
