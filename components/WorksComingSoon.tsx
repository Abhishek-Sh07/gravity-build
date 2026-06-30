'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'

/*
  "All works" index page — the full archive isn't built yet, so the /work route
  shows a branded "Coming soon" state. Reuses the .cs-* styles from the project
  detail placeholder.
*/
export default function WorksComingSoon() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.1, defaults: { ease: 'power4.out' } })
      tl.from('.cs-tag', { y: 24, opacity: 0, duration: 0.8 })
        .from('.cs-line', { yPercent: 115, duration: 1.1, stagger: 0.12 }, '-=0.45')
        .from('.cs-sub', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6')
        .from('.cs-back', { y: 16, opacity: 0, duration: 0.7 }, '-=0.55')
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="cs">
      <header className="cs-header">
        <Link href="/" className="cs-logo" aria-label="Gravity Studio — home">
          <img src="/images/brand/gravity-lockup-horizontal-white.svg" alt="Gravity Studio" />
        </Link>
        <Link href="/" className="cs-back-top">← Back home</Link>
      </header>

      <main className="cs-main">
        <span className="cs-tag">All Works</span>

        <h1 className="cs-title">
          <span className="cs-mask"><span className="cs-line">Coming</span></span>
          <span className="cs-mask"><span className="cs-line">Soon.</span></span>
        </h1>

        <p className="cs-sub">
          Our full project archive is on its way. In the meantime, explore the
          featured works on the home page.
        </p>

        <Link href="/#work" className="cs-back">← Back to featured work</Link>
      </main>
    </div>
  )
}
