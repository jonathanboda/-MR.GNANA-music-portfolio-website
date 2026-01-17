'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { ContentProvider } from '@/lib/content-context'
import type { SiteContentType } from '@/lib/content-fetcher'
import Navbar from '@/components/Navbar'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Music from '@/components/sections/Music'
import Services from '@/components/sections/Services'
import Gallery from '@/components/sections/Gallery'
import Videos from '@/components/sections/Videos'
import Shows from '@/components/sections/Shows'
import Contact from '@/components/sections/Contact'
import Footer from '@/components/Footer'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface HomeClientProps {
  initialContent: SiteContentType
}

export default function HomeClient({ initialContent }: HomeClientProps) {
  useEffect(() => {
    // Initialize smooth scroll behavior
    const sections = document.querySelectorAll('section')

    sections.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0.8,
        },
        {
          opacity: 1,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      )
    })

    // Parallax effect for background elements
    gsap.utils.toArray('.orb').forEach((orb) => {
      gsap.to(orb as Element, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: orb as Element,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <ContentProvider initialContent={initialContent}>
      <main className="relative">
        <Navbar />
        <Hero />
        <About />
        <Music />
        <Services />
        <Gallery />
        <Videos />
        <Shows />
        <Contact />
        <Footer />
      </main>
    </ContentProvider>
  )
}
