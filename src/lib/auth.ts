import crypto from 'crypto'

export function validateAdminToken(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return false

  const token = authHeader.slice(7)

  try {
    const decoded = Buffer.from(token, 'base64').toString()
    const parts = decoded.split(':')

    // Handle both old format (admin:timestamp) and new format (admin:timestamp:signature)
    if (parts.length < 2) return false

    const [prefix, timestamp, signature] = parts
    if (prefix !== 'admin') return false

    // Check token age
    const tokenAge = Date.now() - parseInt(timestamp)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    if (tokenAge > maxAge) return false

    // If signature present, verify it (new token format)
    if (signature) {
      const secret = process.env.ADMIN_PASSWORD || 'admin123'
      const data = `admin:${timestamp}`
      const expectedSignature = crypto.createHmac('sha256', secret).update(data).digest('hex')

      // Use timing-safe comparison to prevent timing attacks
      if (signature.length !== expectedSignature.length) return false
      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))
    }

    // Allow old tokens for backward compatibility (will expire naturally)
    return true
  } catch {
    return false
  }
}

export function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: 'Unauthorized' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  })
}
