'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useContent } from '@/lib/content-context'

export default function About() {
  const { content } = useContent()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-neon-purple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-neon-cyan/10 rounded-full blur-[100px]" />

      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Image Side */}
          <motion.div variants={imageVariants} className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              {/* Decorative frame */}
              <div className="absolute -inset-4 bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-magenta rounded-3xl opacity-20 blur-sm" />
              <div className="absolute -inset-4 bg-gradient-to-br from-neon-purple via-neon-cyan to-neon-magenta rounded-3xl opacity-10" />

              {/* Main image container */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-surface border border-border">
                <Image
                  src="/images/7.JPG"
                  alt="Mr.Gnana"
                  fill
                  className="object-cover object-top"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              </div>

              {/* Floating badge */}
              <motion.div
                className="absolute -bottom-4 -right-4 glass px-4 py-2 rounded-xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-sm font-medium gradient-text">
                  {content.about.badge}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <div className="space-y-8">
            {/* Section Title */}
            <motion.div variants={itemVariants}>
              <span className="text-neon-cyan text-sm font-mono uppercase tracking-widest">
                Who I Am
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-2">
                <span className="gradient-text">{content.about.title}</span>
              </h2>
            </motion.div>

            {/* Bio */}
            <motion.div
              variants={itemVariants}
              className="text-text-muted text-lg leading-relaxed space-y-4"
            >
              {content.about.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </motion.div>

            {/* Instruments */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-3">
                Instruments & Tools
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.about.instruments.map((instrument: string, index: number) => (
                  <motion.span
                    key={instrument}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="px-4 py-2 bg-surface border border-border rounded-full text-sm font-medium hover:border-neon-purple/50 hover:shadow-neon-purple transition-all duration-300 cursor-default"
                  >
                    {instrument}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Genres */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-mono uppercase tracking-widest text-text-muted mb-3">
                Genres
              </h3>
              <div className="flex flex-wrap gap-2">
                {content.about.genres.map((genre: string, index: number) => (
                  <motion.span
                    key={genre}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={
                      isInView
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.8 }
                    }
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="px-4 py-2 bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 border border-neon-purple/20 rounded-full text-sm font-medium text-neon-cyan cursor-default"
                  >
                    {genre}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
