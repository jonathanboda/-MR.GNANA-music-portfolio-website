'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Loader2 } from 'lucide-react'

interface ImageUploaderProps {
  label: string
  value: string
  onChange: (url: string) => void
}

export default function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
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
    formData.append('type', 'image')

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
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface border border-white/10">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              onClick={() => onChange('')}
              className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full aspect-video rounded-lg border-2 border-dashed border-white/20 hover:border-neon-purple/50 flex flex-col items-center justify-center transition-colors bg-surface/30"
          >
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 text-neon-purple animate-spin mb-2" />
                <span className="text-sm text-text-muted">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-8 h-8 text-text-muted mb-2" />
                <span className="text-sm text-text-muted">Click to upload image</span>
              </>
            )}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
