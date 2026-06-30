'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'

gsap.registerPlugin(ScrollTrigger, Flip)

/*
  WORK V2 — on-scroll liquid mask reveal  (technique per Codrops "On-Scroll Filter")
  ───────────────────────────────────────────────────────────────────────────────
  Each project image is painted inside an inline <svg> and revealed through an
  SVG <mask> whose <circle> radius grows from 0 → rFinal as you scroll. The mask
  circle carries a feTurbulence + feDisplacementMap filter, so the growing edge
  is liquid / organic, not a clean circle. Simultaneously the <image> scales to
  1.2 and brightens 100% → 150%. The split title starts large and centred, then
  GSAP Flip flies the two halves apart into the straddling layout. Everything is
  scrubbed to scroll position over ~40% of the viewport via ScrollTrigger, on top
  of the existing Lenis smooth-scroll.
*/

type Project = {
  up: string
  down: string
  slug: string
  text: string
  category: string
  image: string
  layout: 1 | 2 | 3 | 4 | 5 | 6
  w: number
  h: number
  rFinal: number
  bf: string      // feTurbulence baseFrequency
  scale: number   // feDisplacementMap scale
  oct: number     // numOctaves
  align?: string  // preserveAspectRatio alignment (default xMidYMid)
}

// Two alternating presets:
//   L2 — wide horizontal image (62vw)      ·  viewBox 1000×450
//   LV — vertical / portrait, centred stack ·  viewBox 900×1180
const L2 = { layout: 2 as const, w: 1000, h: 450, rFinal: 760, bf: '0.02', scale: 55, oct: 1 }
const LV = { layout: 5 as const, w: 900, h: 1180, rFinal: 760, bf: '0.015', scale: 46, oct: 2 }

const PROJECTS: Project[] = [
  {
    up: 'Himalayan', down: 'Java Kiosk',
    slug: 'himalayan-java',
    category: 'QR Ordering / UX Design',
    text: 'A mobile-first ordering experience for a Himalayan coffee house — built around clarity, warmth and speed.',
    image: '/images/work/java%20kiosk.png',
    ...L2,
  },
  {
    up: 'COCO', down: 'Fitness',
    slug: 'coco-fitness',
    category: 'Website Design / Motion',
    text: 'A high-energy fitness brand and site, engineered for momentum and conversion.',
    image: '/images/work/coco.jpg',
    ...LV,
  },
  {
    up: 'Kayo', down: 'Events',
    slug: 'kayo-event-management',
    category: 'Event Management / App Design',
    text: 'An end-to-end event management app — from planning to live check-in, built for calm and control.',
    image: '/images/work/kayo.jpg',
    ...L2,
    align: 'xMidYMin',
  },
]

// Shared across all items: the "explore-active" flag on <html> must reflect
// whether ANY image is hovered. Each item toggles on its own move, so a plain
// class toggle would let non-hovered items stomp it — count instead.
let exploreCount = 0
function setExploreActive(on: boolean) {
  exploreCount = Math.max(0, exploreCount + (on ? 1 : -1))
  document.documentElement.classList.toggle('explore-active', exploreCount > 0)
}

