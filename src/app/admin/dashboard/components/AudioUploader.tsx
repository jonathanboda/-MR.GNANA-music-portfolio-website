'use client'

import { useState, useRef } from 'react'
import { Upload, X, Loader2, Music } from 'lucide-react'

interface AudioUploaderProps {
  label: string
  value: string
  onChange: (url: string) => void
}

export default function AudioUploader({ label, value, onChange }: AudioUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'audio')

    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else if (data.url) {
        onChange(data.url)
      }
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-muted">{label}</label>
      <div className="relative">
        {value ? (
          <div className="relative w-full rounded-lg overflow-hidden bg-surface border border-white/10 p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-neon-purple/20 flex items-center justify-center">
                <Music className="w-6 h-6 text-neon-purple" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{value.split('/').pop()}</p>
                <audio src={value} controls className="w-full mt-2 h-8" />
              </div>
              <button
                onClick={() => onChange('')}
                className="p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full py-8 rounded-lg border-2 border-dashed border-white/20 hover:border-neon-purple/50 flex flex-col items-center justify-center transition-colors bg-surface/30"
          >
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-neon-purple animate-spin mb-2" />
                <span className="text-sm text-text-muted">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-text-muted mb-2" />
                <span className="text-sm text-text-muted">Click to upload audio file</span>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
