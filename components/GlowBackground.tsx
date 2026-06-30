'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

/*
  Site-wide fixed glow background.
  ─────────────────────────────────
  The three blurred radial blobs (formerly inside HeroSection) now live on a
  viewport-fixed layer at z-index -1, so every section with a transparent
  background shares the same drifting glow instead of each owning a copy.

  Motion = Lissajous idle drift (x = sin t, y = sin 2t) + a lerped scroll
  offset: as the page scrolls the whole field eases upward and sways slightly,
  so the background visibly "breathes" with the scroll without parallaxing
  away from the viewport.
*/

const BLOBS = [
  {
    size: '46vw',
    top:  '44%',
    background: 'radial-gradient(circle, rgba(86,255,222,0.68) 0%, rgba(47,232,195,0.32) 36%, transparent 70%)',
    drift: 0.085,   // px of upward travel per scrolled px (lerped)
  },
  {
    size: '54vw',
    top:  '50%',
    background: 'radial-gradient(circle, rgba(40,120,255,0.52) 0%, rgba(20,70,200,0.24) 40%, transparent 72%)',
    drift: 0.055,
  },
  {
    size: '72vw',
    top:  '48%',
    background: 'radial-gradient(circle, rgba(10,40,130,0.5) 0%, transparent 70%)',
    drift: 0.03,
  },
]

export default function GlowBackground() {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const blobs = gsap.utils.toArray<HTMLElement>('.gb-blob', root)
    const setters = blobs.map(b => ({
      x: gsap.quickSetter(b, 'x', 'px'),
      y: gsap.quickSetter(b, 'y', 'px'),
      s: gsap.quickSetter(b, 'scale'),
    }))

    let sy = window.scrollY   // lerped scroll position

    const tick = (time: number) => {
      const w = window.innerWidth
      const h = window.innerHeight

      // ease toward the real scroll position → smooth scroll response
      sy += (window.scrollY - sy) * 0.06

      setters.forEach((st, i) => {
        const t  = time * (0.32 + i * 0.07)
        const ph = i * 2.1
        const drift = BLOBS[i].drift

        // idle figure-8 drift + scroll-driven rise and gentle sway
        st.x(Math.sin(t + ph) * w * 0.17 + Math.sin(sy * 0.0012 + ph) * w * 0.04)
        st.y(Math.sin(2 * t + ph) * h * 0.13 - sy * drift)
        st.s(1 + Math.sin(t * 1.7 + ph) * 0.1 + Math.sin(sy * 0.0008) * 0.04)
      })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1, background: '#040a14' }}
    >
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left:      '50%',
            top:       b.top,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="gb-blob"
            style={{
              width:        b.size,
              height:       b.size,
              borderRadius: '50%',
              background:   b.background,
              filter:       'blur(64px)',
              mixBlendMode: 'screen',
              willChange:   'transform',
            }}
          />
        </div>
      ))}
    </div>
  )
}
