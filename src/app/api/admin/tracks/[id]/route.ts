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

// PUT - Update track
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const { id } = await params
  const validId = validateId(id)
  if (!validId) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const body = await request.json()

  const { data, error } = await supabaseAdmin
    .from('tracks')
    .update({
      ...body,
      updated_at: new Date().toISOString()
    })
    .eq('id', validId)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// DELETE - Delete track
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  const { id } = await params
  const validId = validateId(id)
  if (!validId) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('tracks')
    .delete()
    .eq('id', validId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
