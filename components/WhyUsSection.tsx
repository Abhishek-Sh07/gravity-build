'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Mark = 'yes' | 'warn' | 'no'
type Cell = { mark: Mark; text: string }

const ROWS: { label: string; gravity: Cell; others: Cell; inhouse: Cell }[] = [
  {
    label: 'Approach',
    gravity: { mark: 'yes',  text: 'Strategy mapping first' },
    others:  { mark: 'warn', text: 'Tool-first approach' },
    inhouse: { mark: 'warn', text: 'Depends on hire' },
  },
  {
    label: 'Workflow',
    gravity: { mark: 'yes',  text: 'Around your operations' },
    others:  { mark: 'no',   text: 'Mostly templated' },
    inhouse: { mark: 'yes',  text: 'If expertise exists' },
  },
  {
    label: 'Speed',
    gravity: { mark: 'yes',  text: 'Weeks, not months' },
    others:  { mark: 'warn', text: 'Most often delayed' },
    inhouse: { mark: 'no',   text: 'Hiring & onboarding' },
  },
  {
    label: 'Optimization',
    gravity: { mark: 'yes',  text: 'Continuous improvement' },
    others:  { mark: 'warn', text: 'Setup & disappear' },
    inhouse: { mark: 'warn', text: 'Limited by bandwidth' },
  },
  {
    label: 'Cost Efficiency',
    gravity: { mark: 'yes',  text: 'Fixed project clarity' },
    others:  { mark: 'warn', text: 'Scope creep common' },
    inhouse: { mark: 'no',   text: 'Salary + overhead' },
  },
]

// ── Gravity hexagon "G" mark — matches the angular hero logo ────────────────
function GravityMark() {
  return (
    <svg className="why-logo-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M20 2.5 35.6 11.25 35.6 28.75 20 37.5 4.4 28.75 4.4 11.25Z"
        stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"
      />
      <path
        d="M26.6 15 A8.6 8.6 0 1 0 27 25.6 L27 20.2 L20.4 20.2"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function MarkIcon({ mark }: { mark: Mark }) {
  if (mark === 'yes') {
    return (
      <svg className="why-icon why-icon--yes" viewBox="0 0 20 20" fill="none" aria-label="Yes">
        <path d="M4.5 10.5 8.5 14.5 15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  if (mark === 'no') {
    return (
      <svg className="why-icon why-icon--no" viewBox="0 0 20 20" fill="none" aria-label="No">
        <path d="M5.5 5.5 14.5 14.5 M14.5 5.5 5.5 14.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg className="why-icon why-icon--warn" viewBox="0 0 20 20" fill="none" aria-label="Limited">
      <path d="M10 3.5 17.5 16.5 2.5 16.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10 8.2 10 11.8 M10 14.1 10 14.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.why-head > *', {
        opacity: 0, y: 32, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.why-head', start: 'top 80%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.why-row', {
        opacity: 0, y: 26, duration: 0.7, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: '.why-table', start: 'top 78%', toggleActions: 'play none none reverse' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="why-section">
      <div className="why-container">

        <div className="why-head">
          <span className="why-badge">Why Us</span>
          <h2 className="why-heading">Built for Real Business<br />Impact</h2>
          <p className="why-sub">
            Most studios talk about design. We build brand systems that reduce
            manual work, improve clarity, and scale with your operations.
          </p>
        </div>

        <div className="why-table-scroll">
          <div className="why-table">

            {/* Header row */}
            <div className="why-row why-row--head">
              <div className="why-cell why-cell--label" />
              <div className="why-cell why-col-brand why-col-brand--top">
                <span className="why-brand"><GravityMark /><span className="why-brand-name">Gravity</span></span>
              </div>
              <div className="why-cell why-cell--col">Other Agencies</div>
              <div className="why-cell why-cell--col">Hire In House</div>
            </div>

            {/* Data rows */}
            {ROWS.map((row, i) => (
              <div key={row.label} className="why-row">
                <div className="why-cell why-cell--label">{row.label}</div>
                <div className={`why-cell why-col-brand${i === ROWS.length - 1 ? ' why-col-brand--bottom' : ''}`}>
                  <MarkIcon mark={row.gravity.mark} /><span>{row.gravity.text}</span>
                </div>
                <div className="why-cell">
                  <MarkIcon mark={row.others.mark} /><span>{row.others.text}</span>
                </div>
                <div className="why-cell">
                  <MarkIcon mark={row.inhouse.mark} /><span>{row.inhouse.text}</span>
                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  )
}
