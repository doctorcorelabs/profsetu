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
-- IMPORTANT: Replace placeholders with actual values from environment variables
-- ADMIN_USERNAME should be set in your environment variables
-- ADMIN_PASSWORD_HASH should be generated from your password using SHA256
INSERT INTO admin_users (username, password_hash) 
VALUES ('ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash;

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users (allow public read access for authentication)
CREATE POLICY "Allow public read access to admin users" ON admin_users
  FOR SELECT USING (true);

