import { supabase } from './supabase'
import { siteContent as staticContent } from '@/data/content'

export async function getContent() {
  try {
    // Fetch all content in parallel - wrap each in try-catch to handle individual failures
    const results = await Promise.allSettled([
      supabase.from('site_content').select('*'),
      supabase.from('tracks').select('*').eq('is_active', true).order('order_index'),
      supabase.from('gallery').select('*').eq('is_active', true).order('order_index'),
      supabase.from('services').select('*').eq('is_active', true).order('order_index'),
      supabase.from('social_links').select('*').eq('is_active', true).order('order_index'),
      supabase.from('nav_links').select('*').eq('is_active', true).order('order_index'),
      supabase.from('events').select('*').order('created_at', { ascending: false }),
      supabase.from('videos').select('*').eq('is_active', true).order('order_index')
    ])

    // Extract data safely, defaulting to empty/null on errors
    // Supabase returns { data, error } - check both fulfilled status AND no error
    const getResultData = (result: PromiseSettledResult<{ data: unknown; error: unknown }>) => {
      if (result.status === 'fulfilled' && !result.value.error) {
        return result.value
      }
      return { data: null }
    }

    // Define types for each result
    type SiteContentRow = { section: string; key: string; value: string }
    type TrackRow = { id: number; title: string; description?: string; audio_src: string; duration?: string }
    type GalleryRow = { id: number; src: string; alt: string; description?: string }
    type ServiceRow = { id: number; title: string; description: string; icon: string }
    type SocialRow = { platform: string; url: string; icon: string }
    type NavLinkRow = { label: string; href: string }
    type EventRow = { id: number; title: string; description?: string; date: string; time?: string; location?: string; type: string }
    type VideoRow = { id: number; title: string; description?: string; platform: string; video_id: string; thumbnail?: string }

    type ResultData<T> = PromiseSettledResult<{ data: T[] | null; error: unknown }>

    const siteContentRows = (getResultData(results[0] as ResultData<SiteContentRow>).data || []) as SiteContentRow[]
    const tracksRows = (getResultData(results[1] as ResultData<TrackRow>).data || []) as TrackRow[]
    const galleryRows = (getResultData(results[2] as ResultData<GalleryRow>).data || []) as GalleryRow[]
    const servicesRows = (getResultData(results[3] as ResultData<ServiceRow>).data || []) as ServiceRow[]
    const socialsRows = (getResultData(results[4] as ResultData<SocialRow>).data || []) as SocialRow[]
    const navLinksRows = (getResultData(results[5] as ResultData<NavLinkRow>).data || []) as NavLinkRow[]
    const eventsRows = (getResultData(results[6] as ResultData<EventRow>).data || []) as EventRow[]
    const videosRows = (getResultData(results[7] as ResultData<VideoRow>).data || []) as VideoRow[]

    // Transform site_content rows into structured object
    const siteContentMap = new Map<string, Record<string, string>>()
    siteContentRows.forEach(row => {
      if (!siteContentMap.has(row.section)) {
        siteContentMap.set(row.section, {})
      }
      siteContentMap.get(row.section)![row.key] = row.value
    })

    const heroData = siteContentMap.get('hero')
    const aboutData = siteContentMap.get('about')
    const musicData = siteContentMap.get('music')
    const galleryData = siteContentMap.get('gallery')
    const videosData = siteContentMap.get('videos')
    const servicesData = siteContentMap.get('services')
    const eventsData = siteContentMap.get('events')
    const contactData = siteContentMap.get('contact')
    const navData = siteContentMap.get('nav')
    const footerData = siteContentMap.get('footer')

    // Parse arrays safely
    const parseJsonArray = (str: string | undefined, fallback: string[]) => {
      if (!str) return fallback
      try {
        return JSON.parse(str)
      } catch {
        return fallback
      }
    }

    // Build content object with fallback to static
    return {
      hero: {
        name: heroData?.name || staticContent.hero.name,
        tagline: heroData?.tagline || staticContent.hero.tagline,
        cta: {
          listen: heroData?.cta_listen || staticContent.hero.cta.listen,
          book: heroData?.cta_book || staticContent.hero.cta.book,
        },
        backgroundImage: heroData?.background_image || '/images/hero section.JPG',
      },
      about: {
        title: aboutData?.title || staticContent.about.title,
        badge: aboutData?.badge || staticContent.about.badge,
        bio: aboutData?.bio || staticContent.about.bio,
        instruments: parseJsonArray(aboutData?.instruments, staticContent.about.instruments),
        genres: parseJsonArray(aboutData?.genres, staticContent.about.genres),
        profileImage: aboutData?.profile_image || '/images/7.JPG',
      },
      music: {
        title: musicData?.title || staticContent.music.title,
        subtitle: musicData?.subtitle || staticContent.music.subtitle,
        tracks: tracksRows.length ? tracksRows.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || '',
          audioSrc: t.audio_src,
          duration: t.duration || '',
        })) : staticContent.music.tracks,
      },
      gallery: {
        title: galleryData?.title || staticContent.gallery.title,
        subtitle: galleryData?.subtitle || staticContent.gallery.subtitle,
        // Use DB images if available, otherwise fallback to static
        images: galleryRows.length ? galleryRows.map(img => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          description: img.description || ''
        })) : staticContent.gallery.images,
      },
      videos: {
        title: videosData?.title || staticContent.videos.title,
        subtitle: videosData?.subtitle || staticContent.videos.subtitle,
        videos: videosRows.length ? videosRows.map(v => ({
          id: v.id,
          title: v.title,
          description: v.description || '',
          platform: v.platform,
          video_id: v.video_id,
          thumbnail: v.thumbnail || ''
        })) : staticContent.videos.videos,
      },
      services: {
        title: servicesData?.title || staticContent.services.title,
        subtitle: servicesData?.subtitle || staticContent.services.subtitle,
        items: servicesRows.length ? servicesRows.map(s => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon
        })) : staticContent.services.items,
      },
      events: {
        title: eventsData?.title || staticContent.events.title,
        subtitle: eventsData?.subtitle || staticContent.events.subtitle,
        upcomingEvents: eventsRows.length ? eventsRows.filter(e => e.type === 'upcoming').map(e => ({
          id: e.id,
          title: e.title,
          description: e.description || '',
          date: e.date,
          time: e.time || '',
          location: e.location || '',
          type: e.type
        })) : staticContent.events.upcomingEvents,
        pastEvents: eventsRows.length ? eventsRows.filter(e => e.type === 'past').map(e => ({
          id: e.id,
          title: e.title,
          description: e.description || '',
          date: e.date,
          time: e.time || '',
          location: e.location || '',
          type: e.type
        })) : staticContent.events.pastEvents,
      },
      contact: {
        title: contactData?.title || staticContent.contact.title,
        subtitle: contactData?.subtitle || staticContent.contact.subtitle,
        message: contactData?.message || staticContent.contact.message,
        email: contactData?.email || staticContent.contact.email,
        socials: socialsRows.length ? socialsRows.map(s => ({
          name: s.platform,
          url: s.url,
          icon: s.icon
        })) : staticContent.contact.socials,
      },
      nav: {
        logo: navData?.logo_text || staticContent.nav.logo,
        links: navLinksRows.length ? navLinksRows.map(link => ({
          label: link.label,
          href: link.href
        })) : staticContent.nav.links,
      },
      footer: {
        copyright: footerData?.copyright || staticContent.footer.copyright,
        tagline: footerData?.tagline || staticContent.footer.tagline,
      },
    }
  } catch (error) {
    console.error('Error fetching content:', error)
    return staticContent // Fallback to static content
  }
}

export type SiteContentType = Awaited<ReturnType<typeof getContent>>
