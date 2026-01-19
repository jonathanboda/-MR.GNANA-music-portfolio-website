import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Server-side client with service role (full access)
let supabaseAdmin: SupabaseClient

if (supabaseUrl && supabaseServiceKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
} else {
  // Create a mock client that will throw helpful errors
  const missingVars = []
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  if (!supabaseServiceKey) missingVars.push('SUPABASE_SERVICE_ROLE_KEY')

  console.error(`Missing environment variables: ${missingVars.join(', ')}`)

  // Create a proxy that throws on any method call
  supabaseAdmin = new Proxy({} as SupabaseClient, {
    get() {
      throw new Error(`Supabase not configured. Missing: ${missingVars.join(', ')}. Add these to your Vercel environment variables.`)
    }
  })
}

export { supabaseAdmin }
