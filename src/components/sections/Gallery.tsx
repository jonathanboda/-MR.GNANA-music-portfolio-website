'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useContent } from '@/lib/content-context'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Gallery() {
  const { content } = useContent()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (selectedImage === null) return
    const totalImages = content.gallery.images.length
    if (direction === 'prev') {
      setSelectedImage(
        selectedImage === 0 ? totalImages - 1 : selectedImage - 1
      )
    } else {
      setSelectedImage(
        selectedImage === totalImages - 1 ? 0 : selectedImage + 1
      )
    }
  }

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-magenta/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[120px]" />

      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              <span className="gradient-text">{content.gallery.title}</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {content.gallery.subtitle}
            </p>
          </motion.div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {content.gallery.images.map((image: { id: number; src: string; alt: string }, index: number) => (
              <motion.div
                key={image.id}
                custom={index}
                variants={imageVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className={`group relative overflow-hidden rounded-2xl cursor-pointer ${index === 0 || index === 5
                    ? 'md:col-span-2 md:row-span-2'
                    : ''
                  }`}
                onClick={() => openLightbox(index)}
              >
                <div
                  className={`relative w-full ${index === 0 || index === 5
                      ? 'aspect-square md:aspect-[4/3]'
                      : 'aspect-square'
                    }`}
                >
                  {/* Actual Image */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Content */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div>
                      <p className="text-white font-medium">{image.alt}</p>
                      <p className="text-neon-cyan text-sm">Click to expand</p>
                    </div>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-neon-purple/50 transition-all duration-500" />
                </div>

                {/* Zoom Effect */}
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-white hover:border-neon-purple/50 transition-colors z-10"
              onClick={closeLightbox}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Navigation Buttons */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-4 w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-white hover:border-neon-cyan/50 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('prev')
              }}
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-4 w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-white hover:border-neon-cyan/50 transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation()
                navigateImage('next')
              }}
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>

            {/* Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-auto h-auto max-h-[75vh]">
                <Image
                  src={content.gallery.images[selectedImage].src}
                  alt={content.gallery.images[selectedImage].alt}
                  width={800}
                  height={600}
                  className="max-h-[75vh] w-auto h-auto object-contain rounded-2xl"
                  sizes="100vw"
                />
              </div>
              {/* Image Caption */}
              <div className="w-full bg-background/80 p-4 text-center">
                <p className="text-white text-lg font-medium">
                  {content.gallery.images[selectedImage].alt}
                </p>
                <p className="text-text-muted mt-1 text-sm">
                  Image {selectedImage + 1} of{' '}
                  {content.gallery.images.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
