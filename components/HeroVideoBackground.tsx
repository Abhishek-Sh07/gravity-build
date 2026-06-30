'use client'

import { useEffect, useRef } from 'react'

// Page-level fixed video backdrop. Stays pinned to the viewport while the
// page content scrolls over it. Blurred + darkened so copy stays legible.
export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 0.3

    const resume = () => {
      if (document.visibilityState === 'visible' && video.paused) {
        video.play().catch(() => {})
      }
    }
    resume()
    document.addEventListener('visibilitychange', resume)
    return () => document.removeEventListener('visibilitychange', resume)
  }, [])

  return (
    <div className="hero-bg-fixed" aria-hidden="true">
      <video
        ref={videoRef}
        className="hs-bg-video"
        src="/videos/herov4.mp4"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hs-bg-overlay" />
    </div>
  )
}
