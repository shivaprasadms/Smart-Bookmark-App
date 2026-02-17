# Setup Checklist

Use this checklist to ensure everything is configured correctly.

## 📋 Pre-Deployment Setup

### Supabase Configuration

- [ ] **Create Supabase Project**
  - [ ] Sign up at supabase.com
  - [ ] Create new project
  - [ ] Wait for initialization to complete
  - [ ] Note your project URL and anon key

- [ ] **Database Setup**
  - [ ] Open SQL Editor in Supabase
  - [ ] Run the SQL from `supabase-setup.sql`
  - [ ] Verify table created: `SELECT * FROM bookmarks;`
  - [ ] Verify RLS enabled
  - [ ] Verify all 3 policies created (SELECT, INSERT, DELETE)

- [ ] **Enable Realtime**
  - [ ] Go to Database → Replication
  - [ ] Find `bookmarks` table
  - [ ] Toggle replication ON
  - [ ] Verify status shows "Enabled"

- [ ] **Configure Google OAuth in Supabase**
  - [ ] Go to Authentication → Providers
  - [ ] Click on Google
  - [ ] Note the Callback URL (needed for Google Cloud)
  - [ ] Keep this page open

### Google Cloud Platform Configuration

- [ ] **Create/Select Project**
  - [ ] Go to console.cloud.google.com
  - [ ] Create new project OR select existing
  - [ ] Note your project name

- [ ] **Configure OAuth Consent Screen**
  - [ ] APIs & Services → OAuth consent screen
  - [ ] User Type: External
  - [ ] Fill in app name and user support email
  - [ ] Add your email as developer contact
  - [ ] Save and continue through all steps

- [ ] **Create OAuth Credentials**
  - [ ] APIs & Services → Credentials
  - [ ] Create Credentials → OAuth client ID
  - [ ] Application type: Web application
  - [ ] Add Authorized redirect URIs:
    - [ ] `https://your-project.supabase.co/auth/v1/callback`
    - [ ] `http://localhost:3000/auth/callback`
  - [ ] Create and copy Client ID
  - [ ] Copy Client Secret

- [ ] **Connect to Supabase**
  - [ ] Return to Supabase Authentication → Providers → Google
  - [ ] Paste Client ID
  - [ ] Paste Client Secret
  - [ ] Save

### Local Development Setup

- [ ] **Install Dependencies**
  - [ ] Run `npm install`
  - [ ] Wait for completion
  - [ ] Check for any errors

