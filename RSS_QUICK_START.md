# 🗞️ RSS News Fetcher - Quick Start Guide

## Masalah yang Dipecahkan
Section "Berita Indonesia Terkini" kosong karena RSS processor hanya berjalan di production (Netlify), tidak di local development.

## Solusi Cepat

### 1️⃣ Fetch Berita RSS (Development)
Jalankan command ini untuk mengisi database dengan berita terbaru:

```bash
npm run rss:fetch
```

**Output yang diharapkan:**
```
✓ Feeds processed: 2/2
✓ Total items processed: 40
✓ CNN Indonesia: 20 items
✓ Antara News: 20 items
```

### 2️⃣ Refresh Browser
Setelah script selesai, refresh browser Anda (Ctrl+F5) untuk melihat berita di section "Berita Indonesia Terkini".

## Kapan Harus Fetch Ulang?

**Development (Local):**
- Saat pertama kali setup project
- Saat berita sudah expired (>3 hari)
- Saat ingin update dengan berita terbaru

**Production (Netlify):**
- Otomatis setiap 12 jam via Netlify Scheduled Functions
- Otomatis setiap 12 jam via GitHub Actions
- Manual via: `https://your-site.netlify.app/.netlify/functions/manual-rss-trigger`

## Troubleshooting

### Berita masih kosong?
1. Check console browser untuk error
2. Verifikasi environment variables di `.env`:
   ```
   VITE_SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
3. Jalankan ulang: `npm run rss:fetch`

### Error saat fetch?
- CNN atau Antara mungkin timeout → Tunggu beberapa menit dan coba lagi
- Check internet connection
- Check Supabase credentials

### Table not found error?
Jalankan SQL schema di Supabase Dashboard:
```bash
# File: rss-news-schema.sql
```

## Fitur RSS News

- ✅ Fetch dari CNN Indonesia & Antara News
- ✅ 20 berita per sumber (total 40)
- ✅ Auto-expire setelah 3 hari
- ✅ Display 12 berita random di carousel
- ✅ Auto-scroll setiap 3 detik
- ✅ Update 2x sehari (production)

## Maintenance

**Setiap hari:**
- Production: Otomatis update via scheduled functions

**Setiap minggu:**
- Check database untuk berita yang expired
- Monitor RSS feed availability

**On-demand:**
```bash
# Fetch berita terbaru
npm run rss:fetch

# Check hasil
# Lihat di browser atau Supabase dashboard
```

## Architecture

```
┌─────────────────┐
│  RSS Sources    │
│  - CNN Indonesia│
│  - Antara News  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  RSS Processor  │
│  - Parse RSS    │
│  - Limit 20/src │
│  - Set expiry   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Supabase DB    │
│  rss_news table │
│  (40 items)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │
│  RSSNewsSection │
│  (12 displayed) │
└─────────────────┘
```

## Files Terkait

- `run-rss-processor-local.js` - Script untuk fetch RSS lokal
- `netlify/functions/rss-processor.js` - Netlify function untuk production
- `netlify/functions/rss-scheduler.js` - Scheduler otomatis
- `src/components/RSSNewsSection.tsx` - Component untuk display
- `rss-news-schema.sql` - Database schema

## Environment Variables

```bash
# .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

**Last Updated:** 29 Oktober 2025  
**Status:** ✅ Working & Tested
