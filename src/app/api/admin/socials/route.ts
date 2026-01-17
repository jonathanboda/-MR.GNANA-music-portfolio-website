import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all social links
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('social_links')
      .select('*')
      .order('order_index')

    if (error) {
      console.error('Socials fetch error:', error.message)
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('Socials API error:', err)
    return NextResponse.json([])
  }
}

// POST - Create new social link
export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { platform, url, icon, order_index } = body

  if (!platform || !url || !icon) {
    return NextResponse.json({ error: 'platform, url, and icon are required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('social_links')
    .insert({
      platform,
      url,
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

// PUT - Update all social links
export async function PUT(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { socials } = body as { socials: { id: number; platform: string; url: string; icon: string; order_index: number }[] }

  if (!socials || !Array.isArray(socials)) {
    return NextResponse.json({ error: 'socials array required' }, { status: 400 })
  }

  for (const social of socials) {
    const { error } = await supabaseAdmin
      .from('social_links')
      .update({
        platform: social.platform,
        url: social.url,
        icon: social.icon,
        order_index: social.order_index
      })
      .eq('id', social.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
