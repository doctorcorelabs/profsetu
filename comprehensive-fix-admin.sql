-- Comprehensive fix for admin login issues
-- Run this in your Supabase SQL Editor

-- First, let's check if the table exists and its structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' AND table_schema = 'public';

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_users';

-- Drop all existing policies on admin_users
DROP POLICY IF EXISTS "Admin users are viewable by authenticated users" ON admin_users;
DROP POLICY IF EXISTS "Allow public read access to admin users" ON admin_users;

-- Temporarily disable RLS to ensure we can insert/update data
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Clear any existing admin users
DELETE FROM admin_users WHERE username IN ('YOUR_USERNAME', 'setiyautama');

-- Insert admin user with correct credentials
-- IMPORTANT: Replace 'YOUR_USERNAME' and 'YOUR_PASSWORD_HASH' with actual values
-- Generate password hash using: crypto.createHash('sha256').update('your_password').digest('hex')
INSERT INTO admin_users (username, password_hash) 
VALUES ('YOUR_USERNAME', 'YOUR_PASSWORD_HASH');

-- Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows public read access
CREATE POLICY "Allow public read access to admin users" ON admin_users
  FOR SELECT USING (true);

-- Verify the admin user was created successfully
SELECT id, username, created_at FROM admin_users WHERE username = 'YOUR_USERNAME';

-- Test the policy by simulating a query
SELECT id, username FROM admin_users WHERE username = 'YOUR_USERNAME' AND password_hash = 'YOUR_PASSWORD_HASH';
