import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all nav links
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('nav_links')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Nav links fetch error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Nav links API error:', err)
    return NextResponse.json([])
  }
}

// POST - Create new nav link
export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { label, href, order_index } = body

  if (!label || !href) {
    return NextResponse.json({ error: 'label and href are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('nav_links')
    .insert({
      label,
      href,
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

// PUT - Update all nav links (for reordering)
export async function PUT(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { navLinks } = body as { navLinks: { id: number; label: string; href: string; order_index: number }[] }

  if (!navLinks || !Array.isArray(navLinks)) {
    return NextResponse.json({ error: 'navLinks array required' }, { status: 400 })
  }

  for (const link of navLinks) {
    const { error } = await supabaseAdmin
      .from('nav_links')
      .update({
        label: link.label,
        href: link.href,
        order_index: link.order_index
      })
      .eq('id', link.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
