-- Fix admin login issues
-- Run this in your Supabase SQL Editor to fix the authentication problems
-- IMPORTANT: Replace placeholders with actual values from environment variables

-- Update admin user with correct credentials
-- IMPORTANT: Replace these placeholders with actual values:
-- ADMIN_USERNAME should be set in your environment variables
-- ADMIN_PASSWORD_HASH should be generated from your password using SHA256
INSERT INTO admin_users (username, password_hash) 
VALUES ('ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admin users are viewable by authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Allow public read access to admin users" ON admin_users;

-- Create new policy for admin users (allow public read access for authentication)
CREATE POLICY "Allow public read access to admin users" ON admin_users
  FOR SELECT USING (true);

-- Verify the admin user exists
SELECT username, created_at FROM admin_users WHERE username = 'ADMIN_USERNAME';
