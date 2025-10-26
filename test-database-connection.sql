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
-- IMPORTANT: Replace ADMIN_USERNAME with your actual username
SELECT id, username, created_at FROM admin_users WHERE username = 'ADMIN_USERNAME';

-- Test 6: Test the exact query that the app will make
-- IMPORTANT: Replace ADMIN_USERNAME and ADMIN_PASSWORD_HASH with actual values
SELECT id, username FROM admin_users 
WHERE username = 'ADMIN_USERNAME' 
AND password_hash = 'ADMIN_PASSWORD_HASH';

-- Test 7: Test with wrong password (should return no results)
SELECT id, username FROM admin_users 
WHERE username = 'ADMIN_USERNAME' 
AND password_hash = 'wrong_hash';
