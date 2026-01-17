'use client'

interface FormFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'textarea' | 'email' | 'url'
  placeholder?: string
  rows?: number
  required?: boolean
}

export default function FormField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  rows = 4,
  required = false
}: FormFieldProps) {
  const baseClasses = "w-full bg-surface/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all"

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text-muted">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          required={required}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={baseClasses}
        />
      )}
    </div>
  )
}
