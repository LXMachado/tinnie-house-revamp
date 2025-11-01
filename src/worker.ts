import { mapSupabaseArtists, mapSupabaseReleases, type Artist, type Release } from '../shared/data-mapper';
import { STATIC_ARTISTS, STATIC_RELEASES } from '../shared/static-content';

export interface Env {
  SUPABASE_URL?: string;
  SUPABASE_ANON_KEY?: string;
  DATABASE_URL: string;
  NODE_ENV: string;
  API_VERSION: string;
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const hasSupabaseConfig = (env: Env): boolean =>
  Boolean(env.SUPABASE_URL && env.SUPABASE_ANON_KEY);

const cloneReleases = (): Release[] => STATIC_RELEASES.map((release) => ({ ...release }));
const cloneArtists = (): Artist[] => STATIC_ARTISTS.map((artist) => ({ ...artist }));

// Contact submission type
interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  status: string;
  createdAt: string;
}

// Simple validation schema (replacing zod for Workers)
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateRequired(value: any, field: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${field} is required`);
  }
}

// Response helpers
function jsonResponse(data: any, status: number = 200, headers: Record<string, string> = {}, origin: string = '*'): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      ...headers,
    },
  });
}

function errorResponse(message: string, status: number = 500, origin: string = '*'): Response {
  return jsonResponse({
    error: message,
    timestamp: new Date().toISOString(),
  }, status, {}, origin);
}

// Database helpers (using Supabase HTTP API)
async function supabaseQuery(env: Env, table: string, operation: 'select' | 'insert' | 'update', data?: any, filters?: Record<string, any>) {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('Supabase configuration is missing');
  }

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseKey = env.SUPABASE_ANON_KEY;

  let url = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/${table}`;
  
  // Add filters for select operations
  if (operation === 'select' && filters) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      params.append(key, `eq.${value}`);
    });
    if (params.toString()) {
      url += '?' + params.toString();
    }
  }
  
  const method = operation === 'select' ? 'GET' : operation === 'insert' ? 'POST' : 'PATCH';
  
  const options: RequestInit = {
    method,
    headers: {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
    },
  };
  
  if (operation === 'insert' && data) {
    (options.headers as any)['Prefer'] = 'return=representation';
    options.body = JSON.stringify(data);
  }
  
  if (operation === 'update' && data) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase API error (${response.status}): ${response.statusText} - ${errorText}`);
    }
    
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : [];
  } catch (error) {
    console.error('Supabase query error:', { url, method, error: error instanceof Error ? error.message : String(error) });
    throw error;
  }
}

// Storage operations (simplified for Workers)
const Storage = {
  async getArtists(env: Env): Promise<Artist[]> {
    if (!hasSupabaseConfig(env)) {
      return cloneArtists();
    }

    try {
      const supabaseData = await supabaseQuery(env, 'artists', 'select');
      return mapSupabaseArtists(supabaseData);
    } catch (error) {
      console.warn('Supabase artists query failed, using static data.', error);
      return cloneArtists();
    }
  },

  async getArtist(env: Env, id: number): Promise<Artist | null> {
    if (!hasSupabaseConfig(env)) {
      return cloneArtists().find((artist) => artist.id === id) ?? null;
    }

    try {
      const supabaseData = await supabaseQuery(env, 'artists', 'select', undefined, { id: id.toString() });
      const mappedData = mapSupabaseArtists(supabaseData);
      return mappedData[0] || null;
    } catch (error) {
      console.warn('Supabase artist query failed, using static data.', error);
      return cloneArtists().find((artist) => artist.id === id) ?? null;
    }
  },

  async createArtist(env: Env, artist: Omit<Artist, 'id'>): Promise<Artist> {
    if (!hasSupabaseConfig(env)) {
      throw new Error('Supabase configuration missing - cannot create artist.');
    }
    const supabaseData = await supabaseQuery(env, 'artists', 'insert', artist);
    const mappedData = mapSupabaseArtists(supabaseData);
    return mappedData[0];
  },

  async getReleases(env: Env): Promise<Release[]> {
    if (!hasSupabaseConfig(env)) {
      return cloneReleases();
    }

    try {
      const supabaseData = await supabaseQuery(env, 'releases', 'select');
      return mapSupabaseReleases(supabaseData).sort((a: Release, b: Release) => {
        const dateA = new Date(a.digitalReleaseDate || 0).getTime();
        const dateB = new Date(b.digitalReleaseDate || 0).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.warn('Supabase releases query failed, using static data.', error);
      return cloneReleases();
    }
  },

  async getFeaturedReleases(env: Env): Promise<Release[]> {
    if (!hasSupabaseConfig(env)) {
      return cloneReleases().filter((release) => release.featured);
    }

    try {
      const supabaseData = await supabaseQuery(env, 'releases', 'select', undefined, { featured: 'true' });
      return mapSupabaseReleases(supabaseData).sort((a: Release, b: Release) => {
        const dateA = new Date(a.digitalReleaseDate || 0).getTime();
        const dateB = new Date(b.digitalReleaseDate || 0).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.warn('Supabase featured releases query failed, using static data.', error);
      return cloneReleases().filter((release) => release.featured);
    }
  },

  async getCatalogReleases(env: Env): Promise<Release[]> {
    if (!hasSupabaseConfig(env)) {
      return cloneReleases().filter((release) => !release.upcoming);
    }

    try {
      const supabaseData = await supabaseQuery(env, 'releases', 'select', undefined, { upcoming: 'false' });
      return mapSupabaseReleases(supabaseData).sort((a: Release, b: Release) => {
        const dateA = new Date(a.digitalReleaseDate || 0).getTime();
        const dateB = new Date(b.digitalReleaseDate || 0).getTime();
        return dateB - dateA;
      });
    } catch (error) {
      console.warn('Supabase catalog releases query failed, using static data.', error);
      return cloneReleases().filter((release) => !release.upcoming);
    }
  },

  async getLatestReleaseWithAudio(env: Env): Promise<Release | null> {
    if (!hasSupabaseConfig(env)) {
      return cloneReleases().find((release) => release.isLatest) ?? null;
    }

    try {
      const supabaseData = await supabaseQuery(env, 'releases', 'select', undefined, { bundle_id: '10341902' });
      const mappedData = mapSupabaseReleases(supabaseData);
      return mappedData[0] || null;
    } catch (error) {
      console.warn('Supabase latest release query failed, using static data.', error);
      return cloneReleases().find((release) => release.isLatest) ?? null;
    }
  },

  async getRelease(env: Env, id: number): Promise<Release | null> {
    if (!hasSupabaseConfig(env)) {
      return cloneReleases().find((release) => release.id === id) ?? null;
    }

    try {
      const supabaseData = await supabaseQuery(env, 'releases', 'select', undefined, { id: id.toString() });
      const mappedData = mapSupabaseReleases(supabaseData);
      return mappedData[0] || null;
    } catch (error) {
      console.warn('Supabase release query failed, using static data.', error);
      return cloneReleases().find((release) => release.id === id) ?? null;
    }
  },

  async createRelease(env: Env, release: Omit<Release, 'id'>): Promise<Release> {
    if (!hasSupabaseConfig(env)) {
      throw new Error('Supabase configuration missing - cannot create release.');
    }
    const supabaseData = await supabaseQuery(env, 'releases', 'insert', release);
    const mappedData = mapSupabaseReleases(supabaseData);
    return mappedData[0];
  },

  async createContactSubmission(env: Env, submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<ContactSubmission> {
    if (!hasSupabaseConfig(env)) {
      throw new Error('Supabase configuration missing - cannot create contact submission.');
    }
    const supabaseData = await supabaseQuery(env, 'contact_submissions', 'insert', submission);
    return supabaseData[0];
  },

  async getContactSubmissions(env: Env): Promise<ContactSubmission[]> {
    if (!hasSupabaseConfig(env)) {
      return [];
    }
    const supabaseData = await supabaseQuery(env, 'contact_submissions', 'select');
    return supabaseData.sort((a: ContactSubmission, b: ContactSubmission) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};

// Route handlers
async function handleAPI(req: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname;
  const method = req.method;
  const origin = req.headers.get('Origin') || '*';

  // Health check
  if (path === '/health') {
    return jsonResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
      version: env.API_VERSION || '1.0.0',
    }, 200, {}, origin);
  }

  // Root API endpoint
  if (path === '/api' && method === 'GET') {
    return jsonResponse({
      message: 'Tinnie House Records API',
      version: env.API_VERSION || '1.0.0',
    }, 200, {}, origin);
  }

  // Releases routes
  if (path.startsWith('/api/releases')) {
    if (path === '/api/releases' && method === 'GET') {
      const releases = await Storage.getReleases(env);
      return jsonResponse(releases, 200, {}, origin);
    }

    if (path === '/api/releases/featured' && method === 'GET') {
      const releases = await Storage.getFeaturedReleases(env);
      return jsonResponse(releases, 200, {}, origin);
    }

    if (path === '/api/releases/catalog' && method === 'GET') {
      const releases = await Storage.getCatalogReleases(env);
      return jsonResponse(releases, 200, {}, origin);
    }

    if (path === '/api/releases/latest' && method === 'GET') {
      const release = await Storage.getLatestReleaseWithAudio(env);
      if (!release) {
        return errorResponse('No latest release found', 404, origin);
      }
      return jsonResponse(release, 200, {}, origin);
    }

    // GET /api/releases/:id
    const releaseIdMatch = path.match(/^\/api\/releases\/(\d+)$/);
    if (releaseIdMatch && method === 'GET') {
      const id = parseInt(releaseIdMatch[1]);
      if (isNaN(id)) {
        return errorResponse('Invalid release ID', 400, origin);
      }
      const release = await Storage.getRelease(env, id);
      if (!release) {
        return errorResponse('Release not found', 404, origin);
      }
      return jsonResponse(release, 200, {}, origin);
    }

    // POST /api/releases
    if (path === '/api/releases' && method === 'POST') {
      try {
        const body = await req.json();
        const release = await Storage.createRelease(env, body);
        return jsonResponse(release, 201, {}, origin);
      } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to create release', 400, origin);
      }
    }
  }

  // Artists routes
  if (path.startsWith('/api/artists')) {
    if (path === '/api/artists' && method === 'GET') {
      const artists = await Storage.getArtists(env);
      return jsonResponse(artists, 200, {}, origin);
    }

    // GET /api/artists/:id
    const artistIdMatch = path.match(/^\/api\/artists\/(\d+)$/);
    if (artistIdMatch && method === 'GET') {
      const id = parseInt(artistIdMatch[1]);
      if (isNaN(id)) {
        return errorResponse('Invalid artist ID', 400, origin);
      }
      const artist = await Storage.getArtist(env, id);
      if (!artist) {
        return errorResponse('Artist not found', 404, origin);
      }
      return jsonResponse(artist, 200, {}, origin);
    }

    // POST /api/artists
    if (path === '/api/artists' && method === 'POST') {
      try {
        const body = await req.json();
        const artist = await Storage.createArtist(env, body);
        return jsonResponse(artist, 201, {}, origin);
      } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to create artist', 400, origin);
      }
    }
  }

  // Contact routes
  if (path === '/api/contact') {
    if (method === 'POST') {
      try {
        const body = await req.json();
        
        // Basic validation
        validateRequired(body.name, 'name');
        validateRequired(body.email, 'email');
        validateRequired(body.subject, 'subject');
        validateRequired(body.message, 'message');
        
        if (!validateEmail(body.email)) {
          return errorResponse('Invalid email format', 400, origin);
        }
        
        const submission = await Storage.createContactSubmission(env, body);
        return jsonResponse({
          message: 'Contact form submitted successfully',
          id: submission.id,
        }, 201, {}, origin);
      } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to submit contact form', 400, origin);
      }
    }

    if (method === 'GET') {
      const submissions = await Storage.getContactSubmissions(env);
      return jsonResponse(submissions, 200, {}, origin);
    }
  }

  // 404 for unmatched routes
  return errorResponse('Not Found', 404, origin);
}

// Main fetch handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const requestOrigin = request.headers.get('Origin') || '*';
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': requestOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Log request in development
    if (env.NODE_ENV === 'development') {
      console.log(`${request.method} ${url.pathname}`);
    }

    try {
      // API routes
      if (url.pathname.startsWith('/api') || url.pathname === '/health') {
        return await handleAPI(request, env, url);
      }

      // Static file serving (if needed)
      if (url.pathname.startsWith('/static/') || url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
        return await env.ASSETS.fetch(request);
      }

      // SPA fallback - serve index.html for all non-API routes
      if (env.NODE_ENV === 'production') {
        return await env.ASSETS.fetch(new Request(`${url.origin}/index.html`, request));
      }

      // In development, return 404 for non-API routes
      return errorResponse('Not Found', 404, requestOrigin);
      
    } catch (error) {
      console.error('Worker error:', error);
      return errorResponse('Internal Server Error', 500, requestOrigin);
    }
  },
};
