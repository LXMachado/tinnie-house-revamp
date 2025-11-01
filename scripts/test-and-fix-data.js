import 'dotenv/config';
import fetch from 'node-fetch';

// Test the current API and check what data is being returned
const API_BASE = 'http://localhost:3001';

async function testAPI() {
  console.log('🔍 Testing API endpoints...\n');
  
  // Test health
  const healthResponse = await fetch(`${API_BASE}/health`);
  console.log('✅ Health:', await healthResponse.json());
  
  // Test artists
  const artistsResponse = await fetch(`${API_BASE}/api/artists`);
  const artists = await artistsResponse.json();
  console.log('🎨 Artists count:', artists.length);
  console.log('Sample artist:', artists[0]);
  
  // Test releases  
  const releasesResponse = await fetch(`${API_BASE}/api/releases`);
  const releases = await releasesResponse.json();
  console.log('\n🎵 Releases count:', releases.length);
  console.log('Sample release:', releases[0]);
  
  // Test latest release
  const latestResponse = await fetch(`${API_BASE}/api/releases/latest`);
  const latest = await latestResponse.json();
  console.log('\n⭐ Latest release:', latest);
  
  console.log('\n📊 Analysis:');
  console.log('- Artists data exists:', artists.length > 0);
  console.log('- Releases data exists:', releases.length > 0);
  console.log('- Latest release found:', latest !== null && latest !== undefined);
  console.log('- Frontend should be working if these return data');
}

testAPI().catch(console.error);