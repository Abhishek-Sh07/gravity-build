'use client'

import { useEffect, useRef, useState } from 'react'

const NAV = ['Work', 'Services', 'About', 'Blog', 'Contact'] as const

export default function Header() {
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    lastY.current = window.scrollY
    let ticking = false

    const update = () => {
      const y = window.scrollY
      const last = lastY.current
      const delta = y - last

      // Always show near the top; ignore tiny jitters
      if (y < 80) {
        setHidden(false)
      } else if (Math.abs(delta) > 6) {
        setHidden(delta > 0) // scrolling down → hide, up → show
      }

      lastY.current = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={`site-header${hidden ? ' site-header--hidden' : ''}${
          menuOpen ? ' site-header--menu-open' : ''
        }`}
      >
        <span className="site-header__logo" data-cursor="link">
          <img
            src="/images/brand/gravity-lockup-horizontal-white.svg"
            alt="Gravity Studio"
            className="site-header__logo-img"
          />
        </span>

        <button
          type="button"
          className={`site-header__toggle${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          data-cursor="link"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        {/* Desktop navigation */}
        <nav className="site-header__nav-wrap" aria-label="Main navigation">
          <ul className="site-header__nav">
            {NAV.map((item) => (
              <li key={item}>
                <button className="site-header__btn" data-cursor="link">
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Mobile fullscreen menu — sibling of the header so it isn't trapped by
          the header's transform containing block */}
      <nav
        className={`mobile-menu${menuOpen ? ' is-open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <ul className="mobile-menu__list">
          {NAV.map((item) => (
            <li key={item}>
              <button
                className="mobile-menu__btn"
                data-cursor="link"
                tabIndex={menuOpen ? 0 : -1}
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
