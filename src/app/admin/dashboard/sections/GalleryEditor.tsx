'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, ImageIcon } from 'lucide-react'
import FormField from '../components/FormField'
import ImageUploader from '../components/ImageUploader'
import SectionWrapper from '../components/SectionWrapper'
import type { GalleryImage } from '@/lib/supabase'
import { siteContent } from '@/data/content'

interface GalleryEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaults = {
  title: siteContent.gallery.title,
  subtitle: siteContent.gallery.subtitle
}

// Convert static gallery images to GalleryImage type for initial display
// Use negative IDs for static images to distinguish from database images
const defaultImages: GalleryImage[] = siteContent.gallery.images.map((img, index) => ({
  id: -(img.id), // Negative ID to mark as static
  src: img.src,
  alt: img.alt,
  description: '',
  order_index: index,
  is_active: true
}))

export default function GalleryEditor({ onSaveSuccess }: GalleryEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<GalleryImage[]>(defaultImages)
  const [sectionData, setSectionData] = useState(defaults)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newImage, setNewImage] = useState({
    src: '',
    alt: '',
    description: ''
  })

  useEffect(() => {
    fetchContent()
    fetchGallery()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.gallery && Object.keys(data.gallery).length > 0) {
        setSectionData({
          title: data.gallery.title || defaults.title,
          subtitle: data.gallery.subtitle || defaults.subtitle
        })
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const fetchGallery = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/gallery', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        // Merge: static images (negative IDs) + database images (positive IDs)
        setImages([...defaultImages, ...data])
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err)
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
        body: JSON.stringify({ section: 'gallery', data: sectionData })
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

  const handleAddImage = async () => {
    if (!newImage.src || !newImage.alt) {
      setError('Image and alt text are required')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newImage,
          order_index: images.length
        })
      })

      if (!res.ok) throw new Error('Failed to add image')

      setNewImage({ src: '', alt: '', description: '' })
      setShowAddForm(false)
      fetchGallery()
      onSaveSuccess()
    } catch {
      setError('Failed to add image')
    }
  }

  const handleUpdateImage = async (image: GalleryImage) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/gallery/${image.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(image)
      })

      if (!res.ok) throw new Error('Failed to update image')

      setEditingImage(null)
      fetchGallery()
      onSaveSuccess()
    } catch {
      setError('Failed to update image')
    }
  }

  const handleDeleteImage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete image')

      fetchGallery()
      onSaveSuccess()
    } catch {
      setError('Failed to delete image')
    }
  }

  return (
    <SectionWrapper
      title="Gallery Section"
      description="Manage your photo gallery"
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
          placeholder="Gallery"
        />
        <FormField
          label="Section Subtitle"
          value={sectionData.subtitle}
          onChange={(v) => setSectionData({ ...sectionData, subtitle: v })}
          placeholder="A collection of moments"
        />
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Images ({images.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Image
          </button>
        </div>

        {showAddForm && (
          <div className="bg-surface/50 border border-white/10 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Image</h4>
              <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <ImageUploader
              label="Image"
              value={newImage.src}
              onChange={(v) => setNewImage({ ...newImage, src: v })}
            />
            <FormField
              label="Alt Text"
              value={newImage.alt}
              onChange={(v) => setNewImage({ ...newImage, alt: v })}
              placeholder="Describe the image..."
              required
            />
            <FormField
              label="Description"
              value={newImage.description}
              onChange={(v) => setNewImage({ ...newImage, description: v })}
              placeholder="Optional caption..."
            />
            <button
              onClick={handleAddImage}
              className="w-full py-2 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
            >
              Add Image
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => {
            const isStatic = image.id < 0 // Negative IDs are static images
            return (
              <div
                key={image.id}
                className={`relative group bg-surface/50 border rounded-lg overflow-hidden ${isStatic ? 'border-white/5' : 'border-neon-purple/30'}`}
              >
                {editingImage?.id === image.id ? (
                  <div className="p-4 space-y-3">
                    <FormField
                      label="Alt Text"
                      value={editingImage.alt}
                      onChange={(v) => setEditingImage({ ...editingImage, alt: v })}
                    />
                    <FormField
                      label="Description"
                      value={editingImage.description || ''}
                      onChange={(v) => setEditingImage({ ...editingImage, description: v })}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateImage(editingImage)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingImage(null)}
                        className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="aspect-square relative bg-surface">
                      {image.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            target.nextElementSibling?.classList.remove('hidden')
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center ${image.src ? 'hidden' : ''}`}>
                        <ImageIcon className="w-8 h-8 text-text-muted" />
                      </div>
                      {isStatic && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 rounded text-[10px] text-text-muted">
                          Static
                        </div>
                      )}
                    </div>
                    {!isStatic && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingImage(image)}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    <div className="p-2">
                      <p className="text-xs text-text-muted truncate">{image.alt}</p>
                    </div>
                  </>
                )}
              </div>
            )
          })}

          {images.length === 0 && !showAddForm && (
            <div className="col-span-full text-center text-text-muted py-8">
              No images yet. Add your first image above.
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
