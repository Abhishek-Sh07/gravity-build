'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    num: '01',
    title: 'Brand Identity',
    desc: 'Logo, visual style, colors, typography, and brand guidelines.',
  },
  {
    num: '02',
    title: 'UI/UX Design',
    desc: 'User-friendly designs for websites, apps, dashboards, and digital products.',
  },
  {
    num: '03',
    title: 'Web Design & Development',
    desc: 'Modern, responsive websites built to look premium and convert visitors.',
  },
  {
    num: '04',
    title: 'SEO',
    desc: 'Website optimization, keyword strategy, on-page SEO, technical SEO, and content planning to help your brand get discovered on Google.',
  },
  {
    num: '05',
    title: 'Digital Marketing',
    desc: 'Social media strategy, ad creatives, campaign planning, and paid ads.',
  },
  {
    num: '06',
    title: 'Creative Content',
    desc: 'Reels, posters, launch creatives, branded visuals, and social media content.',
  },
  {
    num: '07',
    title: 'Growth Strategy',
    desc: 'A clear digital plan that connects your brand, website, SEO, and marketing together.',
    wide: true,
  },
]

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      gsap.from('.svc-intro > *', {
        opacity: 0, y: 34, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-intro', start: 'top 82%', toggleActions: 'play none none reverse' },
      })
      gsap.from('.svc-card', {
        opacity: 0, y: 46, duration: 0.9, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: '.svc-grid', start: 'top 84%', toggleActions: 'play none none reverse' },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="svc-section">
      <div className="svc-container">

        <div className="svc-intro">
          <span className="svc-label">Services</span>
          <h2 className="svc-heading">Everything your brand<br />needs to grow.</h2>
          <p className="svc-para">
            From identity to launch to growth — a full-stack creative and digital
            partner under one roof.
          </p>
        </div>

        <div className="svc-grid">
          {SERVICES.map((s) => (
            <article key={s.num} className={`svc-card${s.wide ? ' svc-card--wide' : ''}`}>
              <span className="svc-num">{s.num}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}
