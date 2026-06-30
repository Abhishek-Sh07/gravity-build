import type { Metadata } from 'next'
import { Manrope, Instrument_Serif } from 'next/font/google'
import LenisProvider from '@/components/LenisProvider'
import Preloader from '@/components/Preloader'
import GravityCursor from '@/components/GravityCursor'
import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Gravity Studio',
  description: 'UI/UX · Branding · Development',
  icons: {
    icon: [
      { url: '/images/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/brand/favicon-64.png', sizes: '64x64', type: 'image/png' },
      { url: '/images/brand/favicon.ico' },
    ],
    apple: '/images/brand/social-profile-512.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${instrumentSerif.variable}`}>
      <body>
        <Preloader />
        <GravityCursor />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  )
}
