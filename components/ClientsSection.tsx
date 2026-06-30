'use client'

/*
  CLIENTS — a quiet trust strip that sits just before the "Work, in motion"
  selected-work section. Client wordmarks scroll in an infinite marquee; the
  track is duplicated so the loop is seamless. Names are dim by default and
  brighten on hover. Pure CSS animation (paused for reduced-motion via the
  media query in globals.css).
*/

const CLIENTS = [
  'Himalayan Java',
  'COCO Fitness',
  'Kayo Events',
  'Karuwa Studio',
  'Rental Hub',
] as const

export default function ClientsSection() {
  // duplicate the list so the marquee can loop without a visible seam
  const row = [...CLIENTS, ...CLIENTS]

  return (
    <section className="clients-section" aria-label="Clients">
      <div className="clients-marquee">
        <ul className="clients-track" aria-hidden="false">
          {row.map((name, i) => (
            <li key={`${name}-${i}`} className="clients-item">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
