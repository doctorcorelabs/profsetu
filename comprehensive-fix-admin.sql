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
DELETE FROM admin_users WHERE username IN ('daivanlabs', 'setiyautama');

-- Insert admin user with correct credentials
-- Username: daivanlabs
-- Password: codecure
-- Hash: a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d
INSERT INTO admin_users (username, password_hash) 
VALUES ('daivanlabs', 'a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d');

-- Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows public read access
CREATE POLICY "Allow public read access to admin users" ON admin_users
  FOR SELECT USING (true);

-- Verify the admin user was created successfully
SELECT id, username, created_at FROM admin_users WHERE username = 'daivanlabs';

-- Test the policy by simulating a query
SELECT id, username FROM admin_users WHERE username = 'daivanlabs' AND password_hash = 'a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d';
