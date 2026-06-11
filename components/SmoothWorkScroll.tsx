'use client'

import { useRef, useEffect } from 'react'

const PROJECTS = [
  {
    index: '01',
    category: 'UI / UX Design',
    title: 'Himalayan',
    desc: 'A full kiosk experience redesign for Nepal\'s most iconic coffee chain — from order flow to brand identity.',
    bg: 'linear-gradient(148deg, #1c1508 0%, #3a2a0a 40%, #1a1205 100%)',
  },
  {
    index: '02',
    category: 'Web Design',
    title: 'COCO',
    desc: 'A conversion-focused website for a premium fitness brand — bold visuals, smooth transitions, measurable results.',
    bg: 'linear-gradient(135deg, #0a1220 0%, #14223a 50%, #0b1828 100%)',
  },
  {
    index: '03',
    category: 'Branding',
    title: 'Karuwa',
    desc: 'Brand identity system for a Kathmandu-based creative collective — mark, palette, and motion guidelines.',
    bg: 'linear-gradient(160deg, #100c1c 0%, #1c1530 50%, #0e0a18 100%)',
  },
  {
    index: '04',
    category: 'Product Design',
    title: 'Kayo',
    desc: 'Mobile-first event discovery and ticketing app — from wireframes to a polished component library.',
    bg: 'linear-gradient(148deg, #0b180d 0%, #142818 50%, #0a150d 100%)',
  },
]

// ── exact helpers from demo3.js ──────────────────────────────────────────
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b
const mapRange = (x: number, a: number, b: number, c: number, d: number) =>
  ((x - a) * (d - c)) / (b - a) + c

export default function SmoothWorkScroll() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let docScroll = 0
    let rafId: number

    const getScroll = () => { docScroll = window.pageYOffset }
    window.addEventListener('scroll', getScroll, { passive: true })
    getScroll()

    // Per-item state matching the reference Item class
    type ItemState = {
      el: HTMLElement
      imgWrap: HTMLElement
      imgInner: HTMLElement
      // random rotation axis (tiny Y, Z components like reference)
      ry: number
      rz: number
      // target rotation range (clamped lerp targets)
      toRot: number
      fromRot: number
      // lerped previous + current for each property
      rotPrev: number; rotCur: number
      yPrev: number;   yCur: number
      // DOM metrics (updated on resize)
      top: number
      height: number
      isVisible: boolean
      observer: IntersectionObserver
    }

    const states: ItemState[] = []

    const items = sectionRef.current!.querySelectorAll<HTMLElement>('.sws-item')

    items.forEach((item) => {
      const imgWrap  = item.querySelector<HTMLElement>('.sws-img-wrap')
      const imgInner = item.querySelector<HTMLElement>('.sws-img-inner')
      const title    = item.querySelector<HTMLElement>('.sws-title')
      if (!imgWrap || !imgInner) return

      // ── set up exactly as reference does ──────────────────────────────
      item.style.perspective     = '1000px'
      imgWrap.style.transformOrigin = '50% 100%'
      if (title) title.style.transform = 'translate3d(0,0,150px)'

      const ry     = (Math.random() - 0.5) * 1.0   // −0.5 … +0.5
      const rz     = (Math.random() - 0.5) * 1.0
      const toRot  = -(50 + Math.random() * 20)    // −70 … −50  (reference range)
      const fromRot = -toRot                        // +50 … +70

      const rect = item.getBoundingClientRect()
      const top    = docScroll + rect.top
      const height = rect.height

      const state: ItemState = {
        el: item, imgWrap, imgInner,
        ry, rz, toRot, fromRot,
        rotPrev: 0, rotCur: 0,
        yPrev: 0,   yCur: 0,
        top, height,
        isVisible: false,
        observer: null!,
      }

      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { state.isVisible = e.intersectionRatio > 0 })
      })
      obs.observe(item)
      state.observer = obs

      states.push(state)
    })

    // ── compute target values from scroll (mirrors reference setValue fns) ──
    function calcTargets(s: ItemState) {
      const OVERFLOW = 40
      const winH = window.innerHeight
      const pos  = s.top - docScroll   // distance: viewport-top → item-top

      // inner image Y: −overflow → +overflow as item traverses viewport
      const yCur = mapRange(pos, winH, -s.height, -OVERFLOW, OVERFLOW)
      s.yCur = Math.max(-OVERFLOW, Math.min(OVERFLOW, yCur))

      // wrapper rotation: fromRot → toRot across wider range (1.5× viewport)
      const rotCur = mapRange(pos, winH * 1.5, -s.height, s.fromRot, s.toRot)
      s.rotCur = Math.max(s.toRot, Math.min(s.fromRot, rotCur))
    }

    function applyLayout(s: ItemState) {
      s.imgInner.style.transform =
        `translate3d(0,${s.yPrev.toFixed(3)}px,0)`
      s.imgWrap.style.transform =
        `rotate3d(1,${s.ry},${s.rz},${s.rotPrev.toFixed(3)}deg)`
    }

    // init without lerp
    states.forEach(s => {
      calcTargets(s)
      s.rotPrev = s.rotCur
      s.yPrev   = s.yCur
      applyLayout(s)
    })

    // ── rAF render loop (exact reference pattern) ─────────────────────────
    function render() {
      states.forEach(s => {
        if (!s.isVisible) return
        calcTargets(s)
        s.rotPrev = lerp(s.rotPrev, s.rotCur, 0.1)
        s.yPrev   = lerp(s.yPrev,   s.yCur,   0.1)
        applyLayout(s)
      })
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    // ── resize ────────────────────────────────────────────────────────────
    function onResize() {
      states.forEach(s => {
        const rect = s.el.getBoundingClientRect()
        s.top    = docScroll + rect.top
        s.height = rect.height
        calcTargets(s)
        s.rotPrev = s.rotCur
        s.yPrev   = s.yCur
        applyLayout(s)
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', getScroll)
      window.removeEventListener('resize', onResize)
      states.forEach(s => s.observer.disconnect())
    }
  }, [])

  return (
    <section ref={sectionRef} className="sws-section">
      <div className="sws-content">

        {PROJECTS.map((p, i) => {
          const isAlt = i % 2 === 1
          return (
            <div key={p.index} className={`sws-item${isAlt ? ' sws-item--alt' : ''}`}>

              {/* image — spans rows 1-2 in its column */}
              <div className="sws-img-wrap">
                <div className="sws-img-inner" style={{ background: p.bg }} />
              </div>

              {/* description — beside the image, rows 1-2 other column */}
              <p className="sws-desc">
                <span className="sws-cat">{p.index} — {p.category}</span>
                {p.desc}
              </p>

              {/* huge title — row 3, overlaps image bottom via negative margin */}
              <h3 className="sws-title">{p.title}</h3>

            </div>
          )
        })}

      </div>
    </section>
  )
}
