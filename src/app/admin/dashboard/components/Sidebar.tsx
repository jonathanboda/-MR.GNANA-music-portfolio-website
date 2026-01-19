'use client'

import { useState } from 'react'
import {
  Home,
  User,
  Music,
  Briefcase,
  Image,
  Video,
  Calendar,
  Mail,
  Menu,
  FileText,
  LogOut,
  ClipboardList,
  X
} from 'lucide-react'

interface SidebarProps {
  activeSection: string
  onSelect: (section: string) => void
  onLogout: () => void
}

const sections = [
  { id: 'bookings', label: 'Bookings', icon: ClipboardList },
  { id: 'hero', label: 'Hero', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'services', label: 'Services', icon: Briefcase },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'navigation', label: 'Navigation', icon: Menu },
  { id: 'footer', label: 'Footer', icon: FileText },
]

export default function Sidebar({ activeSection, onSelect, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (sectionId: string) => {
    onSelect(sectionId)
    setIsOpen(false) // Close sidebar on mobile after selection
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs text-text-muted">MR.GNANA</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-surface/95 lg:bg-surface/50 backdrop-blur-xl border-r border-white/10
        min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        pt-16 lg:pt-0
      `}>
        {/* Desktop Header */}
        <div className="hidden lg:block p-6 border-b border-white/10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-text-muted mt-1">MR.GNANA</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id

              return (
                <li key={section.id}>
                  <button
                    onClick={() => handleSelect(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                        : 'text-text-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="lg:hidden h-16" />
    </>
  )
}
