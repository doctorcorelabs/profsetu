# 🚀 Panduan Deploy ke Netlify

## ✨ Fitur RSS Auto-Update
- ⏰ Update otomatis **2x sehari** (pukul 13:00 & 01:00 WIB)
- 🗑️ Berita otomatis terhapus setelah **3 hari**
- 📰 Sumber: CNN Indonesia & Antara News (20 berita per sumber)
- 🔧 Menggunakan **Netlify Scheduled Functions** (100% GRATIS!)
- ✅ Tidak perlu GitHub Actions atau setup tambahan!

---

## 📋 Langkah Deploy (Mudah!)

### 1️⃣ Push ke GitHub

```bash
git add .
git commit -m "Setup RSS auto-update with Netlify Scheduled Functions"
git push origin master
```

### 2️⃣ Connect ke Netlify

1. Buka [Netlify Dashboard](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Pilih **GitHub** → Authorize Netlify
4. Pilih repository **profsetu**
5. Build settings (otomatis terdeteksi dari `netlify.toml`):
   ```
   Build command: npm run build
   Publish directory: dist
   Functions directory: netlify/functions
   ```
6. Click **"Deploy site"**

### 3️⃣ Setup Environment Variables

**PENTING!** Setelah deploy pertama:

1. Site settings → Environment variables
2. Click **"Add a variable"** → **"Add a single variable"**
3. Tambahkan 3 variables berikut (copy dari file `.env` lokal):

   **Variable 1:**
   ```
   Key: VITE_SUPABASE_URL
   Value: https://vvzbiqjsnvmegbewruif.supabase.co
   ```

   **Variable 2:**
   ```
   Key: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
   ```

   **Variable 3:**
   ```
   Key: SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBh...
   ```

4. Click **"Save"**
5. **Redeploy site**: Deploys → Trigger deploy → Deploy site

### 4️⃣ Verifikasi Functions

1. Netlify Dashboard → **Functions** tab
2. Pastikan muncul:
   - ✅ `rss-scheduler` - Status: **Scheduled** (2x sehari)
   - ✅ `rss-processor` - Status: **Active** (manual trigger)

3. Click `rss-scheduler` → Lihat **Next scheduled run**

---

## 🧪 Testing

### Test 1: Manual Trigger RSS Processor

```bash
# Ganti YOUR-SITE dengan site name Anda
curl -X POST https://YOUR-SITE.netlify.app/.netlify/functions/rss-processor
```

Expected response:
```json
{
  "message": "RSS processing completed successfully",
  "feedsProcessed": 2,
  "totalItemsProcessed": 40
}
```

### Test 2: Check Database

1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Table Editor → `rss_news`
3. Harus ada ~40 rows:
   - 20 dari CNN Indonesia
   - 20 dari Antara News
   - `expires_at` = 3 hari dari `created_at`

### Test 3: Check Website

Buka website Anda → Scroll ke section **"Berita Indonesia Terkini"**
- Harus muncul carousel dengan berita
- Auto-scroll setiap 3 detik
- Klik berita untuk membuka artikel

---

## ⏰ Jadwal Auto-Update

| Waktu UTC | Waktu WIB | Keterangan |
|-----------|-----------|------------|
| 06:00 | 13:00 | ✅ Auto-run (siang) |
| 18:00 | 01:00 | ✅ Auto-run (malam) |

**Cara Kerja:**
1. Netlify Scheduled Function berjalan otomatis
2. Fetch 20 berita dari CNN Indonesia
3. Fetch 20 berita dari Antara News  
4. Insert/update ke Supabase
5. Cleanup berita yang expired (>3 hari)
6. Selesai! 🎉

---

## 📊 Monitoring

### Check Logs di Netlify

1. Functions → `rss-scheduler` → **Logs** tab
2. Lihat eksekusi terakhir
3. Expected logs:
   ```
   🚀 RSS Scheduler triggered at: 2025-10-29T06:00:00.000Z
   Processing CNN Indonesia...
   Successfully processed 20 items from CNN Indonesia
   Processing Antara News...
   Successfully processed 20 items from Antara News
   ✅ RSS processing completed: 2/2 feeds, 40 items
   ```

### Check di Supabase

```sql
-- Total berita aktif
SELECT source, COUNT(*) as count 
FROM rss_news 
WHERE expires_at > NOW()
GROUP BY source;

-- Berita expired (akan dihapus)
SELECT COUNT(*) FROM rss_news WHERE expires_at < NOW();
```

---

## 🐛 Troubleshooting

### ❌ Functions tidak muncul di Netlify

**Penyebab:** `netlify.toml` tidak terbaca

**Solusi:**
1. Pastikan `netlify.toml` ada di **root** project
2. Check isi file:
   ```toml
   [functions]
     node_bundler = "esbuild"

   [functions."rss-scheduler"]
     schedule = "0 6,18 * * *"
   ```
3. Redeploy site

### ❌ Error: "Missing Supabase environment variables"

**Penyebab:** Environment variables belum di-set atau salah

**Solusi:**
1. Site settings → Environment variables
2. Pastikan **3 variables** ada:
   - `VITE_SUPABASE_URL` ✓
   - `VITE_SUPABASE_ANON_KEY` ✓
   - `SUPABASE_SERVICE_ROLE_KEY` ✓
3. **PENTING:** Redeploy setelah menambahkan!

### ❌ Scheduled function tidak berjalan

**Penyebab:** Package `@netlify/functions` tidak terinstall

**Solusi:**
```bash
npm install @netlify/functions
git add package.json package-lock.json
git commit -m "Add @netlify/functions dependency"
git push origin master
```

### ❌ Berita tidak muncul di website

**Solusi berurutan:**
1. Trigger manual: `curl -X POST https://YOUR-SITE.netlify.app/.netlify/functions/rss-processor`
2. Check Supabase apakah data masuk
3. Check browser console untuk error
4. Verify RLS policies di Supabase (harus allow SELECT untuk anon key)

---

## ✅ Checklist Deployment

Sebelum deploy, pastikan:

- [ ] File `netlify.toml` ada di root dengan config scheduled function
- [ ] Package `@netlify/functions` sudah di-install (`package.json`)
- [ ] File `netlify/functions/rss-scheduler.js` menggunakan `schedule()` dari `@netlify/functions`
- [ ] File `netlify/functions/rss-processor.js` ada (untuk manual trigger)
- [ ] Database Supabase sudah setup (tabel `rss_news`)
- [ ] File `.env` lokal ada (untuk copy ke Netlify)

Setelah deploy:

- [ ] Environment variables sudah di-set di Netlify (3 variables)
- [ ] Site sudah di-redeploy setelah set env vars
- [ ] Functions tab menunjukkan `rss-scheduler` dengan status "Scheduled"
- [ ] Manual trigger berhasil (test dengan curl)
- [ ] Database ada ~40 berita
- [ ] Website menampilkan carousel berita
- [ ] Check logs scheduled function untuk next run time

---

## 🎉 Selesai!

Setelah semua checklist ✅, sistem akan:

1. ✅ Auto-update RSS **2x sehari** (13:00 & 01:00 WIB)
2. ✅ Auto-delete berita setelah **3 hari**
3. ✅ Tampilkan 12 berita random di carousel
4. ✅ Semua **GRATIS** dengan Netlify!

**Tidak perlu:**
- ❌ GitHub Actions
- ❌ GitHub Secrets
- ❌ Manual cron jobs
- ❌ External services

**Semua otomatis berjalan di Netlify!** 🚀

---

**Last Updated:** 29 Oktober 2025  
**Status:** ✅ Production Ready  
**Method:** Netlify Scheduled Functions Only

### 1. Environment Variables di Netlify
Login ke Netlify Dashboard → Site Settings → Environment Variables

Tambahkan 3 variables berikut:

```
VITE_SUPABASE_URL=https://vvzbiqjsnvmegbewruif.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**⚠️ PENTING:** 
- Copy dari file `.env` lokal Anda
- `SUPABASE_SERVICE_ROLE_KEY` diperlukan untuk RSS processor function
- Jangan commit `.env` ke git!

### 2. GitHub Secrets untuk Auto-Update
Login ke GitHub → Repository Settings → Secrets and variables → Actions

Tambahkan secret:

```
Name: NETLIFY_SITE_URL
Value: https://your-site-name.netlify.app
```

Ganti `your-site-name` dengan nama site Netlify Anda.

### 3. Verifikasi File Netlify Functions

Pastikan file-file ini ada:
- ✅ `netlify/functions/rss-processor.js`
- ✅ `netlify/functions/package.json`
- ✅ `.github/workflows/rss-processor.yml`

## 🔄 Cara Auto-Update Bekerja

### GitHub Actions (Recommended)
```
┌─────────────────────────┐
│  GitHub Actions         │
│  Cron: 06:00 & 18:00 UTC│
│  (13:00 & 01:00 WIB)    │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Netlify Function       │
│  rss-processor.js       │
│  - Fetch CNN (20 news)  │
│  - Fetch Antara (20)    │
│  - Cleanup expired      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│  Supabase Database      │
│  rss_news table         │
│  - 40 items total       │
│  - Expires after 3 days │
└─────────────────────────┘
```

### Waktu Update
- **Otomatis**: 2x sehari (13:00 WIB & 01:00 WIB)
- **Manual**: Via GitHub Actions UI → Run workflow
- **Retention**: Berita otomatis terhapus setelah 3 hari

## 📋 Deployment Steps

### Step 1: Push ke GitHub
```bash
git add .
git commit -m "Setup RSS auto-update with GitHub Actions"
git push origin master
```

### Step 2: Deploy di Netlify

**Opsi A: Connect GitHub Repo (Recommended)**
1. Netlify Dashboard → New site from Git
2. Connect to GitHub → pilih repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy site

**Opsi B: Manual Deploy**
```bash
npm run build
# Upload folder dist/ ke Netlify
```

### Step 3: Set Environment Variables
1. Site Settings → Environment Variables
2. Add variables (lihat checklist #1)
3. **PENTING**: Klik "Save" dan "Redeploy site"

### Step 4: Verify Functions
1. Netlify Dashboard → Functions tab
2. Pastikan `rss-processor` muncul dengan status Active
3. Click function → Test dengan trigger manual

### Step 5: Setup GitHub Secrets
1. GitHub Repository → Settings → Secrets → Actions
2. New repository secret:
   - Name: `NETLIFY_SITE_URL`
   - Value: `https://your-actual-site.netlify.app` (dari Netlify dashboard)

### Step 6: Test GitHub Actions
1. GitHub → Actions tab
2. Select "RSS News Processor" workflow
3. Click "Run workflow" → Run workflow
4. Monitor logs untuk memastikan berhasil

## 🧪 Testing

### Test 1: Manual Trigger Netlify Function
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/rss-processor
```

Expected response:
```json
{
  "message": "RSS processing completed successfully",
  "timestamp": "2025-10-29T...",
  "feedsProcessed": 2,
  "totalFeeds": 2,
  "totalItemsProcessed": 40
}
```

### Test 2: Verify Database
Login ke Supabase → Table Editor → rss_news

Check:
- Total rows: ~40 items
- Sources: CNN Indonesia, Antara News
- expires_at: 3 days from created_at

### Test 3: Check Website
```bash
# Development
npm run dev
# Open http://localhost:8080
```

Scroll ke "Berita Indonesia Terkini" → harus ada carousel dengan berita

### Test 4: GitHub Actions
1. GitHub → Actions → RSS News Processor
2. Click latest run
3. Check logs for success message

## 🐛 Troubleshooting

### Functions tidak muncul di Netlify
```bash
# Check netlify.toml
[functions]
  node_bundler = "esbuild"

# Pastikan folder ada
netlify/functions/rss-processor.js
```

### GitHub Actions gagal
**Error: Secret not found**
- Fix: Add `NETLIFY_SITE_URL` di GitHub Secrets

**Error: 404 Function not found**
- Fix: Deploy ulang di Netlify
- Verify Functions tab menunjukkan rss-processor

**Error: 500 Internal Server Error**
- Fix: Check Netlify Function logs
- Verify env vars: `SUPABASE_SERVICE_ROLE_KEY`

### Berita tidak muncul di website
1. Check console browser untuk error
2. Verify Supabase RLS policies
3. Check database untuk data
4. Run `npm run rss:fetch` lokal untuk test

### Auto-cleanup tidak jalan
- Cleanup dipanggil setiap kali RSS processor berjalan
- Check expires_at timestamp (harus 3 hari dari created_at)
- Manual cleanup via Supabase SQL:
  ```sql
  DELETE FROM rss_news WHERE expires_at < NOW();
  ```

## 📊 Monitoring

### Netlify Function Logs
1. Netlify Dashboard → Functions → rss-processor
2. Click "Logs" tab
3. Filter by date range

### GitHub Actions History
1. GitHub → Actions → RSS News Processor
2. View all workflow runs
3. Click run untuk detail logs

### Supabase Database
```sql
-- Check total berita
SELECT source, COUNT(*) as count, MAX(pub_date) as latest
FROM rss_news
WHERE expires_at > NOW()
GROUP BY source;

-- Check expired
SELECT COUNT(*) FROM rss_news WHERE expires_at < NOW();
```

## ✅ Expected Behavior After Deployment

### Automatic (Production)
- ✅ RSS processor runs 2x daily (13:00 & 01:00 WIB)
- ✅ Fetches 40 news (20 CNN + 20 Antara)
- ✅ Auto-cleanup expired news (>3 days)
- ✅ GitHub Actions logs success/failure
- ✅ Netlify Functions logs execution

### Manual (Development)
- ✅ Run `npm run rss:fetch` anytime
- ✅ Test locally before deploy
- ✅ Verify data in Supabase

### Website
- ✅ Displays 12 random news in carousel
- ✅ Auto-scroll every 3 seconds
- ✅ Click to read full article
- ✅ Responsive design

## 🎯 Final Checklist

Before going live:
- [ ] Environment variables set di Netlify
- [ ] GitHub secret `NETLIFY_SITE_URL` added
- [ ] Site deployed successfully
- [ ] Functions tab shows `rss-processor` active
- [ ] Manual test RSS processor returns 200
- [ ] Database has ~40 news items
- [ ] Website displays news carousel
- [ ] GitHub Actions workflow runs successfully
- [ ] Check back after 12 hours for auto-update

## 📞 Support

Jika ada masalah:
1. Check Netlify Function logs
2. Check GitHub Actions logs
3. Check Supabase database
4. Verify environment variables
5. Test manual trigger first

---

**Last Updated:** 29 Oktober 2025
**Status:** ✅ Ready for Production
**Auto-Update:** ✅ Configured (2x daily)
**Retention:** ✅ 3 days auto-cleanup
