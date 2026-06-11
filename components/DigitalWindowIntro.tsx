'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function DigitalWindowIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const windowRef  = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      })

      tl.fromTo(
        windowRef.current,
        { opacity: 0, scale: 0.92 },
        { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }
      ).fromTo(
        contentRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.5'
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="dw-section">
      {/* ambient mint glow */}
      <div className="dw-glow" />
      {/* subtle grid */}
      <div className="dw-grid" />

      <div ref={windowRef} className="dw-window">
        <div ref={contentRef} className="dw-content">
          <span className="dw-label">Inside Gravity</span>

          <h2 className="dw-heading">
            We shape brands, websites,<br />and digital products.
          </h2>

          <p className="dw-para">
            A creative studio for UI/UX, branding, and development —<br />
            built for brands that want to move different.
          </p>

          <div className="dw-buttons">
            <button className="dw-btn-primary">View Work</button>
            <button className="dw-btn-secondary">Explore Services</button>
          </div>
        </div>
      </div>
    </section>
  )
}
