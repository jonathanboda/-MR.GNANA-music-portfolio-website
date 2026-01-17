'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useContent } from '@/lib/content-context'
import { Mail, Instagram, Youtube, Pin } from 'lucide-react'

// Custom X (formerly Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const socialIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="w-6 h-6" />,
  youtube: <Youtube className="w-6 h-6" />,
  x: <XIcon className="w-6 h-6" />,
  twitter: <XIcon className="w-6 h-6" />,
  pinterest: <Pin className="w-6 h-6" />,
}

export default function Contact() {
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

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.3 + i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 w-[800px] h-[800px] bg-neon-purple/5 rounded-full blur-[200px] -translate-x-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-neon-magenta/5 rounded-full blur-[100px]" />

      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-4xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="text-neon-magenta text-sm font-mono uppercase tracking-widest">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-2 mb-4">
              <span className="gradient-text">{content.contact.title}</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {content.contact.subtitle}
            </p>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            variants={itemVariants}
            className="relative glass rounded-3xl p-8 md:p-12 overflow-hidden"
          >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-neon-purple/20 to-transparent rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-neon-cyan/20 to-transparent rounded-tr-full" />

            <div className="relative z-10 grid md:grid-cols-2 gap-12">
              {/* Left Side - Message */}
              <div>
                <p className="text-text-muted text-lg leading-relaxed mb-8">
                  {content.contact.message}
                </p>

                {/* Email */}
                <motion.a
                  href={`mailto:${content.contact.email}`}
                  className="group inline-flex items-center gap-4 p-4 bg-surface rounded-xl border border-border hover:border-neon-purple/50 transition-all duration-300"
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-text-muted">Email me at</p>
                    <p className="text-white font-medium group-hover:text-neon-cyan transition-colors">
                      {content.contact.email}
                    </p>
                  </div>
                </motion.a>
              </div>

              {/* Right Side - Socials */}
              <div>
                <h3 className="text-lg font-display font-semibold text-white mb-6">
                  Follow Me
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  {content.contact.socials.map((social: { name: string; url: string; icon: string }, index: number) => (
                    <motion.a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      custom={index}
                      variants={socialVariants}
                      initial="hidden"
                      animate={isInView ? 'visible' : 'hidden'}
                      className="group flex items-center gap-3 p-4 bg-surface rounded-xl border border-border hover:border-neon-cyan/50 transition-all duration-300"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-text-muted group-hover:text-neon-cyan group-hover:bg-neon-cyan/10 transition-all duration-300">
                        {socialIcons[social.icon]}
                      </div>
                      <span className="font-medium text-text-muted group-hover:text-white transition-colors">
                        {social.name}
                      </span>
                    </motion.a>
                  ))}
                </div>

                {/* Quick Response Note */}
                <motion.div
                  variants={itemVariants}
                  className="mt-8 p-4 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-cyan/10 border border-neon-purple/20"
                >
                  <p className="text-sm text-text-muted">
                    <span className="text-neon-cyan font-medium">
                      Quick Response
                    </span>{' '}
                    — I typically reply within 24 hours. For urgent bookings,
                    please mention it in the subject line.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Decorative Text */}
          <motion.div
            variants={itemVariants}
            className="text-center mt-16"
          >
            <p className="text-6xl md:text-8xl font-display font-bold text-surface select-none">
              LET&apos;S CREATE
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
