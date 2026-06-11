'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // ── GSAP entrance animation ──────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 })

      tl.from('.hs-line', {
        yPercent: 112,
        duration: 1.35,
        stagger:  0.13,
        ease:     'power4.out',
      })

      tl.from('.hs-thumb', {
        opacity:  0,
        scale:    0.76,
        rotateZ: -7,
        duration: 0.9,
        ease:     'back.out(1.3)',
      }, '-=0.62')

      tl.from('.hs-meta', {
        opacity:  0,
        y:        20,
        duration: 0.95,
        stagger:  0.07,
        ease:     'power3.out',
      }, '-=0.82')

      tl.from('.hs-scroll', {
        opacity:  0,
        y:        14,
        duration: 0.8,
        ease:     'power3.out',
      }, '-=0.50')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#010508]"
      style={{ height: '100svh' }}
    >

      {/* ── Bordered rounded hero card — plain dark background ─────────────── */}
      <div
        className="absolute overflow-hidden bg-[#010508]"
        style={{
          inset:        14,
          borderRadius: 20,
          border:       '1px solid rgba(255,255,255,0.07)',
        }}
      >

        {/* ── Top meta row ─────────────────────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 flex justify-between items-center z-10"
          style={{ padding: 'clamp(20px, 2.8vw, 40px) clamp(22px, 3.2vw, 48px)' }}
        >
          <span
            className="hs-meta font-sans font-semibold uppercase tracking-[0.26em]
                       text-white/22 leading-none"
            style={{ fontSize: 10.5 }}
          >
            KTM / NP
          </span>
          <div
            className="hs-meta flex items-center gap-2.5 font-sans font-semibold
                       uppercase text-white/16"
            style={{ fontSize: 10.5, letterSpacing: '0.2em' }}
          >
            <span>Branding</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>UI/UX</span>
            <span style={{ opacity: 0.35 }}>·</span>
            <span>Dev</span>
          </div>
        </div>

        {/* ── Main headline ─────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ padding: '0 clamp(16px, 4vw, 64px)' }}
        >
          <h1
            className="text-center font-extrabold uppercase text-white"
            style={{
              fontSize:      'clamp(46px, 9.2vw, 145px)',
              lineHeight:     0.91,
              letterSpacing: '-0.026em',
              userSelect:    'none',
            }}
          >
            <span className="block" style={{ overflow: 'hidden', paddingBottom: '0.06em' }}>
              <span className="hs-line block">WE ARE A</span>
            </span>

            <span className="block" style={{ overflow: 'hidden', paddingBottom: '0.06em' }}>
              <span className="hs-line block">DESIGN &mdash; LED</span>
            </span>

            <span className="block" style={{ overflow: 'hidden', paddingBottom: '0.06em' }}>
              <span className="hs-line flex items-center justify-center" style={{ gap: '0.13em' }}>
                <span>CREATIVE</span>

                <span
                  className="hs-thumb inline-flex flex-shrink-0 align-middle"
                  style={{
                    width:        'clamp(70px, 10.2vw, 162px)',
                    height:       'clamp(45px, 6.7vw, 106px)',
                    borderRadius: '0.085em',
                    overflow:     'hidden',
                    position:     'relative',
                  }}
                >
                  <span
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(148deg, #1c1508 0%, #402c0a 42%, #0e0804 100%)' }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{ borderRadius: 'inherit', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.13)' }}
                  />
                </span>

                <span>STUDIO</span>
              </span>
            </span>
          </h1>
        </div>

        {/* ── Bottom meta ──────────────────────────────────────────────── */}
        <div
          className="absolute bottom-0 left-0 right-0 flex justify-between items-end z-10"
          style={{ padding: 'clamp(20px, 2.8vw, 40px) clamp(22px, 3.2vw, 48px)' }}
        >
          <span
            className="hs-meta font-sans font-semibold uppercase tracking-[0.24em] text-white/20 leading-none"
            style={{ fontSize: 10.5 }}
          >
            Est. 2020
          </span>
          <span
            className="hs-meta font-sans font-semibold uppercase tracking-[0.2em] text-white/14 leading-none text-right"
            style={{ fontSize: 10.5 }}
          >
            Premium Creative Studio
          </span>
        </div>

      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <div
        className="hs-scroll absolute left-1/2 flex flex-col items-center z-20"
        style={{ bottom: 4, transform: 'translateX(-50%)', gap: 5 }}
      >
        <div className="rounded-full" style={{ width: 5, height: 5, background: 'rgba(255,255,255,0.22)' }} />
        <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)' }} />
      </div>

    </section>
  )
}
