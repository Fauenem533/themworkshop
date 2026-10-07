import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import './CustomCursor.css'

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState('')
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 420, damping: 32, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 420, damping: 32, mass: 0.35 })

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest(
        'a, button, [role="button"], .product-card, .cursor-grow',
      ) as HTMLElement | null
      if (!target) {
        setHovering(false)
        setLabel('')
        return
      }
      setHovering(true)
      setLabel(target.dataset.cursor || '')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      className={`custom-cursor ${hovering ? 'is-hover' : ''} ${label ? 'has-label' : ''}`}
      style={{ x: sx, y: sy }}
      aria-hidden
    >
      <span className="custom-cursor-inner">
        <span className="custom-cursor-ring" />
        {label ? <span className="custom-cursor-label">{label}</span> : null}
      </span>
    </motion.div>
  )
}