- [ ] **Environment Variables**
  - [ ] Create `.env.local` file
  - [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Verify no spaces or quotes
  - [ ] Verify `.env.local` is in `.gitignore`

- [ ] **Test Locally**
  - [ ] Run `npm run dev`
  - [ ] Open http://localhost:3000
  - [ ] Verify app loads without errors
  - [ ] Check browser console for errors

### Local Testing

- [ ] **Authentication Flow**
  - [ ] Click "Sign in with Google"
  - [ ] Google OAuth consent screen appears
  - [ ] Select your Google account
  - [ ] Grant permissions
  - [ ] Redirected back to app
  - [ ] See your email displayed
  - [ ] Bookmark interface loads

- [ ] **Add Bookmark Feature**
  - [ ] Enter a title
  - [ ] Enter a URL (with https://)
  - [ ] Click "Add Bookmark"
  - [ ] Bookmark appears in list
  - [ ] Form clears after submission

- [ ] **Real-time Sync**
  - [ ] Open app in second browser tab
  - [ ] Both tabs show same bookmarks
  - [ ] Add bookmark in Tab 1
  - [ ] Verify appears in Tab 2 instantly (no refresh)
  - [ ] Delete bookmark in Tab 2
  - [ ] Verify disappears from Tab 1 instantly

- [ ] **Delete Feature**
  - [ ] Hover over bookmark
  - [ ] Delete button appears
  - [ ] Click delete
  - [ ] Bookmark removed from list

- [ ] **Privacy/Isolation**
  - [ ] Sign out
  - [ ] Sign in with different Google account
  - [ ] Verify no bookmarks from first account
  - [ ] Add test bookmark
  - [ ] Sign out and back to first account
  - [ ] Verify only first account's bookmarks visible

## 🚀 Deployment

### Prepare for Deployment

- [ ] **Code Repository**
  - [ ] Initialize git: `git init`
  - [ ] Create GitHub repository
  - [ ] Add remote: `git remote add origin <url>`
  - [ ] Commit all files: `git add . && git commit -m "Initial commit"`
  - [ ] Push to GitHub: `git push -u origin main`
  - [ ] Verify all files uploaded
  - [ ] Verify `.env.local` is NOT in repository

### Vercel Deployment

- [ ] **Connect to Vercel**
  - [ ] Go to vercel.com
  - [ ] Sign in with GitHub
  - [ ] Import repository
  - [ ] Select bookmark-app repository

- [ ] **Configure Project**
  - [ ] Framework: Next.js (auto-detected)
  - [ ] Root directory: ./
  - [ ] Build command: default
  - [ ] Output directory: default

- [ ] **Add Environment Variables**
  - [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Double-check values are correct
  - [ ] No trailing slashes or spaces

- [ ] **Deploy**
  - [ ] Click Deploy
  - [ ] Wait for build to complete
  - [ ] Note your Vercel URL
  - [ ] Visit the URL to verify it works

### Post-Deployment Configuration

- [ ] **Update Google OAuth**
  - [ ] Go to Google Cloud Console
  - [ ] APIs & Services → Credentials
  - [ ] Edit your OAuth client ID
  - [ ] Add authorized redirect URI:
    - [ ] `https://your-app.vercel.app/auth/callback`
  - [ ] Save changes

- [ ] **Test Production Deployment**
  - [ ] Visit your Vercel URL
  - [ ] Click "Sign in with Google"
  - [ ] Verify authentication works
  - [ ] Add test bookmark
  - [ ] Verify bookmark saves
  - [ ] Open in second tab
  - [ ] Verify real-time sync works
  - [ ] Delete bookmark
  - [ ] Verify deletion works

## ✅ Final Verification

### Feature Checklist

- [ ] ✅ Google OAuth sign-in works
- [ ] ✅ Email/password login disabled (Google only)
- [ ] ✅ Can add bookmarks (URL + title)
- [ ] ✅ Bookmarks are private per user
- [ ] ✅ Real-time updates work across tabs
- [ ] ✅ Can delete own bookmarks
- [ ] ✅ App deployed on Vercel
- [ ] ✅ Live URL accessible
- [ ] ✅ All requirements met

### Technical Checklist

- [ ] ✅ Uses Next.js App Router
- [ ] ✅ Supabase for Auth, Database, Realtime
- [ ] ✅ Tailwind CSS for styling
- [ ] ✅ TypeScript enabled
- [ ] ✅ RLS policies protect data
- [ ] ✅ No console errors
- [ ] ✅ Mobile responsive
- [ ] ✅ Fast page load

### Security Checklist

- [ ] ✅ Environment variables not in repository
- [ ] ✅ RLS policies enabled
- [ ] ✅ User can only see own data
- [ ] ✅ HTTPS enabled (Vercel default)
- [ ] ✅ OAuth properly configured
- [ ] ✅ No API keys exposed in client

## 🎉 Success!

If all items are checked, congratulations! Your Smart Bookmark Manager is:
- ✅ Fully functional
- ✅ Securely deployed
- ✅ Production-ready
- ✅ Meeting all requirements

## 📝 Notes

Keep track of your credentials (store securely):
- Supabase Project URL: ___________________________
- Supabase Anon Key: ___________________________
- Google Client ID: ___________________________
- Vercel URL: ___________________________
- GitHub Repository: ___________________________

## 🆘 Troubleshooting

If any item fails, refer to:
- `README.md` - Detailed setup instructions
- `DEPLOYMENT.md` - Deployment troubleshooting
- `QUICKSTART.md` - Quick reference guide

Common issues:
- Redirect URI mismatch → Check Google Cloud Console
- Real-time not working → Enable Replication in Supabase
- Build fails → Check environment variables in Vercel
- Auth not working → Verify OAuth credentials
