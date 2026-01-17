import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

// Validate ID is a positive integer
function validateId(id: string): number | null {
  const parsed = parseInt(id, 10)
  if (isNaN(parsed) || parsed <= 0 || !Number.isInteger(parsed)) {
    return null
  }
  return parsed
}

// PUT - Update video
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { id } = await params
    const validId = validateId(id)
    if (!validId) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const body = await request.json()
    const { title, description, platform, video_id, thumbnail, order_index, is_active } = body

    const { data, error } = await supabaseAdmin
      .from('videos')
      .update({
        title,
        description,
        platform,
        video_id,
        thumbnail,
        order_index,
        is_active
      })
      .eq('id', validId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Videos PUT error:', err)
    return NextResponse.json({ error: 'Failed to update video' }, { status: 500 })
  }
}

// DELETE - Delete video
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { id } = await params
    const validId = validateId(id)
    if (!validId) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('videos')
      .delete()
      .eq('id', validId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Videos DELETE error:', err)
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
  }
}
