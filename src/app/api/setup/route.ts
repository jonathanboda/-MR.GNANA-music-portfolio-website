import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST() {
  try {
    // Check if tables exist by trying to query them
    const { error: checkError } = await supabaseAdmin.from('site_content').select('id').limit(1)

    if (checkError && checkError.code === '42P01') {
      // Tables don't exist - return SQL for manual creation
      return NextResponse.json({
        success: false,
        message: 'Tables not found. Please run the SQL in Supabase dashboard.',
        sql: getDatabaseSetupSQL()
      })
    }

    return NextResponse.json({ success: true, message: 'Database is ready!' })
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}

function getDatabaseSetupSQL() {
  return `
-- ============================================
-- SITE CONTENT TABLE (key-value for all sections)
-- ============================================
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section, key)
);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT,
  location TEXT,
  type TEXT NOT NULL CHECK (type IN ('upcoming', 'past')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TRACKS TABLE (Music section)
-- ============================================
CREATE TABLE IF NOT EXISTS tracks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  audio_src TEXT NOT NULL,
  duration TEXT,
  cover_image TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- GALLERY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SERVICES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SOCIAL LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS social_links (
  id SERIAL PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  icon TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NAV LINKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS nav_links (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE nav_links ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read site_content" ON site_content FOR SELECT USING (true);
CREATE POLICY "Public read events" ON events FOR SELECT USING (true);
CREATE POLICY "Public read tracks" ON tracks FOR SELECT USING (is_active = true);
CREATE POLICY "Public read gallery" ON gallery FOR SELECT USING (is_active = true);
CREATE POLICY "Public read services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public read social_links" ON social_links FOR SELECT USING (is_active = true);
CREATE POLICY "Public read nav_links" ON nav_links FOR SELECT USING (is_active = true);

-- Admin write policies (service role bypasses RLS anyway)
CREATE POLICY "Admin write site_content" ON site_content FOR ALL USING (true);
CREATE POLICY "Admin write events" ON events FOR ALL USING (true);
CREATE POLICY "Admin write tracks" ON tracks FOR ALL USING (true);
CREATE POLICY "Admin write gallery" ON gallery FOR ALL USING (true);
CREATE POLICY "Admin write services" ON services FOR ALL USING (true);
CREATE POLICY "Admin write social_links" ON social_links FOR ALL USING (true);
CREATE POLICY "Admin write nav_links" ON nav_links FOR ALL USING (true);

-- ============================================
-- STORAGE BUCKETS (run separately in Storage settings)
-- ============================================
-- Create buckets named: "images" and "audio"
-- Set them as public buckets for read access
`
}
