// Setup database tables for the website

async function setupDatabase() {
  const supabaseUrl = 'https://kxreiwwujohewvsxahwp.supabase.co';
  const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4cmVpd3d1am9oZXd2c3hhaHdwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODU1ODU1NSwiZXhwIjoyMDg0MTM0NTU1fQ.X93rVp05Jx3itBUjUJOY7wVCbOi8GZVa1akGNpPyRAc';

  const sql = `
    -- Create events table
    CREATE TABLE IF NOT EXISTS events (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      time TEXT,
      location TEXT,
      type TEXT NOT NULL CHECK (type IN ('upcoming', 'past')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Enable RLS
    ALTER TABLE events ENABLE ROW LEVEL SECURITY;

    -- Drop existing policy if exists and create new one
    DROP POLICY IF EXISTS "Allow all" ON events;
    CREATE POLICY "Allow all" ON events FOR ALL USING (true);
  `;

  console.log('Creating events table...');

  try {
    // Use Supabase SQL endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Prefer': 'return=minimal'
      }
    });

    // The REST API doesn't support DDL, so we need to check if table exists
    const checkResponse = await fetch(`${supabaseUrl}/rest/v1/events?select=id&limit=1`, {
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`
      }
    });

    if (checkResponse.status === 404 || checkResponse.status === 400) {
      console.log('\n❌ Events table not found.');
      console.log('\n📋 Please copy and run this SQL in Supabase SQL Editor:\n');
      console.log('Go to: https://supabase.com/dashboard/project/kxreiwwujohewvsxahwp/sql/new\n');
      console.log(sql);
    } else {
      const data = await checkResponse.json();
      if (checkResponse.ok) {
        console.log('✅ Events table is ready!');
      } else {
        console.log('Response:', data);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

setupDatabase();
