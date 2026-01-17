export const siteContent = {
  // Hero Section
  hero: {
    name: 'MR.GNANA',
    tagline: 'Pads • Sound Engineering • Live & Studio',
    cta: {
      listen: 'Listen',
      book: 'Book Now',
    },
  },

  // About Section
  about: {
    title: 'About Me',
    badge: 'Sound Engineer',
    bio: `I'm Mr.Gnana, a passionate musician and sound engineer dedicated to crafting immersive sonic experiences. With years of experience in live performances and studio production, I bring a unique blend of technical precision and creative artistry to every project.

My journey in music started with a deep fascination for atmospheric sounds and how they can transform spaces. Today, I specialize in creating lush pad textures, cinematic soundscapes, and polished productions that resonate with audiences.

Whether on stage or behind the mixing console, I'm committed to delivering audio excellence that exceeds expectations.`,
    instruments: ['Synthesizers', 'Pads', 'Keys', 'Sound Design'],
    genres: ['Ambient', 'Electronic', 'Cinematic', 'Worship', 'Indie'],
  },

  // Music Section
  music: {
    title: 'My Music',
    subtitle: 'Listen to my latest productions',
    tracks: [],
  },

  // Services Section
  services: {
    title: 'Services',
    subtitle: 'Professional audio solutions for every need',
    items: [
      {
        id: 1,
        title: 'Live Performance',
        description:
          'Elevate your event with immersive live performances featuring atmospheric pads, synthesizers, and real-time sound design. Perfect for concerts, worship services, and corporate events.',
        icon: 'music',
      },
      {
        id: 2,
        title: 'Mixing & Mastering',
        description:
          'Professional mixing and mastering services that bring clarity, depth, and polish to your tracks. Industry-standard processing with a creative touch.',
        icon: 'sliders',
      },
      {
        id: 3,
        title: 'Sound Design',
        description:
          'Custom sound design for films, games, podcasts, and multimedia projects. From subtle ambiences to bold sonic textures, tailored to your vision.',
        icon: 'waveform',
      },
    ],
  },

  // Gallery Section
  gallery: {
    title: 'Gallery',
    subtitle: 'A collection of moments',
    images: [
      { id: 1, src: '/images/1.JPG', alt: 'Live performance at concert venue' },
      { id: 2, src: '/images/2.JPG', alt: 'Studio session setup' },
      { id: 3, src: '/images/3.JPG', alt: 'Festival performance' },
      { id: 4, src: '/images/4.jpeg', alt: 'Intimate venue show' },
      { id: 5, src: '/images/5.jpeg', alt: 'Behind the scenes' },
      { id: 6, src: '/images/6.jpeg', alt: 'Sound check preparations' },
    ],
  },

  // Videos Section
  videos: {
    title: 'Videos',
    subtitle: 'Watch my latest performances and content',
    videos: [] as { id: number; title: string; description: string; platform: 'youtube' | 'instagram'; video_id: string; thumbnail?: string }[],
  },

  // Events Section
  events: {
    title: 'Events',
    subtitle: 'Join Us for Upcoming Events',
    upcomingEvents: [],
    pastEvents: [
      // Add your past events here like this:
      // {
      //   id: 1,
      //   title: 'Event Name',
      //   description: 'Event description here',
      //   date: 'February 24, 2024',
      //   time: '8:00 AM - 2:00 PM',
      //   location: 'Venue Name, City',
      // },
    ],
  },

  // Contact Section
  contact: {
    title: "Let's Connect",
    subtitle: 'Ready to collaborate or book a show?',
    message:
      "I'm always excited to work on new projects and connect with fellow music enthusiasts. Whether you need a live performer, studio production, or custom sound design, let's create something amazing together.",
    email: 'mr.gnana08@gmail.com',
    socials: [
      { name: 'Instagram', url: 'https://www.instagram.com/am_gnanaa?igsh=MXhidDVia2szb2x3bA%3D%3D&utm_source=qr', icon: 'instagram' },
      { name: 'YouTube', url: 'https://youtube.com/@am_gnanaa?si=sACafU4nviW1E84m', icon: 'youtube' },
      { name: 'X', url: 'https://x.com/mrgnana8?s=11', icon: 'x' },
      { name: 'Pinterest', url: 'https://pin.it/4hz97nVeC', icon: 'pinterest' },
    ],
  },

  // Navigation
  nav: {
    logo: 'MR.GNANA',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Music', href: '#music' },
      { label: 'Services', href: '#services' },
      { label: 'Gallery', href: '#gallery' },
      { label: 'Videos', href: '#videos' },
      { label: 'Events', href: '#events' },
      { label: 'Contact', href: '#contact' },
    ],
  },

  // Footer
  footer: {
    copyright: '© 2025 Mr.Gnana. All rights reserved.',
    tagline: 'Crafting sonic experiences',
  },
}
