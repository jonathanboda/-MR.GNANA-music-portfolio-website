'use client'

import { useState, useEffect } from 'react'
import FormField from '../components/FormField'
import SectionWrapper from '../components/SectionWrapper'
import { siteContent } from '@/data/content'

interface FooterEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaults = {
  copyright: siteContent.footer.copyright,
  tagline: siteContent.footer.tagline
}

export default function FooterEditor({ onSaveSuccess }: FooterEditorProps) {
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
      if (data.footer && Object.keys(data.footer).length > 0) {
        setFormData({
          copyright: data.footer.copyright || defaults.copyright,
          tagline: data.footer.tagline || defaults.tagline
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
        body: JSON.stringify({ section: 'footer', data: formData })
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
      title="Footer Section"
      description="Manage the footer content"
      onSave={handleSave}
      loading={loading}
      success={success}
      error={error}
    >
      <FormField
        label="Copyright Text"
        value={formData.copyright}
        onChange={(v) => setFormData({ ...formData, copyright: v })}
        placeholder="© 2025 Mr.Gnana. All rights reserved."
      />
      <FormField
        label="Tagline"
        value={formData.tagline}
        onChange={(v) => setFormData({ ...formData, tagline: v })}
        placeholder="Crafting sonic experiences"
      />
    </SectionWrapper>
  )
}
