'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import FormField from '../components/FormField'
import AudioUploader from '../components/AudioUploader'
import SectionWrapper from '../components/SectionWrapper'
import type { Track } from '@/lib/supabase'
import { siteContent } from '@/data/content'

interface MusicEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaults = {
  title: siteContent.music.title,
  subtitle: siteContent.music.subtitle
}

export default function MusicEditor({ onSaveSuccess }: MusicEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [tracks, setTracks] = useState<Track[]>([])
  const [sectionData, setSectionData] = useState(defaults)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTrack, setNewTrack] = useState({
    title: '',
    description: '',
    audio_src: '',
    duration: ''
  })

  useEffect(() => {
    fetchContent()
    fetchTracks()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.music && Object.keys(data.music).length > 0) {
        setSectionData({
          title: data.music.title || defaults.title,
          subtitle: data.music.subtitle || defaults.subtitle
        })
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const fetchTracks = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/tracks', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setTracks(data)
      }
    } catch (err) {
      console.error('Failed to fetch tracks:', err)
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
        body: JSON.stringify({ section: 'music', data: sectionData })
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

  const handleAddTrack = async () => {
    if (!newTrack.title || !newTrack.audio_src) {
      setError('Title and audio file are required')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/tracks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newTrack,
          order_index: tracks.length
        })
      })

      if (!res.ok) throw new Error('Failed to add track')

      setNewTrack({ title: '', description: '', audio_src: '', duration: '' })
      setShowAddForm(false)
      fetchTracks()
      onSaveSuccess()
    } catch {
      setError('Failed to add track')
    }
  }

  const handleUpdateTrack = async (track: Track) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/tracks/${track.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(track)
      })

      if (!res.ok) throw new Error('Failed to update track')

      setEditingTrack(null)
      fetchTracks()
      onSaveSuccess()
    } catch {
      setError('Failed to update track')
    }
  }

  const handleDeleteTrack = async (id: number) => {
    if (!confirm('Are you sure you want to delete this track?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/tracks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete track')

      fetchTracks()
      onSaveSuccess()
    } catch {
      setError('Failed to delete track')
    }
  }

  return (
    <SectionWrapper
      title="Music Section"
      description="Manage your music tracks"
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
          placeholder="My Music"
        />
        <FormField
          label="Section Subtitle"
          value={sectionData.subtitle}
          onChange={(v) => setSectionData({ ...sectionData, subtitle: v })}
          placeholder="Listen to my latest productions"
        />
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Tracks ({tracks.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Track
          </button>
        </div>

        {showAddForm && (
          <div className="bg-surface/50 border border-white/10 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Track</h4>
              <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Title"
                value={newTrack.title}
                onChange={(v) => setNewTrack({ ...newTrack, title: v })}
                required
              />
              <FormField
                label="Duration"
                value={newTrack.duration}
                onChange={(v) => setNewTrack({ ...newTrack, duration: v })}
                placeholder="3:45"
              />
            </div>
            <FormField
              label="Description"
              type="textarea"
              rows={2}
              value={newTrack.description}
              onChange={(v) => setNewTrack({ ...newTrack, description: v })}
            />
            <AudioUploader
              label="Audio File"
              value={newTrack.audio_src}
              onChange={(v) => setNewTrack({ ...newTrack, audio_src: v })}
            />
            <button
              onClick={handleAddTrack}
              className="w-full py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
            >
              Add Track
            </button>
          </div>
        )}

        <div className="space-y-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="bg-surface/50 border border-white/10 rounded-lg p-4"
            >
              {editingTrack?.id === track.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Title"
                      value={editingTrack.title}
                      onChange={(v) => setEditingTrack({ ...editingTrack, title: v })}
                    />
                    <FormField
                      label="Duration"
                      value={editingTrack.duration}
                      onChange={(v) => setEditingTrack({ ...editingTrack, duration: v })}
                    />
                  </div>
                  <FormField
                    label="Description"
                    type="textarea"
                    rows={2}
                    value={editingTrack.description}
                    onChange={(v) => setEditingTrack({ ...editingTrack, description: v })}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateTrack(editingTrack)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingTrack(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{track.title}</h4>
                    <p className="text-sm text-text-muted">{track.description}</p>
                    {track.duration && (
                      <span className="text-xs text-neon-purple">{track.duration}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTrack(track)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrack(track.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {tracks.length === 0 && !showAddForm && (
            <p className="text-center text-text-muted py-8">No tracks yet. Add your first track above.</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
