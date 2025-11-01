// Add missing columns to the releases table
const SUPABASE_URL = 'https://owfzhzdcughglvllnhei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZnpoemRjdWdoZ2x2bGxuaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODI2NzksImV4cCI6MjA3NzU1ODY3OX0.CHHeWMRw6KwphbnyOexbtLs38e9o8c0cuMqUqxqByzE';

// SQL to add missing columns
const sqlQueries = [
  'ALTER TABLE releases ADD COLUMN IF NOT EXISTS slug TEXT;',
  'ALTER TABLE releases ADD COLUMN IF NOT EXISTS artist_slug TEXT;',
  'ALTER TABLE releases ADD COLUMN IF NOT EXISTS is_latest BOOLEAN DEFAULT FALSE;',
  'ALTER TABLE releases ADD COLUMN IF NOT EXISTS audio_file_path TEXT;'
];

async function executeSQL(sql) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ SQL executed:', sql);
      return result;
    } else {
      const error = await response.text();
      console.log('❌ SQL failed:', sql, '-', error);
      return null;
    }
  } catch (error) {
    console.log('❌ Error executing SQL:', sql, '-', error.message);
    return null;
  }
}

async function addColumns() {
  console.log('🔧 Adding missing columns to releases table...\n');
  
  for (const sql of sqlQueries) {
    await executeSQL(sql);
    await new Promise(resolve => setTimeout(resolve, 200)); // Small delay
  }
  
  console.log('\n✅ Column addition completed!');
  console.log('📝 Note: You may need to restart the server to pick up the schema changes.');
}

addColumns().catch(console.error);