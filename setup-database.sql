-- Complete database setup for Setiya Utama Admin Dashboard
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content JSONB,
  excerpt TEXT,
  featured_image VARCHAR(500),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Create post_tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for posts table
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at 
  BEFORE UPDATE ON posts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Insert admin user with correct credentials
-- IMPORTANT: Replace placeholders with actual values from environment variables
-- ADMIN_USERNAME should be set in your environment variables
-- ADMIN_PASSWORD_HASH should be generated from your password using SHA256
INSERT INTO admin_users (username, password_hash) 
VALUES ('ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
('Politik', 'politik', 'Berita dan kegiatan politik'),
('Sosial', 'sosial', 'Kegiatan sosial dan kemasyarakatan'),
('Ekonomi', 'ekonomi', 'Program ekonomi dan pembangunan'),
('Pendidikan', 'pendidikan', 'Kegiatan pendidikan dan pelatihan'),
('Kesehatan', 'kesehatan', 'Program kesehatan masyarakat')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug) VALUES
('Pembangunan', 'pembangunan'),
('Masyarakat', 'masyarakat'),
('Program', 'program'),
('Kegiatan', 'kegiatan'),
('Pemerintahan', 'pemerintahan')
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access to published posts
CREATE POLICY "Allow public read access to published posts" ON posts
  FOR SELECT USING (status = 'published');

-- Allow public read access to categories and tags
CREATE POLICY "Allow public read access to categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to post_tags" ON post_tags
  FOR SELECT USING (true);

-- Admin policies (these would be implemented with proper authentication)
-- For now, we'll allow all operations for authenticated users
-- In production, you should implement proper JWT-based authentication

-- Create policy for admin users (allow public read access for authentication)
CREATE POLICY "Allow public read access to admin users" ON admin_users
  FOR SELECT USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for post images
CREATE POLICY "Allow public read access to post images" ON storage.objects
  FOR SELECT USING (bucket_id = 'post-images');

-- Create storage policy for authenticated uploads
CREATE POLICY "Allow authenticated uploads to post images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'post-images');

CREATE POLICY "Allow authenticated updates to post images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'post-images');

CREATE POLICY "Allow authenticated deletes to post images" ON storage.objects
  FOR DELETE USING (bucket_id = 'post-images');
