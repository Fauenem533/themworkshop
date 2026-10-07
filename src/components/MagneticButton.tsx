import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useRef, type ReactNode, type MouseEvent } from 'react'

type Props = {
  children: ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  href?: string
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled,
  href,
}: Props) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 280, damping: 18, mass: 0.4 })
  const springY = useSpring(y, { stiffness: 280, damping: 18, mass: 0.4 })

  function onMove(e: MouseEvent) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    x.set(dx * 0.28)
    y.set(dy * 0.28)
  }

  function onLeave() {
    x.set(0)
    y.set(0)
  }

  const shared = {
    className,
    style: { x: springX, y: springY },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileTap: { scale: 0.97 },
  }

  if (href) {
    return (
      <motion.a ref={ref as React.RefObject<HTMLAnchorElement>} href={href} {...shared}>
        {children}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...shared}
    >
      {children}
    </motion.button>
  )
}
