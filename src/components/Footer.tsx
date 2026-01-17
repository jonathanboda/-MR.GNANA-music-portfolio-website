'use client'

import { motion } from 'framer-motion'
import { useContent } from '@/lib/content-context'

export default function Footer() {
  const { content } = useContent()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-12 border-t border-border">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/5 via-transparent to-transparent pointer-events-none" />

      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div>
            <p className="text-text-muted text-sm">
              {content.footer.copyright.replace('2025', String(currentYear))}
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6">
            {content.nav.links.map((link: { label: string; href: string }) => (
              <motion.a
                key={link.href}
                href={link.href}
                className="text-text-muted hover:text-white text-sm transition-colors duration-300"
                whileHover={{ y: -2 }}
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

        </div>

        {/* Back to Top */}
        <motion.a
          href="#"
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-white hover:border-neon-purple/50 hover:shadow-neon-purple transition-all duration-300 z-40"
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
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
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </motion.a>
      </div>
    </footer>
  )
}
