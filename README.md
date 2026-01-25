# Real Estate Frontend

A modern Next.js frontend for the Real Estate application, featuring property listings, search, user authentication, and dashboard.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (Postgres)
- **Search**: Algolia InstantSearch
- **Maps**: Mapbox GL
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (with backend set up)
- Algolia account
- Mapbox account

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy the environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

3. Update `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_ALGOLIA_APP_ID=your-algolia-app-id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your-search-api-key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=properties
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
rs-frontend/
├── app/
│   ├── (auth)/              # Auth pages (login, signup)
│   ├── (dashboard)/         # Dashboard pages (protected)
│   ├── (main)/              # Public pages
│   ├── auth/                # Auth callback handler
│   ├── globals.css          # Global styles
│   └── layout.tsx           # Root layout
├── components/
│   ├── dashboard/           # Dashboard components
│   ├── layout/              # Header, Footer
│   ├── property/            # Property cards, forms
│   └── search/              # Algolia search components
├── lib/
│   ├── algolia.ts           # Algolia client
│   ├── supabase/            # Supabase clients
│   └── utils.ts             # Utility functions
├── types/
│   └── database.ts          # TypeScript types
└── middleware.ts            # Auth middleware
```

## Features

### Public Pages
- **Home** (`/`): Hero section, featured properties, latest listings
- **Properties** (`/properties`): Filterable property list with pagination
- **Property Detail** (`/properties/[id]`): Full property details with gallery
- **Search** (`/search`): Algolia-powered instant search with facets

### Authentication
- **Login** (`/login`): Email/password and Google OAuth
- **Signup** (`/signup`): User registration with email verification
- **Auth Callback** (`/auth/callback`): OAuth callback handler

### Dashboard (Protected)
- **Overview** (`/dashboard`): Stats and quick actions
- **My Properties** (`/dashboard/properties`): Manage listings
- **Favorites** (`/dashboard/favorites`): Saved properties
- **Settings** (`/dashboard/settings`): Profile management

## Syncing Types with Backend

To keep types in sync with your backend:

```bash
# Option 1: Copy from backend
cp ../rs-backend/src/types/database.ts ./types/database.ts

# Option 2: Generate from Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
npm run typecheck # Run TypeScript check
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Algolia application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | Algolia search-only API key |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME` | Algolia index name (default: properties) |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox public access token |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build the production bundle:

```bash
npm run build
```

Start the server:

```bash
npm run start
```

## Related Projects

- [rs-backend](../rs-backend): Backend API with Supabase, Algolia, and Mapbox integration
# rs-frontend
