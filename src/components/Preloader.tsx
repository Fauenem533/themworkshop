import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import './Preloader.css'

const SESSION_KEY = 'tw-preloader-done'

type Props = {
  onDone?: () => void
}

export function Preloader({ onDone }: Props) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return true
    return !sessionStorage.getItem(SESSION_KEY)
  })
  const [pct, setPct] = useState(0)
  const progress = useMotionValue(0)

  useEffect(() => {
    if (!visible) {
      onDone?.()
      return
    }

    const controls = animate(progress, 100, {
      duration: 1.65,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setPct(Math.round(v)),
      onComplete: () => {
        window.setTimeout(() => {
          sessionStorage.setItem(SESSION_KEY, '1')
          setVisible(false)
          onDone?.()
        }, 280)
      },
    })

    return () => controls.stop()
  }, [visible, progress, onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          className="preloader"
          initial={{ y: '0%' }}
          exit={{
            y: '-105%',
            transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
          }}
          aria-hidden
        >
          <div className="preloader-mask" />

          <p className="preloader-label">Loading</p>

          <motion.div
            className="preloader-mark"
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="preloader-blade" />
            <span className="preloader-brand">TW</span>
          </motion.div>

          <p className="preloader-pct">{pct}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
