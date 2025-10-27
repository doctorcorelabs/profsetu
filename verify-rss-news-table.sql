-- Verify RSS News Table dan RLS Policies
-- Jalankan query ini satu per satu di Supabase SQL Editor

-- 1. Check apakah tabel rss_news ada
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'rss_news';

-- 2. Check RLS policies untuk tabel rss_news
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'rss_news';

-- 3. Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'rss_news'
ORDER BY ordinal_position;

-- 4. Test insert sample data (untuk verify policies bekerja)
INSERT INTO public.rss_news (
    title, 
    description, 
    link, 
    pub_date, 
    source
) VALUES (
    'Test News',
    'This is a test news item',
    'https://example.com/test',
    NOW(),
    'Test Source'
);

-- 5. Check data
SELECT * FROM public.rss_news;

-- 6. Delete test data
DELETE FROM public.rss_news WHERE source = 'Test Source';
