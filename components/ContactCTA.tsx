'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ContactCTA() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      })

      tl.from('.cta-label', { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' })
        .from('.cta-heading', { opacity: 0, y: 70, scale: 0.96, duration: 1.1, ease: 'power3.out' }, '-=0.3')
        .from('.cta-para', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' }, '-=0.5')
        .from('.cta-buttons', { opacity: 0, y: 30, duration: 0.8, ease: 'power3.out' }, '-=0.4')
        .from('.cta-card', { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out' }, '-=0.3')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="cta-section">

      {/* Ambient animated mint glow */}
      <div className="cta-glow" aria-hidden="true" />

      <div className="cta-container">

        <span className="cta-label">Start a Project</span>

        <h2 className="cta-heading">
          Have an idea?<br />
          Let&apos;s turn it into<br />
          a digital brand.
        </h2>

        <p className="cta-para">
          Tell us what you are building. We&apos;ll help shape the brand, website,
          or product experience from the ground up.
        </p>

        <div className="cta-buttons">
          <button className="cta-btn-primary">Start a Project</button>
          <a href="mailto:hello@gravitystudio.com" className="cta-btn-secondary">
            Send Email
          </a>
        </div>

        {/* Glass contact card */}
        <div className="cta-card">
          <div className="cta-card-row">
            <span className="cta-card-key">Email</span>
            <a href="mailto:hello@gravitystudio.com" className="cta-card-val">
              hello@gravitystudio.com
            </a>
          </div>
          <div className="cta-card-divider" />
          <div className="cta-card-row">
            <span className="cta-card-key">Services</span>
            <span className="cta-card-val">Branding · UI/UX · Web Development</span>
          </div>
          <div className="cta-card-divider" />
          <div className="cta-card-row">
            <span className="cta-card-key">Location</span>
            <span className="cta-card-val">Kathmandu, Nepal</span>
          </div>
        </div>

      </div>
    </section>
  )
}
