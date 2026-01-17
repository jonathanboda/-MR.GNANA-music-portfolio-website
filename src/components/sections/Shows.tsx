'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useContent } from '@/lib/content-context'
import { supabase, Event } from '@/lib/supabase'
import { MapPin, Clock, Calendar, Sparkles } from 'lucide-react'

export default function Events() {
  const { content } = useContent()
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false })

      if (error) {
        console.error('Supabase error:', error)
        // Fallback to static content
        setUpcomingEvents(content.events.upcomingEvents as unknown as Event[])
        setPastEvents(content.events.pastEvents as unknown as Event[])
      } else {
        setUpcomingEvents(data?.filter(e => e.type === 'upcoming') || [])
        setPastEvents(data?.filter(e => e.type === 'past') || [])
      }
    } catch (err) {
      console.error('Error fetching events:', err)
      // Fallback to static content
      setUpcomingEvents(content.events.upcomingEvents as unknown as Event[])
      setPastEvents(content.events.pastEvents as unknown as Event[])
    } finally {
      setLoading(false)
    }
  }

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
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  // Helper function to extract day and month from date string
  const parseDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const day = date.getDate()
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    return { day: isNaN(day) ? dateStr.split(' ')[1] || '1' : day, month: isNaN(day) ? dateStr.split(' ')[0]?.substring(0,3).toUpperCase() || 'JAN' : month }
  }

  return (
    <section
      id="events"
      ref={sectionRef}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px]" />

      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-2 mb-4">
              <span className="gradient-text">{content.events.title}</span>
            </h2>
            <p className="text-text-muted text-lg max-w-2xl mx-auto">
              {content.events.subtitle}
            </p>
          </motion.div>

          {/* Coming Soon Badge */}
          <motion.div variants={itemVariants} className="flex justify-start mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full text-sm">
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span className="text-text-muted">Coming Soon</span>
            </span>
          </motion.div>

          {/* Upcoming Events Section */}
          <motion.div variants={itemVariants} className="mb-16">
            <h3 className="text-2xl font-display font-bold text-white mb-6">
              Upcoming Events
            </h3>

            {loading ? (
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <p className="text-text-muted">Loading events...</p>
              </div>
            ) : upcomingEvents.length === 0 ? (
              /* Empty State */
              <div className="bg-surface border border-border rounded-2xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-text-muted" />
                </div>
                <p className="text-text-muted text-lg mb-2">No upcoming events at this time</p>
                <p className="text-text-muted/60 text-sm">Check back soon for upcoming events!</p>
              </div>
            ) : (
              /* Upcoming Events Grid */
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => {
                  const { day, month } = parseDate(event.date)
                  return (
                    <motion.div
                      key={event.id}
                      custom={index}
                      variants={cardVariants}
                      className="group flex bg-surface border border-border rounded-xl overflow-hidden hover:border-neon-purple/30 transition-all duration-300"
                    >
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-20 bg-white/5 flex flex-col items-center justify-center p-4">
                        <span className="text-3xl font-bold text-neon-cyan">{day}</span>
                        <span className="text-xs font-mono text-text-muted">{month}</span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 p-4">
                        <h4 className="font-display font-semibold text-white mb-1 group-hover:text-neon-cyan transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-text-muted text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex flex-col gap-1 text-xs text-text-muted">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{event.date}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>

          {/* Past Events Section */}
          {!loading && pastEvents.length > 0 && (
            <motion.div variants={itemVariants}>
              <h3 className="text-2xl font-display font-bold text-white mb-6">
                Past Events
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {pastEvents.map((event, index) => {
                  const { day, month } = parseDate(event.date)
                  return (
                    <motion.div
                      key={event.id}
                      custom={index}
                      variants={cardVariants}
                      className="group flex bg-surface border border-border rounded-xl overflow-hidden hover:border-neon-cyan/30 transition-all duration-300"
                    >
                      {/* Date Badge */}
                      <div className="flex-shrink-0 w-20 bg-neon-purple/10 flex flex-col items-center justify-center p-4">
                        <span className="text-3xl font-bold text-neon-purple">{day}</span>
                        <span className="text-xs font-mono text-neon-purple/70">{month}</span>
                      </div>

                      {/* Event Details */}
                      <div className="flex-1 p-4">
                        <h4 className="font-display font-semibold text-white mb-1 group-hover:text-neon-purple transition-colors">
                          {event.title}
                        </h4>
                        <p className="text-text-muted text-sm mb-3 line-clamp-2">
                          {event.description}
                        </p>
                        <div className="flex flex-col gap-1 text-xs text-text-muted">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            <span>{event.date}</span>
                          </div>
                          {event.time && (
                            <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              <span>{event.time}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3 h-3" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Book CTA */}
          <motion.div variants={itemVariants} className="text-center mt-16">
            <p className="text-text-muted mb-4">
              Want to book Mr.Gnana for your event?
            </p>
            <motion.a
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full font-semibold text-white btn-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Contact for Booking</span>
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
