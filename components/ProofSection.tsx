'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PROOF = [
  {
    num: '01',
    title: 'Strategy before visuals',
    desc: 'We begin with the goal, audience, and business direction before designing a single screen.',
  },
  {
    num: '02',
    title: 'Premium but practical',
    desc: 'We create visuals that feel high-end while staying useful, clear, and easy to maintain long-term.',
  },
  {
    num: '03',
    title: 'Built for launch',
    desc: 'From design to development, we focus on work that can actually go live and support real growth.',
  },
]

export default function ProofSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.proof-label', {
        opacity: 0, y: 20, duration: 0.7, ease: 'power3.out',
        scrollTrigger: { trigger: '.proof-intro', start: 'top 75%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.proof-heading', {
        opacity: 0, y: 60, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.proof-intro', start: 'top 70%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.proof-card', {
        opacity: 0, y: 60, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.proof-grid', start: 'top 78%', toggleActions: 'play none none reverse' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="proof-section">
      <div className="proof-container">

        <div className="proof-intro">
          <span className="proof-label">Why Work With Us</span>
          <h2 className="proof-heading">
            Clear design. Strong identity.<br />Better digital presence.
          </h2>
        </div>

        <div className="proof-grid">
          {PROOF.map((p) => (
            <div key={p.num} className="proof-card">
              <span className="proof-card-num">{p.num}</span>
              <h3 className="proof-card-title">{p.title}</h3>
              <p className="proof-card-desc">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
