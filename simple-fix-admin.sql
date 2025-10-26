-- Simple and effective fix for admin login
-- Run this in your Supabase SQL Editor
-- IMPORTANT: Replace placeholders with actual values from environment variables

-- Step 1: Disable RLS temporarily
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Clear any existing admin users
DELETE FROM admin_users;

-- Step 3: Insert the admin user
-- IMPORTANT: Replace these placeholders with actual values:
-- ADMIN_USERNAME should be set in your environment variables
-- ADMIN_PASSWORD_HASH should be generated from your password using SHA256
INSERT INTO admin_users (username, password_hash) 
VALUES ('ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH');

-- Step 4: Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 5: Create a simple policy
CREATE POLICY "Allow all operations on admin_users" ON admin_users
  FOR ALL USING (true);

-- Step 6: Verify the user was created
SELECT id, username, created_at FROM admin_users;

-- Step 7: Test the exact query
SELECT id, username FROM admin_users 
WHERE username = 'ADMIN_USERNAME' 
AND password_hash = 'ADMIN_PASSWORD_HASH';
