import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { formatPrice, type Product } from '../data/products'
import { useProducts } from '../context/ProductsContext'
import './Admin.css'

const IMAGE_OPTIONS = [
  '/products/tw-hero.jpg',
  '/products/tw-01.jpg',
  '/products/tw-02.jpg',
  '/products/tw-03.jpg',
  '/products/tw-04.jpg',
  '/products/tw-05.jpg',
  '/products/tw-06.jpg',
  '/products/tw-07.jpg',
  '/products/tw-08.jpg',
]

export function Admin() {
  const {
    products,
    upsert,
    remove,
    resetDefaults,
    createDraft,
    isAdmin,
    login,
    logout,
  } = useProducts()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<Product | null>(null)
  const [query, setQuery] = useState('')
  const [savedFlash, setSavedFlash] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return products
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q),
    )
  }, [products, query])

  function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (login(password)) {
      setError('')
      setPassword('')
    } else {
      setError('Nieprawidłowe hasło')
    }
  }

  function startCreate() {
    setEditing(createDraft())
  }

  function startEdit(product: Product) {
    setEditing(structuredClone(product))
  }

  function saveProduct(e: FormEvent) {
    e.preventDefault()
    if (!editing) return
    const cleaned: Product = {
      ...editing,
      name: editing.name.trim() || 'Bez nazwy',
      price: Number.isFinite(editing.price) ? Math.max(0, editing.price) : 0,
      images: editing.images.filter(Boolean).length
        ? editing.images.filter(Boolean)
        : ['/products/tw-01.jpg'],
      specs: editing.specs.filter((s) => s.label.trim() || s.value.trim()),
    }
    upsert(cleaned)
    setEditing(null)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1600)
  }

  if (!isAdmin) {
    return (
      <div className="admin-shell admin-login">
        <motion.form
          className="admin-login-card"
          onSubmit={handleLogin}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="eyebrow">Panel</p>
          <h1 className="display">themworkshop</h1>
          <p className="admin-muted">Zaloguj się, aby edytować ofertę i ceny.</p>
          <label>
            Hasło
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
            />
          </label>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="btn btn-primary">
            Wejdź do panelu
          </button>
          <Link to="/" className="admin-back">
            ← Wróć do sklepu
          </Link>
          <p className="admin-hint">Demo: hasło to nazwa konta Instagram</p>
        </motion.form>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <header className="admin-top">
        <div>
          <p className="eyebrow">Administrator</p>
          <h1 className="display">themworkshop</h1>
        </div>
        <div className="admin-top-actions">
          {savedFlash && <span className="admin-flash">Zapisano</span>}
          <Link to="/" className="btn btn-ghost">
            Sklep
          </Link>
          <button type="button" className="btn btn-ghost" onClick={logout}>
            Wyloguj
          </button>
        </div>
      </header>

      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Szukaj produktu…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn btn-primary" onClick={startCreate}>
          + Nowe ogłoszenie
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            if (confirm('Przywrócić domyślną ofertę?')) resetDefaults()
          }}
        >
          Reset oferty
        </button>
      </div>

      <div className="admin-stats">
        <div>
          <strong>{products.length}</strong>
          <span>produktów</span>
        </div>
        <div>
          <strong>
            {formatPrice(products.reduce((s, p) => s + p.price, 0) / Math.max(products.length, 1))}
          </strong>
          <span>średnia cena</span>
        </div>
        <div>
          <strong>{products.filter((p) => p.featured).length}</strong>
          <span>wyróżnione</span>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Zdjęcie</th>
              <th>Nazwa</th>
              <th>Kategoria</th>
              <th>Cena</th>
              <th>Wyróżniony</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.images[0]} alt="" className="admin-thumb" />
                </td>
                <td>
                  <strong>{product.name}</strong>
                  <small>{product.tagline}</small>
                </td>
                <td>{product.category}</td>
                <td>
                  <input
                    className="admin-price-input"
                    type="number"
                    min={0}
                    step={10}
                    value={product.price}
                    onChange={(e) =>
                      upsert({ ...product, price: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={!!product.featured}
                    onChange={(e) =>
                      upsert({ ...product, featured: e.target.checked })
                    }
                  />
                </td>
                <td className="admin-row-actions">
                  <button type="button" onClick={() => startEdit(product)}>
                    Edytuj
                  </button>
                  <button
                    type="button"
                    className="danger"
                    onClick={() => {
                      if (confirm(`Usunąć „${product.name}”?`)) remove(product.id)
                    }}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            className="admin-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEditing(null)}
          >
            <motion.form
              className="admin-modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={saveProduct}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
            >
              <div className="admin-modal-head">
                <h2 className="display">Edycja produktu</h2>
                <button type="button" onClick={() => setEditing(null)}>
                  Zamknij
                </button>
              </div>

              <div className="admin-form-grid">
                <label>
                  Nazwa
                  <input
                    required
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </label>
                <label>
                  Tagline
                  <input
                    value={editing.tagline}
                    onChange={(e) =>
                      setEditing({ ...editing, tagline: e.target.value })
                    }
                  />
                </label>
                <label>
                  Kategoria
                  <input
                    value={editing.category}
                    onChange={(e) =>
                      setEditing({ ...editing, category: e.target.value })
                    }
                  />
                </label>
                <label>
                  Cena (PLN)
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={editing.price}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: Number(e.target.value) || 0,
                      })
                    }
                  />
                </label>
                <label>
                  Cena przed promocją
                  <input
                    type="number"
                    min={0}
                    step={10}
                    value={editing.compareAtPrice ?? ''}
                    placeholder="np. 790"
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        compareAtPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                        onSale: e.target.value
                          ? Number(e.target.value) > editing.price
                          : editing.onSale,
                      })
                    }
                  />
                </label>
                <label className="span-2">
                  Opis
                  <textarea
                    rows={4}
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                </label>
                <label className="span-2">
                  ID (slug)
                  <input
                    value={editing.id}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        id: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]/g, '-'),
                      })
                    }
                  />
                </label>
              </div>

              <fieldset className="admin-images">
                <legend>Zdjęcia (Instagram)</legend>
                <div className="admin-image-grid">
                  {IMAGE_OPTIONS.map((src) => {
                    const active = editing.images.includes(src)
                    return (
                      <button
                        key={src}
                        type="button"
                        className={`admin-image-pick ${active ? 'is-on' : ''}`}
                        onClick={() => {
                          setEditing((prev) => {
                            if (!prev) return prev
                            const has = prev.images.includes(src)
                            return {
                              ...prev,
                              images: has
                                ? prev.images.filter((i) => i !== src)
                                : [...prev.images, src],
                            }
                          })
                        }}
                      >
                        <img src={src} alt="" />
                      </button>
                    )
                  })}
                </div>
                <label className="admin-custom-url">
                  Lub własny URL zdjęcia
                  <input
                    placeholder="https://… lub /products/…"
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return
                      e.preventDefault()
                      const value = (e.target as HTMLInputElement).value.trim()
                      if (!value) return
                      setEditing({
                        ...editing,
                        images: [...editing.images, value],
                      })
                      ;(e.target as HTMLInputElement).value = ''
                    }}
                  />
                </label>
              </fieldset>

              <fieldset className="admin-specs">
                <legend>Specyfikacja</legend>
                {editing.specs.map((spec, i) => (
                  <div className="admin-spec-row" key={i}>
                    <input
                      placeholder="Etykieta"
                      value={spec.label}
                      onChange={(e) => {
                        const specs = [...editing.specs]
                        specs[i] = { ...specs[i], label: e.target.value }
                        setEditing({ ...editing, specs })
                      }}
                    />
                    <input
                      placeholder="Wartość"
                      value={spec.value}
                      onChange={(e) => {
                        const specs = [...editing.specs]
                        specs[i] = { ...specs[i], value: e.target.value }
                        setEditing({ ...editing, specs })
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          specs: editing.specs.filter((_, j) => j !== i),
                        })
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    setEditing({
                      ...editing,
                      specs: [...editing.specs, { label: '', value: '' }],
                    })
                  }
                >
                  + Pole
                </button>
              </fieldset>

              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={!!editing.featured}
                  onChange={(e) =>
                    setEditing({ ...editing, featured: e.target.checked })
                  }
                />
                Wyróżnij na stronie głównej
              </label>

              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={!!editing.onSale}
                  onChange={(e) =>
                    setEditing({ ...editing, onSale: e.target.checked })
                  }
                />
                Pokaż w zakładce Wyprzedaż
              </label>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setEditing(null)}
                >
                  Anuluj
                </button>
                <button type="submit" className="btn btn-accent">
                  Zapisz ogłoszenie
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
