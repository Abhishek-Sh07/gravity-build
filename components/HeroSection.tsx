'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'

// Last word cycles through these (same length keeps the line width stable)
const ROTATING_WORDS = ['STUDIO', 'AGENCY', 'VISION']

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  // ── Rotating last word ────────────────────────────────────────────────────
  // Slot-machine column: one masked column of words steps upward on a single
  // repeating timeline (a duplicate of the first word at the end makes the
  // wrap seamless). One target, one timeline — survives hot reloads cleanly.
  useEffect(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const col = section.querySelector<HTMLElement>('.hs-rot-col')
    if (!col) return
    const rows = ROTATING_WORDS.length + 1   // + duplicated first word

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ repeat: -1 })
      for (let i = 1; i < rows; i++) {
        tl.to(col, {
          yPercent: -(100 / rows) * i,
          duration: 0.7,
          ease:     'power3.inOut',
        }, i * 2.8 - 0.7)
      }
      tl.set(col, { yPercent: 0 })   // duplicate row 0 → real row 0, invisible jump
    }, section)

    return () => ctx.revert()
  }, [])

  // ── Keep the inline video alive (autoplay can be suspended by the
  //    browser on tab switches or low-power mode) ───────────────────────────
  useEffect(() => {
    const videos = sectionRef.current?.querySelectorAll('video')
    if (!videos || videos.length === 0) return

    const resume = () => {
      if (document.visibilityState !== 'visible') return
      videos.forEach((video) => {
        if (video.paused) video.play().catch(() => {})
      })
    }
    resume()
    document.addEventListener('visibilitychange', resume)
    return () => document.removeEventListener('visibilitychange', resume)
  }, [])

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
    // Overlaps the image-sequence wrapper's last 200vh (net flow height 0).
    // The inner section sticks to the viewport for that whole stretch, so by
    // the time the sequence's end-of-scrub zoom begins the text is already
    // aligned and stationary — the reveal reads as the camera passing through
    // the monitor glass, not a section scrolling up from below.
    <div
      className="relative w-full"
      style={{ height: '200svh', marginTop: '-200svh', zIndex: 1 }}
    >
    <section
      ref={sectionRef}
      className="w-full overflow-hidden"
      style={{
        height: '100svh',
        position: 'sticky',
        top: 0,
        // Background stays transparent — the black body background shows
        // through here and in the sections below.
      }}
    >

      {/* ── Full-bleed inner — blends into the sections around it ────────────
           .hs-stage is driven by ImageSequenceHero during the monitor zoom:
           it fades/scales in so the copy emerges from inside the screen. */}
      <div className="hs-stage absolute inset-0 overflow-hidden" style={{ willChange: 'transform, opacity' }}>

        {/* Blurred video backdrop now lives in the page-level fixed layer
            (HeroVideoBackground) so it stays put while content scrolls over it. */}

        {/* ── Main headline ─────────────────────────────────────────────── */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ padding: '0 clamp(16px, 4vw, 64px)' }}
        >
          <h1
            className="text-center font-extrabold uppercase text-white"
            style={{
              fontSize:      'clamp(40px, 7.8vw, 122px)',
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
                    width:        'clamp(60px, 8.6vw, 137px)',
                    height:       'clamp(39px, 5.7vw, 90px)',
                    borderRadius: '0.085em',
                    overflow:     'hidden',
                    position:     'relative',
                  }}
                >
                  {/* gradient stays visible until the video paints */}
                  <span
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(148deg, #07304a 0%, #0a5a70 42%, #041527 100%)' }}
                  />
                  <video
                    src="/videos/herobox-sm.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    className="absolute inset-0"
                    style={{ borderRadius: 'inherit', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.13)' }}
                  />
                </span>

                {/* Rotating word — masked column, stepped upward by GSAP */}
                <span
                  className="hs-rotator"
                  style={{
                    display:  'inline-block',
                    overflow: 'hidden',
                    height:   '0.91em',
                  }}
                >
                  <span className="hs-rot-col block" style={{ willChange: 'transform' }}>
                    {[...ROTATING_WORDS, ROTATING_WORDS[0]].map((word, i) => (
                      <span key={i} className="block" style={{ height: '0.91em' }}>
                        {word}
                      </span>
                    ))}
                  </span>
                </span>
              </span>
            </span>
          </h1>
        </div>

        {/* ── Scroll indicator ───────────────────────────────────────────── */}
        <div
          className="hs-scroll absolute left-1/2 flex flex-col items-center z-20"
          style={{ bottom: 4, transform: 'translateX(-50%)', gap: 5 }}
        >
          <div className="rounded-full" style={{ width: 5, height: 5, background: 'rgba(255,255,255,0.22)' }} />
          <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)' }} />
        </div>

      </div>

    </section>
    </div>
  )
}
