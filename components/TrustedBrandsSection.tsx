'use client'

import { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  "They trust us" — ports the client-list section from fromanother.love:
  brand names sit tangent on a large invisible wheel left of the viewport.
  Scrolling (section is pinned) rotates the wheel, names arc past the
  3 o'clock position; the name closest to it glows while the rest stay dim,
  and the right panel crossfades to that brand's mark.
*/

const SERVICES = [
  {
    name: 'Branding',
    mark: 'BR',
    desc: 'Logo, visual style, colors, typography, and brand guidelines that make your business feel clear and memorable.',
  },
  {
    name: 'UI/UX Design',
    mark: 'UX',
    desc: 'Clean and user-friendly designs for websites, apps, dashboards, and digital products.',
  },
  {
    name: 'Web and Mobile App',
    mark: 'WM',
    desc: 'Modern, responsive websites and mobile apps that are fast, polished, and built to convert visitors into customers.',
  },
  {
    name: 'SEO',
    mark: 'SE',
    desc: 'Website optimization, keyword strategy, on-page SEO, technical SEO, and content planning to help your brand get discovered on Google.',
  },
  {
    name: 'Digital Marketing',
    mark: 'DM',
    desc: 'Social media strategy, ad creatives, content planning, and campaigns that help your brand grow online.',
  },
  {
    name: 'Creative Content',
    mark: 'CC',
    desc: 'Visuals, reels, posters, launch campaigns, and branded content for social media and promotions.',
  },
  {
    name: 'Growth Strategy',
    mark: 'GS',
    desc: 'We plan how your brand, website, content, and marketing work together to drive long-term growth.',
  },
]

const N = SERVICES.length

export default function TrustedBrandsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef   = useRef<HTMLDivElement>(null)
  const wheelRef   = useRef<HTMLDivElement>(null)
  const nameRefs   = useRef<(HTMLSpanElement | null)[]>([])
  const stepRef    = useRef(12)           // deg between names, set from geometry
  const activeRef  = useRef(0)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    const wheel   = wheelRef.current
    if (!section || !wheel) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ── Wheel geometry: center sits left of the viewport, names fan out ────
    const applyGeometry = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const radius = gsap.utils.clamp(420, vw * 0.42, 640)

      const first = nameRefs.current[0]
      const fontSize = first ? parseFloat(getComputedStyle(first).fontSize) : 72
      const arcGap = fontSize * 1.7
      stepRef.current = (arcGap / radius) * (180 / Math.PI)

      // Active name's left edge lands at ~22% of the viewport width
      wheel.style.left = `${vw * (vw < 768 ? 0.1 : 0.22) - radius}px`
      wheel.style.top  = `${vh / 2}px`

      nameRefs.current.forEach((el, i) => {
        if (!el) return
        el.style.transform =
          `rotate(${i * stepRef.current}deg) translateX(${radius}px) translateY(-50%)`
      })
    }

    applyGeometry()

    if (reduced) {
      // No pin/scrub — park the wheel on the middle brand
      const mid = Math.floor(N / 2)
      gsap.set(wheel, { rotation: -mid * stepRef.current })
      activeRef.current = mid
      setActive(mid)
      return
    }

    ScrollTrigger.addEventListener('refreshInit', applyGeometry)

    const ctx = gsap.context(() => {
      // ── Entry: circular reveal grows from the bottom into the full section.
      // Inspired by lukebaffait.fr: the color enters as a giant rising circle,
      // then becomes the section background once the pin begins.
      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { clipPath: 'circle(0vmax at 50% 116%)' },
          {
            clipPath: () => {
              const vw = window.innerWidth
              const vh = window.innerHeight
              const radius = Math.hypot(vw * 0.5, vh * 1.16) / Math.max(vw, vh) * 100 + 8
              return `circle(${radius}vmax at 50% 116%)`
            },
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top 105%',
              end: 'top 8%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        )
      }

      gsap.fromTo(
        wheel,
        { rotation: 0 },
        {
          rotation: () => -(N - 1) * stepRef.current,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=320%',
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: st => {
              const idx = gsap.utils.clamp(0, N - 1, Math.round(st.progress * (N - 1)))
              if (activeRef.current !== idx) {
                activeRef.current = idx
                setActive(idx)
              }
            },
          },
        }
      )
    }, section)

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', applyGeometry)
      ctx.revert()
    }
  }, [])

  const service = SERVICES[active]

  return (
    <section
      ref={sectionRef}
      id="trusted-brands"
      className="relative h-screen overflow-hidden"
    >

      {/* ── Brand-yellow surface — un-clips to full bleed on approach ──────── */}
      <div
        ref={panelRef}
        className="absolute inset-0 overflow-hidden"
        style={{ background: '#FCBC03', clipPath: 'circle(0vmax at 50% 116%)', willChange: 'clip-path' }}
      >

      {/* ── The name wheel ─────────────────────────────────────────────────── */}
      <div
        ref={wheelRef}
        className="absolute"
        style={{ width: 0, height: 0, transformOrigin: '0 0', willChange: 'transform' }}
      >
        {SERVICES.map((b, i) => (
          <span
            key={b.name}
            ref={el => { nameRefs.current[i] = el }}
            className={`tb-name${i === active ? ' tb-name--active' : ''}`}
            style={{
              position:      'absolute',
              left:          0,
              top:           0,
              transformOrigin: '0 0',
              whiteSpace:    'nowrap',
              fontFamily:    'var(--font-manrope, sans-serif)',
              fontSize:      'clamp(32px, 5vw, 72px)',
              fontWeight:    800,
              letterSpacing: '-0.03em',
              lineHeight:    1,
              willChange:    'transform',
              pointerEvents: 'none',
            }}
          >
            {b.name}
          </span>
        ))}
      </div>

      {/* ── Right panel: active brand mark + static blurb ──────────────────── */}
      <div
        className="absolute z-10 flex flex-col gap-8 md:gap-10
                   right-6 bottom-10 left-6
                   md:left-auto md:bottom-auto md:right-[8%] md:top-1/2 md:-translate-y-1/2
                   md:w-[340px]"
      >
        {/* key swap re-runs the fade-up on every active change */}
        <div key={active} className="tb-swap flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <span
              className="flex items-center justify-center flex-shrink-0"
              style={{
                width:        44,
                height:       44,
                border:       '1.5px solid #161204',
                borderRadius: 10,
                color:        '#161204',
                fontFamily:   'var(--font-manrope, sans-serif)',
                fontWeight:   800,
                fontSize:     15,
                letterSpacing: '0.04em',
              }}
            >
              {service.mark}
            </span>
            <span
              style={{
                fontFamily:    'var(--font-manrope, sans-serif)',
                fontWeight:    800,
                fontSize:      19,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color:         '#161204',
              }}
            >
              {service.name}
            </span>
          </div>

          <p
            className="font-sans text-[14px] md:text-[15px] leading-[1.8]"
            style={{ color: 'rgba(22,18,4,0.62)' }}
          >
            {service.desc}
          </p>
        </div>
      </div>

      </div>

    </section>
  )
}
