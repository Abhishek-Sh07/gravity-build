const NAV_LINKS = ['Work', 'Services', 'About', 'Contact']
const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn',  href: '#' },
  { label: 'Behance',   href: '#' },
]

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">

        <div className="footer-brand">
          <img
            src="/images/brand/gravity-lockup-horizontal-white.svg"
            alt="Gravity Studio"
            className="footer-brand-img"
          />
        </div>

        <nav className="footer-nav" aria-label="Footer navigation">
          {NAV_LINKS.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="footer-link">
              {link}
            </a>
          ))}
        </nav>

        <div className="footer-social">
          {SOCIAL_LINKS.map((s) => (
            <a key={s.label} href={s.href} className="footer-link" target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Gravity Studio. All rights reserved.</p>
      </div>
    </footer>
  )
}
