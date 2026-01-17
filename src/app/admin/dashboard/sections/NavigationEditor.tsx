'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, GripVertical } from 'lucide-react'
import FormField from '../components/FormField'
import SectionWrapper from '../components/SectionWrapper'
import type { NavLink } from '@/lib/supabase'
import { siteContent } from '@/data/content'

interface NavigationEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaultLogoText = siteContent.hero.name // Use the name from hero as logo

// Convert static nav links to NavLink type for initial display
const defaultNavLinks: NavLink[] = siteContent.nav.links.map((link, index) => ({
  id: index + 1,
  label: link.label,
  href: link.href,
  order_index: index,
  is_active: true
}))

export default function NavigationEditor({ onSaveSuccess }: NavigationEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [navLinks, setNavLinks] = useState<NavLink[]>(defaultNavLinks)
  const [logoText, setLogoText] = useState(defaultLogoText)
  const [editingLink, setEditingLink] = useState<NavLink | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLink, setNewLink] = useState({
    label: '',
    href: ''
  })

  useEffect(() => {
    fetchContent()
    fetchNavLinks()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.nav && Object.keys(data.nav).length > 0) {
        setLogoText(data.nav.logo_text || defaultLogoText)
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const fetchNavLinks = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/nav-links', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setNavLinks(data)
      }
      // If no data from DB, keep the default nav links
    } catch (err) {
      console.error('Failed to fetch nav links:', err)
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
        body: JSON.stringify({ section: 'nav', data: { logo_text: logoText } })
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

  const handleAddLink = async () => {
    if (!newLink.label || !newLink.href) {
      setError('Label and href are required')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/nav-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newLink,
          order_index: navLinks.length
        })
      })

      if (!res.ok) throw new Error('Failed to add link')

      setNewLink({ label: '', href: '' })
      setShowAddForm(false)
      fetchNavLinks()
      onSaveSuccess()
    } catch {
      setError('Failed to add link')
    }
  }

  const handleUpdateLink = async (link: NavLink) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/nav-links/${link.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(link)
      })

      if (!res.ok) throw new Error('Failed to update link')

      setEditingLink(null)
      fetchNavLinks()
      onSaveSuccess()
    } catch {
      setError('Failed to update link')
    }
  }

  const handleDeleteLink = async (id: number) => {
    if (!confirm('Are you sure you want to delete this navigation link?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/nav-links/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete link')

      fetchNavLinks()
      onSaveSuccess()
    } catch {
      setError('Failed to delete link')
    }
  }

  return (
    <SectionWrapper
      title="Navigation"
      description="Manage the navigation menu and logo"
      onSave={handleSave}
      loading={loading}
      success={success}
      error={error}
    >
      <FormField
        label="Logo Text"
        value={logoText}
        onChange={setLogoText}
        placeholder="MR.GNANA"
      />

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Navigation Links ({navLinks.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Link
          </button>
        </div>

        {showAddForm && (
          <div className="bg-surface/50 border border-white/10 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Navigation Link</h4>
              <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Label"
                value={newLink.label}
                onChange={(v) => setNewLink({ ...newLink, label: v })}
                placeholder="About"
                required
              />
              <FormField
                label="Link (href)"
                value={newLink.href}
                onChange={(v) => setNewLink({ ...newLink, href: v })}
                placeholder="#about"
                required
              />
            </div>
            <button
              onClick={handleAddLink}
              className="w-full py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
            >
              Add Link
            </button>
          </div>
        )}

        <div className="space-y-2">
          {navLinks.map((link, index) => (
            <div
              key={link.id}
              className="bg-surface/50 border border-white/10 rounded-lg p-4"
            >
              {editingLink?.id === link.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      label="Label"
                      value={editingLink.label}
                      onChange={(v) => setEditingLink({ ...editingLink, label: v })}
                    />
                    <FormField
                      label="Link (href)"
                      value={editingLink.href}
                      onChange={(v) => setEditingLink({ ...editingLink, href: v })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateLink(editingLink)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingLink(null)}
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
                    <div className="text-text-muted">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <span className="text-sm text-text-muted">{index + 1}.</span>
                    <div>
                      <span className="font-medium">{link.label}</span>
                      <span className="text-text-muted mx-2">→</span>
                      <span className="text-neon-cyan">{link.href}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLink(link)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {navLinks.length === 0 && !showAddForm && (
            <p className="text-center text-text-muted py-8">No navigation links yet. Add your first link above.</p>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
