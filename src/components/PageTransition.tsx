import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const variants = {
  initial: { opacity: 0, y: 28, filter: 'blur(8px)' },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: 'blur(6px)',
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] as const },
  },
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}
