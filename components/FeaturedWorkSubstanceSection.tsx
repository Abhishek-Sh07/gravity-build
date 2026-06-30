'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  Layout math from the original source:
  ─────────────────────────────────────
  contentMaxWidth = 0.6 * canvasWidth         → image width ≈ 60% viewport
  b               = 0.15 * canvasWidth        → outer edge margin ≈ 5% viewport
  x               = !(index % 2)              → even = LEFT, odd = RIGHT
  accent color    = index%2 ? '#D40749' : '#2FE8C3'
  bg number color = '#1A1E2A' at opacity 0.5
  bg number pos   = opposite side from image, above image center
*/

const PROJECTS = [
  {
    num:      '01',
    title:    'Himalayan Java',
    category: 'QR Ordering / UX Design / Cafe Experience',
    desc:     "A complete digital experience for one of Kathmandu's most loved cafes — from table ordering to brand identity.",
    image:    '/images/work/himalayan-java.jpg',
    gradient: 'linear-gradient(148deg, #271400 0%, #4a2a00 55%, #1a0d00 100%)',
    accent:   '#2FE8C3',   // even → teal
    isLeft:   true,
  },
  {
    num:      '02',
    title:    'COCO Fitness',
    category: 'Website Design / Fitness / Motion',
    desc:     'High-energy website and brand system designed to convert visitors and communicate premium fitness culture.',
    image:    '/images/work/coco-fitness.jpg',
    gradient: 'linear-gradient(148deg, #001624 0%, #00304a 55%, #000e18 100%)',
    accent:   '#D40749',   // odd → red
    isLeft:   false,
  },
  {
    num:      '03',
    title:    'Karuwa Studio',
    category: 'Branding / Identity System',
    desc:     'An earthy, artisan identity for a Nepali studio — wordmark, color system, and brand guidelines built from scratch.',
    image:    '/images/work/karuwa-studio.jpg',
    gradient: 'linear-gradient(148deg, #0a1a00 0%, #1e3800 55%, #071100 100%)',
    accent:   '#2FE8C3',
    isLeft:   true,
  },
  {
    num:      '04',
    title:    'Event App',
    category: 'UI/UX Design / Mobile App',
    desc:     'Event discovery and ticketing app — clarity, fast checkout, and a social browsing experience.',
    image:    '/images/work/event-app.jpg',
    gradient: 'linear-gradient(148deg, #1a001a 0%, #380038 55%, #100012 100%)',
    accent:   '#D40749',
    isLeft:   false,
  },
  {
    num:      '05',
    title:    'Rental Dashboard',
    category: 'Product Design / SaaS Dashboard',
    desc:     'A data-rich rental management dashboard balancing density with clarity — built for operators.',
    image:    '/images/work/rental-dashboard.jpg',
    gradient: 'linear-gradient(148deg, #001020 0%, #00203d 55%, #000b18 100%)',
    accent:   '#2FE8C3',
    isLeft:   true,
  },
]

