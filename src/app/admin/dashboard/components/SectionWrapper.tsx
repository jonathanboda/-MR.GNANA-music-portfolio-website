'use client'

import { Save, Loader2, Check } from 'lucide-react'

interface SectionWrapperProps {
  title: string
  description?: string
  children: React.ReactNode
  onSave: () => void
  loading?: boolean
  success?: boolean
  error?: string
}

export default function SectionWrapper({
  title,
  description,
  children,
  onSave,
  loading = false,
  success = false,
  error
}: SectionWrapperProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {description && <p className="text-text-muted mt-1">{description}</p>}
        </div>
        <button
          onClick={onSave}
          disabled={loading}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            success
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-neon-purple hover:bg-neon-purple/80 text-white'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : success ? (
            <>
              <Check className="w-5 h-5" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
          {error}
        </div>
      )}

      <div className="bg-surface/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6">
        {children}
      </div>
    </div>
  )
}
