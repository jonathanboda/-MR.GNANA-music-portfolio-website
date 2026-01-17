'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, Instagram, Youtube, PinIcon } from 'lucide-react'
import FormField from '../components/FormField'
import SectionWrapper from '../components/SectionWrapper'
import type { SocialLink } from '@/lib/supabase'
import { siteContent } from '@/data/content'

interface ContactEditorProps {
  onSaveSuccess: () => void
}

// Custom X (formerly Twitter) icon component
const XSocialIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const iconOptions = [
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'x', label: 'X', icon: XSocialIcon },
  { value: 'pinterest', label: 'Pinterest', icon: PinIcon },
]

// Static defaults from content.ts
const defaults = {
  title: siteContent.contact.title,
  subtitle: siteContent.contact.subtitle,
  message: siteContent.contact.message,
  email: siteContent.contact.email
}

// Convert static socials to SocialLink type for initial display
const defaultSocials: SocialLink[] = siteContent.contact.socials.map((social, index) => ({
  id: index + 1,
  platform: social.name,
  url: social.url,
  icon: social.icon,
  order_index: index,
  is_active: true
}))

export default function ContactEditor({ onSaveSuccess }: ContactEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [socials, setSocials] = useState<SocialLink[]>(defaultSocials)
  const [formData, setFormData] = useState(defaults)
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSocial, setNewSocial] = useState({
    platform: '',
    url: '',
    icon: 'instagram'
  })

  useEffect(() => {
    fetchContent()
    fetchSocials()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.contact && Object.keys(data.contact).length > 0) {
        setFormData({
          title: data.contact.title || defaults.title,
          subtitle: data.contact.subtitle || defaults.subtitle,
          message: data.contact.message || defaults.message,
          email: data.contact.email || defaults.email
        })
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const fetchSocials = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/socials', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setSocials(data)
      }
      // If no data from DB, keep the default socials
    } catch (err) {
      console.error('Failed to fetch socials:', err)
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
        body: JSON.stringify({ section: 'contact', data: formData })
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

  const handleAddSocial = async () => {
    if (!newSocial.platform || !newSocial.url) {
      setError('Platform and URL are required')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/socials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newSocial,
          order_index: socials.length
        })
      })

      if (!res.ok) throw new Error('Failed to add social link')

      setNewSocial({ platform: '', url: '', icon: 'instagram' })
      setShowAddForm(false)
      fetchSocials()
      onSaveSuccess()
    } catch {
      setError('Failed to add social link')
    }
  }

  const handleUpdateSocial = async (social: SocialLink) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/socials/${social.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(social)
      })

      if (!res.ok) throw new Error('Failed to update social link')

      setEditingSocial(null)
      fetchSocials()
      onSaveSuccess()
    } catch {
      setError('Failed to update social link')
    }
  }

  const handleDeleteSocial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this social link?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/socials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete social link')

      fetchSocials()
      onSaveSuccess()
    } catch {
      setError('Failed to delete social link')
    }
  }

  const getIconComponent = (iconName: string) => {
    // Handle legacy 'twitter' values
    const normalizedName = iconName === 'twitter' ? 'x' : iconName
    const option = iconOptions.find(o => o.value === normalizedName)
    return option ? option.icon : Instagram
  }

  return (
    <SectionWrapper
      title="Contact Section"
      description="Manage contact information and social links"
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
          placeholder="Let's Connect"
        />
        <FormField
          label="Section Subtitle"
          value={formData.subtitle}
          onChange={(v) => setFormData({ ...formData, subtitle: v })}
          placeholder="Ready to collaborate or book a show?"
        />
      </div>
      <FormField
        label="Contact Message"
        type="textarea"
        rows={4}
        value={formData.message}
        onChange={(v) => setFormData({ ...formData, message: v })}
        placeholder="Your message here..."
      />
      <FormField
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(v) => setFormData({ ...formData, email: v })}
        placeholder="your@email.com"
      />

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Social Links ({socials.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Social Link
          </button>
        </div>

        {showAddForm && (
          <div className="bg-surface/50 border border-white/10 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Social Link</h4>
              <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FormField
              label="Platform Name"
              value={newSocial.platform}
              onChange={(v) => setNewSocial({ ...newSocial, platform: v })}
              placeholder="Instagram"
              required
            />
            <FormField
              label="URL"
              type="url"
              value={newSocial.url}
              onChange={(v) => setNewSocial({ ...newSocial, url: v })}
              placeholder="https://instagram.com/..."
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-muted">Icon</label>
              <div className="flex flex-wrap gap-2">
                {iconOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewSocial({ ...newSocial, icon: option.value })}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                        newSocial.icon === option.value
                          ? 'bg-neon-purple/20 border-neon-purple/50 text-neon-purple'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <button
              onClick={handleAddSocial}
              className="w-full py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
            >
              Add Social Link
            </button>
          </div>
        )}

        <div className="space-y-3">
          {socials.map((social) => {
            const Icon = getIconComponent(social.icon)
            return (
              <div
                key={social.id}
                className="bg-surface/50 border border-white/10 rounded-lg p-4"
              >
                {editingSocial?.id === social.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Platform"
                        value={editingSocial.platform}
                        onChange={(v) => setEditingSocial({ ...editingSocial, platform: v })}
                      />
                      <FormField
                        label="URL"
                        type="url"
                        value={editingSocial.url}
                        onChange={(v) => setEditingSocial({ ...editingSocial, url: v })}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateSocial(editingSocial)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingSocial(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neon-purple" />
                      </div>
                      <div>
                        <h4 className="font-medium">{social.platform}</h4>
                        <p className="text-sm text-text-muted truncate max-w-xs">{social.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingSocial(social)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSocial(social.id)}
                        className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {socials.length === 0 && !showAddForm && (
            <p className="text-center text-text-muted py-8">No social links yet. Add your first link above.</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
