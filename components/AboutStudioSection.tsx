'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: '6+', label: 'Years Design Experience' },
  { value: '∞',  label: 'UI/UX · Branding · Development' },
  { value: '🌏', label: 'Nepal-rooted, Global-minded' },
  { value: '01',  label: 'Digital-first Studio' },
]

export default function AboutStudioSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Oversized background word — slow parallax
      gsap.to('.about-bg-word', {
        y: -120,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })

      // Heading
      gsap.from('.about-heading', {
        opacity: 0, y: 70, duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-heading', start: 'top 78%', toggleActions: 'play none none reverse' },
      })

      // Copy paragraphs
      gsap.from('.about-copy p', {
        opacity: 0, y: 40, duration: 0.9, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-body', start: 'top 75%', toggleActions: 'play none none reverse' },
      })

      // Stat cards
      gsap.from('.about-stat', {
        opacity: 0, y: 60, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '.about-stats', start: 'top 78%', toggleActions: 'play none none reverse' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="about-section">

      {/* Oversized background word */}
      <span className="about-bg-word" aria-hidden="true">GRAVITY</span>

      <div className="about-container">

        <h2 className="about-heading">
          A creative studio built<br />for brands that want to move.
        </h2>

        <div className="about-body">

          <div className="about-copy">
            <p>
              Gravity Studio works at the intersection of design, branding, and development.
              We help businesses turn raw ideas into clear identities, thoughtful interfaces,
              and websites that feel premium from the first interaction.
            </p>
            <p>
              We believe good design should feel simple, useful, and memorable. Every project
              is shaped with strategy, visual clarity, and motion that supports the story.
            </p>
          </div>

          <div className="about-right">
            <div className="about-glow" aria-hidden="true" />
            <div className="about-stats">
              {STATS.map((s) => (
                <div key={s.label} className="about-stat">
                  <span className="about-stat-value">{s.value}</span>
                  <span className="about-stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
