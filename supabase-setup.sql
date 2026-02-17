-- Smart Bookmark Manager - Database Setup Script
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. Create the bookmarks table
-- ============================================

CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- ============================================
-- 2. Enable Row Level Security (RLS)
-- ============================================

ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Create RLS Policies
-- ============================================

-- Policy: Users can view only their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert only their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete only their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 4. Create Indexes for Better Performance
-- ============================================

-- Index on user_id for faster queries
CREATE INDEX IF NOT EXISTS bookmarks_user_id_idx 
  ON bookmarks(user_id);

-- Index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS bookmarks_created_at_idx 
  ON bookmarks(created_at DESC);

-- ============================================
-- 5. Enable Realtime (Run this separately)
-- ============================================

-- Note: You also need to enable Realtime in the Supabase Dashboard
-- Go to Database → Replication → Enable for 'bookmarks' table

-- ============================================
-- Verification Queries
-- ============================================

-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'bookmarks';

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'bookmarks';

-- Check policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'bookmarks';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'bookmarks';
