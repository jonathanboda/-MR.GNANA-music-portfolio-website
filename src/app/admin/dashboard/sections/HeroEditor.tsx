'use client'

import { useState, useEffect } from 'react'
import FormField from '../components/FormField'
import ImageUploader from '../components/ImageUploader'
import SectionWrapper from '../components/SectionWrapper'
import { siteContent } from '@/data/content'

interface HeroEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaults = {
  name: siteContent.hero.name,
  tagline: siteContent.hero.tagline,
  cta_listen: siteContent.hero.cta.listen,
  cta_book: siteContent.hero.cta.book,
  background_image: '/images/hero section.JPG'
}

export default function HeroEditor({ onSaveSuccess }: HeroEditorProps) {
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
      if (data.hero && Object.keys(data.hero).length > 0) {
        setFormData({
          name: data.hero.name || defaults.name,
          tagline: data.hero.tagline || defaults.tagline,
          cta_listen: data.hero.cta_listen || defaults.cta_listen,
          cta_book: data.hero.cta_book || defaults.cta_book,
          background_image: data.hero.background_image || defaults.background_image
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
        body: JSON.stringify({ section: 'hero', data: formData })
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || `Failed to save (${res.status})`)
      }

      setSuccess(true)
      onSaveSuccess()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  return (
    <SectionWrapper
      title="Hero Section"
      description="Edit the main hero banner content"
      onSave={handleSave}
      loading={loading}
      success={success}
      error={error}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Name"
          value={formData.name}
          onChange={(v) => setFormData({ ...formData, name: v })}
          placeholder="MR.GNANA"
        />
        <FormField
          label="Tagline"
          value={formData.tagline}
          onChange={(v) => setFormData({ ...formData, tagline: v })}
          placeholder="Pads • Sound Engineering • Live & Studio"
        />
        <FormField
          label="Listen Button Text"
          value={formData.cta_listen}
          onChange={(v) => setFormData({ ...formData, cta_listen: v })}
          placeholder="Listen"
        />
        <FormField
          label="Book Button Text"
          value={formData.cta_book}
          onChange={(v) => setFormData({ ...formData, cta_book: v })}
          placeholder="Book Now"
        />
      </div>
      <ImageUploader
        label="Background Image"
        value={formData.background_image}
        onChange={(v) => setFormData({ ...formData, background_image: v })}
      />
    </SectionWrapper>
  )
}
