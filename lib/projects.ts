export type Quote = { text: string; author: string; role: string }

export type Project = {
  slug: string
  titleLines: [string, string]
  category: string
  year: string
  client: string
  services: string[]
  /** Big overview statement under the hero image */
  intro: string
  challengeHeading: string
  challenge: string[]
  /** Large centered pull-statement */
  statement: string
  quote: Quote
  images: {
    hero: string
    full1: string
    full2: string
    twoCol: [string, string]
    gallery: [string, string, string]
  }
}

const WORK = '/images/work'
const SVC = '/images/services'

export const PROJECTS: Project[] = [
  {
    slug: 'himalayan-java',
    titleLines: ['Himalayan', 'Java'],
    category: 'QR Ordering · UX Design',
    year: '2025',
    client: 'Himalayan Java Coffee',
    services: ['UX Strategy', 'Product Design', 'Design System', 'Development'],
    intro:
      'A mobile-first ordering experience for a Himalayan coffee house — built around clarity, warmth and speed. We reimagined the in-store journey from a paper menu into a calm, tactile digital ritual.',
    challengeHeading: 'The challenge',
    challenge: [
      'Himalayan Java served thousands of cups a day across busy outlets, but ordering was slow and the brand felt invisible on screen. Queues grew, regulars churned, and the team had no view of what was actually selling.',
      'We were asked to design a QR-led ordering flow that felt premium and unmistakably theirs — fast enough for the morning rush, gentle enough for a slow afternoon, and consistent across every outlet.',
    ],
    statement:
      'Good design should feel like the shortest distance between a craving and a cup.',
    quote: {
      text:
        'They didn’t just hand us screens — they handed us a system our staff actually wanted to use. Average order time dropped, and the brand finally feels alive on the phone.',
      author: 'Aayush Rana',
      role: 'Head of Experience, Himalayan Java',
    },
    images: {
      hero: `${WORK}/java%20kiosk.png`,
      full1: `${SVC}/ui-ux-design.jpg`,
      full2: `${SVC}/website-design.jpg`,
      twoCol: [`${WORK}/event-app.jpg`, `${WORK}/rental-dashboard.jpg`],
      gallery: [`${SVC}/development.jpg`, `${SVC}/motion-interaction.jpg`, `${SVC}/brand-identity.jpg`],
    },
  },
  {
    slug: 'coco-fitness',
    titleLines: ['COCO', 'Fitness'],
    category: 'Website Design · Motion',
    year: '2025',
    client: 'COCO Performance',
    services: ['Art Direction', 'Web Design', 'Motion', 'Development'],
    intro:
      'A high-energy fitness brand and site, engineered for momentum and conversion. Every scroll was tuned to feel like a heartbeat building toward the sign-up.',
    challengeHeading: 'The challenge',
    challenge: [
      'COCO had a loyal community but a flat digital presence that undersold the intensity of the experience. The old site loaded slowly and buried the one thing that mattered: starting a membership.',
      'We set out to translate the energy of the room into the browser — kinetic typography, decisive motion, and a path to conversion that never lets the visitor cool down.',
    ],
    statement:
      'Momentum is a feeling. Our job was to make the screen move the way the body does.',
    quote: {
      text:
        'The new site converts almost twice as well, and people mention it before they even walk in. It finally looks as serious as our training is.',
      author: 'Mariana Cruz',
      role: 'Founder, COCO Performance',
    },
    images: {
      hero: `${WORK}/coco.jpg`,
      full1: `${SVC}/motion-interaction.jpg`,
      full2: `${SVC}/website-design.jpg`,
      twoCol: [`${WORK}/rental-dashboard.jpg`, `${WORK}/event-app.jpg`],
      gallery: [`${SVC}/development.jpg`, `${SVC}/ui-ux-design.jpg`, `${SVC}/brand-identity.jpg`],
    },
  },
  {
    slug: 'kayo-event-management',
    titleLines: ['Kayo', 'Events'],
    category: 'Event Management · App Design',
    year: '2024',
    client: 'Kayo Event Management App',
    services: ['UX Strategy', 'Product Design', 'Design System', 'Development'],
    intro:
      'An end-to-end event management app — from planning to check-in. We built a calm, organized experience that keeps organizers and guests on the same page.',
    challengeHeading: 'The challenge',
    challenge: [
      'Kayo’s organizers juggled spreadsheets, group chats and ticketing tools that never talked to each other. Details slipped, guests got confused, and event day was chaos.',
      'The brief: one app to run an event end to end — scheduling, invites, ticketing and live check-in — that felt effortless for organizers and delightful for attendees.',
    ],
    statement:
      'A great event feels effortless — the work that makes it so should be invisible.',
    quote: {
      text:
        'We run twice the events with half the stress. Check-in that used to take an hour now takes minutes, and guests actually compliment the app.',
      author: 'Sujan Maharjan',
      role: 'Founder, Kayo',
    },
    images: {
      hero: `${WORK}/kayo.jpg`,
      full1: `${SVC}/ui-ux-design.jpg`,
      full2: `${SVC}/website-design.jpg`,
      twoCol: [`${WORK}/event-app.jpg`, `${WORK}/rental-dashboard.jpg`],
      gallery: [`${SVC}/development.jpg`, `${SVC}/motion-interaction.jpg`, `${SVC}/brand-identity.jpg`],
    },
  },
]

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug)
}

export function getNextProject(slug: string): Project {
  const i = PROJECTS.findIndex((p) => p.slug === slug)
  return PROJECTS[(i + 1) % PROJECTS.length]
}
