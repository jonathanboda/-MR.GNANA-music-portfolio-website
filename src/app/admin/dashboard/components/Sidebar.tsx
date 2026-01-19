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
    setIsOpen(false)
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
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
    </>
  )

  return (
    <>
      {/* Mobile Header - Only visible on small screens */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-neon-purple to-neon-cyan bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-xs text-text-muted">MR.GNANA</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-surface border-r border-white/10
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </div>

      {/* Desktop Sidebar - Only visible on large screens */}
      <aside className="hidden lg:flex w-64 bg-surface/50 backdrop-blur-xl border-r border-white/10 min-h-screen flex-col flex-shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
