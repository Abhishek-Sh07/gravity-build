'use client'

import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

/*
  Full-screen intro preloader. A 00 → 100 counter and a progress bar fill while
  the page boots (and the hero frames preload), then the whole panel slides up
  to reveal the site. Renders on the server too, so it covers the first paint
  with no flash of content.
*/
export default function Preloader() {
  const [done, setDone] = useState(false)
  const rootRef  = useRef<HTMLDivElement>(null)
  const countRef = useRef<HTMLSpanElement>(null)
  const barRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDone(true)
      return
    }

    document.body.style.overflow = 'hidden'
    const counter = { v: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        setDone(true)
      },
    })

    tl.to(counter, {
      v: 100,
      duration: 1.9,
      ease: 'power2.inOut',
      onUpdate: () => {
        const v = Math.round(counter.v)
        if (countRef.current) countRef.current.textContent = String(v).padStart(2, '0')
        if (barRef.current) barRef.current.style.transform = `scaleX(${counter.v / 100})`
      },
    })
      .to('.pl-brand', { y: -24, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.15')
      .to('.pl-foot', { opacity: 0, duration: 0.4, ease: 'power2.in' }, '<')
      .to(rootRef.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '-=0.05')

    return () => {
      tl.kill()
      document.body.style.overflow = ''
    }
  }, [])

  if (done) return null

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <div className="pl-brand">
        <span className="pl-logo">
          <img src="/images/brand/gravity-mark-white.svg" alt="" className="pl-logo-img" />
        </span>
        <span className="pl-name">Gravity Studio</span>
      </div>

      <div className="pl-foot">
        <div className="pl-bar-track">
          <div ref={barRef} className="pl-bar" />
        </div>
        <span ref={countRef} className="pl-count">00</span>
      </div>
    </div>
  )
}
