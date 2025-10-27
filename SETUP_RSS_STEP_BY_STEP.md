# 📰 Setup RSS News Indonesia - Step by Step Guide

## ⚠️ Problem yang Dialami
Error 401 Unauthorized saat mengakses tabel `rss_news` - tabel belum dibuat atau RLS policies salah.

## ✅ Solusi

### Step 1: Setup Database di Supabase

1. **Buka Supabase Dashboard:**
   - Login ke https://app.supabase.com
   - Pilih project Anda

2. **Buka SQL Editor:**
   - Klik menu "SQL Editor" di sidebar kiri
   - Klik "New query"

3. **Copy paste dan jalankan file SQL:**
   - Buka file `setup-rss-news.sql`
   - Copy semua isinya
   - Paste di SQL Editor
   - Klik "Run" (atau tekan Ctrl+Enter)

4. **Verify tabel sudah dibuat:**
   ```sql
   SELECT * FROM public.rss_news LIMIT 1;
   ```
   Seharusnya tidak ada error.

### Step 2: Cek Environment Variables di Netlify

1. **Buka Netlify Dashboard:**
   - Login ke https://app.netlify.com
   - Pilih site Anda

2. **Masuk ke Settings:**
   - Klik "Site settings" atau "Site configuration"

3. **Buka Environment Variables:**
   - Klik "Environment variables" di menu kiri
   - Pastikan ada:
     ```
     VITE_SUPABASE_URL = your_supabase_url
     VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
     SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
     ```

4. **Jika belum ada, tambahkan:**
   - Klik "Add a variable"
   - Masukkan key dan value
   - Klik "Save"

### Step 3: Redeploy di Netlify

1. **Trigger manual deploy:**
   - Klik "Deploys" tab
   - Klik "Trigger deploy" > "Clear cache and deploy site"

   ATAU

2. **Deploy dari Git (jika sudah push):**
   ```bash
   git add .
   git commit -m "Fix RSS News setup"
   git push
   ```

### Step 4: Test Manual RSS Processor

1. **Trigger RSS processor:**
   ```bash
   # Ganti URL dengan URL Netlify Anda
   curl -X POST https://lucky-snickerdoodle-6dd69e.netlify.app/.netlify/functions/rss-processor
   ```

2. **Atau buka di browser:**
   ```
   https://lucky-snickerdoodle-6dd69e.netlify.app/.netlify/functions/rss-processor
   ```

3. **Expected response:**
   ```json
   {
     "message": "RSS processing completed successfully",
     "feedsProcessed": 5,
     "totalItemsProcessed": 25
   }
   ```

### Step 5: Verify di Website

1. **Refresh halaman website:**
   - Buka https://lucky-snickerdoodle-6dd69e.netlify.app
   - Scroll ke section "Berita Indonesia Terkini"
   - Seharusnya berita sudah muncul

2. **Check browser console:**
   - Tidak ada error 401
   - Tidak ada error "Error loading RSS news"

## 🔍 Troubleshooting

### Masih Error 401?

**Kemungkinan penyebab:**
1. Tabel belum dibuat di Supabase
   - **Solution:** Jalankan `setup-rss-news.sql` di Supabase SQL Editor

2. RLS policies tidak benar
   - **Solution:** Jalankan ulang file `setup-rss-news.sql`

3. Service Role key tidak benar
   - **Solution:** Cek di Supabase Dashboard > Settings > API > service_role key

### Berita Tidak Muncul?

**Kemungkinan penyebab:**
1. RSS processor belum dijalankan
   - **Solution:** Trigger manual via curl atau browser

2. Database masih kosong
   - **Solution:** Check di Supabase Table Editor apakah ada data

3. Berita sudah expired
   - **Solution:** Jalankan RSS processor lagi untuk fetch berita baru

## 📋 Quick Checklist

- [ ] Jalankan `setup-rss-news.sql` di Supabase
- [ ] Verify tabel ada: `SELECT * FROM rss_news;`
- [ ] Set environment variables di Netlify
- [ ] Redeploy di Netlify
- [ ] Trigger RSS processor
- [ ] Check berita muncul di website

## 🆘 Still Need Help?

Jika masih error, kirim screenshot dari:
1. Supabase SQL Editor (saat menjalankan query)
2. Netlify Environment Variables
3. Browser console errors
4. Response dari RSS processor endpoint
