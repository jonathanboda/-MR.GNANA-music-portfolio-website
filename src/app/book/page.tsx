'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Send, Calendar, User, Mail, Phone, MapPin, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function BookPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    venue: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const eventTypes = [
    'Concert',
    'Private Event',
    'Festival',
    'Corporate',
    'Worship Service',
    'Studio Session',
    'Other',
  ]

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setStatusMessage('Your booking request has been received! I\'ll get back to you soon.')
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          venue: '',
          message: '',
        })
      } else {
        setSubmitStatus('error')
        setStatusMessage(data.error || 'Failed to send booking request. Please try again.')
      }
    } catch {
      setSubmitStatus('error')
      setStatusMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <main className="relative min-h-screen py-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 -left-40 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 -right-40 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-magenta/5 rounded-full blur-[180px]" />

      <div className="container-custom relative z-10">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300 mb-12"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="text-neon-purple text-sm font-mono uppercase tracking-widest">
              Let&apos;s Work Together
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mt-2 mb-4">
              <span className="gradient-text">Book Now</span>
            </h1>
            <p className="text-text-muted text-lg">
              Fill out the form below and I&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8 md:p-10 space-y-6"
          >
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-white">
                <User className="w-4 h-4 text-neon-cyan" />
                Name <span className="text-neon-magenta">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all duration-300"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-white">
                <Mail className="w-4 h-4 text-neon-cyan" />
                Email <span className="text-neon-magenta">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all duration-300"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label htmlFor="phone" className="flex items-center gap-2 text-sm font-medium text-white">
                <Phone className="w-4 h-4 text-neon-cyan" />
                Phone <span className="text-text-muted text-xs">(optional)</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all duration-300"
              />
            </div>

            {/* Event Type Field */}
            <div className="space-y-2">
              <label htmlFor="eventType" className="flex items-center gap-2 text-sm font-medium text-white">
                <Calendar className="w-4 h-4 text-neon-cyan" />
                Event Type <span className="text-neon-magenta">*</span>
              </label>
              <select
                id="eventType"
                name="eventType"
                required
                value={formData.eventType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all duration-300 appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6,9 12,15 18,9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                  backgroundSize: '20px',
                }}
              >
                <option value="" disabled className="bg-surface text-text-muted">
                  Select event type
                </option>
                {eventTypes.map((type) => (
                  <option key={type} value={type} className="bg-surface text-white">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Event Date Field */}
            <div className="space-y-2">
              <label htmlFor="eventDate" className="flex items-center gap-2 text-sm font-medium text-white">
                <Calendar className="w-4 h-4 text-neon-cyan" />
                Event Date <span className="text-neon-magenta">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleChange}
                  onClick={(e) => (e.target as HTMLInputElement).showPicker?.()}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all duration-300 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:brightness-200"
                />
              </div>
            </div>

            {/* Venue/Location Field */}
            <div className="space-y-2">
              <label htmlFor="venue" className="flex items-center gap-2 text-sm font-medium text-white">
                <MapPin className="w-4 h-4 text-neon-cyan" />
                Venue / Location <span className="text-neon-magenta">*</span>
              </label>
              <input
                type="text"
                id="venue"
                name="venue"
                required
                value={formData.venue}
                onChange={handleChange}
                placeholder="Event venue and city"
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all duration-300"
              />
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label htmlFor="message" className="flex items-center gap-2 text-sm font-medium text-white">
                <MessageSquare className="w-4 h-4 text-neon-cyan" />
                Message / Details <span className="text-neon-magenta">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me more about your event, requirements, and any special requests..."
                className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-text-muted focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all duration-300 resize-none"
              />
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <p>{statusMessage}</p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{statusMessage}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan rounded-full font-semibold text-white btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={isSubmitting ? {} : { scale: 1.02 }}
              whileTap={isSubmitting ? {} : { scale: 0.98 }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Booking Request</span>
                </>
              )}
            </motion.button>

            <p className="text-center text-text-muted text-sm">
              Your booking details will be sent directly to my email.
            </p>
          </motion.form>
        </motion.div>
      </div>
    </main>
  )
}
