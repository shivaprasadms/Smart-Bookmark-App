# Quick Start Guide

Get your Smart Bookmark Manager up and running in 15 minutes!

## 🚀 Quick Setup (5 Steps)

### 1️⃣ Supabase Project (5 min)

1. Create account at [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details and wait for setup
4. Go to SQL Editor and run the script from `supabase-setup.sql`
5. Enable Realtime: **Database** → **Replication** → Toggle `bookmarks` table

### 2️⃣ Google OAuth (3 min)

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project (or select existing)
3. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
4. Configure consent screen (use your email)
5. Application type: **Web application**
6. Add redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
   - Find this in Supabase: **Authentication** → **Providers** → **Google**
7. Copy Client ID and Client Secret

### 3️⃣ Connect Google to Supabase (2 min)

1. In Supabase: **Authentication** → **Providers**
2. Enable **Google**
3. Paste Client ID and Client Secret from Google
4. Save

### 4️⃣ Local Development (2 min)

```bash
# Install dependencies
npm install

# Create .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here

# Get these from: Supabase → Settings → API

# Run locally
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5️⃣ Deploy to Vercel (3 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables when prompted
# Then deploy to production
vercel --prod
```

Or use [vercel.com](https://vercel.com) dashboard to import from GitHub.

**Important:** After deployment, add your Vercel URL to Google OAuth redirect URIs!

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] `bookmarks` table created with RLS policies
- [ ] Realtime enabled for `bookmarks` table
- [ ] Google OAuth configured
- [ ] Environment variables set
- [ ] App runs locally
- [ ] Can sign in with Google
- [ ] Can add bookmarks
- [ ] Can delete bookmarks
- [ ] Real-time sync works (test with 2 tabs)
- [ ] Deployed to Vercel
- [ ] Production Google OAuth configured

## 🎯 Test Real-time Feature

1. Open app in two browser tabs
2. Sign in to both
3. Add bookmark in Tab 1
4. See it appear in Tab 2 instantly!
5. Delete bookmark in Tab 2
6. See it disappear from Tab 1!

## 🆘 Common Issues

**"Invalid redirect URL"**
→ Check Google Cloud Console redirect URIs match Supabase callback URL

**"No bookmarks appear"**
→ Check RLS policies are set up correctly in Supabase

**"Real-time not working"**
→ Enable Replication for bookmarks table in Supabase Dashboard

**Build fails on Vercel**
→ Check environment variables are set in Vercel dashboard

## 📚 Full Documentation

- See `README.md` for detailed setup
- See `DEPLOYMENT.md` for deployment details
- See `supabase-setup.sql` for database schema

## 🎉 You're Done!

Your bookmark manager is live! Share the URL and start bookmarking!
