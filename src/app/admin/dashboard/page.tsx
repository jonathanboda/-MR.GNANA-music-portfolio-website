'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Sidebar from './components/Sidebar'

// Lazy load all editors for faster initial page load
const BookingsEditor = dynamic(() => import('./sections/BookingsEditor'), { ssr: false })
const HeroEditor = dynamic(() => import('./sections/HeroEditor'), { ssr: false })
const AboutEditor = dynamic(() => import('./sections/AboutEditor'), { ssr: false })
const MusicEditor = dynamic(() => import('./sections/MusicEditor'), { ssr: false })
const ServicesEditor = dynamic(() => import('./sections/ServicesEditor'), { ssr: false })
const GalleryEditor = dynamic(() => import('./sections/GalleryEditor'), { ssr: false })
const VideosEditor = dynamic(() => import('./sections/VideosEditor'), { ssr: false })
const EventsEditor = dynamic(() => import('./sections/EventsEditor'), { ssr: false })
const ContactEditor = dynamic(() => import('./sections/ContactEditor'), { ssr: false })
const NavigationEditor = dynamic(() => import('./sections/NavigationEditor'), { ssr: false })
const FooterEditor = dynamic(() => import('./sections/FooterEditor'), { ssr: false })

// Loading spinner component
const EditorLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="animate-spin w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full"></div>
  </div>
)

export default function AdminDashboard() {
  const router = useRouter()
  const [activeSection, setActiveSection] = useState('bookings')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [dbStatus, setDbStatus] = useState<'checking' | 'ready' | 'needs_setup'>('checking')
  const [setupSql, setSetupSql] = useState('')

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin')
      return
    }
    setIsAuthenticated(true)

    // Check database status
    checkDatabase()
  }, [router])

  const checkDatabase = async () => {
    try {
      const res = await fetch('/api/setup', { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        setDbStatus('ready')
      } else if (data.sql) {
        setDbStatus('needs_setup')
        setSetupSql(data.sql)
      }
    } catch {
      setDbStatus('ready') // Assume ready if we can't check
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin')
  }

  const handleSaveSuccess = () => {
    // Could add a toast notification here
    console.log('Changes saved successfully')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-text-muted">Loading...</div>
      </div>
    )
  }

  if (dbStatus === 'checking') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-neon-purple border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-text-muted">Checking database...</div>
        </div>
      </div>
    )
  }

  if (dbStatus === 'needs_setup') {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-surface/30 backdrop-blur-sm border border-white/10 rounded-xl p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Database Setup Required</h1>
            <p className="text-text-muted mb-6">
              The database tables need to be created. Please run the following SQL in your Supabase SQL Editor:
            </p>
            <div className="bg-black/50 rounded-lg p-4 overflow-auto max-h-96">
              <pre className="text-sm text-green-400 whitespace-pre-wrap">{setupSql}</pre>
            </div>
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => navigator.clipboard.writeText(setupSql)}
                className="px-6 py-3 bg-neon-purple hover:bg-neon-purple/80 rounded-lg transition-colors"
              >
                Copy SQL
              </button>
              <button
                onClick={checkDatabase}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                Check Again
              </button>
            </div>
            <p className="text-sm text-text-muted mt-4">
              After running the SQL, also create two storage buckets named &quot;images&quot; and &quot;audio&quot; in Supabase Storage.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background lg:flex">
      <Sidebar
        activeSection={activeSection}
        onSelect={setActiveSection}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto pt-20 lg:pt-8">
        <div className="max-w-5xl mx-auto">
          <Suspense fallback={<EditorLoader />}>
            {activeSection === 'bookings' && <BookingsEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'hero' && <HeroEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'about' && <AboutEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'music' && <MusicEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'services' && <ServicesEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'gallery' && <GalleryEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'videos' && <VideosEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'events' && <EventsEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'contact' && <ContactEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'navigation' && <NavigationEditor onSaveSuccess={handleSaveSuccess} />}
            {activeSection === 'footer' && <FooterEditor onSaveSuccess={handleSaveSuccess} />}
          </Suspense>
        </div>
      </main>
    </div>
  )
}
