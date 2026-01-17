import type { Metadata } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mrgnana.com'),
  title: 'Mr.Gnana | Musician • Pads Player • Sound Engineer',
  description:
    'Professional musician and sound engineer specializing in atmospheric pads, live performances, mixing & mastering, and custom sound design.',
  keywords: [
    'musician',
    'pads player',
    'sound engineer',
    'mixing',
    'mastering',
    'live performance',
    'sound design',
    'ambient music',
    'electronic music',
  ],
  authors: [{ name: 'Mr.Gnana' }],
  openGraph: {
    title: 'Mr.Gnana | Musician • Pads Player • Sound Engineer',
    description:
      'Professional musician and sound engineer specializing in atmospheric pads, live performances, and audio production.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Mr.Gnana',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mr.Gnana - Professional Musician and Sound Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr.Gnana | Musician • Pads Player • Sound Engineer',
    description:
      'Professional musician and sound engineer specializing in atmospheric pads, live performances, and audio production.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans antialiased">
        <div className="noise-overlay" />
        {children}
      </body>
    </html>
  )
}