export default function FeaturedWorkSubstanceSection() {
  const sectionRef   = useRef<HTMLElement>(null)
  const rowRefs      = useRef<(HTMLDivElement | null)[]>([])
  const contentRefs  = useRef<(HTMLDivElement | null)[]>([])   // ← whole content group
  const imgWrapRefs  = useRef<(HTMLDivElement | null)[]>([])
  const imgInRefs    = useRef<(HTMLDivElement | null)[]>([])
  const titleRefs    = useRef<(HTMLHeadingElement | null)[]>([])
  const bgNumRefs    = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile  = window.innerWidth < 768

    const ctx = gsap.context(() => {

      // ── Section header ────────────────────────────────────────────────────
      gsap.from('.fw-label', {
        opacity: 0, y: 20, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: '.fw-header', start: 'top 84%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.fw-heading-mask > *', {
        yPercent: 110, duration: 1.3, ease: 'power4.out',
        scrollTrigger: { trigger: '.fw-header', start: 'top 82%', toggleActions: 'play none none reverse' },
      })

      PROJECTS.forEach((_, i) => {
        const row     = rowRefs.current[i]
        const content = contentRefs.current[i]
        const imgWrap = imgWrapRefs.current[i]
        const imgIn   = imgInRefs.current[i]
        const title   = titleRefs.current[i]
        const bgNum   = bgNumRefs.current[i]
        if (!row) return

        // ── Category label ────────────────────────────────────────────────
        gsap.from(row.querySelector('.fw-cat'), {
          opacity: 0, y: 14, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 84%', toggleActions: 'play none none reverse' },
        })

        // ── Title clip reveal ─────────────────────────────────────────────
        if (title) {
          gsap.from(title, {
            yPercent: 112, duration: 1.4, ease: 'power4.out',
            scrollTrigger: { trigger: row, start: 'top 82%', toggleActions: 'play none none reverse' },
          })
        }

        // ── Description fade (opacity only — y belongs to its parallax scrub) ──
        gsap.from(row.querySelector('.fw-desc'), {
          opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 66%', toggleActions: 'play none none reverse' },
        })

        // ── Image entrance: curtain clip-reveal + settle-from-zoom ────────
        // The frame un-clips upward while the image inside eases down from
        // an overscaled state — the classic editorial "window" reveal.
        if (imgWrap) {
          gsap.fromTo(
            imgWrap,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            {
              clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'power4.inOut',
              scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none reverse' },
            }
          )
          gsap.fromTo(
            imgWrap.querySelector('.fw-img-stack'),
            { scale: 1.3 },
            {
              scale: 1, duration: 1.7, ease: 'power3.out',
              scrollTrigger: { trigger: row, start: 'top 80%', toggleActions: 'play none none reverse' },
            }
          )
        }

        if (!reduced) {
          /*
           * ── Parallax depth layers (matches The Substance source) ───────────
           *
           * Reference factor breakdown (from source JS):
           *   Content group  → factor 1.75–2.25  (moves FAST, foreground)
           *   Background num → factor 0.2         (barely moves, background)
           *   Ratio ≈ 8.75 : 1
           *
           * CSS translation:
           *   1. Entire content column scrubs y: +60 → -60
           *      (adds upward momentum → appears in foreground vs bgNum)
           *   2. Image inner scrubs y: +90 → -90 WITHIN its overflow:hidden wrap
           *      (even faster within the container → the image "floats" inside the frame)
           *   3. bgNum scrubs y: -10 → +10  (counteracts natural scroll → appears
           *      nearly static = painted-on-wall background depth)
           *
           * Net speed ratio: content (120px) vs bgNum (20px counteraction) ≈ 7:1 ✓
           */

          // Content column: all content travels together (same group as in reference)
          if (content) {
            gsap.fromTo(
              content,
              { y: 80 },
              {
                y: -80, ease: 'none',
                scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
              }
            )
          }

          // Title: fastest text layer (reference factor ≈ 2.25) — leads the image.
          // Moves in `y` px on top of the entrance reveal's yPercent, so the
          // two tweens compose without fighting over the same property.
          if (title) {
            gsap.fromTo(
              title,
              { y: 70 },
              {
                y: -70, ease: 'none',
                scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
              }
            )
          }

          // Description: its own slower text factor — trails the title
          gsap.fromTo(
            row.querySelector('.fw-desc'),
            { y: 34 },
            {
              y: -34, ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.8 },
            }
          )

          // Image inner: additional layer of depth within the image frame
          if (imgIn) {
            gsap.fromTo(
              imgIn,
              { y: 90, scale: 1.12 },
              {
                y: -90, scale: 1.0, ease: 'none',
                scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
              }
            )
          }

          // Background number: barely moves (factor 0.2 → counteracts scroll → frozen)
          if (!mobile && bgNum) {
            gsap.fromTo(
              bgNum,
              { y: -55 },
              {
                y: 55, ease: 'none',
                scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: 3.0 },
              }
            )
          }
        }

        // ── Active / inactive opacity ─────────────────────────────────────
        ScrollTrigger.create({
          trigger: row,
          start:   'top 72%',
          end:     'bottom 28%',
          onEnter:     () => gsap.to(row, { opacity: 1,    duration: 0.65, ease: 'power2.out' }),
          onLeave:     () => gsap.to(row, { opacity: 0.28, duration: 0.65, ease: 'power2.out' }),
          onEnterBack: () => gsap.to(row, { opacity: 1,    duration: 0.65, ease: 'power2.out' }),
          onLeaveBack: () => gsap.to(row, { opacity: 0.28, duration: 0.65, ease: 'power2.out' }),
        })
      })

      ScrollTrigger.refresh()
    }, sectionRef)

    /*
     * ── Velocity breath ─────────────────────────────────────────────────────
     * The image frame swells very slightly with lerped scroll velocity
     * (max ~5%) and settles back to rest when the scroll stops:
     *   vel   = lerp(vel, scrollDelta, 0.1)
     *   scale = 1 + min(|vel|, 70) * k
     * Uniform scale on the clip frame — no shear, no color artifacts, just
     * a soft "pulse" that makes fast scrolling feel alive.
     */
    let velTick: (() => void) | null = null
    const section = sectionRef.current
    if (!reduced && section) {
      const wraps  = imgWrapRefs.current.filter((el): el is HTMLDivElement => !!el)
      const scales = wraps.map(el => gsap.quickSetter(el, 'scale'))

      let lastY = window.scrollY
      let vel   = 0
      const k = mobile ? 0.0005 : 0.0008

      velTick = () => {
        const y = window.scrollY
        vel   = vel + (y - lastY - vel) * 0.1   // lerp(vel, delta, 0.1)
        lastY = y

        // Skip DOM writes while the section is fully offscreen
        const rect = section.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) return

        const s = 1 + Math.min(Math.abs(vel), 70) * k
        for (let j = 0; j < scales.length; j++) scales[j](s)
      }
      gsap.ticker.add(velTick)
    }

    return () => {
      if (velTick) gsap.ticker.remove(velTick)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="featured-work"
    >

      {/* ── Section header ─────────────────────────────────────────────────── */}
      <div
        className="fw-header"
        style={{ padding: 'clamp(80px,10vw,140px) clamp(32px,5vw,72px) clamp(48px,6vw,72px)' }}
      >
        <span
          className="fw-label"
          style={{
            display:       'block',
            fontFamily:    'var(--font-manrope, sans-serif)',
            fontSize:      11,
            fontWeight:    600,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.25)',
            marginBottom:  24,
          }}
        >
          03 / Featured Work
        </span>
        <div className="fw-heading-mask" style={{ overflow: 'hidden' }}>
          <h2
            style={{
              fontFamily:    'var(--font-manrope, sans-serif)',
              fontSize:      'clamp(28px,4vw,60px)',
              fontWeight:    800,
              letterSpacing: '-0.03em',
              lineHeight:    1.15,
              color:         '#fff',
              margin:        0,
              maxWidth:      '20ch',
            }}
          >
            Selected work shaped with design, motion and detail.
          </h2>
        </div>
      </div>

      {/* ── Project rows ────────────────────────────────────────────────────── */}
      {PROJECTS.map((project, i) => (
        <div
          key={project.num}
          ref={el => { rowRefs.current[i] = el }}
          className={`fw-substance-row${project.isLeft ? ' fw-row-left' : ' fw-row-right'}`}
          style={{ position: 'relative', overflow: 'hidden', opacity: 0.28 }}
        >
          {/*
            ── Background number ───────────────────────────────────────────────
            Source: color "#1A1E2A" opacity 0.5, positioned on OPPOSITE side
            from image, above image center-line.
            For even (isLeft=true): number is to the RIGHT.
            For odd  (isLeft=false): number is to the LEFT.
          */}
          <span
            ref={el => { bgNumRefs.current[i] = el }}
            aria-hidden="true"
            style={{
              position:      'absolute',
              top:           '-0.12em',
              ...(project.isLeft ? { right: '-0.04em' } : { left: '-0.04em' }),
              fontFamily:    'var(--font-manrope, sans-serif)',
              fontSize:      'clamp(140px, 20vw, 320px)',
              fontWeight:    900,
              letterSpacing: '-0.06em',
              lineHeight:    1,
              color:         'rgba(26,30,42,0.5)',
              userSelect:    'none',
              pointerEvents: 'none',
              zIndex:        0,
            }}
          >
            {project.num}
          </span>

          {/*
            ── Content area ────────────────────────────────────────────────────
            Width ≈ 62% of viewport, matching contentMaxWidth (60%) + ~5% left/right padding.
            isLeft  → sits on the LEFT side  (margin-right: auto, padding-left: ~5%)
            !isLeft → sits on the RIGHT side (margin-left: auto,  padding-right: ~5%)
          */}
          <div
            ref={el => { contentRefs.current[i] = el }}
            className="fw-content"
            style={{
              position:   'relative',
              zIndex:     1,
              width:      'clamp(280px, 62%, 900px)',
              marginLeft:  project.isLeft ? 'clamp(24px,5%,80px)' : 'auto',
              marginRight: project.isLeft ? 'auto'                  : 'clamp(24px,5%,80px)',
              display:    'flex',
              flexDirection: 'column',
              willChange: 'transform',
            }}
          >
            {/* ── Top text: category + title ───────────────────────────── */}
            <div
              style={{
                padding:    `clamp(36px,5vh,64px) 0 clamp(12px,1.8vh,22px)`,
                textAlign:  project.isLeft ? 'left' : 'right',
              }}
            >
              {/* Category label — matches reference's small header copy */}
              <span
                className="fw-cat"
                style={{
                  display:       'block',
                  fontFamily:    'var(--font-manrope, sans-serif)',
                  fontSize:      'clamp(11px,0.95vw,13px)',
                  fontWeight:    500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color:         'rgba(255,255,255,0.35)',
                  marginBottom:  'clamp(8px,1.2vh,16px)',
                }}
              >
                {project.category}
              </span>

              {/*
                Title with overflow:hidden wrapper for clip reveal.
                CSS .fw-project-title::after adds scan-line overlay —
                approximates the Three.js horizontal wave / shift shader.
              */}
              <div style={{ overflow: 'hidden', lineHeight: 0.9 }}>
                <h3
                  ref={el => { titleRefs.current[i] = el }}
                  className="fw-project-title"
                  style={{
                    fontFamily:    'var(--font-manrope, sans-serif)',
                    fontSize:      'clamp(48px,7.5vw,112px)',
                    fontWeight:    800,
                    letterSpacing: '-0.04em',
                    lineHeight:    0.9,
                    color:         project.accent,
                    margin:        0,
                    willChange:    'transform',
                  }}
                >
                  {project.title}
                </h3>
              </div>
            </div>

            {/*
              ── Image ─────────────────────────────────────────────────────────
              No horizontal padding — fills the full 62% content width.
              imgWrapRefs: outer overflow:hidden clip window.
              imgInRefs:   inner parallax target (inset: -72px 0, so 144px taller).
            */}
            <div
              ref={el => { imgWrapRefs.current[i] = el }}
              style={{
                overflow:   'hidden',
                aspectRatio: '3/2',
                position:   'relative',
                willChange: 'clip-path',
              }}
            >
              <div
                ref={el => { imgInRefs.current[i] = el }}
                style={{
                  position:   'absolute',
                  inset:      '-72px 0',
                  background: project.gradient,
                  willChange: 'transform',
                }}
              >
                {/* Image stack — entrance settle-zoom + velocity skew target */}
                <div
                  className="fw-img-stack"
                  style={{ position: 'absolute', inset: 0, willChange: 'transform' }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    style={{
                      position:  'absolute',
                      inset:     0,
                      width:     '100%',
                      height:    '100%',
                      objectFit: 'cover',
                      display:   'block',
                    }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                </div>
                {/* Cinematic vignette — matches reference's dark image treatment */}
                <div
                  style={{
                    position:      'absolute',
                    inset:         0,
                    background:    'linear-gradient(to bottom, rgba(12,15,19,0.1) 0%, transparent 30%, transparent 65%, rgba(12,15,19,0.5) 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            </div>

            {/* ── Description — matches reference's bottom paragraph ─────── */}
            <div
              style={{
                padding:   `clamp(16px,2.4vh,28px) 0 clamp(48px,7vh,96px)`,
                textAlign: project.isLeft ? 'left' : 'right',
              }}
            >
              <p
                className="fw-desc"
                style={{
                  fontFamily:  'var(--font-manrope, sans-serif)',
                  fontSize:    'clamp(12px,1.05vw,15px)',
                  lineHeight:  1.8,
                  color:       '#8b8b8b',
                  maxWidth:    '48ch',
                  margin:      project.isLeft ? '0' : '0 0 0 auto',
                }}
              >
                {project.desc}
              </p>
            </div>
          </div>
        </div>
      ))}

    </section>
  )
}
