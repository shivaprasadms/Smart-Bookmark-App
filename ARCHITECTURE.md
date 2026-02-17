# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         User Browser                        │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   Tab 1      │              │   Tab 2      │            │
│  │              │              │              │            │
│  │  Next.js     │◄────────────►│  Next.js     │            │
│  │  Frontend    │  Real-time   │  Frontend    │            │
│  │              │  WebSocket   │              │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                             │                     │
└─────────┼─────────────────────────────┼─────────────────────┘
          │                             │
          │         HTTPS               │
          ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                     Vercel (Hosting)                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Next.js App Router                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   SSR Pages  │  │ API Routes   │  │  Middleware  │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Supabase Client SDK
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │    Auth      │  │  PostgreSQL  │  │   Realtime   │     │
│  │   (OAuth)    │  │   Database   │  │  (WebSocket) │     │
│  │              │  │              │  │              │     │
│  │  - Google    │  │  - bookmarks │  │  - Changes   │     │
│  │  - Session   │  │  - RLS       │  │  - Broadcast │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
          ▲
          │ OAuth Flow
          ▼
┌─────────────────────────────────────────────────────────────┐
│              Google OAuth 2.0                               │
│  - Identity Provider                                        │
│  - User Authentication                                      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Authentication Flow

```
User clicks "Sign in"
    │
    ▼
Redirect to Google OAuth
    │
    ▼
User authorizes app
    │
    ▼
Google redirects to /auth/callback
    │
    ▼
Exchange code for session
    │
    ▼
Store session in cookies
    │
    ▼
Redirect to home page
    │
    ▼
Display bookmarks
```

### 2. Add Bookmark Flow

```
User fills form
    │
    ▼
Click "Add Bookmark"
    │
    ▼
Client: supabase.from('bookmarks').insert()
    │
    ▼
Server: Verify auth.uid() matches user_id (RLS)
    │
    ▼
Insert into PostgreSQL
    │
    ▼
Trigger Realtime event
    │
    ├──► Tab 1: Listen on channel → Update UI
    │
    └──► Tab 2: Listen on channel → Update UI
```

### 3. Delete Bookmark Flow

```
User clicks "Delete"
    │
    ▼
Client: supabase.from('bookmarks').delete()
    │
    ▼
Server: Verify auth.uid() matches user_id (RLS)
    │
    ▼
Delete from PostgreSQL
    │
    ▼
Trigger Realtime event
    │
    ├──► Tab 1: Listen on channel → Update UI
    │
    └──► Tab 2: Listen on channel → Update UI
```

## Security Layers

### Row Level Security (RLS)

```sql
-- Users can only SELECT their own bookmarks
WHERE auth.uid() = user_id

-- Users can only INSERT with their own user_id
WITH CHECK (auth.uid() = user_id)

-- Users can only DELETE their own bookmarks
USING (auth.uid() = user_id)
```

### Authentication

```
┌─────────────────┐
│  Middleware     │ ← Every request
│  - Refresh JWT  │
│  - Verify user  │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Server Client  │ ← Server Components/Actions
│  - Cookie-based │
│  - Secure       │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│  Browser Client │ ← Client Components
│  - OAuth flow   │
│  - Realtime     │
└─────────────────┘
```

## Technology Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Hooks

### Backend
- **BaaS:** Supabase
- **Database:** PostgreSQL
- **Auth:** Supabase Auth (Google OAuth)
- **Realtime:** Supabase Realtime (WebSocket)

### Deployment
- **Hosting:** Vercel
- **CI/CD:** GitHub → Vercel (automatic)
- **SSL:** Automatic (Vercel)
- **Edge:** Global CDN

## File Structure

```
bookmark-app/
├── app/                      # Next.js App Router
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts      # OAuth callback
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home page
├── components/
│   ├── BookmarkList.tsx      # Main bookmark UI
│   └── LoginButton.tsx       # Google sign-in
├── lib/
│   └── supabase/
│       ├── client.ts         # Client-side SDK
│       └── server.ts         # Server-side SDK
├── middleware.ts             # Auth refresh
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind config
└── tsconfig.json             # TypeScript config
```

## Real-time Implementation

```typescript
// Subscribe to changes
const channel = supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', {
    event: '*',              // INSERT, UPDATE, DELETE
    schema: 'public',
    table: 'bookmarks',
    filter: `user_id=eq.${user.id}`  // Only user's data
  }, (payload) => {
    // Update local state
    if (payload.eventType === 'INSERT') {
      addToList(payload.new)
    } else if (payload.eventType === 'DELETE') {
      removeFromList(payload.old.id)
    }
  })
  .subscribe()

// Cleanup on unmount
return () => supabase.removeChannel(channel)
```

## Performance Considerations

### Optimizations
- ✅ Server-side rendering for initial load
- ✅ Optimistic UI updates
- ✅ Database indexes on user_id and created_at
- ✅ Real-time subscriptions per user (filtered)
- ✅ Minimal bundle size with tree-shaking
- ✅ CDN edge caching (Vercel)

### Scalability
- Database connection pooling (Supabase)
- Edge runtime support (Next.js)
- Horizontal scaling (Vercel)
- PostgreSQL indexes for fast queries

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL      → Client + Server
NEXT_PUBLIC_SUPABASE_ANON_KEY → Client + Server

Note: NEXT_PUBLIC_ prefix makes them available to browser
```

## API Endpoints

### Authentication
- `POST /auth/callback` - OAuth callback handler

### Database (via Supabase SDK)
- `SELECT * FROM bookmarks` - Fetch user's bookmarks
- `INSERT INTO bookmarks` - Add bookmark
- `DELETE FROM bookmarks WHERE id=?` - Remove bookmark

### Realtime
- `WebSocket /realtime/v1` - Real-time subscriptions
