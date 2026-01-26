"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { sanityClient } from "@/lib/sanity"

const defaultHeroImages = [
  "/modern-printing-press-industrial.jpg",
  "/modern-printing-press-industrial2.jpg",
  "/branding-signage.jpg",
]

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0)
  const [heroImages, setHeroImages] = useState<string[]>(defaultHeroImages)
  const [title, setTitle] = useState<string>(
    "Turning Ideas Into Powerful Visual Brands"
  )
  const [subtitle, setSubtitle] = useState<string>(
    "Printing • Branding • Signage • Promotional Solutions"
  )

  useEffect(() => {
    // rotate index
    const interval = setInterval(() => {
      setActiveIndex((prev: number) => (prev + 1) % heroImages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    // Try to fetch featured service images and a headline from Sanity
    let mounted = true
    ;(async () => {
      try {
        const query = `*[_type == "service" && featured == true][0..4]{title, excerpt, "images": images[].asset->url}`
        const res = await sanityClient.fetch(query)
        if (!mounted || !res || res.length === 0) return

        // Use images from first featured service and map titles
        const imgs: string[] = []
        res.forEach((s: any) => {
          if (s.images && s.images.length) imgs.push(...s.images)
        })
        if (imgs.length) setHeroImages(imgs.slice(0, 5))
        if (res[0].title) setTitle(res[0].title)
        if (res[0].excerpt) setSubtitle(res[0].excerpt)
      } catch (err) {
        // keep defaults on error
        console.warn("Hero fetch failed", err)
      }
    })()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden">
      {/* Background carousel with fade animations */}
      <div className="absolute inset-0">
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
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance"
          >
            {title.split(" ").slice(0, 3).join(" ")} <span className="text-primary">{title.split(" ").slice(3, 4).join(" ")}</span>{" "}
            <span className="text-secondary">{title.split(" ").slice(4).join(" ")}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed"
          >
            {subtitle}
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
        </div>
      </div>
    </section>
  )
}
