'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Mark = 'yes' | 'warn' | 'no'
type Cell = { mark: Mark; text: string }

const ROWS: { label: string; gravity: Cell; others: Cell }[] = [
  {
    label: 'Approach',
    gravity: { mark: 'yes',  text: 'Strategy mapping first' },
    others:  { mark: 'warn', text: 'Tool-first approach' },
  },
  {
    label: 'Workflow',
    gravity: { mark: 'yes',  text: 'Around your operations' },
    others:  { mark: 'no',   text: 'Mostly templated' },
  },
  {
    label: 'Speed',
    gravity: { mark: 'yes',  text: 'Weeks, not months' },
    others:  { mark: 'warn', text: 'Most often delayed' },
  },
  {
    label: 'Optimization',
    gravity: { mark: 'yes',  text: 'Continuous improvement' },
    others:  { mark: 'warn', text: 'Setup & disappear' },
  },
  {
    label: 'Cost Efficiency',
    gravity: { mark: 'yes',  text: 'Fixed project clarity' },
    others:  { mark: 'warn', text: 'Scope creep common' },
  },
]

function MarkIcon({ mark, brand }: { mark: Mark; brand?: boolean }) {
  if (mark === 'yes') {
    return (
      <svg className={`apart-mark ${brand ? 'apart-mark--yes-brand' : 'apart-mark--yes'}`} viewBox="0 0 24 24" fill="none" aria-label="Yes">
        <path d="M5 12.5 10 17.5 19 6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (mark === 'no') {
    return (
      <svg className="apart-mark apart-mark--no" viewBox="0 0 24 24" fill="none" aria-label="No">
        <path d="M6 6 18 18 M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="apart-mark apart-mark--warn" viewBox="0 0 24 24" fill="none" aria-label="Limited">
      <path d="M12 4 21.5 20 2.5 20Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M12 10 12 14.5 M12 17 12 17.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function BrandMark() {
  return (
    <svg className="apart-brand-mark" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2 22 12 12 22 2 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 7 17 12 12 17 7 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

export default function ApartSection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set('.apart-intro', { opacity: 1, y: 0 })
        gsap.set('.apart-card', { yPercent: 0 })
        return
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top',
          end: '+=200%',
          pin: '.apart-pin',
          scrub: true,
        },
      })

      // All reveals finish by ~0.6, then the timeline HOLDS (spacer) so the
      // composed card stays pinned and readable for the rest of the scroll.
      tl.to('.apart-left',  { x: () => -window.innerWidth * 0.46, opacity: 0.12, ease: 'none', duration: 0.5 }, 0)
        .to('.apart-right', { x: () =>  window.innerWidth * 0.46, opacity: 0.12, ease: 'none', duration: 0.5 }, 0)
        // Intro (heading + copy) rises in
        .to('.apart-intro', { opacity: 1, y: 0, duration: 0.34, ease: 'power3.out' }, 0.14)
        // Comparison card slides up from below (stays solid)
        .from('.apart-card', { yPercent: 125, duration: 0.42, ease: 'power3.out' }, 0.18)
        // Hold everything settled for the remainder of the pinned scroll
        .to({}, { duration: 0.4 }, 0.6)
    }, ref)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="apart-section">
      <div className="apart-pin">

        {/* Splitting heading */}
        <h2 className="apart-heading" aria-label="What sets us apart from others">
          <span className="apart-left" aria-hidden="true">
            What sets us <em className="apart-em">apart</em>
          </span>
          <span className="apart-right" aria-hidden="true">From others</span>
        </h2>

        {/* Intro */}
        <div className="apart-intro">
          <p className="apart-sub">Built for Real Business Impact</p>
          <p className="apart-desc">
            Most studios talk about design. We build brand systems that reduce
            manual work, improve clarity, and scale with your operations.
          </p>
        </div>

        {/* Comparison table */}
        <div className="apart-card apart-card--table">
          <div className="apart-tscroll">
            <div className="apart-table">

              {/* Header */}
              <div className="apart-trow apart-trow--head">
                <div className="apart-tcell apart-tcell--label" />
                <div className="apart-tcell apart-tcol-brand apart-tcol-brand--top">
                  <span className="apart-brand"><BrandMark /><span className="apart-brand-name">Gravity</span></span>
                </div>
                <div className="apart-tcell apart-thead">Other Agencies</div>
              </div>

              {/* Rows */}
              {ROWS.map((row, i) => (
                <div key={row.label} className="apart-trow">
                  <div className="apart-tcell apart-tcell--label">{row.label}</div>
                  <div className={`apart-tcell apart-tcol-brand${i === ROWS.length - 1 ? ' apart-tcol-brand--bottom' : ''}`}>
                    <MarkIcon mark={row.gravity.mark} brand /><span>{row.gravity.text}</span>
                  </div>
                  <div className="apart-tcell apart-tcell--muted">
                    <MarkIcon mark={row.others.mark} /><span>{row.others.text}</span>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
