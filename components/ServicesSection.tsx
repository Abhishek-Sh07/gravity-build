'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

const SERVICES = [
  {
    num: '01',
    title: 'Brand Identity',
    desc: 'Logos, visual systems, brand guidelines, and social assets.',
    gradient: 'linear-gradient(135deg, #1a0e00 0%, #3d2500 45%, #1a0e00 100%)',
    accent: '#f5c842',
  },
  {
    num: '02',
    title: 'UI/UX Design',
    desc: 'Web apps, mobile apps, wireframes, prototypes, and design systems.',
    gradient: 'linear-gradient(135deg, #00091a 0%, #001035 45%, #00091a 100%)',
    accent: '#42a8f5',
  },
  {
    num: '03',
    title: 'Website Design',
    desc: 'High-converting websites with strong layout, typography, and storytelling.',
    gradient: 'linear-gradient(135deg, #0a0018 0%, #1a0035 45%, #0a0018 100%)',
    accent: '#a855f7',
  },
  {
    num: '04',
    title: 'Development',
    desc: 'Frontend development, responsive builds, CMS, and custom interactions.',
    gradient: 'linear-gradient(135deg, #00100a 0%, #00261a 45%, #00100a 100%)',
    accent: '#bbf6e2',
  },
  {
    num: '05',
    title: 'Motion & Interaction',
    desc: 'Scroll animations, micro-interactions, hover effects, and animated experiences.',
    gradient: 'linear-gradient(135deg, #150010 0%, #300025 45%, #150010 100%)',
    accent: '#f542a8',
  },
]

