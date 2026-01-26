"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const defaultHeroImages = [
  "/modern-printing-press-industrial.jpg",
  "/modern-printing-press-industrial2.jpg",
  "/branding-signage.jpg",
]

type Props = {
  images?: string[]
  title?: string
  subtitle?: string
}

export default function HeroSection({ images, title, subtitle }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [paused, setPaused] = useState(false)
  const heroImages = images && images.length ? images : defaultHeroImages
  const heading = title || "Turning Ideas Into Powerful Visual Brands"
  const sub = subtitle || "Printing • Branding • Signage • Promotional Solutions"

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setActiveIndex((prev: number) => (prev + 1) % heroImages.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [heroImages.length, paused])

  function prev() {
    setActiveIndex((p) => (p - 1 + heroImages.length) % heroImages.length)
  }

  function next() {
    setActiveIndex((p) => (p + 1) % heroImages.length)
  }

  return (
    <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden">
      <div className="absolute inset-0" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <AnimatePresence>
          {heroImages.map((image, index) =>
            index === activeIndex ? (
              <motion.div
                key={image + index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9 }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${image})` }}
              />
            ) : null
          )}
        </AnimatePresence>
        {/* controls */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
          <button aria-label="Previous" onClick={prev} className="bg-black/40 text-white p-2 rounded-full">‹</button>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
          <button aria-label="Next" onClick={next} className="bg-black/40 text-white p-2 rounded-full">›</button>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
          >
            {heading}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed"
          >
            {sub}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-lg text-dark-section-fg/70 leading-relaxed max-w-2xl"
          >
            We help businesses, hotels, institutions, and events stand out with
            high-quality printing, branding, and signage solutions in Nairobi, Kenya.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
              <a href="https://wa.me/254701869821" target="_blank" rel="noopener noreferrer">
                Get a Quote
              </a>
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-dark-section-fg/30 text-dark-section-fg hover:bg-dark-section-fg/10 bg-transparent"
              asChild
            >
              <Link href="/services">View Our Services</Link>
            </Button>
          </motion.div>
          {/* indicators */}
          <div className="mt-6 flex items-center gap-2">
            {heroImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setActiveIndex(i)}
                className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-primary' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
