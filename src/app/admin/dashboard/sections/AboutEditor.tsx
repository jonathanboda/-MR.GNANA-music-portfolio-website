'use client'

import { useState, useEffect } from 'react'
import FormField from '../components/FormField'
import ImageUploader from '../components/ImageUploader'
import ArrayEditor from '../components/ArrayEditor'
import SectionWrapper from '../components/SectionWrapper'
import { siteContent } from '@/data/content'

interface AboutEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaults = {
  title: siteContent.about.title,
  badge: siteContent.about.badge,
  bio: siteContent.about.bio,
  instruments: siteContent.about.instruments,
  genres: siteContent.about.genres,
  profile_image: '/images/7.JPG'
}

export default function AboutEditor({ onSaveSuccess }: AboutEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState(defaults)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.about && Object.keys(data.about).length > 0) {
        setFormData({
          title: data.about.title || defaults.title,
          badge: data.about.badge || defaults.badge,
          bio: data.about.bio || defaults.bio,
          instruments: data.about.instruments ? JSON.parse(data.about.instruments) : defaults.instruments,
          genres: data.about.genres ? JSON.parse(data.about.genres) : defaults.genres,
          profile_image: data.about.profile_image || defaults.profile_image
        })
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const handleSave = async () => {
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
        body: JSON.stringify({
          section: 'about',
          data: {
            title: formData.title,
            badge: formData.badge,
            bio: formData.bio,
            instruments: JSON.stringify(formData.instruments),
            genres: JSON.stringify(formData.genres),
            profile_image: formData.profile_image
          }
        })
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

  return (
    <SectionWrapper
      title="About Section"
      description="Edit your bio and profile information"
      onSave={handleSave}
      loading={loading}
      success={success}
      error={error}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Section Title"
          value={formData.title}
          onChange={(v) => setFormData({ ...formData, title: v })}
          placeholder="About Me"
        />
        <FormField
          label="Badge Text"
          value={formData.badge}
          onChange={(v) => setFormData({ ...formData, badge: v })}
          placeholder="Sound Engineer"
        />
      </div>
      <FormField
        label="Biography"
        type="textarea"
        rows={6}
        value={formData.bio}
        onChange={(v) => setFormData({ ...formData, bio: v })}
        placeholder="Write your bio here..."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ArrayEditor
          label="Instruments"
          items={formData.instruments}
          onChange={(v) => setFormData({ ...formData, instruments: v })}
          placeholder="Add instrument..."
        />
        <ArrayEditor
          label="Genres"
          items={formData.genres}
          onChange={(v) => setFormData({ ...formData, genres: v })}
          placeholder="Add genre..."
        />
      </div>
      <ImageUploader
        label="Profile Image"
        value={formData.profile_image}
        onChange={(v) => setFormData({ ...formData, profile_image: v })}
      />
    </SectionWrapper>
  )
}
