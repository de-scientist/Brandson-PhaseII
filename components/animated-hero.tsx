"use client"

import { motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"
import { sanityClient } from "@/lib/sanity"
import { pageHeroQuery } from "@/lib/queries"

type AnimatedHeroProps = {
  pageKey: string
}

type PageHeroDoc = {
  headline?: string
  subheadline?: string
  backgroundImage?: { asset?: { url?: string } }
  animationStyle?: "kinetic" | "parallax" | "fade"
}

export function AnimatedHero({ pageKey }: AnimatedHeroProps) {
  const [data, setData] = useState<PageHeroDoc | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    sanityClient.fetch(pageHeroQuery, { pageKey }).then(setData).catch(() => setData(null))
  }, [pageKey])

  if (!data) return null

  const { headline, subheadline, backgroundImage, animationStyle } = data

  const textMotion =
    animationStyle === "kinetic" && !prefersReducedMotion
      ? {
          initial: { y: "100%", opacity: 0 },
          animate: { y: "0%", opacity: 1 },
        }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
        }

  return (
    <section className="relative overflow-hidden bg-dark-section-bg text-dark-section-fg">
      {backgroundImage?.asset?.url && (
        <Image
          src={backgroundImage.asset.url}
          alt={headline || pageKey}
          fill
          className="object-cover opacity-20"
          priority
        />
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <motion.h1
          initial={textMotion.initial}
          animate={textMotion.animate}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-5xl font-bold tracking-tight"
        >
          {headline}
        </motion.h1>
        {subheadline && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mt-6 text-xl text-dark-section-fg/80 max-w-2xl"
          >
            {subheadline}
          </motion.p>
        )}
      </div>
    </section>
  )
}

