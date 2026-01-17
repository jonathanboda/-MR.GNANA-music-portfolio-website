'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, Calendar, Clock, MapPin } from 'lucide-react'
import FormField from '../components/FormField'
import SectionWrapper from '../components/SectionWrapper'
import type { Event } from '@/lib/supabase'
import { siteContent } from '@/data/content'

interface EventsEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaults = {
  title: siteContent.events.title,
  subtitle: siteContent.events.subtitle
}

export default function EventsEditor({ onSaveSuccess }: EventsEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [events, setEvents] = useState<Event[]>([])
  const [sectionData, setSectionData] = useState(defaults)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'upcoming' as 'upcoming' | 'past'
  })

  useEffect(() => {
    fetchContent()
    fetchEvents()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.events && Object.keys(data.events).length > 0) {
        setSectionData({
          title: data.events.title || defaults.title,
          subtitle: data.events.subtitle || defaults.subtitle
        })
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/events', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setEvents(data)
      }
    } catch (err) {
      console.error('Failed to fetch events:', err)
    }
  }

  const handleSaveSection = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ section: 'events', data: sectionData })
      })

      if (!res.ok) throw new Error('Failed to save')

      setSuccess(true)
      onSaveSuccess()
      setTimeout(() => setSuccess(false), 3000)
    } catch {
      setError('Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) {
      setError('Title and date are required')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newEvent)
      })

      if (!res.ok) throw new Error('Failed to add event')

      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        type: 'upcoming'
      })
      setShowAddForm(false)
      fetchEvents()
      onSaveSuccess()
    } catch {
      setError('Failed to add event')
    }
  }

  const handleUpdateEvent = async (event: Event) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/events/${event.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(event)
      })

      if (!res.ok) throw new Error('Failed to update event')

      setEditingEvent(null)
      fetchEvents()
      onSaveSuccess()
    } catch {
      setError('Failed to update event')
    }
  }

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete event')

      fetchEvents()
      onSaveSuccess()
    } catch {
      setError('Failed to delete event')
    }
  }

  const upcomingEvents = events.filter(e => e.type === 'upcoming')
  const pastEvents = events.filter(e => e.type === 'past')

  return (
    <SectionWrapper
      title="Events Section"
      description="Manage your events and shows"
      onSave={handleSaveSection}
      loading={loading}
      success={success}
      error={error}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <FormField
          label="Section Title"
          value={sectionData.title}
          onChange={(v) => setSectionData({ ...sectionData, title: v })}
          placeholder="Events"
        />
        <FormField
          label="Section Subtitle"
          value={sectionData.subtitle}
          onChange={(v) => setSectionData({ ...sectionData, subtitle: v })}
          placeholder="Join Us for Upcoming Events"
        />
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Events ({events.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {showAddForm && (
          <div className="bg-surface/50 border border-white/10 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Event</h4>
              <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Title"
                value={newEvent.title}
                onChange={(v) => setNewEvent({ ...newEvent, title: v })}
                required
              />
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-muted">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as 'upcoming' | 'past' })}
                  className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple/50"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>
            <FormField
              label="Description"
              type="textarea"
              rows={2}
              value={newEvent.description}
              onChange={(v) => setNewEvent({ ...newEvent, description: v })}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="Date"
                value={newEvent.date}
                onChange={(v) => setNewEvent({ ...newEvent, date: v })}
                placeholder="February 24, 2024"
                required
              />
              <FormField
                label="Time"
                value={newEvent.time}
                onChange={(v) => setNewEvent({ ...newEvent, time: v })}
                placeholder="8:00 AM - 2:00 PM"
              />
              <FormField
                label="Location"
                value={newEvent.location}
                onChange={(v) => setNewEvent({ ...newEvent, location: v })}
                placeholder="Chennai, India"
              />
            </div>
            <button
              onClick={handleAddEvent}
              className="w-full py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
            >
              Add Event
            </button>
          </div>
        )}

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-neon-cyan mb-3">Upcoming Events</h4>
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isEditing={editingEvent?.id === event.id}
                  editingEvent={editingEvent}
                  setEditingEvent={setEditingEvent}
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-text-muted mb-3">Past Events</h4>
            <div className="space-y-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  isEditing={editingEvent?.id === event.id}
                  editingEvent={editingEvent}
                  setEditingEvent={setEditingEvent}
                  onUpdate={handleUpdateEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 && !showAddForm && (
          <p className="text-center text-text-muted py-8">No events yet. Add your first event above.</p>
        )}
      </div>
    </SectionWrapper>
  )
}

function EventCard({
  event,
  isEditing,
  editingEvent,
  setEditingEvent,
  onUpdate,
  onDelete
}: {
  event: Event
  isEditing: boolean
  editingEvent: Event | null
  setEditingEvent: (e: Event | null) => void
  onUpdate: (e: Event) => void
  onDelete: (id: number) => void
}) {
  if (isEditing && editingEvent) {
    return (
      <div className="bg-surface/50 border border-white/10 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Title"
            value={editingEvent.title}
            onChange={(v) => setEditingEvent({ ...editingEvent, title: v })}
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-muted">Type</label>
            <select
              value={editingEvent.type}
              onChange={(e) => setEditingEvent({ ...editingEvent, type: e.target.value as 'upcoming' | 'past' })}
              className="w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-purple/50"
            >
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
            </select>
          </div>
        </div>
        <FormField
          label="Description"
          type="textarea"
          rows={2}
          value={editingEvent.description}
          onChange={(v) => setEditingEvent({ ...editingEvent, description: v })}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            label="Date"
            value={editingEvent.date}
            onChange={(v) => setEditingEvent({ ...editingEvent, date: v })}
          />
          <FormField
            label="Time"
            value={editingEvent.time}
            onChange={(v) => setEditingEvent({ ...editingEvent, time: v })}
          />
          <FormField
            label="Location"
            value={editingEvent.location}
            onChange={(v) => setEditingEvent({ ...editingEvent, location: v })}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onUpdate(editingEvent)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={() => setEditingEvent(null)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-surface/50 border border-white/10 rounded-lg p-4 flex items-center justify-between">
      <div className="flex-1">
        <h4 className="font-medium">{event.title}</h4>
        {event.description && <p className="text-sm text-text-muted mt-1">{event.description}</p>}
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {event.date}
          </span>
          {event.time && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {event.time}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className={`px-2 py-1 text-xs rounded ${
          event.type === 'upcoming'
            ? 'bg-neon-cyan/20 text-neon-cyan'
            : 'bg-white/10 text-text-muted'
        }`}>
          {event.type}
        </span>
        <button
          onClick={() => setEditingEvent(event)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => onDelete(event.id)}
          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
