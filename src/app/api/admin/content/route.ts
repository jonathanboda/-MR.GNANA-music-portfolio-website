import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// GET - Fetch all site content
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('site_content')
      .select('*')
      .order('section')

    if (error) {
      // Return empty object if table doesn't exist or other error
      console.error('Content fetch error:', error.message)
      return NextResponse.json({})
    }

    // Group by section
    const grouped: Record<string, Record<string, string>> = {}
    data?.forEach(row => {
      if (!grouped[row.section]) {
        grouped[row.section] = {}
      }
      grouped[row.section][row.key] = row.value
    })

    return NextResponse.json(grouped)
  } catch (err) {
    console.error('Content API error:', err)
    return NextResponse.json({})
  }
}

// PUT - Update site content
export async function PUT(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const body = await request.json()
  const { section, data } = body as { section: string; data: Record<string, string> }

  if (!section || !data) {
    return NextResponse.json({ error: 'Missing section or data' }, { status: 400 })
  }

  // Upsert each key-value pair
  const entries = Object.entries(data)
  const upserts = entries.map(([key, value]) => ({
    section,
    key,
    value,
    updated_at: new Date().toISOString()
  }))

  const { error } = await supabaseAdmin
    .from('site_content')
    .upsert(upserts, { onConflict: 'section,key' })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
