'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const TOTAL_FRAMES = 192
const FADE_START   = 0.85

function frameUrl(n: number) {
  return `/frames/gravity/frame-${String(n).padStart(3, '0')}.jpg`
}

export default function ImageSequenceHero() {
  const wrapperRef     = useRef<HTMLDivElement>(null)
  const pinRef         = useRef<HTMLDivElement>(null)
  const canvasRef      = useRef<HTMLCanvasElement>(null)
  const overlayRef     = useRef<HTMLDivElement>(null)
  const readabilityRef = useRef<HTMLDivElement>(null)
  const smokeOneRef    = useRef<HTMLDivElement>(null)
  const smokeTwoRef    = useRef<HTMLDivElement>(null)
  const copyRef        = useRef<HTMLDivElement>(null)
  const bitmaps        = useRef<(ImageBitmap | null)[]>(new Array(TOTAL_FRAMES).fill(null))

  useEffect(() => {
    const canvas      = canvasRef.current!
    const ctx         = canvas.getContext('2d')!
    const wrapper     = wrapperRef.current!
    const pin         = pinRef.current!
    const overlay     = overlayRef.current!
    const readability = readabilityRef.current!
    const smokeOne    = smokeOneRef.current!
    const smokeTwo    = smokeTwoRef.current!
    const copy        = copyRef.current!

    let currentIdx  = 0
    let lastDrawIdx = -1
    let rafId: number

    const dpr = window.devicePixelRatio || 1

    // ── Canvas sizing with DPR ────────────────────────────────────────────
    // Physical buffer = CSS size × dpr (sharp on retina).
    // setTransform scales the coordinate system so all drawing uses CSS
    // pixels — no manual dpr multiply needed in draw calls.
    function resize() {
      canvas.width        = window.innerWidth  * dpr
      canvas.height       = window.innerHeight * dpr
      canvas.style.width  = '100vw'
      canvas.style.height = '100vh'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      lastDrawIdx = -1
    }

    // ── Cover-fit draw in CSS-pixel space ─────────────────────────────────
    // ctx is pre-scaled by dpr via setTransform, so cw/ch are CSS pixels
    // and the GPU writes to the full physical buffer automatically.
    function drawBitmap(bmp: ImageBitmap) {
      const cw    = window.innerWidth
      const ch    = window.innerHeight
      const scale = Math.max(cw / bmp.width, ch / bmp.height)
      const dw    = bmp.width  * scale
      const dh    = bmp.height * scale
      ctx.clearRect(0, 0, cw, ch)
      ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh)
    }

    // ── rAF loop: only redraws when frame index actually changes ──────────
    function tick() {
      if (currentIdx !== lastDrawIdx) {
        const bmp = bitmaps.current[currentIdx]
        if (bmp) {
          drawBitmap(bmp)
          lastDrawIdx = currentIdx
        }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    resize()
    window.addEventListener('resize', resize)

    // ── Preload + decode all frames into GPU-resident ImageBitmaps ─────────
    // createImageBitmap decodes the JPEG once — drawImage from a bitmap
    // is a plain GPU texture copy with zero CPU decode overhead per frame.
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.onload = async () => {
        try {
          bitmaps.current[i] = await createImageBitmap(img)
        } catch { /* browser without createImageBitmap — rAF will skip */ }
      }
      img.src = frameUrl(i + 1)
    }

    // ── ScrollTrigger ─────────────────────────────────────────────────────
    const st = ScrollTrigger.create({
      trigger:    wrapper,
      start:      'top top',
      end:        'bottom bottom',
      pin:        pin,
      pinSpacing: false,
      scrub:      true,
      onUpdate(self) {
        currentIdx = Math.round(self.progress * (TOTAL_FRAMES - 1))

        const p = self.progress

        // ── Hero copy: fade out 0 → 0.22 ─────────────────────────────────
        const tText = Math.min(p / 0.22, 1)
        copy.style.opacity   = String(1 - tText)
        copy.style.transform = `translateY(${-40 * tText}px)`
        copy.style.filter    = `blur(${8 * tText}px)`

        // ── Readability overlay + smoke: fade out 0.05 → 0.35 ────────────
        const tOvl = p <= 0.05 ? 1
          : p >= 0.35 ? 0
          : 1 - (p - 0.05) / 0.30
        readability.style.opacity = String(tOvl)
        smokeOne.style.opacity    = String(0.35 * tOvl)
        smokeTwo.style.opacity    = String(0.35 * tOvl)

        // ── Dark end-of-scroll overlay: fade in 85% → 100% ───────────────
        overlay.style.opacity =
          p >= FADE_START
            ? String((p - FADE_START) / (1 - FADE_START))
            : '0'
      },
    })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      st.kill()
      bitmaps.current.forEach(bmp => bmp?.close())
      bitmaps.current.fill(null)
    }
  }, [])

  return (
    <section ref={wrapperRef} className="sequence-scroll-wrapper">
      <div ref={pinRef} className="sequence-pin">
        <canvas ref={canvasRef} className="sequence-canvas" />
        <div ref={readabilityRef} className="hero-readability-overlay" />
        <div ref={smokeOneRef} className="hero-smoke hero-smoke-one" />
        <div ref={smokeTwoRef} className="hero-smoke hero-smoke-two" />
        <div ref={overlayRef} className="dark-overlay" />
        <div ref={copyRef} className="hero-copy">
          <span className="hero-kicker">Branding, UI/UX, and websites crafted with clarity, depth, and motion.</span>
          <h1>We turn ideas into<br />digital brands.</h1>
          <div className="hero-actions">
            <a href="#work" className="hero-btn hero-btn-primary">View Work</a>
            <a href="#contact" className="hero-btn hero-btn-secondary">Start a Project</a>
          </div>
        </div>
      </div>
    </section>
  )
}
