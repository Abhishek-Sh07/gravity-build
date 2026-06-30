'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Benefit = { Icon: () => JSX.Element; label: string; text: string }

// ── Minimal geometric line icons (Cuberto-style wireframe marks) ────────────
function IconOctahedron() {
  return (
    <svg className="benefit-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M40 8 64 40 40 72 16 40Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M16 40 40 32 64 40" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M40 8 40 32 M40 32 24 56 M40 32 56 56" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconBolt() {
  return (
    <svg className="benefit-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="1.6" />
      <path d="M44 18 28 44 40 44 36 62 52 36 40 36Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconFlex() {
  return (
    <svg className="benefit-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <path d="M14 26 40 12 66 26 66 54 40 68 14 54Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 26 40 40 66 26 M40 40 40 68" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function IconSpectrum() {
  return (
    <svg className="benefit-icon" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <circle cx="40" cy="40" r="32" stroke="currentColor" strokeWidth="1.6" />
      <path d="M40 8 40 72 M8 40 72 40 M17 17 63 63 M63 17 17 63" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="40" cy="40" r="10" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

const BENEFITS: Benefit[] = [
  {
    Icon: IconOctahedron,
    label: "Time Zones Ain't No Thing",
    text:
      "Wherever you are in the world, you'll feel like we're right around the corner. " +
      "With years of experience, our processes are seamless and time differences don't matter.",
  },
  {
    Icon: IconBolt,
    label: "Impossible? We're On It",
    text:
      "'Impossible' simply does not exist in our vocabulary. We build products exactly as they " +
      "were at the design stage — no simplifications, no shortcuts, no BS.",
  },
  {
    Icon: IconFlex,
    label: 'Flexible Work Terms',
    text:
      'Just like we stick to a fixed budget, we stay within a clear scope and framework. ' +
      'Whatever terms we agree to will always depend on your project needs.',
  },
  {
    Icon: IconSpectrum,
    label: 'Full Spectrum Of Services',
    text:
      "Any solution your brand needs, we're on it: branding and logos, interface design, " +
      'development, motion, and ongoing support — all under one roof.',
  },
]

export default function BenefitsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.benefit-heading', {
        opacity: 0, y: 70, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.benefit-heading', start: 'top 82%', toggleActions: 'play none none reverse' },
      })

      gsap.utils.toArray<HTMLElement>('.benefit-row').forEach((row) => {
        gsap.from(row, {
          opacity: 0, y: 40, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
        // Icon draws/rotates in as the row enters
        gsap.from(row.querySelector('.benefit-icon'), {
          rotate: -90, scale: 0.6, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="benefit-section">
      <div className="benefit-container">

        <h2 className="benefit-heading">Benefits of<br />working with us</h2>

        <div className="benefit-list">
          {BENEFITS.map(({ Icon, label, text }) => (
            <div key={label} className="benefit-row">
              <div className="benefit-mark"><Icon /></div>
              <div className="benefit-label">{label}</div>
              <p className="benefit-text">{text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
