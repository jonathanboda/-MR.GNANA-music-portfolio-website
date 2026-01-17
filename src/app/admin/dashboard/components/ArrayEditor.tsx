'use client'

import { Plus, X } from 'lucide-react'
import { useState } from 'react'

interface ArrayEditorProps {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
}

export default function ArrayEditor({ label, items, onChange, placeholder = 'Add item...' }: ArrayEditorProps) {
  const [newItem, setNewItem] = useState('')

  const addItem = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addItem()
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-muted">{label}</label>

      <div className="flex flex-wrap gap-2 min-h-[42px] p-2 bg-surface/30 border border-white/10 rounded-lg">
        {items.map((item, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-3 py-1 bg-neon-purple/20 border border-neon-purple/30 rounded-full text-sm"
          >
            {item}
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-surface/50 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-text-muted focus:outline-none focus:border-neon-purple/50"
        />
        <button
          type="button"
          onClick={addItem}
          className="px-4 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/30 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
