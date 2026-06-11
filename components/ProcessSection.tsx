'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    num: '01',
    title: 'Discover',
    desc: 'We understand your business, audience, goals, and current challenges through focused research and conversation.',
  },
  {
    num: '02',
    title: 'Define',
    desc: 'We shape the strategy, direction, sitemap, user flow, and visual mood before any design work begins.',
  },
  {
    num: '03',
    title: 'Design',
    desc: 'We create the identity, interface, layout, and motion direction — refined until it feels exactly right.',
  },
  {
    num: '04',
    title: 'Build',
    desc: 'We turn the approved design into a fast, responsive, production-ready website using modern front-end tools.',
  },
  {
    num: '05',
    title: 'Launch',
    desc: 'We test, refine, launch, and support the final experience so it goes live without friction.',
  },
]

export default function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // Left column fade in
      gsap.from('.proc-left', {
        opacity: 0, y: 50, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: '.proc-inner', start: 'top 75%', toggleActions: 'play none none reverse' },
      })

      // Each step: divider + content
      const steps = sectionRef.current!.querySelectorAll<HTMLElement>('.proc-step')
      steps.forEach((step) => {
        const divider = step.querySelector<HTMLElement>('.proc-divider')
        const num     = step.querySelector<HTMLElement>('.proc-num')
        const content = step.querySelector<HTMLElement>('.proc-content')

        if (divider) {
          gsap.from(divider, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 78%', toggleActions: 'play none none reverse' },
          })
        }

        if (num && content) {
          gsap.from([num, content], {
            opacity: 0, y: 40, duration: 0.9, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: step, start: 'top 75%', toggleActions: 'play none none reverse' },
          })
        }

        // Active number highlight
        if (num) {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 55%',
            end: 'bottom 45%',
            onEnter:     () => num.classList.add('proc-num--active'),
            onLeave:     () => num.classList.remove('proc-num--active'),
            onEnterBack: () => num.classList.add('proc-num--active'),
            onLeaveBack: () => num.classList.remove('proc-num--active'),
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="proc-section">
      <div className="proc-container">
        <div className="proc-inner">

          {/* Left — sticky intro */}
          <div className="proc-left">
            <span className="proc-label">Process</span>
            <h2 className="proc-heading">A simple process<br />from idea to launch.</h2>
            <p className="proc-para">
              Every project moves through a clear process, from understanding
              the idea to launching the final digital experience.
            </p>
          </div>

          {/* Right — scrollable steps */}
          <div className="proc-right">
            {STEPS.map((s) => (
              <div key={s.num} className="proc-step">
                <div className="proc-divider" />
                <div className="proc-step-inner">
                  <span className="proc-num">{s.num}</span>
                  <div className="proc-content">
                    <h3 className="proc-title">{s.title}</h3>
                    <p className="proc-desc">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
