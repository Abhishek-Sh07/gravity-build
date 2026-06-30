'use client'

import { useEffect, useRef } from 'react'

export default function GravityCursor() {
  const rootRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!finePointer || reducedMotion) return

    const root = rootRef.current
    const dot = dotRef.current
    if (!root || !dot) return

    document.documentElement.classList.add('has-gravity-cursor')

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let scale = 1
    let targetScale = 1
    let raf = 0
    let hoveredButton: HTMLElement | null = null

    const render = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      scale += (targetScale - scale) * 0.16
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`
      dot.style.transform = `translate(-50%, -50%) scale(${scale})`
      raf = window.requestAnimationFrame(render)
    }

    const onPointerMove = (event: PointerEvent) => {
      tx = event.clientX
      ty = event.clientY

      const target = event.target as HTMLElement | null
      const active = target?.closest<HTMLElement>('a, button, [data-cursor]')
      const activeButton = target?.closest<HTMLElement>('.gb-button') ?? null
      const magnetic = target?.closest<HTMLElement>('.gb-magnetic')
      // Over a work image the "Explore" badge is showing — keep the dot small
      // so it reads as a crisp cursor inside the trailing circle.
      const explore = document.documentElement.classList.contains('explore-active')

      root.classList.toggle('is-active', Boolean(active) && !explore)
      root.classList.toggle('is-button', Boolean(activeButton))
      root.classList.toggle('is-explore', explore)
      targetScale = explore ? 1 : active ? (activeButton ? 0.72 : 2.25) : 1

      if (hoveredButton !== activeButton) {
        hoveredButton?.classList.remove('is-hover')
        activeButton?.classList.add('is-hover')
        hoveredButton = activeButton
      }

      if (magnetic) {
        const rect = magnetic.getBoundingClientRect()
        const mx = (event.clientX - rect.left - rect.width / 2) * 0.18
        const my = (event.clientY - rect.top - rect.height / 2) * 0.28
        magnetic.style.setProperty('--mx', `${mx}px`)
        magnetic.style.setProperty('--my', `${my}px`)
      }
    }

    const onPointerOver = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      target?.closest<HTMLElement>('.gb-button')?.classList.add('is-hover')
    }

    const onPointerOut = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      const magnetic = target?.closest<HTMLElement>('.gb-magnetic')
      if (magnetic) {
        magnetic.style.setProperty('--mx', '0px')
        magnetic.style.setProperty('--my', '0px')
      }
      target?.closest<HTMLElement>('.gb-button')?.classList.remove('is-hover')
      if (hoveredButton && !target?.closest<HTMLElement>('.gb-button')) {
        hoveredButton.classList.remove('is-hover')
        hoveredButton = null
      }
    }

    raf = window.requestAnimationFrame(render)
    window.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerover', onPointerOver)
    document.addEventListener('pointerout', onPointerOut)

    return () => {
      window.cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerover', onPointerOver)
      document.removeEventListener('pointerout', onPointerOut)
      hoveredButton?.classList.remove('is-hover')
      document.documentElement.classList.remove('has-gravity-cursor')
    }
  }, [])

  return (
    <div ref={rootRef} className="gravity-cursor" aria-hidden="true">
      <div ref={dotRef} className="gravity-cursor__dot" />
    </div>
  )
}
