'use client'

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
  ClipboardList
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
  return (
    <aside className="w-64 bg-surface/50 backdrop-blur-xl border-r border-white/10 min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-sm text-text-muted mt-1">MR.GNANA</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = activeSection === section.id

            return (
              <li key={section.id}>
                <button
                  onClick={() => onSelect(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
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
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
