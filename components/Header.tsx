const NAV = ['Work', 'About', 'Contact'] as const

export default function Header() {
  return (
    <header className="site-header">
      <span className="site-header__logo">Gravity Studio</span>
      <nav aria-label="Main navigation">
        <ul className="site-header__nav">
          {NAV.map((item) => (
            <li key={item}>
              <button className="site-header__btn">{item}</button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
