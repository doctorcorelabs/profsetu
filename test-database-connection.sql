-- Test database connection and admin user
-- Run this in your Supabase SQL Editor to verify everything is working

-- Test 1: Check if admin_users table exists and is accessible
SELECT COUNT(*) as table_exists FROM information_schema.tables 
WHERE table_name = 'admin_users' AND table_schema = 'public';

-- Test 2: Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'admin_users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Test 3: Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admin_users' AND schemaname = 'public';

-- Test 4: Check existing policies
SELECT policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'admin_users';

-- Test 5: Check if admin user exists
SELECT id, username, created_at FROM admin_users WHERE username = 'daivanlabs';

-- Test 6: Test the exact query that the app will make
SELECT id, username FROM admin_users 
WHERE username = 'daivanlabs' 
AND password_hash = 'a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d';

-- Test 7: Test with wrong password (should return no results)
SELECT id, username FROM admin_users 
WHERE username = 'daivanlabs' 
AND password_hash = 'wrong_hash';
