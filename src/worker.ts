export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  DATABASE_URL: string;
  NODE_ENV: string;
  API_VERSION: string;
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

// Types matching the existing schema
interface Artist {
  id: number;
  name: string;
  bio?: string;
  genre?: string;
  imageUrl?: string;
  socialLinks?: string;
  createdAt: string;
}

interface Release {
  id: number;
  bundleId?: string;
  title: string;
  artist: string;
  artistId?: number;
  labelId?: string;
  label: string;
  ean?: string;
  bundleType: string;
  musicStyle: string;
  digitalReleaseDate?: string;
  published: string;
  coverFileName?: string;
  coverImageUrl?: string;
  imgUrl?: string;
  internalReference?: string;
  coverFileHash?: string;
  trackCount: number;
  beatportSaleUrl?: string;
  purchaseLink?: string;
  shareLink?: string;
  audioFileUrl?: string;
  featured: boolean;
  upcoming: boolean;
  description?: string;
  releaseDate?: string;
  createdAt: string;
  updateDate?: string;
}

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
function jsonResponse(data: any, status: number = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...headers,
    },
  });
}

function errorResponse(message: string, status: number = 500): Response {
  return jsonResponse({
    error: message,
    timestamp: new Date().toISOString(),
  }, status);
}

// Database helpers (using Supabase HTTP API)
async function supabaseQuery(env: Env, table: string, operation: 'select' | 'insert' | 'update', data?: any, filters?: Record<string, any>) {
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
    const data = await supabaseQuery(env, 'artists', 'select');
    return data.sort((a: Artist, b: Artist) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getArtist(env: Env, id: number): Promise<Artist | null> {
    const data = await supabaseQuery(env, 'artists', 'select', undefined, { id: id.toString() });
    return data[0] || null;
  },

  async createArtist(env: Env, artist: Omit<Artist, 'id' | 'createdAt'>): Promise<Artist> {
    const data = await supabaseQuery(env, 'artists', 'insert', artist);
    return data[0];
  },

  async getReleases(env: Env): Promise<Release[]> {
    const data = await supabaseQuery(env, 'releases', 'select');
    return data.sort((a: Release, b: Release) => {
      const dateA = new Date(a.digitalReleaseDate || a.createdAt).getTime();
      const dateB = new Date(b.digitalReleaseDate || b.createdAt).getTime();
      return dateB - dateA;
    });
  },

  async getFeaturedReleases(env: Env): Promise<Release[]> {
    const data = await supabaseQuery(env, 'releases', 'select', undefined, { featured: 'true' });
    return data.sort((a: Release, b: Release) => {
      const dateA = new Date(a.digitalReleaseDate || a.createdAt).getTime();
      const dateB = new Date(b.digitalReleaseDate || b.createdAt).getTime();
      return dateB - dateA;
    });
  },

  async getCatalogReleases(env: Env): Promise<Release[]> {
    const data = await supabaseQuery(env, 'releases', 'select', undefined, { upcoming: 'false' });
    return data.sort((a: Release, b: Release) => {
      const dateA = new Date(a.digitalReleaseDate || a.createdAt).getTime();
      const dateB = new Date(b.digitalReleaseDate || b.createdAt).getTime();
      return dateB - dateA;
    });
  },

  async getLatestReleaseWithAudio(env: Env): Promise<Release | null> {
    const data = await supabaseQuery(env, 'releases', 'select', undefined, { bundle_id: '10341902' });
    return data[0] || null;
  },

  async getRelease(env: Env, id: number): Promise<Release | null> {
    const data = await supabaseQuery(env, 'releases', 'select', undefined, { id: id.toString() });
    return data[0] || null;
  },

  async createRelease(env: Env, release: Omit<Release, 'id' | 'createdAt'>): Promise<Release> {
    const data = await supabaseQuery(env, 'releases', 'insert', release);
    return data[0];
  },

  async createContactSubmission(env: Env, submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<ContactSubmission> {
    const data = await supabaseQuery(env, 'contact_submissions', 'insert', submission);
    return data[0];
  },

  async getContactSubmissions(env: Env): Promise<ContactSubmission[]> {
    const data = await supabaseQuery(env, 'contact_submissions', 'select');
    return data.sort((a: ContactSubmission, b: ContactSubmission) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
};

// Route handlers
async function handleAPI(req: Request, env: Env, url: URL): Promise<Response> {
  const path = url.pathname;
  const method = req.method;

  // Health check
  if (path === '/health') {
    return jsonResponse({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
      version: env.API_VERSION || '1.0.0',
    });
  }

  // Root API endpoint
  if (path === '/api' && method === 'GET') {
    return jsonResponse({
      message: 'Tinnie House Records API',
      version: env.API_VERSION || '1.0.0',
    });
  }

  // Releases routes
  if (path.startsWith('/api/releases')) {
    if (path === '/api/releases' && method === 'GET') {
      const releases = await Storage.getReleases(env);
      return jsonResponse(releases);
    }

    if (path === '/api/releases/featured' && method === 'GET') {
      const releases = await Storage.getFeaturedReleases(env);
      return jsonResponse(releases);
    }

    if (path === '/api/releases/catalog' && method === 'GET') {
      const releases = await Storage.getCatalogReleases(env);
      return jsonResponse(releases);
    }

    if (path === '/api/releases/latest' && method === 'GET') {
      const release = await Storage.getLatestReleaseWithAudio(env);
      if (!release) {
        return errorResponse('No latest release found', 404);
      }
      return jsonResponse(release);
    }

    // GET /api/releases/:id
    const releaseIdMatch = path.match(/^\/api\/releases\/(\d+)$/);
    if (releaseIdMatch && method === 'GET') {
      const id = parseInt(releaseIdMatch[1]);
      if (isNaN(id)) {
        return errorResponse('Invalid release ID', 400);
      }
      const release = await Storage.getRelease(env, id);
      if (!release) {
        return errorResponse('Release not found', 404);
      }
      return jsonResponse(release);
    }

    // POST /api/releases
    if (path === '/api/releases' && method === 'POST') {
      try {
        const body = await req.json();
        const release = await Storage.createRelease(env, body);
        return jsonResponse(release, 201);
      } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to create release', 400);
      }
    }
  }

  // Artists routes
  if (path.startsWith('/api/artists')) {
    if (path === '/api/artists' && method === 'GET') {
      const artists = await Storage.getArtists(env);
      return jsonResponse(artists);
    }

    // GET /api/artists/:id
    const artistIdMatch = path.match(/^\/api\/artists\/(\d+)$/);
    if (artistIdMatch && method === 'GET') {
      const id = parseInt(artistIdMatch[1]);
      if (isNaN(id)) {
        return errorResponse('Invalid artist ID', 400);
      }
      const artist = await Storage.getArtist(env, id);
      if (!artist) {
        return errorResponse('Artist not found', 404);
      }
      return jsonResponse(artist);
    }

    // POST /api/artists
    if (path === '/api/artists' && method === 'POST') {
      try {
        const body = await req.json();
        const artist = await Storage.createArtist(env, body);
        return jsonResponse(artist, 201);
      } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to create artist', 400);
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
          return errorResponse('Invalid email format', 400);
        }
        
        const submission = await Storage.createContactSubmission(env, body);
        return jsonResponse({
          message: 'Contact form submitted successfully',
          id: submission.id,
        }, 201);
      } catch (error) {
        return errorResponse(error instanceof Error ? error.message : 'Failed to submit contact form', 400);
      }
    }

    if (method === 'GET') {
      const submissions = await Storage.getContactSubmissions(env);
      return jsonResponse(submissions);
    }
  }

  // 404 for unmatched routes
  return errorResponse('Not Found', 404);
}

// Main fetch handler
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
      return errorResponse('Not Found', 404);
      
    } catch (error) {
      console.error('Worker error:', error);
      return errorResponse('Internal Server Error', 500);
    }
  },
};