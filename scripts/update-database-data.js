import 'dotenv/config';

// Update database data using the existing API
const SUPABASE_URL = 'https://owfzhzdcughglvllnhei.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93ZnpoemRjdWdoZ2x2bGxuaGVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODI2NzksImV4cCI6MjA3NzU1ODY3OX0.CHHeWMRw6KwphbnyOexbtLs38e9o8c0cuMqUqxqByzE';

// Data updates for releases
const releaseUpdates = [
  {
    id: 1,
    slug: 'stormdrifter',
    artistSlug: 'rafa-kao',
    isLatest: true,
    audioFilePath: 'rafa-kao/stormdrifter.mp3',
    digitalReleaseDate: '2025-06-30',
    internalReference: 'TH019'
  },
  {
    id: 2,
    slug: 'aurora-ep',
    artistSlug: 'guri',
    isLatest: false,
    audioFilePath: 'guri/aurora.mp3',
    digitalReleaseDate: '2024-08-09',
    internalReference: 'TH017'
  },
  {
    id: 3,
    slug: 'magnetosphere',
    artistSlug: 'guri',
    isLatest: false,
    audioFilePath: 'guri/magnetosphere.mp3',
    digitalReleaseDate: '2024-05-06',
    internalReference: 'TH016'
  },
  {
    id: 4,
    slug: 'morphing',
    artistSlug: 'guri',
    isLatest: false,
    audioFilePath: 'guri/morphing.mp3',
    digitalReleaseDate: '2024-01-15',
    internalReference: 'TH015'
  },
  {
    id: 5,
    slug: 'ritual',
    artistSlug: 'guri',
    isLatest: false,
    audioFilePath: 'guri/ritual.mp3',
    digitalReleaseDate: '2024-11-15',
    internalReference: 'TH018'
  }
];

async function updateRelease(releaseId, data) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/releases?id=eq.${releaseId}`, {
      method: 'PATCH',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Updated release ${releaseId}:`, result);
    } else {
      const error = await response.text();
      console.log(`❌ Failed to update release ${releaseId}:`, error);
    }
  } catch (error) {
    console.log(`❌ Error updating release ${releaseId}:`, error.message);
  }
}

async function updateAllReleases() {
  console.log('🔄 Starting database data updates...');
  
  for (const update of releaseUpdates) {
    await updateRelease(update.id, update);
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('✅ Database update completed!');
}

updateAllReleases().catch(console.error);