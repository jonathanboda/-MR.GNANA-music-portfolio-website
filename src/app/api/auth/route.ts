import { NextResponse } from 'next/server'
import crypto from 'crypto'

// Simple in-memory rate limiting (resets on server restart)
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return ip
}

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts) return false

  // Reset if window has passed
  if (now - attempts.firstAttempt > WINDOW_MS) {
    loginAttempts.delete(ip)
    return false
  }

  return attempts.count >= MAX_ATTEMPTS
}

function recordAttempt(ip: string): void {
  const now = Date.now()
  const attempts = loginAttempts.get(ip)

  if (!attempts || now - attempts.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now })
  } else {
    attempts.count++
  }
}

function clearAttempts(ip: string): void {
  loginAttempts.delete(ip)
}

// Create HMAC-signed token
function createToken(): string {
  const secret = process.env.ADMIN_PASSWORD || 'admin123'
  const timestamp = Date.now().toString()
  const data = `admin:${timestamp}`
  const signature = crypto.createHmac('sha256', secret).update(data).digest('hex')
  return Buffer.from(`${data}:${signature}`).toString('base64')
}

export async function POST(request: Request) {
  try {
    const ip = getClientIP(request)

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (password === adminPassword) {
      clearAttempts(ip)
      const token = createToken()
      return NextResponse.json({ success: true, token })
    }

    recordAttempt(ip)
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
  } catch {
    return NextResponse.json({ success: false, message: 'Error' }, { status: 500 })
  }
}
