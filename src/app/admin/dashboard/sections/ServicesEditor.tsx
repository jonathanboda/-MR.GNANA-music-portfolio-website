'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, Music, Sliders, AudioWaveform } from 'lucide-react'
import FormField from '../components/FormField'
import SectionWrapper from '../components/SectionWrapper'
import type { Service } from '@/lib/supabase'
import { siteContent } from '@/data/content'

interface ServicesEditorProps {
  onSaveSuccess: () => void
}

const iconOptions = [
  { value: 'music', label: 'Music', icon: Music },
  { value: 'sliders', label: 'Sliders', icon: Sliders },
  { value: 'waveform', label: 'Waveform', icon: AudioWaveform },
]

// Static defaults from content.ts
const defaults = {
  title: siteContent.services.title,
  subtitle: siteContent.services.subtitle
}

// Convert static services to Service type for initial display
const defaultServices: Service[] = siteContent.services.items.map((item, index) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  icon: item.icon,
  order_index: index,
  is_active: true
}))

export default function ServicesEditor({ onSaveSuccess }: ServicesEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [services, setServices] = useState<Service[]>(defaultServices)
  const [sectionData, setSectionData] = useState(defaults)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newService, setNewService] = useState({
    title: '',
    description: '',
    icon: 'music'
  })

  useEffect(() => {
    fetchContent()
    fetchServices()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.services && Object.keys(data.services).length > 0) {
        setSectionData({
          title: data.services.title || defaults.title,
          subtitle: data.services.subtitle || defaults.subtitle
        })
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/services', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        setServices(data)
      }
      // If no data from DB, keep the default services
    } catch (err) {
      console.error('Failed to fetch services:', err)
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
        body: JSON.stringify({ section: 'services', data: sectionData })
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

  const handleAddService = async () => {
    if (!newService.title || !newService.description) {
      setError('Title and description are required')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newService,
          order_index: services.length
        })
      })

      if (!res.ok) throw new Error('Failed to add service')

      setNewService({ title: '', description: '', icon: 'music' })
      setShowAddForm(false)
      fetchServices()
      onSaveSuccess()
    } catch {
      setError('Failed to add service')
    }
  }

  const handleUpdateService = async (service: Service) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(service)
      })

      if (!res.ok) throw new Error('Failed to update service')

      setEditingService(null)
      fetchServices()
      onSaveSuccess()
    } catch {
      setError('Failed to update service')
    }
  }

  const handleDeleteService = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete service')

      fetchServices()
      onSaveSuccess()
    } catch {
      setError('Failed to delete service')
    }
  }

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(o => o.value === iconName)
    return option ? option.icon : Music
  }

  return (
    <SectionWrapper
      title="Services Section"
      description="Manage your services offerings"
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
          placeholder="Services"
        />
        <FormField
          label="Section Subtitle"
          value={sectionData.subtitle}
          onChange={(v) => setSectionData({ ...sectionData, subtitle: v })}
          placeholder="Professional audio solutions for every need"
        />
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Services ({services.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {showAddForm && (
          <div className="bg-surface/50 border border-white/10 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Service</h4>
              <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FormField
              label="Title"
              value={newService.title}
              onChange={(v) => setNewService({ ...newService, title: v })}
              required
            />
            <FormField
              label="Description"
              type="textarea"
              rows={3}
              value={newService.description}
              onChange={(v) => setNewService({ ...newService, description: v })}
              required
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-muted">Icon</label>
              <div className="flex gap-2">
                {iconOptions.map((option) => {
                  const Icon = option.icon
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setNewService({ ...newService, icon: option.value })}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                        newService.icon === option.value
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
              onClick={handleAddService}
              className="w-full py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
            >
              Add Service
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => {
            const Icon = getIconComponent(service.icon)
            return (
              <div
                key={service.id}
                className="bg-surface/50 border border-white/10 rounded-lg p-4"
              >
                {editingService?.id === service.id ? (
                  <div className="space-y-4">
                    <FormField
                      label="Title"
                      value={editingService.title}
                      onChange={(v) => setEditingService({ ...editingService, title: v })}
                    />
                    <FormField
                      label="Description"
                      type="textarea"
                      rows={2}
                      value={editingService.description}
                      onChange={(v) => setEditingService({ ...editingService, description: v })}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateService(editingService)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingService(null)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-neon-purple" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingService(service)}
                          className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">{service.title}</h4>
                    <p className="text-sm text-text-muted line-clamp-2">{service.description}</p>
                  </>
                )}
              </div>
            )
          })}

          {services.length === 0 && !showAddForm && (
            <div className="col-span-full text-center text-text-muted py-8">
              No services yet. Add your first service above.
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
