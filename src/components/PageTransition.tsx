import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import './PageTransition.css'

const content = {
  initial: { opacity: 0, y: 28 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.18 },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.28, ease: [0.4, 0, 1, 1] as const },
  },
}

const wipe = {
  initial: { scaleY: 0 },
  animate: {
    scaleY: 0,
    transition: { duration: 0.01 },
  },
  exit: {
    scaleY: 1,
    transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] as const },
  },
}

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <>
      <motion.div
        className="page-wipe"
        variants={wipe}
        initial="initial"
        animate="animate"
        exit="exit"
        aria-hidden
      />
      <motion.div
        className="page-shell"
        variants={content}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {children}
      </motion.div>
    </>
  )
}
