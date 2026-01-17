import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all events
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Events fetch error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Events API error:', err)
    return NextResponse.json([])
  }
}

// POST - Create new event
export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { title, description, date, time, location, type } = body

  if (!title || !date || !type) {
    return NextResponse.json({ error: 'title, date, and type are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert({
      title,
      description: description || '',
      date,
      time: time || '',
      location: location || '',
      type
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
