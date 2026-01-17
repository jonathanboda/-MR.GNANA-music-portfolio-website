import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all videos
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('videos')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Videos fetch error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Videos API error:', err)
    return NextResponse.json([])
  }
}

// POST - Create new video
export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { title, description, platform, video_id, thumbnail, order_index } = body

    if (!title || !platform || !video_id) {
      return NextResponse.json({ error: 'title, platform, and video_id are required' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('videos')
      .insert({
        title,
        description: description || '',
        platform,
        video_id,
        thumbnail: thumbnail || null,
        order_index: order_index || 0,
        is_active: true
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Videos POST error:', err)
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 })
  }
}
