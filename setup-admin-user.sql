-- Setup admin user for Supabase
-- Run this in your Supabase SQL Editor

-- First, create the admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user with hashed password
-- Password: codecure
-- Hash: 8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4
INSERT INTO admin_users (username, password_hash) 
VALUES ('daivanlabs', '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users (allow public read access for authentication)
CREATE POLICY "Allow public read access to admin users" ON admin_users
  FOR SELECT USING (true);

