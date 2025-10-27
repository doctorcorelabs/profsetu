-- ============================================
-- Setup RSS News Table untuk Setiya Utama
-- ============================================
-- Jalankan file ini di Supabase SQL Editor
-- URL: https://app.supabase.com/project/YOUR_PROJECT/sql/new

-- 1. Buat tabel rss_news
CREATE TABLE IF NOT EXISTS public.rss_news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  link VARCHAR(1000) NOT NULL UNIQUE,
  pub_date TIMESTAMPTZ NOT NULL,
  source VARCHAR(255) NOT NULL,
  image_url VARCHAR(1000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '2 days')
);

-- 2. Buat index untuk performa
CREATE INDEX IF NOT EXISTS idx_rss_news_pub_date ON public.rss_news(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_rss_news_expires_at ON public.rss_news(expires_at);
CREATE INDEX IF NOT EXISTS idx_rss_news_source ON public.rss_news(source);
CREATE INDEX IF NOT EXISTS idx_rss_news_link ON public.rss_news(link);

-- 3. Enable Row Level Security
ALTER TABLE public.rss_news ENABLE ROW LEVEL SECURITY;

-- 4. Hapus policies yang ada (jika ada)
DROP POLICY IF EXISTS "Allow public read access to active rss_news" ON public.rss_news;
DROP POLICY IF EXISTS "Allow service role insert" ON public.rss_news;
DROP POLICY IF EXISTS "Allow service role update" ON public.rss_news;
DROP POLICY IF EXISTS "Allow service role delete" ON public.rss_news;
DROP POLICY IF EXISTS "Allow service role full access to rss_news" ON public.rss_news;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.rss_news;

-- 5. Buat policy untuk SELECT (public read)
CREATE POLICY "Enable read access for all users" 
ON public.rss_news 
FOR SELECT 
USING (true);

-- 6. Buat policy untuk INSERT (service role)
CREATE POLICY "Allow service role insert" 
ON public.rss_news 
FOR INSERT 
WITH CHECK (true);

-- 7. Buat policy untuk UPDATE (service role)
CREATE POLICY "Allow service role update" 
ON public.rss_news 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

-- 8. Buat policy untuk DELETE (service role)
CREATE POLICY "Allow service role delete" 
ON public.rss_news 
FOR DELETE 
USING (true);

-- 9. Function untuk cleanup expired news
CREATE OR REPLACE FUNCTION public.cleanup_expired_rss_news()
RETURNS void AS $$
BEGIN
  DELETE FROM public.rss_news WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Trigger untuk auto-cleanup
CREATE OR REPLACE FUNCTION public.trigger_cleanup_expired_rss_news()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM public.rss_news WHERE expires_at < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cleanup_expired_rss_news_trigger ON public.rss_news;

CREATE TRIGGER cleanup_expired_rss_news_trigger
  AFTER INSERT ON public.rss_news
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.trigger_cleanup_expired_rss_news();

-- 11. Berikan permission
GRANT ALL ON public.rss_news TO anon, authenticated, service_role;

-- ============================================
-- Verify Setup
-- ============================================
-- Jalankan query di bawah untuk verifikasi:

-- SELECT * FROM public.rss_news LIMIT 5;
-- SELECT * FROM pg_policies WHERE tablename = 'rss_news';
