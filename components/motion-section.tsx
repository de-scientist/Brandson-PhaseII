"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ReactNode } from "react"

type MotionSectionProps = {
  children: ReactNode
  delay?: number
}

export function MotionSection({ children, delay = 0 }: MotionSectionProps) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <section>{children}</section>
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay }}
    >
      {children}
    </motion.section>
  )
}

