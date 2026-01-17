import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all services
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('services')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Services fetch error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Services API error:', err)
    return NextResponse.json([])
  }
}

// POST - Create new service
export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { title, description, icon, order_index } = body

  if (!title || !description || !icon) {
    return NextResponse.json({ error: 'title, description, and icon are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('services')
    .insert({
      title,
      description,
      icon,
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

// PUT - Update multiple services (for reordering)
export async function PUT(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { services } = body as { services: { id: number; order_index: number }[] }

  if (!services || !Array.isArray(services)) {
    return NextResponse.json({ error: 'services array required' }, { status: 400 })
  }

  // Update each service
  for (const service of services) {
    const { error } = await supabaseAdmin
      .from('services')
      .update({ order_index: service.order_index, updated_at: new Date().toISOString() })
      .eq('id', service.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
