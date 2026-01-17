import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all tracks
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('tracks')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Tracks fetch error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Tracks API error:', err)
    return NextResponse.json([])
  }
}

// POST - Create new track
export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { title, description, audio_src, duration, cover_image, order_index } = body

  if (!title || !audio_src) {
    return NextResponse.json({ error: 'Title and audio_src are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('tracks')
    .insert({
      title,
      description: description || '',
      audio_src,
      duration: duration || '',
      cover_image: cover_image || null,
      order_index: order_index || 0,
      is_active: true
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
