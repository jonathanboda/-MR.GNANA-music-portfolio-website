'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useContent } from '@/lib/content-context'
import { X, Play, Youtube } from 'lucide-react'

export default function Videos() {
  const { content } = useContent()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [selectedVideo, setSelectedVideo] = useState<number | null>(null)

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

  const videoVariants = {
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
    setSelectedVideo(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedVideo(null)
    document.body.style.overflow = 'auto'
  }

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  // Get embed URL based on platform
  const getEmbedUrl = (platform: string, videoId: string) => {
    if (platform === 'youtube') {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`
    } else if (platform === 'instagram') {
      return `https://www.instagram.com/p/${videoId}/embed`
    }
    return ''
  }

  // If no videos, don't render the section
  if (!content.videos?.videos || content.videos.videos.length === 0) {
    return null
  }

  return (
    <section
      id="videos"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-purple/5 rounded-full blur-[120px]" />

      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              <span className="gradient-text">{content.videos.title}</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {content.videos.subtitle}
            </p>
          </motion.div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.videos.videos.map((video: { id: number; title: string; description: string; platform: string; video_id: string; thumbnail?: string }, index: number) => (
              <motion.div
                key={video.id}
                custom={index}
                variants={videoVariants}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                className="group relative overflow-hidden rounded-2xl cursor-pointer bg-surface border border-border"
                onClick={() => openLightbox(index)}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-surface to-black">
                  {/* Fallback play icon - always visible behind */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-red-600/80 flex items-center justify-center">
                      <Play className="w-10 h-10 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {video.platform === 'youtube' && video.video_id ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={video.thumbnail || `https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.opacity = '0'
                      }}
                    />
                  ) : video.platform === 'instagram' ? (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">IG</span>
                    </div>
                  ) : null}

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>

                  {/* Platform Badge */}
                  <div className="absolute top-3 right-3">
                    {video.platform === 'youtube' ? (
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                        <Youtube className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">IG</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4">
                  <h3 className="text-white font-medium line-clamp-1 group-hover:text-neon-cyan transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-text-muted text-sm mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>

                {/* Border Glow on Hover */}
                <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-neon-cyan/50 transition-all duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedVideo !== null && content.videos.videos[selectedVideo] && (
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

            {/* Video Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={getEmbedUrl(
                  content.videos.videos[selectedVideo].platform,
                  content.videos.videos[selectedVideo].video_id
                )}
                title={content.videos.videos[selectedVideo].title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>

            {/* Video Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
            >
              <p className="text-white text-lg font-medium">
                {content.videos.videos[selectedVideo].title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 section-divider" />
    </section>
  )
}
