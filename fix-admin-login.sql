-- Fix admin login issues
-- Run this in your Supabase SQL Editor to fix the authentication problems

-- Update admin user with correct credentials
-- Username: daivanlabs
-- Password: codecure
-- Hash: a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d
INSERT INTO admin_users (username, password_hash) 
VALUES ('daivanlabs', 'a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Admin users are viewable by authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Allow public read access to admin users" ON admin_users;

-- Create new policy for admin users (allow public read access for authentication)
CREATE POLICY "Allow public read access to admin users" ON admin_users
  FOR SELECT USING (true);

-- Verify the admin user exists
SELECT username, created_at FROM admin_users WHERE username = 'daivanlabs';
