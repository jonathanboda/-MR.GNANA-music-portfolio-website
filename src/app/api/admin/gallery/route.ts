import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all gallery images
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('gallery')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Gallery fetch error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Gallery API error:', err)
    return NextResponse.json([])
  }
}

// POST - Create new gallery image
export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { src, alt, description, order_index } = body

  if (!src || !alt) {
    return NextResponse.json({ error: 'src and alt are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('gallery')
    .insert({
      src,
      alt,
      description: description || '',
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
