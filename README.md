# Tinnie House Records Website

A modern, full-stack electronic music label website built with React, Express.js, and PostgreSQL. Showcases underground electronic music talent with a focus on techno, melodic techno, and progressive house genres from Australia and beyond.

## 🎵 Live Website

Visit the live website: [Tinnie House Records](https://www.beatport.com/label/tinnie-house-records/50650)

## 🚀 Features

### Core Functionality
- **Dynamic Music Player**: Full-featured audio player with play/pause, volume control, and progress tracking
- **Release Carousel**: Interactive showcase of catalog releases with hover effects and compact music players
- **Artist Showcase**: Featured artists section with dynamic content management
- **Contact System**: Professional contact form with database storage for demo submissions
- **Theme Toggle**: Complete dark/light mode support with persistent user preferences

### Design & User Experience
- **Responsive Design**: Mobile-first approach with seamless tablet and desktop experiences
- **Glass Morphism**: Modern blur card effects with backdrop filters
- **Custom Animations**: Floating animations, pulse glows, and smooth transitions
- **Orbitron Typography**: Futuristic font matching the electronic music aesthetic
- **Custom Button Styling**: Unique clip-path polygon buttons with gradient effects

### Content Management
- **Database-Driven Content**: Dynamic releases, artists, and metadata management
- **Audio File Streaming**: Express.js server handles MP3 file delivery
- **External Platform Integration**: Direct links to Beatport, SoundCloud, and social media
- **SEO Optimization**: Meta tags and Open Graph support for social sharing

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling with custom configuration
- **Wouter** for client-side routing
- **TanStack Query** for server state management
- **React Hook Form** with Zod validation
- **Shadcn/ui** component library
- **Framer Motion** for animations

### Backend
- **Express.js** server with TypeScript support
- **PostgreSQL** database with connection pooling
- **Drizzle ORM** for type-safe database operations
- **Passport.js** authentication system (ready for admin features)
- **Session management** with connect-pg-simple

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for fast compilation
- **Drizzle Kit** for database migrations
- **Hot Module Replacement** for instant development feedback

## 📁 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Shadcn/ui components
│   │   │   ├── contact-form.tsx
│   │   │   ├── music-player.tsx
│   │   │   ├── release-carousel.tsx
│   │   │   └── theme-toggle.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Route components
│   │   └── main.tsx       # Application entry point
│   └── index.html
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database operations interface
│   └── vite.ts           # Vite development integration
├── shared/               # Shared TypeScript types and schemas
│   └── schema.ts         # Drizzle database schema and Zod types
├── attached_assets/      # Static assets (audio files, images)
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
└── drizzle.config.ts     # Database configuration
```

## 🗄️ Database Schema

### Users Table
- User authentication and profile management
- Fields: id, username, email, password hash, created/updated timestamps

### Artists Table
- Artist profiles and information
- Fields: id, name, bio, genre, image URL, social links

### Releases Table
- Music release metadata and links
- Fields: id, title, artist, catalog number, release dates, cover art, audio files, purchase/share links

### Contact Submissions Table
- Demo submissions and contact form data
- Fields: id, name, email, message, submission timestamp

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tinnie-house-records
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Database connection
   DATABASE_URL=postgresql://username:password@localhost:5432/tinnie_house
   
   # Development/Production mode
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

## 📝 Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🎨 Styling System

### Theme Configuration
- **Dark Theme**: Deep blue gradients with high contrast text
- **Light Theme**: Clean whites with subtle blue accents
- **CSS Variables**: Consistent color system across components

### Custom Components
- **Blur Cards**: Glass morphism effects with backdrop filters
- **Polygon Buttons**: Unique clip-path styling with gradients
- **Grid Overlays**: Subtle background patterns
- **Pulse Animations**: Dynamic glow effects for interactive elements

### Responsive Breakpoints
- Mobile: `< 768px`
- Tablet: `768px - 1024px`  
- Desktop: `> 1024px`

## 🔌 API Endpoints

### Releases
- `GET /api/releases/latest` - Get the latest/featured release
- `GET /api/releases/catalog` - Get all catalog releases
- `GET /api/releases/featured` - Get featured releases

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get specific artist

### Contact
- `POST /api/contact` - Submit contact form

### Audio Streaming
- `GET /assets/:filename` - Stream audio files

## 🔐 Security Features

- **Input Validation**: Zod schemas for all form inputs
- **SQL Injection Protection**: Parameterized queries via Drizzle ORM
- **Session Security**: Secure session configuration
- **CORS Configuration**: Proper cross-origin resource sharing
- **Error Handling**: Comprehensive error boundaries and logging

## 🌐 Deployment

### Production Build
```bash
npm run build
```

### Environment Setup
- Set `NODE_ENV=production`
- Configure production database URL
- Set up proper CORS origins
- Configure session secrets

### Replit Deployment
The project is configured for Replit Deployments with:
- Automatic builds via GitHub integration
- PostgreSQL database provisioning
- Custom domain support
- SSL/TLS certificates
- Health check monitoring

## 🎵 Audio Integration

### Supported Formats
- MP3 (primary)
- WAV (fallback)
- OGG (web optimization)

### Audio Features
- **Streaming**: Progressive loading for large files
- **Controls**: Play/pause, volume, progress scrubbing
- **Responsive**: Mobile-optimized touch controls
- **Preloading**: Smart audio preloading for smooth playback

## 📱 Social Media Integration

### Platforms
- **Beatport**: Official label page and release links
- **SoundCloud**: Music streaming and artist profiles
- **Instagram**: Visual content and stories
- **Twitter/X**: News and updates
- **Facebook**: Community engagement
- **YouTube**: Music videos and content
- **Juno Download**: Alternative music marketplace

### Sharing Features
- Native Web Share API support
- Fallback clipboard copying
- Open Graph meta tags for rich previews

## 🔧 Development Guidelines

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Consistent code formatting
- **Component Structure**: Single responsibility principle
- **Hooks**: Custom hooks for reusable logic
- **Error Boundaries**: Comprehensive error handling

### Database Operations
- **Type Safety**: Drizzle ORM with TypeScript integration
- **Migrations**: Schema versioning with drizzle-kit
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Indexed fields and efficient queries

### Performance Optimizations
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: WebP format with fallbacks
- **Caching**: HTTP caching headers and query caching
- **Bundle Analysis**: Regular bundle size monitoring

## 🐛 Troubleshooting

### Common Issues

**Database Connection Errors**
```bash
# Check database URL format
DATABASE_URL=postgresql://user:password@host:port/database

# Test connection
npm run db:push
```

**Audio Playback Issues**
- Verify audio file paths in `/attached_assets/`
- Check browser console for CORS errors
- Ensure files are properly encoded

**Build Failures**
- Clear node_modules: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run check`
- Verify environment variables

## 📄 Legal & Compliance

The website includes comprehensive legal pages:
- **Privacy Policy**: Data collection and usage practices
- **Terms of Service**: User agreements and platform rules  
- **Cookie Policy**: Browser storage and tracking information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📞 Support

For technical support or questions:
- **Email**: Contact through the website form
- **Issues**: GitHub issue tracker
- **Documentation**: This README and inline code comments

## 📊 Analytics & Monitoring

### Performance Metrics
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Bundle Size**: Regular analysis and optimization
- **Database Performance**: Query timing and optimization
- **User Experience**: Real user monitoring

### Error Tracking
- **Client-side**: React error boundaries
- **Server-side**: Express error handlers
- **Database**: Connection and query error logging
- **Production**: Comprehensive error reporting

---

## 🎧 About Tinnie House Records

Tinnie House Records is a cutting-edge electronic music label rooted in Australia's vibrant Gold Coast scene, championing the underground sounds that define tomorrow's dancefloors. While celebrating Australia's rich electronic heritage, we champion artists from every corner of the globe, with passion spanning techno, melodic techno, and progressive house.

**Our Mission**: Seeking groundbreaking sounds that transcend borders and move both body and soul.

---

*Built with ❤️ for the underground electronic music community*