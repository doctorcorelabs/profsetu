-- Simple and effective fix for admin login
-- Run this in your Supabase SQL Editor

-- Step 1: Disable RLS temporarily
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Step 2: Clear any existing admin users
DELETE FROM admin_users;

-- Step 3: Insert the correct admin user
-- Username: daivanlabs
-- Password: codecure
-- Hash: a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d
INSERT INTO admin_users (username, password_hash) 
VALUES ('daivanlabs', 'a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d');

-- Step 4: Re-enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Step 5: Create a simple policy
CREATE POLICY "Allow all operations on admin_users" ON admin_users
  FOR ALL USING (true);

-- Step 6: Verify the user was created
SELECT id, username, created_at FROM admin_users;

-- Step 7: Test the exact query
SELECT id, username FROM admin_users 
WHERE username = 'daivanlabs' 
AND password_hash = 'a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d';
