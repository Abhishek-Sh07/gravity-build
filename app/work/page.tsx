import type { Metadata } from 'next'
import WorksComingSoon from '@/components/WorksComingSoon'

export const metadata: Metadata = {
  title: 'Work · Gravity Studio',
  description: 'Selected and featured works by Gravity Studio.',
}

export default function WorkPage() {
  return <WorksComingSoon />
}
