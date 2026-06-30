'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Project } from '@/lib/projects'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectDetail({ project, next }: { project: Project; next: Project }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ── Hero title: masked lines rise on load ────────────────────────────
      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'power4.out' } })
      if (reduced) {
        gsap.set(['.pd-title-line', '.pd-hero-tag', '.pd-hero-meta > *', '.pd-scroll'], { y: 0, opacity: 1 })
      } else {
        tl.from('.pd-hero-tag', { y: 24, opacity: 0, duration: 0.8 })
          .from('.pd-title-line', { yPercent: 115, duration: 1.15, stagger: 0.1 }, '-=0.45')
          .from('.pd-hero-meta > *', { y: 24, opacity: 0, duration: 0.8, stagger: 0.08 }, '-=0.7')
          .from('.pd-scroll', { y: 16, opacity: 0, duration: 0.7 }, '-=0.5')
      }

      if (reduced) return

      // ── Image reveal: inner media wipes up into view ─────────────────────
      gsap.utils.toArray<HTMLElement>('.pd-media').forEach((media) => {
        const img = media.querySelector('img')
        gsap.fromTo(
          media,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: media, start: 'top 85%' },
          }
        )
        // Continuous parallax via object-position crop shift (paint-only)
        if (img) {
          gsap.fromTo(
            img,
            { objectPosition: '50% 38%' },
            {
              objectPosition: '50% 62%',
              ease: 'none',
              scrollTrigger: { trigger: media, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          )
        }
      })

      // ── Generic fade-up for text blocks ──────────────────────────────────
      gsap.utils.toArray<HTMLElement>('.pd-fade').forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        })
      })

      // ── Big statement: word-by-word brighten ─────────────────────────────
      gsap.utils.toArray<HTMLElement>('.pd-statement').forEach((el) => {
        const words = el.querySelectorAll('.pd-word')
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: 'none',
            stagger: 0.06,
            scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 60%', scrub: true },
          }
        )
      })

      // ── Next-project parallax title ──────────────────────────────────────
      const nextImg = root.current?.querySelector('.pd-next-media img')
      if (nextImg) {
        gsap.fromTo(
          nextImg,
          { objectPosition: '50% 35%' },
          {
            objectPosition: '50% 65%',
            ease: 'none',
            scrollTrigger: { trigger: '.pd-next', start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      }
    }, root)

    return () => ctx.revert()
  }, [project.slug])

  const statementWords = project.statement.split(' ')

  return (
    <div ref={root} className="pd">

      {/* ── Local header ─────────────────────────────────────────────────── */}
      <header className="pd-header">
        <Link href="/" className="pd-logo">GRAVITY BUILD</Link>
        <Link href="/#work" className="pd-back">← Back to work</Link>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pd-hero">
        <span className="pd-hero-tag">{project.category}</span>
        <h1 className="pd-title">
          {project.titleLines.map((line) => (
            <span key={line} className="pd-title-mask">
              <span className="pd-title-line">{line}</span>
            </span>
          ))}
        </h1>
        <div className="pd-hero-meta">
          <div className="pd-meta-item">
            <span className="pd-meta-label">Client</span>
            <span className="pd-meta-value">{project.client}</span>
          </div>
          <div className="pd-meta-item">
            <span className="pd-meta-label">Year</span>
            <span className="pd-meta-value">{project.year}</span>
          </div>
          <div className="pd-meta-item">
            <span className="pd-meta-label">Services</span>
            <span className="pd-meta-value">{project.services.join(', ')}</span>
          </div>
        </div>
        <div className="pd-scroll" aria-hidden="true">
          <span>Scroll</span>
          <span className="pd-scroll-line" />
        </div>
      </section>

      {/* ── Hero image (full-bleed) ──────────────────────────────────────── */}
      <section className="pd-section pd-bleed">
        <div className="pd-media pd-media--hero">
          <img src={project.images.hero} alt={project.titleLines.join(' ')} />
        </div>
      </section>

      {/* ── Intro / overview statement ───────────────────────────────────── */}
      <section className="pd-section pd-intro">
        <p className="pd-intro-text pd-fade">{project.intro}</p>
      </section>

      {/* ── Challenge: sticky heading + copy ─────────────────────────────── */}
      <section className="pd-section pd-split">
        <div className="pd-split-aside">
          <h2 className="pd-split-heading pd-fade">{project.challengeHeading}</h2>
        </div>
        <div className="pd-split-body">
          {project.challenge.map((para, i) => (
            <p key={i} className="pd-split-para pd-fade">{para}</p>
          ))}
        </div>
      </section>

      {/* ── Full image 1 ─────────────────────────────────────────────────── */}
      <section className="pd-section pd-bleed">
        <div className="pd-media pd-media--full">
          <img src={project.images.full1} alt="" />
        </div>
      </section>

      {/* ── Two-column image row ─────────────────────────────────────────── */}
      <section className="pd-section pd-twocol">
        <div className="pd-media pd-media--tall">
          <img src={project.images.twoCol[0]} alt="" />
        </div>
        <div className="pd-media pd-media--tall pd-twocol-offset">
          <img src={project.images.twoCol[1]} alt="" />
        </div>
      </section>

      {/* ── Big statement ────────────────────────────────────────────────── */}
      <section className="pd-section pd-statement-wrap">
        <p className="pd-statement">
          {statementWords.map((w, i) => (
            <span key={i} className="pd-word">{w}&nbsp;</span>
          ))}
        </p>
      </section>

      {/* ── Full image 2 ─────────────────────────────────────────────────── */}
      <section className="pd-section pd-bleed">
        <div className="pd-media pd-media--full">
          <img src={project.images.full2} alt="" />
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section className="pd-section pd-gallery">
        {project.images.gallery.map((src, i) => (
          <div key={i} className="pd-media pd-media--grid">
            <img src={src} alt="" />
          </div>
        ))}
      </section>

      {/* ── Quote / testimonial ──────────────────────────────────────────── */}
      <section className="pd-section pd-quote">
        <blockquote className="pd-quote-text pd-fade">“{project.quote.text}”</blockquote>
        <div className="pd-quote-by pd-fade">
          <span className="pd-quote-author">{project.quote.author}</span>
          <span className="pd-quote-role">{project.quote.role}</span>
        </div>
      </section>

      {/* ── Next project ─────────────────────────────────────────────────── */}
      <Link href={`/projects/${next.slug}`} className="pd-next">
        <div className="pd-next-media">
          <img src={next.images.hero} alt={next.titleLines.join(' ')} />
        </div>
        <div className="pd-next-inner">
          <span className="pd-next-label">Next project</span>
          <span className="pd-next-title">{next.titleLines.join(' ')}</span>
          <span className="pd-next-cat">{next.category}</span>
        </div>
      </Link>

    </div>
  )
}
