# Smart Bookmark Manager

A modern, real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

✅ Google OAuth authentication (no email/password)  
✅ Add bookmarks with URL and title  
✅ Private bookmarks per user  
✅ Real-time synchronization across tabs  
✅ Delete bookmarks  
✅ Clean, responsive UI with Tailwind CSS  
✅ Deployed on Vercel

## Tech Stack

- **Next.js 14** (App Router)
- **Supabase** (Auth, Database, Realtime)
- **Tailwind CSS** (Styling)
- **TypeScript** (Type safety)

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google Cloud Platform account (for OAuth)
- A Vercel account (for deployment)

## Setup Instructions

### 1. Supabase Setup

#### Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

#### Create the Bookmarks Table

Run this SQL in the Supabase SQL Editor:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
```

#### Enable Realtime

1. In your Supabase dashboard, go to **Database** → **Replication**
2. Enable replication for the `bookmarks` table

#### Configure Google OAuth

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable the Google provider
3. Note the **Callback URL** (you'll need this for Google Cloud Console)

### 2. Google Cloud Platform Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add these authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback` (from Supabase)
   - `http://localhost:3000/auth/callback` (for local development)
8. Copy the **Client ID** and **Client Secret**
9. Add these to Supabase:
   - Go back to Supabase → **Authentication** → **Providers** → **Google**
   - Paste your Client ID and Client Secret
   - Save the configuration

### 3. Local Development

#### Clone and Install

```bash
# Clone this repository (or copy the files)
cd bookmark-app

# Install dependencies
npm install
```

#### Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

You can find these values in your Supabase project settings under **Project Settings** → **API**.

#### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Vercel Deployment

#### Option 1: Deploy via GitHub

1. Push your code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New** → **Project**
4. Import your repository
5. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click **Deploy**

#### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts and add environment variables when asked
```

#### Update Google OAuth Redirect URIs

After deployment, add your Vercel URL to Google Cloud Console:

1. Go to Google Cloud Console → **Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add to authorized redirect URIs:
   - `https://your-app.vercel.app/auth/callback`

## Project Structure

```
bookmark-app/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # OAuth callback handler
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── BookmarkList.tsx          # Bookmark list with real-time updates
│   └── LoginButton.tsx           # Google sign-in button
├── lib/
│   └── supabase/
│       ├── client.ts             # Client-side Supabase client
│       └── server.ts             # Server-side Supabase client
├── middleware.ts                 # Auth session refresh
├── .env.local.example            # Environment variables template
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## How It Works

### Authentication Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. After approval, Google redirects to `/auth/callback`
4. Callback handler exchanges code for session
5. User is redirected to the home page
6. Session is stored in cookies

### Real-time Updates

The app uses Supabase Realtime to listen for database changes:

```typescript
supabase
  .channel('bookmarks-changes')
  .on('postgres_changes', { ... }, (payload) => {
    // Update UI in real-time
  })
  .subscribe()
```

When a bookmark is added or deleted in one tab, all other tabs automatically update without refresh.

### Row Level Security

Supabase RLS policies ensure that:
- Users can only see their own bookmarks
- Users can only add bookmarks to their own account
- Users can only delete their own bookmarks

## Testing Real-time Functionality

1. Open your app in two different browser tabs
2. Sign in to both tabs
3. Add a bookmark in one tab
4. Watch it appear instantly in the other tab
5. Delete a bookmark in one tab
6. Watch it disappear from the other tab

## Troubleshooting

### "Invalid redirect URL" error

- Make sure you've added all redirect URLs to Google Cloud Console
- Check that the URLs match exactly (including http/https)

### Bookmarks not appearing

- Check Supabase RLS policies are correctly set up
- Verify the user is authenticated
- Check browser console for errors

### Real-time not working

- Ensure Replication is enabled for the bookmarks table in Supabase
- Check that the Supabase Realtime service is running
- Verify the channel subscription is active

## License

MIT

## Support

For issues or questions, please check the documentation or create an issue in the repository.
