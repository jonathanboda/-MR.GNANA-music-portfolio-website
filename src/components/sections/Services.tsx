'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useContent } from '@/lib/content-context'
import { Music, Sliders, AudioWaveform } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  music: <Music className="w-8 h-8" />,
  sliders: <Sliders className="w-8 h-8" />,
  waveform: <AudioWaveform className="w-8 h-8" />,
}

export default function Services() {
  const { content } = useContent()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
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

  const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: i * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  const glowColors = [
    'from-neon-purple to-neon-cyan',
    'from-neon-cyan to-neon-magenta',
    'from-neon-magenta to-neon-purple',
  ]

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-neon-purple/5 rounded-full blur-[150px] -translate-y-1/2" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px]" />

      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-neon-magenta text-sm font-mono uppercase tracking-widest">
              What I Offer
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-2 mb-4">
              <span className="gradient-text">{content.services.title}</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {content.services.subtitle}
            </p>
          </motion.div>

          {/* Service Cards */}
          <div
            className="grid md:grid-cols-3 gap-6 lg:gap-8"
            style={{ perspective: '1000px' }}
          >
            {content.services.items.map((service: { id: number; title: string; description: string; icon: string }, index: number) => (
              <motion.div
                key={service.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="group relative"
              >
                <div className="relative h-full bg-surface rounded-2xl border border-border p-8 overflow-hidden transition-all duration-500 group-hover:border-transparent">
                  {/* Animated Border Gradient */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${glowColors[index]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    style={{ padding: '1px' }}
                  >
                    <div className="absolute inset-[1px] bg-surface rounded-2xl" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${glowColors[index]} p-[1px] mb-6`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <div className="w-full h-full bg-surface rounded-2xl flex items-center justify-center text-white">
                        {iconMap[service.icon]}
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-display font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-text-muted leading-relaxed">
                      {service.description}
                    </p>

                    {/* Learn More Link */}
                    <motion.div
                      className="mt-6 flex items-center gap-2 text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="text-sm font-medium">Learn More</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Background Glow */}
                  <div
                    className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${glowColors[index]} opacity-0 group-hover:opacity-20 blur-3xl transition-opacity duration-500`}
                  />
                </div>

                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
                  <span className="font-mono text-xs text-neon-cyan">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Section */}
          <motion.div
            variants={itemVariants}
            className="mt-16 text-center"
          >
            <div className="glass rounded-2xl p-8 md:p-12 max-w-3xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                Need a Custom Solution?
              </h3>
              <p className="text-text-muted mb-6">
                Every project is unique. Let&apos;s discuss your specific requirements
                and create something extraordinary together.
              </p>
              <motion.a
                href="#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full font-semibold text-white btn-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Get in Touch</span>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