function Item({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const exploreRef = useRef<HTMLDivElement>(null)

  // ── Cuberto-style "Explore" badge that follows the cursor over the image ──
  useEffect(() => {
    const el = ref.current!
    const fig = el.querySelector<SVGElement>('.wv2-fig')!
    const badge = exploreRef.current!

    if (window.matchMedia('(pointer: coarse)').matches) return

    // Drive the follow through GSAP's quickTo so it rides the same ticker as
    // Lenis/ScrollTrigger — one batched RAF, no competing loops = smooth.
    // GSAP owns x/y AND scale/opacity so nothing fights over `transform`.
    gsap.set(badge, { xPercent: -50, yPercent: -50, scale: 0.4, opacity: 0 })
    const xTo = gsap.quickTo(badge, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(badge, 'y', { duration: 0.4, ease: 'power3' })

    let lastX = -1, lastY = -1
    let active = false
    let primed = false
    let rect = fig.getBoundingClientRect() // cached; only refreshed on scroll/resize

    // Geometry-based hover test against the image box — limits the hot-zone to
    // the image (the overlapping title/text would otherwise flicker enter/leave).
    const setActive = (on: boolean) => {
      if (on === active) return
      active = on
      gsap.to(badge, {
        scale: on ? 1 : 0.4,
        opacity: on ? 1 : 0,
        duration: on ? 0.4 : 0.3,
        ease: on ? 'back.out(1.7)' : 'power2.in',
        overwrite: 'auto',
      })
      setExploreActive(on)
    }
    const test = () => {
      if (lastX < 0) return
      setActive(
        lastX >= rect.left && lastX <= rect.right &&
        lastY >= rect.top && lastY <= rect.bottom,
      )
    }

    const onMove = (e: PointerEvent) => {
      lastX = e.clientX
      lastY = e.clientY
      if (!primed) { gsap.set(badge, { x: lastX, y: lastY }); primed = true } // no fly-in
      xTo(lastX)
      yTo(lastY)
      test()
    }
    // The image scrolls under a stationary cursor → refresh bounds & re-test.
    const onScroll = () => { rect = fig.getBoundingClientRect(); test() }
    const onResize = () => { rect = fig.getBoundingClientRect(); test() }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf(badge)
      if (active) setExploreActive(false) // keep the shared counter balanced
    }
  }, [])

  useEffect(() => {
    const el        = ref.current!
    const titleWrap = el.querySelector<HTMLElement>('.wv2-title-wrap')!
    const titleUp   = el.querySelector<HTMLElement>('.wv2-title-up')!
    const titleDown = el.querySelector<HTMLElement>('.wv2-title-down')!
    const layout    = el.querySelectorAll<HTMLElement>('.wv2-content')[1]
    const mask      = el.querySelector<SVGCircleElement>('.wv2-mask')!
    const image     = el.querySelector<SVGImageElement>('.wv2-image')!

    // The titles get relocated out of .wv2-title-wrap; remember their home so
    // React can unmount cleanly on teardown.
    const origParent = titleUp.parentNode!
    const restore = () => {
      origParent.appendChild(titleUp)
      origParent.appendChild(titleDown)
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      mask.setAttribute('r', String(p.rFinal))
      layout.prepend(titleUp, titleDown)
      return restore
    }

    // 1) record the large, centred (start) state of the two title halves
    const state = Flip.getState([titleUp, titleDown])
    // 2) move them into the layout → their straddling (end) positions
    layout.prepend(titleUp, titleDown)

    // 3) one scrubbed timeline: title Flip (centre → straddle) + mask grow +
    //    image scale/brightness — the Codrops "On-Scroll Filter" text effect.
    const flip = Flip.from(state, { ease: 'none', simple: true })
      .fromTo(mask,
        { attr: { r: 0 } },
        { ease: 'none', attr: { r: p.rFinal } }, 0)
      .fromTo(image,
        { transformOrigin: '50% 50%', filter: 'brightness(70%)' },
        { ease: 'none', scale: 1.2, filter: 'brightness(80%)' }, 0)

    const st = ScrollTrigger.create({
      trigger: titleWrap,
      start: 'top 75%',
      end: '+=55%',
      scrub: 0.6,
      animation: flip,
    })

    return () => {
      st.kill()
      flip.kill()
      restore()
    }
  }, [])

  const filterId = `wv2-disp-${index}`
  const maskId   = `wv2-mask-${index}`

  return (
    <Link href={`/projects/${p.slug}`} ref={ref} className="wv2-wrap">
      {/* before-state: title large & centred */}
      <div className="wv2-content wv2-content--title">
        <div className="wv2-title-wrap">
          <span className="wv2-title wv2-title-up">{p.up}</span>
          <span className="wv2-title wv2-title-down">{p.down}</span>
        </div>
      </div>

      {/* after-state: editorial layout the titles flip into */}
      <div className={`wv2-content wv2-layout-${p.layout}`}>
        <svg
          className={`wv2-fig wv2-fig-${p.layout}`}
          viewBox={`0 0 ${p.w} ${p.h}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
              <feTurbulence type="fractalNoise" baseFrequency={p.bf} numOctaves={p.oct} seed={index * 9 + 3} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={p.scale} xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <mask id={maskId}>
              <circle className="wv2-mask" cx="50%" cy="50%" r="0" fill="white" style={{ filter: `url(#${filterId})` }} />
            </mask>
          </defs>
          <image
            className="wv2-image"
            href={p.image}
            width={p.w}
            height={p.h}
            preserveAspectRatio={`${p.align ?? 'xMidYMid'} slice`}
            mask={`url(#${maskId})`}
          />
        </svg>

        <div ref={exploreRef} className="wv2-explore" aria-hidden="true">
          Explore
        </div>

        <p className="wv2-text">
          <span className="wv2-cat">{p.category}</span>
          {p.text}
        </p>
      </div>
    </Link>
  )
}

export default function WorkV2Section() {
  const introRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = introRef.current!
    const label = el.querySelector<HTMLElement>('.wv2-label')!

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.set(label, { y: 48, opacity: 0, letterSpacing: '0.5em' })

      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 20%',
          // onEnter / onLeave / onEnterBack / onLeaveBack:
          // replay on every entry, reset to hidden on every exit
          toggleActions: 'restart reset restart reset',
        },
      })

      tl.to(label, {
        y: 0,
        opacity: 1,
        letterSpacing: '0.28em',
        duration: 0.9,
        ease: 'power3.out',
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section className="wv2-section">
      <div className="wv2-intro" ref={introRef}>
        <span className="wv2-label">Featured Works</span>
      </div>

      {PROJECTS.map((p, i) => (
        <Item key={p.up} p={p} index={i} />
      ))}

      <div className="wv2-allcta-wrap">
        <Link href="/work" className="gb-button gb-magnetic" data-cursor="button">
          <span className="gb-button__border" aria-hidden="true" />
          <span className="gb-button__ripple" aria-hidden="true"><span /></span>
          <span className="gb-button__title">
            <span data-text="View all works">View all works</span>
          </span>
        </Link>
      </div>
    </section>
  )
}
