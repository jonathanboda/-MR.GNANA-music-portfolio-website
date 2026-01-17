import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  type: 'upcoming' | 'past'
  created_at?: string
}

export interface GalleryImage {
  id: number
  src: string
  alt: string
  description?: string
  order_index: number
  is_active: boolean
  created_at?: string
}

export interface Service {
  id: number
  title: string
  description: string
  icon: string
  order_index: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface SiteContent {
  id: number
  section: string
  key: string
  value: string
  created_at?: string
  updated_at?: string
}

export interface Track {
  id: number
  title: string
  description: string
  audio_src: string
  duration: string
  cover_image?: string
  order_index: number
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface SocialLink {
  id: number
  platform: string
  url: string
  icon: string
  order_index: number
  is_active: boolean
  created_at?: string
}

export interface NavLink {
  id: number
  label: string
  href: string
  order_index: number
  is_active: boolean
  created_at?: string
}

export interface Video {
  id: number
  title: string
  description: string
  platform: 'youtube' | 'instagram'
  video_id: string
  thumbnail?: string
  order_index: number
  is_active: boolean
  created_at?: string
}
