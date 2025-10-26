-- Fix RLS Policies for Admin Dashboard
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public insert on posts" ON posts;
DROP POLICY IF EXISTS "Allow public update on posts" ON posts;
DROP POLICY IF EXISTS "Allow public delete on posts" ON posts;
DROP POLICY IF EXISTS "Allow public insert on post_tags" ON post_tags;
DROP POLICY IF EXISTS "Allow public update on post_tags" ON post_tags;
DROP POLICY IF EXISTS "Allow public delete on post_tags" ON post_tags;

-- Allow all operations on posts (for now - in production, add proper auth check)
CREATE POLICY "Allow public insert on posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on posts" ON posts
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on posts" ON posts
  FOR DELETE USING (true);

-- Allow all operations on post_tags
CREATE POLICY "Allow public insert on post_tags" ON post_tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on post_tags" ON post_tags
  FOR UPDATE USING (true);

CREATE POLICY "Allow public delete on post_tags" ON post_tags
  FOR DELETE USING (true);

-- Allow admin to read all posts (not just published)
DROP POLICY IF EXISTS "Allow public read all posts" ON posts;
CREATE POLICY "Allow public read all posts" ON posts
  FOR SELECT USING (true);
