import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'

export async function POST(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as 'image' | 'audio'

    if (!file || !type) {
      return NextResponse.json({ error: 'Missing file or type' }, { status: 400 })
    }

    // File size limits (in bytes)
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024  // 10MB
    const MAX_AUDIO_SIZE = 50 * 1024 * 1024  // 50MB

    // Check file size
    if (type === 'image' && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'Image too large. Maximum size is 10MB.' }, { status: 400 })
    }

    if (type === 'audio' && file.size > MAX_AUDIO_SIZE) {
      return NextResponse.json({ error: 'Audio file too large. Maximum size is 50MB.' }, { status: 400 })
    }

    // Validate file type
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3']

    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid image type. Allowed: JPEG, PNG, GIF, WebP' }, { status: 400 })
    }

    if (type === 'audio' && !allowedAudioTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid audio type. Allowed: MP3, WAV, OGG' }, { status: 400 })
    }

    // Generate unique filename
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const bucket = type === 'image' ? 'images' : 'audio'

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
