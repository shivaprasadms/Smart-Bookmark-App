# Deployment Guide

This guide will walk you through deploying the Smart Bookmark Manager to Vercel.

## Pre-deployment Checklist

Before deploying, ensure you have completed:

- ✅ Created a Supabase project
- ✅ Created the bookmarks table with RLS policies
- ✅ Enabled Realtime for the bookmarks table
- ✅ Configured Google OAuth in Supabase
- ✅ Set up Google Cloud Console OAuth credentials
- ✅ Tested the app locally

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/your-username/bookmark-app.git
   git push -u origin main
   ```

2. **Ensure .env.local is in .gitignore** (it should be by default)

### Step 2: Deploy to Vercel

#### Method A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com/new)
2. Sign in with GitHub
3. Click "Import Project"
4. Select your bookmark-app repository
5. Configure your project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** .next (default)

6. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

7. Click "Deploy"

#### Method B: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? (select your account)
   - Link to existing project? **N**
   - What's your project's name? **bookmark-app**
   - In which directory is your code? **./**
   - Want to override the settings? **N**

5. **Add environment variables:**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   # Paste your Supabase URL when prompted
   
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   # Paste your Supabase anon key when prompted
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

### Step 3: Update Google OAuth Settings

After deployment, you'll receive a Vercel URL (e.g., `https://bookmark-app.vercel.app`).

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs:**
   ```
   https://your-app.vercel.app/auth/callback
   https://your-project.supabase.co/auth/v1/callback
   ```
5. Click **Save**

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Click "Sign in with Google"
3. Authorize the application
4. Add a test bookmark
5. Open the app in another tab
6. Verify real-time sync works

## Updating Your Deployment

### Automatic Deployments

Once connected to GitHub, Vercel will automatically deploy:
- **Production:** when you push to `main` branch
- **Preview:** when you create a pull request

### Manual Deployments

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Variables Management

### View Environment Variables

```bash
vercel env ls
```

### Add Environment Variables

```bash
vercel env add VARIABLE_NAME
```

### Remove Environment Variables

```bash
vercel env rm VARIABLE_NAME
```

### Pull Environment Variables Locally

```bash
vercel env pull .env.local
```

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Update DNS records as instructed
5. Update Google OAuth redirect URIs with your custom domain

## Troubleshooting

### Build Failures

**Error: Missing environment variables**
- Ensure all required env vars are set in Vercel dashboard
- Check for typos in variable names

**Error: Type errors during build**
- Run `npm run build` locally first
- Fix any TypeScript errors

### Runtime Errors

**OAuth redirect error**
- Verify redirect URIs in Google Cloud Console
- Check that URLs match exactly (http vs https)

**Supabase connection error**
- Verify environment variables are correct
- Check Supabase project is active
- Ensure NEXT_PUBLIC_ prefix is used

### Real-time Not Working

- Verify Realtime is enabled in Supabase
- Check browser console for WebSocket errors
- Ensure RLS policies are correctly configured

## Performance Optimization

### Enable Edge Runtime (Optional)

For faster response times, you can enable Edge Runtime for API routes:

1. Add to route handlers:
   ```typescript
   export const runtime = 'edge'
   ```

### Configure Caching

Add to `next.config.js`:
```javascript
module.exports = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // For Google profile pictures
  },
}
```

## Monitoring

### View Logs

```bash
vercel logs
```

### Analytics

Enable Vercel Analytics in your dashboard for:
- Page views
- Performance metrics
- User insights

## Security Best Practices

1. ✅ Never commit `.env.local` to Git
2. ✅ Use environment variables for all secrets
3. ✅ Enable RLS policies in Supabase
4. ✅ Use HTTPS only (Vercel does this by default)
5. ✅ Regularly rotate API keys
6. ✅ Monitor for suspicious activity

## Scaling Considerations

For high-traffic applications:

1. **Supabase:**
   - Upgrade to Pro plan for better performance
   - Enable connection pooling
   - Add database indexes

2. **Vercel:**
   - Upgrade to Pro for better limits
   - Use Edge Functions for global performance
   - Enable caching strategies

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

## Next Steps

After successful deployment:

1. ✅ Test all features in production
2. ✅ Set up monitoring and alerts
3. ✅ Consider adding custom domain
4. ✅ Enable analytics
5. ✅ Share your app!

Congratulations! Your Smart Bookmark Manager is now live! 🎉
