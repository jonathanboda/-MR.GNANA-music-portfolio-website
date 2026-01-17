'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, MapPin, MessageSquare, User, Clock, RefreshCw } from 'lucide-react'

interface Booking {
  id: number
  name: string
  email: string
  phone: string | null
  event_type: string
  event_date: string
  venue: string
  message: string
  status: string
  created_at: string
}

interface BookingsEditorProps {
  onSaveSuccess: () => void
}

export default function BookingsEditor({ onSaveSuccess }: BookingsEditorProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/send-booking', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setBookings(data)
      }
    } catch (err) {
      console.error('Failed to fetch bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Booking Requests</h2>
          <p className="text-text-muted mt-1">View all booking requests from your website</p>
        </div>
        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-surface/30 border border-white/10 rounded-xl p-12 text-center">
          <Calendar className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No Bookings Yet</h3>
          <p className="text-text-muted">
            When someone submits a booking request on your website, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-surface/30 border border-white/10 rounded-xl p-6 hover:border-neon-purple/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{booking.name}</h3>
                    <p className="text-sm text-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(booking.created_at)}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'new'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-white/10 text-text-muted'
                }`}>
                  {booking.status === 'new' ? 'New' : booking.status}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-neon-cyan" />
                  <a href={`mailto:${booking.email}`} className="text-neon-cyan hover:underline">
                    {booking.email}
                  </a>
                </div>
                {booking.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-neon-cyan" />
                    <a href={`tel:${booking.phone}`} className="text-white hover:text-neon-cyan">
                      {booking.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-neon-purple" />
                  <span className="text-white">{booking.event_type} - {booking.event_date}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-neon-magenta" />
                  <span className="text-white">{booking.venue}</span>
                </div>
              </div>

              <div className="bg-surface/50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-text-muted mt-0.5" />
                  <p className="text-sm text-text-muted whitespace-pre-wrap">{booking.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
