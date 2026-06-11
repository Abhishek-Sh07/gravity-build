'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SelectedWorkFormation() {
  const wrapperRef = useRef<HTMLElement>(null)
  const pinRef     = useRef<HTMLDivElement>(null)
  const gridRef    = useRef<HTMLDivElement>(null)

  // surrounding cells (main cell stays in place)
  const tlRef = useRef<HTMLDivElement>(null)
  const tcRef = useRef<HTMLDivElement>(null)
  const trRef = useRef<HTMLDivElement>(null)
  const mlRef = useRef<HTMLDivElement>(null)
  const mrRef = useRef<HTMLDivElement>(null)
  const blRef = useRef<HTMLDivElement>(null)
  const bcRef = useRef<HTMLDivElement>(null)
  const brRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const row1  = [tlRef.current, tcRef.current, trRef.current]
      const row3  = [blRef.current, bcRef.current, brRef.current]
      const left  = mlRef.current
      const right = mrRef.current
      const grid  = gridRef.current

      // ── Initial state ─────────────────────────────────────────────────────
      // Grid: slightly zoomed out (matches DevTools scale ~0.9 at mid-animation)
      gsap.set(grid,  { scale: 0.82, skewY: 0 })
      // Surrounding cells: pushed outside viewport in their entry direction
      gsap.set(row1,  { yPercent: -115 })
      gsap.set(row3,  { yPercent:  115 })
      gsap.set(left,  { xPercent: -115 })
      gsap.set(right, { xPercent:  115 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:    wrapperRef.current,
          start:      'top top',
          end:        'bottom bottom',
          pin:        pinRef.current,
          pinSpacing: false,
          scrub:      1.2,  // slight lag = cinematic weight
        },
        defaults: { ease: 'none' },
      })

      // 0.00 – 0.70 : grid scales up from 0.82 → 1.0
      tl.to(grid, { scale: 1, duration: 0.7 }, 0)

      // Skew warp bell-curve on the grid (matches the skew seen in DevTools):
      // rises to peak ~2.2° at ≈35% then settles back to 0 by ≈75%
      tl.to(grid, { skewY:  2.2, duration: 0.35 }, 0.05)
      tl.to(grid, { skewY: -0.3, duration: 0.25 }, 0.40)
      tl.to(grid, { skewY:  0,   duration: 0.15 }, 0.65)

      // 0.00 – 0.65 : surrounding cells slide into final grid positions
      tl.to(row1,  { yPercent: 0, duration: 0.65 }, 0)
      tl.to(row3,  { yPercent: 0, duration: 0.65 }, 0)
      tl.to(left,  { xPercent: 0, duration: 0.65 }, 0)
      tl.to(right, { xPercent: 0, duration: 0.65 }, 0)

      // 0.70 – 1.00 : spotlight — outer panels dim, grid holds
      tl.to(
        [...row1, ...row3, left, right],
        { opacity: 0.22, duration: 0.3 },
        0.70
      )
    }, wrapperRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapperRef} className="work-formation">
      <div ref={pinRef} className="work-pin">
        <div ref={gridRef} className="wg-grid">

          {/* ── Row 1 ── */}
          <div ref={tlRef} className="wg-cell"><div className="wg-img wg-img-tl" /></div>
          <div ref={tcRef} className="wg-cell">
            <div className="wg-img wg-img-tc" />
            <div className="wg-caption">
              <span>02 / Web Design</span>
              <p>COCO Fitness</p>
            </div>
          </div>
          <div ref={trRef} className="wg-cell"><div className="wg-img wg-img-tr" /></div>

          {/* ── Row 2 — left side ── */}
          <div ref={mlRef} className="wg-cell">
            <div className="wg-img wg-img-ml" />
            <div className="wg-caption">
              <span>03 / Branding</span>
              <p>Karuwa Studio</p>
            </div>
          </div>

          {/* ── Row 2 — MAIN (not ref'd — always in place) ── */}
          <div className="wg-cell wg-main">
            <div className="wg-img wg-img-main" />
            <div className="wg-main-overlay">
              <span className="wg-eyebrow">Selected Work</span>
              <div className="wg-main-copy">
                <p className="wg-main-tag">01 / UI · UX Design</p>
                <h3>Himalayan<br />Java Kiosk</h3>
              </div>
            </div>
          </div>

          {/* ── Row 2 — right side ── */}
          <div ref={mrRef} className="wg-cell">
            <div className="wg-img wg-img-mr" />
            <div className="wg-caption">
              <span>04 / Product Design</span>
              <p>Kayo Event App</p>
            </div>
          </div>

          {/* ── Row 3 ── */}
          <div ref={blRef} className="wg-cell"><div className="wg-img wg-img-bl" /></div>
          <div ref={bcRef} className="wg-cell"><div className="wg-img wg-img-bc" /></div>
          <div ref={brRef} className="wg-cell"><div className="wg-img wg-img-br" /></div>

        </div>
      </div>
    </section>
  )
}
