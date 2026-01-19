'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, X, Check, Youtube, Play } from 'lucide-react'
import FormField from '../components/FormField'
import SectionWrapper from '../components/SectionWrapper'
import type { Video } from '@/lib/supabase'
import { siteContent } from '@/data/content'

interface VideosEditorProps {
  onSaveSuccess: () => void
}

// Static defaults from content.ts
const defaults = {
  title: siteContent.videos.title,
  subtitle: siteContent.videos.subtitle
}

export default function VideosEditor({ onSaveSuccess }: VideosEditorProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [videos, setVideos] = useState<Video[]>([])
  const [sectionData, setSectionData] = useState(defaults)
  const [editingVideo, setEditingVideo] = useState<Video | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newVideo, setNewVideo] = useState({
    url: '',
    title: '',
    description: ''
  })

  useEffect(() => {
    fetchContent()
    fetchVideos()
  }, [])

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/content', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.videos && Object.keys(data.videos).length > 0) {
        setSectionData({
          title: data.videos.title || defaults.title,
          subtitle: data.videos.subtitle || defaults.subtitle
        })
      }
    } catch (err) {
      console.error('Failed to fetch content:', err)
    }
  }

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/videos', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setVideos(data)
      }
    } catch (err) {
      console.error('Failed to fetch videos:', err)
    }
  }

  // Extract video ID and platform from URL
  const parseVideoUrl = (url: string): { platform: 'youtube' | 'instagram'; video_id: string } | null => {
    // YouTube patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/
    ]

    for (const pattern of youtubePatterns) {
      const match = url.match(pattern)
      if (match) {
        return { platform: 'youtube', video_id: match[1] }
      }
    }

    // Instagram patterns
    const instagramPatterns = [
      /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/
    ]

    for (const pattern of instagramPatterns) {
      const match = url.match(pattern)
      if (match) {
        return { platform: 'instagram', video_id: match[1] }
      }
    }

    return null
  }

  // Get YouTube thumbnail
  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
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
        body: JSON.stringify({ section: 'videos', data: sectionData })
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

  const handleAddVideo = async () => {
    if (!newVideo.url || !newVideo.title) {
      setError('URL and title are required')
      return
    }

    const parsed = parseVideoUrl(newVideo.url)
    if (!parsed) {
      setError('Invalid YouTube or Instagram URL')
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      // Generate thumbnail URL for YouTube videos
      const thumbnail = parsed.platform === 'youtube'
        ? `https://i.ytimg.com/vi/${parsed.video_id}/hqdefault.jpg`
        : null

      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newVideo.title,
          description: newVideo.description,
          platform: parsed.platform,
          video_id: parsed.video_id,
          thumbnail,
          order_index: videos.length
        })
      })

      if (!res.ok) throw new Error('Failed to add video')

      setNewVideo({ url: '', title: '', description: '' })
      setShowAddForm(false)
      setError('')
      fetchVideos()
      onSaveSuccess()
    } catch {
      setError('Failed to add video')
    }
  }

  const handleUpdateVideo = async (video: Video) => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/videos/${video.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(video)
      })

      if (!res.ok) throw new Error('Failed to update video')

      setEditingVideo(null)
      fetchVideos()
      onSaveSuccess()
    } catch {
      setError('Failed to update video')
    }
  }

  const handleDeleteVideo = async (id: number) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/admin/videos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Failed to delete video')

      fetchVideos()
      onSaveSuccess()
    } catch {
      setError('Failed to delete video')
    }
  }

  return (
    <SectionWrapper
      title="Videos Section"
      description="Manage your YouTube and Instagram videos"
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
          placeholder="Videos"
        />
        <FormField
          label="Section Subtitle"
          value={sectionData.subtitle}
          onChange={(v) => setSectionData({ ...sectionData, subtitle: v })}
          placeholder="Watch my latest performances and content"
        />
      </div>

      <div className="border-t border-white/10 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Videos ({videos.length})</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Video
          </button>
        </div>

        {showAddForm && (
          <div className="bg-surface/50 border border-white/10 rounded-lg p-4 mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">New Video</h4>
              <button onClick={() => setShowAddForm(false)} className="text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FormField
              label="Video URL"
              value={newVideo.url}
              onChange={(v) => setNewVideo({ ...newVideo, url: v })}
              placeholder="https://youtube.com/watch?v=... or https://instagram.com/p/..."
              required
            />
            {newVideo.url && parseVideoUrl(newVideo.url) && (
              <div className="flex items-center gap-2 text-sm text-green-400">
                <Check className="w-4 h-4" />
                {parseVideoUrl(newVideo.url)?.platform === 'youtube' ? 'YouTube' : 'Instagram'} video detected
              </div>
            )}
            {newVideo.url && !parseVideoUrl(newVideo.url) && (
              <div className="text-sm text-red-400">
                Invalid URL. Use a YouTube or Instagram video link.
              </div>
            )}
            <FormField
              label="Title"
              value={newVideo.title}
              onChange={(v) => setNewVideo({ ...newVideo, title: v })}
              placeholder="Video title..."
              required
            />
            <FormField
              label="Description"
              value={newVideo.description}
              onChange={(v) => setNewVideo({ ...newVideo, description: v })}
              placeholder="Optional description..."
            />
            <button
              onClick={handleAddVideo}
              disabled={!newVideo.url || !newVideo.title || !parseVideoUrl(newVideo.url)}
              className="w-full py-2 bg-neon-purple hover:bg-neon-purple/80 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Add Video
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div
              key={video.id}
              className="relative group bg-surface/50 border border-white/10 rounded-lg overflow-hidden"
            >
              {editingVideo?.id === video.id ? (
                <div className="p-4 space-y-3">
                  <FormField
                    label="Title"
                    value={editingVideo.title}
                    onChange={(v) => setEditingVideo({ ...editingVideo, title: v })}
                  />
                  <FormField
                    label="Description"
                    value={editingVideo.description || ''}
                    onChange={(v) => setEditingVideo({ ...editingVideo, description: v })}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateVideo(editingVideo)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingVideo(null)}
                      className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="aspect-video relative bg-black overflow-hidden">
                    {/* Use lightweight thumbnail instead of iframe for faster loading */}
                    {video.platform === 'youtube' && video.video_id ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://i.ytimg.com/vi/${video.video_id}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {/* Play button overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg">
                            <Play className="w-7 h-7 text-white fill-white ml-1" />
                          </div>
                        </div>
                      </>
                    ) : video.platform === 'instagram' ? (
                      <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">IG</span>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface">
                        <Play className="w-12 h-12 text-text-muted" />
                      </div>
                    )}

                    {/* Platform badge */}
                    <div className="absolute top-2 right-2 z-10">
                      {video.platform === 'youtube' ? (
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                          <Youtube className="w-4 h-4 text-white" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">IG</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => setEditingVideo(video)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteVideo(video.id)}
                      className="p-2 bg-red-500/50 hover:bg-red-500/70 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="font-medium text-sm truncate">{video.title}</p>
                    {video.description && (
                      <p className="text-xs text-text-muted truncate mt-1">{video.description}</p>
                    )}
                    <p className="text-xs text-text-muted mt-1 capitalize">{video.platform}</p>
                    <p className="text-[10px] text-text-muted/50 mt-1 font-mono">ID: {video.video_id}</p>
                  </div>
                </>
              )}
            </div>
          ))}

          {videos.length === 0 && !showAddForm && (
            <div className="col-span-full text-center text-text-muted py-8">
              No videos yet. Add your first video above.
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  )
}
