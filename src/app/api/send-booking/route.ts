import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { validateAdminToken, unauthorizedResponse } from '@/lib/auth'
import { z } from 'zod'

// HTML escape function to prevent XSS
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }
  return text.replace(/[&<>"']/g, (char) => map[char])
}

// Zod schema for booking validation
const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(20, 'Phone number too long').optional().or(z.literal('')),
  eventType: z.string().min(1, 'Event type is required').max(50, 'Event type too long'),
  eventDate: z.string().min(1, 'Event date is required'),
  venue: z.string().min(2, 'Venue must be at least 2 characters').max(200, 'Venue too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message too long'),
})

export async function POST(request: Request) {
  try {
    const rawData = await request.json()

    // Validate with Zod
    const result = bookingSchema.safeParse(rawData)
    if (!result.success) {
      const errors = result.error.issues.map(e => e.message).join(', ')
      return NextResponse.json({ error: errors }, { status: 400 })
    }

    const data = result.data

    // Store booking in database
    const { error: dbError } = await supabaseAdmin
      .from('bookings')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        event_type: data.eventType,
        event_date: data.eventDate,
        venue: data.venue,
        message: data.message,
        status: 'new'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue anyway - try to send email even if DB fails
    }

    // Try to send email if Resend is configured
    const recipientEmail = process.env.BOOKING_EMAIL || 'mr.gnana08@gmail.com'
    const resendApiKey = process.env.RESEND_API_KEY

    if (resendApiKey) {
      // Escape all user input to prevent XSS
      const safeName = escapeHtml(data.name)
      const safeEmail = escapeHtml(data.email)
      const safePhone = escapeHtml(data.phone || 'Not provided')
      const safeEventType = escapeHtml(data.eventType)
      const safeEventDate = escapeHtml(data.eventDate)
      const safeVenue = escapeHtml(data.venue)
      const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>')

      const emailHtml = `
        <h2>New Booking Request</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Phone</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safePhone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Event Type</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeEventType}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Event Date</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeEventDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Venue/Location</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${safeVenue}</td>
          </tr>
        </table>
        <h3>Message:</h3>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">${safeMessage}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">This booking request was sent from your website.</p>
      `

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Booking Request <onboarding@resend.dev>',
            to: recipientEmail,
            subject: `New Booking Request: ${safeEventType} - ${safeEventDate}`,
            html: emailHtml,
            reply_to: data.email,
          }),
        })
      } catch (emailError) {
        console.error('Email send error:', emailError)
        // Don't fail the request if email fails - booking is saved in DB
      }
    }

    return NextResponse.json({ success: true, message: 'Booking request received!' })
  } catch (error) {
    console.error('Send booking error:', error)
    return NextResponse.json({ error: 'Failed to submit booking request' }, { status: 500 })
  }
}

// GET - Fetch all bookings (for admin)
export async function GET(request: Request) {
  if (!validateAdminToken(request)) {
    return unauthorizedResponse()
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json([])
    }

    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json([])
  }
}
