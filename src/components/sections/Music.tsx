'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useContent } from '@/lib/content-context'
import AudioPlayer from '@/components/AudioPlayer'
import { Music as MusicIcon } from 'lucide-react'

export default function Music() {
  const { content } = useContent()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: i * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  return (
    <section
      id="music"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-neon-magenta/5 rounded-full blur-[120px]" />

      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-neon-purple text-sm font-mono uppercase tracking-widest">
              Listen Now
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-2 mb-4">
              <span className="gradient-text">{content.music.title}</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {content.music.subtitle}
            </p>
          </motion.div>

          {/* Track Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {content.music.tracks.map((track: { id: number; title: string; description: string; audioSrc: string; duration: string }, index: number) => (
              <motion.div
                key={track.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="group relative bg-surface rounded-2xl border border-border overflow-hidden card-hover"
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/0 via-neon-cyan/0 to-neon-magenta/0 group-hover:from-neon-purple/10 group-hover:via-neon-cyan/5 group-hover:to-neon-magenta/10 transition-all duration-500" />

                {/* Track Artwork */}
                <div className="relative aspect-square overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
                    <MusicIcon className="w-20 h-20 text-white/20" />
                  </div>
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

                  {/* Track Number */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="font-mono text-sm text-neon-cyan">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Track Info */}
                <div className="relative p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-display font-bold text-white group-hover:text-neon-cyan transition-colors duration-300">
                      {track.title}
                    </h3>
                    <p className="text-text-muted text-sm mt-1 line-clamp-2">
                      {track.description}
                    </p>
                  </div>

                  {/* Audio Player */}
                  <AudioPlayer
                    src={track.audioSrc}
                    title={track.title}
                    onPlay={() => setCurrentlyPlaying(track.id)}
                    isCurrentlyPlaying={currentlyPlaying === track.id}
                  />

                  {/* Duration Badge */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-mono text-text-muted">
                      Duration
                    </span>
                    <span className="text-xs font-mono text-neon-purple">
                      {track.duration}
                    </span>
                  </div>
                </div>

                {/* Border Glow on Hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-neon-purple/30 transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* More Music CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-12"
          >
            <motion.a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3 bg-surface border border-border rounded-full text-text-muted hover:text-white hover:border-neon-purple/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View All Releases</span>
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
            </motion.a>
          </motion.div>
        </motion.div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
