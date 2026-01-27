"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

type YoutubeEmbedProps = {
  youtubeId: string
  title: string
}

export function YoutubeEmbed({ youtubeId, title }: YoutubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    return () => {
      if (!iframeRef.current) return
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo" }),
        "*",
      )
    }
  }, [])

  const url = `https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&rel=0`

  const Wrapper: any = prefersReducedMotion ? "div" : motion.div

  return (
    <Wrapper
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video"
    >
      <iframe
        ref={iframeRef}
        className="w-full h-full"
        src={url}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </Wrapper>
  )
}

