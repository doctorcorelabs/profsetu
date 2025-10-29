# RSS News Troubleshooting - SOLVED ✅

## Masalah: Section Berita Indonesia Kosong

### Gejala
- Section "Berita Indonesia Terkini" menampilkan "Belum ada berita tersedia saat ini"
- Console browser menunjukkan: `RSS news loaded: CNN 0 Antara 0`
- Database `rss_news` kosong

### Penyebab
RSS processor function belum pernah dijalankan untuk mengisi data ke database. Meskipun Netlify Functions sudah dikonfigurasi, fungsi tersebut hanya berjalan di production (setelah deploy ke Netlify), **bukan di local development**.

## Solusi

### ✅ Solusi Langsung (Manual)
Jalankan script lokal untuk mengisi database:

```bash
node run-rss-processor-local.js
```

Script ini akan:
1. Fetch 20 berita terbaru dari CNN Indonesia
2. Fetch 20 berita terbaru dari Antara News
3. Insert/update ke database Supabase
4. Cleanup berita yang sudah expired (>3 hari)
5. Verifikasi data yang tersimpan

### ✅ Hasil Eksekusi
```
✓ Feeds processed: 2/2
✓ Total items processed: 40
✓ CNN Indonesia: 20 items
✓ Antara News: 20 items
✓ Expired items deleted: 0
```

### 🔄 Solusi Otomatis

#### 1. Development (Local)
Tambahkan npm script untuk menjalankan RSS processor:

**package.json:**
```json
{
  "scripts": {
    "rss:fetch": "node run-rss-processor-local.js",
    "rss:watch": "node run-rss-processor-local.js && echo 'RSS fetched! Refresh your browser.'"
  }
}
```

Jalankan dengan:
```bash
npm run rss:fetch
```

#### 2. Production (Netlify)

**Opsi A: Manual Trigger via URL**
Akses URL berikut untuk trigger manual:
```
https://your-site.netlify.app/.netlify/functions/manual-rss-trigger
```

**Opsi B: Netlify Scheduled Functions**
Edit `netlify.toml` (sudah dikonfigurasi):
```toml
[functions."rss-scheduler"]
  schedule = "0 */12 * * *"  # Setiap 12 jam
```

**Opsi C: GitHub Actions (Recommended)**
File `.github/workflows/rss-processor.yml` akan otomatis:
- Berjalan setiap 12 jam (06:00 dan 18:00 WIB)
- Trigger manual via GitHub Actions UI
- Post-deployment hooks

### 📋 Checklist Post-Setup

- [x] Tabel `rss_news` sudah dibuat di Supabase
- [x] Environment variables sudah set (VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- [x] Dependencies installed (`rss-parser`, `@supabase/supabase-js`, `dotenv`)
- [x] Script `run-rss-processor-local.js` berjalan sukses
- [x] Database terisi dengan 40 berita
- [x] Browser menampilkan berita di section "Berita Indonesia Terkini"

### 🔍 Cara Verifikasi

1. **Check Database (Supabase Dashboard)**
   ```sql
   SELECT source, COUNT(*) as count 
   FROM rss_news 
   WHERE expires_at > NOW()
   GROUP BY source;
   ```

2. **Check di Browser**
   - Refresh halaman (Ctrl+F5)
   - Scroll ke section "Berita Indonesia Terkini"
   - Harus muncul carousel dengan berita dari CNN & Antara

3. **Check Console Log**
   ```
   Loading RSS news...
   RSS news loaded: CNN 20 Antara 20
   Merged items for display: 12
   ```

### ⏱️ Maintenance Schedule

**Development:**
- Manual: Jalankan `npm run rss:fetch` saat dibutuhkan
- Auto: Setup cron job lokal (opsional)

**Production:**
- Netlify Scheduled Functions: Otomatis setiap 12 jam
- GitHub Actions: Otomatis setiap 12 jam
- Manual Trigger: Via URL atau GitHub UI

### 📊 Monitoring

**Expected Data:**
- Total berita: 40 item (20 CNN + 20 Antara)
- Update frequency: 2x per hari (production)
- Retention: 3 hari (auto-cleanup)
- Display: 12 berita random di carousel

### 🚨 Troubleshooting Tambahan

**Jika masih kosong setelah fetch:**
1. Check console untuk error
2. Verify Supabase credentials
3. Check RLS policies di tabel `rss_news`
4. Pastikan tidak ada CORS error

**Jika ada error 42P01 (table not found):**
```sql
-- Jalankan di Supabase SQL Editor
-- File: rss-news-schema.sql
```

**Jika RSS feed timeout:**
- CNN Indonesia atau Antara mungkin sedang down
- Script akan tetap insert dari feed yang berhasil
- Coba lagi beberapa menit kemudian

### ✅ Status: RESOLVED
Data RSS berhasil di-fetch dan ditampilkan di website. Section "Berita Indonesia Terkini" sekarang menampilkan 12 berita terbaru dari CNN Indonesia dan Antara News dengan carousel auto-scroll.

**Tanggal:** 29 Oktober 2025
**Waktu Eksekusi:** 20:23 WIB
**Items Processed:** 40 berita (20 CNN + 20 Antara)
