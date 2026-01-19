"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const heroImages = [
  "/modern-printing-press-industrial.jpg",
  "/modern-printing-press-industrial2.jpg",
  "/branding-signage.jpg",
  "/promotional-printing.jpg",
  "/3d-printing.jpg",
]

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev: number) => (prev + 1) % heroImages.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative bg-dark-section-bg text-dark-section-fg overflow-hidden">
      {/* Background carousel */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
              index === activeIndex ? "opacity-20" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
            Turning Ideas Into <span className="text-primary">Powerful</span>{" "}
            <span className="text-secondary">Visual Brands</span>
          </h1>

          <p className="mt-6 text-xl text-dark-section-fg/80 leading-relaxed">
            Printing • Branding • Signage • Promotional Solutions
          </p>

          <p className="mt-4 text-lg text-dark-section-fg/70 leading-relaxed max-w-2xl">
            We help businesses, hotels, institutions, and events stand out with
            high-quality printing, branding, and signage solutions in Nairobi, Kenya.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
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
          </div>
        </div>
      </div>
    </section>
  )
}
