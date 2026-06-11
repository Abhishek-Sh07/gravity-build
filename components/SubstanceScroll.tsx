'use client'

import { useRef, useEffect } from 'react'

// Mirrors Block factor > 1 lerp from the reference
const lerp = (a: number, b: number, n: number) => (1 - n) * a + n * b

// left items  : image 5vw→65vw,  header/desc at 5vw,  number at right
// right items : image 35vw→95vw, header/desc at right, number at left
const ITEMS = [
  {
    num: '01',
    header: 'Himalayan Java',
    text: "A full kiosk experience redesign for Nepal's most iconic coffee chain — from order flow to brand identity.",
    // stripe pattern so parallax movement is clearly visible
    bg: 'repeating-linear-gradient(180deg, #221a06 0px, #3a2a0a 120px, #1a1205 240px, #2e2008 360px)',
    left: true,
  },
  {
    num: '02',
    header: 'COCO Fitness',
    text: 'A conversion-focused website for a premium fitness brand — bold visuals, smooth transitions, measurable results.',
    bg: 'repeating-linear-gradient(180deg, #060e1a 0px, #0e1e30 120px, #060c18 240px, #122038 360px)',
    left: false,
  },
  {
    num: '03',
    header: 'Karuwa Studio',
    text: 'Brand identity system for a Kathmandu-based creative collective — mark, palette, and motion guidelines.',
    bg: 'repeating-linear-gradient(180deg, #0c0818 0px, #1a1230 120px, #08060e 240px, #160e28 360px)',
    left: true,
  },
  {
    num: '04',
    header: 'Kayo App',
    text: 'Mobile-first event discovery and ticketing app — from wireframes to a polished component library.',
    bg: 'repeating-linear-gradient(180deg, #07100a 0px, #122018 120px, #060c08 240px, #0e1a10 360px)',
    left: false,
  },
]

export default function SubstanceScroll() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let docScroll = 0
    let rafId: number

    const getScroll = () => { docScroll = window.scrollY }
    window.addEventListener('scroll', getScroll, { passive: true })
    getScroll()

    type State = {
      item: HTMLElement
      imgInner: HTMLElement
      num: HTMLElement | null
      // lerped values
      imgYPrev: number; imgYCur: number
      numYPrev: number; numYCur: number
      isVisible: boolean
      observer: IntersectionObserver
    }

    const states: State[] = []

    sectionRef.current!.querySelectorAll<HTMLElement>('.sub-item').forEach((item) => {
      const imgInner = item.querySelector<HTMLElement>('.sub-img-inner')
      const num      = item.querySelector<HTMLElement>('.sub-num')
      if (!imgInner) return

      const state: State = {
        item, imgInner, num,
        imgYPrev: 0, imgYCur: 0,
        numYPrev: 0, numYCur: 0,
        isVisible: false,
        observer: null!,
      }

      const obs = new IntersectionObserver(
        (entries) => entries.forEach(e => { state.isVisible = e.intersectionRatio > 0 }),
      )
      obs.observe(item)
      state.observer = obs
      states.push(state)
    })

    // Mirrors Block setValue: maps item position through viewport to a travel range
    function calcTargets(s: State) {
      const rect   = s.item.getBoundingClientRect()
      const winH   = window.innerHeight
      const pos    = rect.top   // distance from viewport top to item top

      // Image: travels -200px across the full viewport crossing (factor ≈ 1.75 equivalent)
      // pos = winH  → item bottom of viewport  → imgY =  0
      // pos = -rect.height → item above viewport → imgY = -200
      const TRAVEL = 200
      const imgY = lerp(0, -TRAVEL,
        Math.max(0, Math.min(1, (winH - pos) / (winH + rect.height)))
      )
      s.imgYCur = imgY

      // Number: barely moves (factor 0.2) — opposite direction
      s.numYCur = -imgY * 0.18
    }

    function applyLayout(s: State) {
      s.imgInner.style.transform = `translateY(${s.imgYPrev.toFixed(2)}px)`
      if (s.num) s.num.style.transform = `translateY(${s.numYPrev.toFixed(2)}px)`
    }

    // Initialise without lerp lag
    states.forEach(s => {
      calcTargets(s)
      s.imgYPrev = s.imgYCur
      s.numYPrev = s.numYCur
      applyLayout(s)
    })

    // rAF loop with lerp 0.06 — slightly slower ease than SmoothWorkScroll for heavier feel
    function render() {
      states.forEach(s => {
        if (!s.isVisible) return
        calcTargets(s)
        s.imgYPrev = lerp(s.imgYPrev, s.imgYCur, 0.06)
        s.numYPrev = lerp(s.numYPrev, s.numYCur, 0.06)
        applyLayout(s)
      })
      rafId = requestAnimationFrame(render)
    }
    rafId = requestAnimationFrame(render)

    function onResize() {
      states.forEach(s => {
        calcTargets(s)
        s.imgYPrev = s.imgYCur
        s.numYPrev = s.numYCur
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
    <section ref={sectionRef} className="sub-section">
      {ITEMS.map((item) => (
        <div key={item.num} className={`sub-item${item.left ? '' : ' sub-item--right'}`}>

          {/* Number — barely visible, opposite side from image */}
          <span className="sub-num" aria-hidden="true">{item.num}</span>

          {/* Header — above image */}
          <h3 className="sub-header">{item.header}</h3>

          {/* Image — 60vw wide, vertically centered, inner slides on scroll */}
          <div className="sub-img-wrap">
            <div className="sub-img-inner" style={{ background: item.bg }} />
          </div>

          {/* Description — below image */}
          <p className="sub-desc">{item.text}</p>

        </div>
      ))}
    </section>
  )
}
