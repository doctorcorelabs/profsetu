-- Schema untuk RSS News dengan auto-expire setelah 3 hari
-- Jalankan ini di Supabase SQL Editor

-- Buat tabel rss_news
CREATE TABLE IF NOT EXISTS rss_news (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  link VARCHAR(1000) NOT NULL UNIQUE,
  pub_date TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(255) NOT NULL,
  image_url VARCHAR(1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '3 days')
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_rss_news_pub_date ON rss_news(pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_rss_news_expires_at ON rss_news(expires_at);
CREATE INDEX IF NOT EXISTS idx_rss_news_source ON rss_news(source);
CREATE INDEX IF NOT EXISTS idx_rss_news_link ON rss_news(link);

-- Enable RLS
ALTER TABLE rss_news ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active rss_news" ON rss_news;
DROP POLICY IF EXISTS "Allow service role full access to rss_news" ON rss_news;
DROP POLICY IF EXISTS "Allow service role insert" ON rss_news;
DROP POLICY IF EXISTS "Allow service role update" ON rss_news;
DROP POLICY IF EXISTS "Allow service role delete" ON rss_news;

-- Policy untuk public read access (hanya berita yang belum expired)
CREATE POLICY "Allow public read access to active rss_news" ON rss_news
  FOR SELECT USING (expires_at > NOW());

-- Policy untuk service role INSERT
CREATE POLICY "Allow service role insert" ON rss_news
  FOR INSERT WITH CHECK (true);

-- Policy untuk service role UPDATE
CREATE POLICY "Allow service role update" ON rss_news
  FOR UPDATE USING (true) WITH CHECK (true);

-- Policy untuk service role DELETE
CREATE POLICY "Allow service role delete" ON rss_news
  FOR DELETE USING (true);

-- Function untuk cleanup otomatis berita expired
CREATE OR REPLACE FUNCTION cleanup_expired_rss_news()
RETURNS void AS $$
BEGIN
  DELETE FROM rss_news WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-cleanup saat insert (opsional)
CREATE OR REPLACE FUNCTION trigger_cleanup_expired_rss_news()
RETURNS TRIGGER AS $$
BEGIN
  -- Hapus berita yang sudah expired saat ada insert baru
  DELETE FROM rss_news WHERE expires_at < NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cleanup_expired_rss_news_trigger ON rss_news;

CREATE TRIGGER cleanup_expired_rss_news_trigger
  AFTER INSERT ON rss_news
  FOR EACH STATEMENT
  EXECUTE FUNCTION trigger_cleanup_expired_rss_news();