const IMG_W = 420
const IMG_H = 280

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const floatRef   = useRef<HTMLDivElement>(null)
  const displRef   = useRef<SVGFEDisplacementMapElement>(null)
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([])
  const rowRefs    = useRef<(HTMLDivElement | null)[]>([])

  // Smooth mouse state
  const mouse   = useRef({ x: 0, y: 0 })
  const lerped  = useRef({ x: 0, y: 0 })
  const rafId   = useRef<number>(0)

  const isTouchDevice = useRef(false)

  // ── rAF loop: mouse lerp + velocity → displacement ───────────────────────
  useEffect(() => {
    isTouchDevice.current = window.matchMedia('(hover: none)').matches
    if (isTouchDevice.current) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMove)

    function loop() {
      lerped.current.x = lerp(lerped.current.x, mouse.current.x, 0.1)
      lerped.current.y = lerp(lerped.current.y, mouse.current.y, 0.1)

      if (floatRef.current) {
        floatRef.current.style.transform =
          `translate(${lerped.current.x - IMG_W / 2}px, ${lerped.current.y - IMG_H / 2}px)`
      }

      // Displacement driven by mouse velocity (raw-vs-lerped lag distance)
      const dx = mouse.current.x - lerped.current.x
      const dy = mouse.current.y - lerped.current.y
      const lag = Math.min(Math.hypot(dx, dy), 100)
      if (displRef.current) {
        displRef.current.setAttribute('scale', lag.toFixed(1))
      }

      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId.current)
    }
  }, [])

  // ── Scroll reveals ────────────────────────────────────────────────────────
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from(['.srvs-num', '.srvs-intro'], {
        opacity: 0, y: 28, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.srvs-header',
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      })
      gsap.from('.srvs-heading-inner', {
        y: '105%', duration: 1.2, ease: 'power4.out',
        scrollTrigger: {
          trigger: '.srvs-header',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
      gsap.from('.srvs-row', {
        opacity: 0, y: 55, duration: 1, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.srvs-list',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
      gsap.from('.srvs-divider', {
        scaleX: 0, transformOrigin: 'left center', duration: 1.1, stagger: 0.09, ease: 'power3.out',
        scrollTrigger: {
          trigger: '.srvs-list',
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // ── Hover enter ───────────────────────────────────────────────────────────
  const handleEnter = useCallback((index: number) => {
    if (isTouchDevice.current) return

    // Show floating container
    gsap.set(floatRef.current, { display: 'block' })
    gsap.to(floatRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })

    // Swap visible image (instantly hide others, fade in active)
    imgRefs.current.forEach((el, i) => {
      if (!el) return
      if (i === index) {
        gsap.to(el, { opacity: 1, duration: 0.5, ease: 'quad.out' })
      } else {
        gsap.set(el, { opacity: 0 })
      }
    })

    // Spotlight: dim non-hovered rows
    rowRefs.current.forEach((row, i) => {
      if (row) gsap.to(row, { opacity: i === index ? 1 : 0.2, duration: 0.3, ease: 'power2.out' })
    })

    // Character wave — direction based on lerped-vs-raw mouse Y
    const row = rowRefs.current[index]
    if (row) {
      const chars = row.querySelectorAll<HTMLElement>('.srvs-char')
      const total = chars.length
      // lerped.y < mouse.y means cursor moved downward
      const yDir = lerped.current.y < mouse.current.y ? 30 : -30

      gsap.killTweensOf(chars)
      gsap.fromTo(
        chars,
        { y: 0 },
        {
          y: yDir,
          duration: 0.2,
          stagger: { amount: 0.12, from: 'center', grid: [1, total] },
          repeat: 1,
          yoyo: true,
          ease: 'back.out(1.7)',
          onComplete: () => gsap.set(chars, { clearProps: 'y' }),
        }
      )
    }
  }, [])

  // ── Mouse leaves the section — hide everything ────────────────────────────
  const handleSectionLeave = useCallback(() => {
    if (isTouchDevice.current) return

    gsap.to(floatRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => { if (floatRef.current) floatRef.current.style.display = 'none' },
    })

    rowRefs.current.forEach((row) => {
      if (row) gsap.to(row, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#050508]"
      id="services"
      onMouseLeave={handleSectionLeave}
    >

      {/* ── SVG filter: fractalNoise, exact index2 parameters ─────────────── */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <defs>
          <filter
            id="srvs-distort"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.003"
              numOctaves="5"
              seed="2"
              stitchTiles="noStitch"
              result="noise"
            />
            <feDisplacementMap
              ref={displRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      {/* ── Floating image — fixed, follows cursor smoothly ────────────────── */}
      <div
        ref={floatRef}
        style={{
          position:      'fixed',
          top:           0,
          left:          0,
          width:         IMG_W,
          height:        IMG_H,
          pointerEvents: 'none',
          zIndex:        9999,
          display:       'none',
          opacity:       0,
          willChange:    'transform',
          filter:        'url(#srvs-distort)',
          borderRadius:  16,
          overflow:      'hidden',
        }}
      >
        {SERVICES.map((service, i) => (
          <div
            key={i}
            ref={el => { imgRefs.current[i] = el }}
            style={{
              position:     'absolute',
              inset:        0,
              opacity:      0,
              background:   service.gradient,
              borderRadius: 'inherit',
            }}
          >
            {/* Service label centered for visual texture */}
            <div
              style={{
                position:       'absolute',
                inset:          0,
                display:        'flex',
                flexDirection:  'column',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            10,
              }}
            >
              <span
                style={{
                  color:          service.accent,
                  fontSize:       10,
                  fontWeight:     700,
                  letterSpacing:  '0.3em',
                  textTransform:  'uppercase',
                  opacity:        0.55,
                }}
              >
                {service.num}
              </span>
              <span
                style={{
                  color:          'rgba(255,255,255,0.1)',
                  fontSize:       28,
                  fontWeight:     800,
                  letterSpacing:  '-0.04em',
                  textAlign:      'center',
                  padding:        '0 24px',
                  lineHeight:     1.1,
                }}
              >
                {service.title}
              </span>
              <div
                style={{
                  width:      40,
                  height:     1,
                  background: service.accent,
                  opacity:    0.25,
                  marginTop:  4,
                }}
              />
            </div>
            {/* Inset ring */}
            <div
              style={{
                position:    'absolute',
                inset:       0,
                borderRadius: 'inherit',
                boxShadow:   'inset 0 0 0 1px rgba(255,255,255,0.07)',
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div
        className="srvs-header flex flex-col md:flex-row md:items-end justify-between gap-8
                   px-8 md:px-16 lg:px-24 pt-24 md:pt-32 pb-12 md:pb-16"
      >
        <div>
          <span
            className="srvs-num block font-sans text-[11px] font-semibold tracking-[0.28em]
                       uppercase text-white/25 mb-6 select-none"
          >
            02
          </span>
          <div className="overflow-hidden leading-none">
            <h2
              className="srvs-heading-inner block font-sans font-bold leading-none tracking-[-0.05em]
                         text-white"
              style={{ fontSize: 'clamp(68px, 10.5vw, 148px)' }}
            >
              Services
            </h2>
          </div>
        </div>

        <p
          className="srvs-intro font-sans text-white/45 text-[15px] leading-[1.75]
                     max-w-[320px] md:mb-3 flex-shrink-0"
        >
          We design brands, interfaces, and websites that feel clear, sharp, and memorable.
        </p>
      </div>

      {/* ── Service list rows ──────────────────────────────────────────────── */}
      <div className="srvs-list px-8 md:px-16 lg:px-24 pb-24 md:pb-32">
        {SERVICES.map((service, i) => (
          <div
            key={service.num}
            ref={el => { rowRefs.current[i] = el }}
            className="srvs-row relative cursor-pointer"
            onMouseEnter={() => handleEnter(i)}
          >
            <div className="srvs-divider h-px bg-white/10 origin-left" />

            <div className="flex items-center justify-between py-8 md:py-10 lg:py-12">

              {/* Left: title (char-split) + description */}
              <div className="flex flex-col gap-3 md:gap-4">
                <h3
                  className="font-sans font-bold tracking-[-0.04em] leading-none text-white"
                  style={{ fontSize: 'clamp(30px, 4.5vw, 72px)' }}
                >
                  {service.title.split('').map((char, ci) =>
                    char === ' ' ? (
                      <span key={ci} style={{ display: 'inline-block', width: '0.28em' }}> </span>
                    ) : (
                      <span key={ci} className="srvs-char" style={{ display: 'inline-block' }}>
                        {char}
                      </span>
                    )
                  )}
                </h3>
                <p
                  className="font-sans text-white/38 text-[13px] md:text-[15px]
                             leading-[1.65] max-w-[400px]"
                >
                  {service.desc}
                </p>
              </div>

              {/* Right: number */}
              <span
                className="font-sans font-semibold text-[11px] tracking-[0.24em]
                           uppercase text-white/18 ml-auto pl-8 flex-shrink-0 select-none"
              >
                {service.num}
              </span>
            </div>
          </div>
        ))}

        {/* Final bottom divider */}
        <div className="srvs-divider h-px bg-white/10 origin-left" />
      </div>

    </section>
  )
}
