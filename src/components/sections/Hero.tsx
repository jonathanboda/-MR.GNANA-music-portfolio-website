'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { gsap } from 'gsap'
import { useContent } from '@/lib/content-context'

export default function Hero() {
  const { content } = useContent()
  const containerRef = useRef<HTMLDivElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate floating orbs
      gsap.to(orb1Ref.current, {
        x: 100,
        y: -50,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to(orb2Ref.current, {
        x: -80,
        y: 60,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

      gsap.to(orb3Ref.current, {
        x: 60,
        y: 80,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })

    }, containerRef)

    return () => ctx.revert()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero section.JPG"
          alt="Hero background"
          fill
          className="object-cover object-top"
          priority
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Animated Background Overlay */}
      <div className="absolute inset-0 animated-gradient opacity-30" />

      {/* Floating Orbs */}
      <div
        ref={orb1Ref}
        className="orb orb-purple w-[500px] h-[500px] -top-40 -left-40"
      />
      <div
        ref={orb2Ref}
        className="orb orb-cyan w-[400px] h-[400px] top-1/3 -right-20"
      />
      <div
        ref={orb3Ref}
        className="orb orb-magenta w-[300px] h-[300px] -bottom-20 left-1/4"
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 text-center"
      >

        {/* Tagline */}
        <motion.p
          variants={itemVariants}
          className="text-xl sm:text-2xl md:text-3xl text-text-muted mb-10 font-light tracking-wide"
        >
          {content.hero.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.a
            href="#music"
            className="group relative px-8 py-4 bg-surface border border-border rounded-full font-semibold text-white overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
              {content.hero.cta.listen}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          <motion.a
            href="/book"
            className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full font-semibold text-white btn-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {content.hero.cta.book}
          </motion.a>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-text-muted rounded-full flex justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-neon-cyan rounded-full"
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
