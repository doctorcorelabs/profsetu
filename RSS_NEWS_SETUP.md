# RSS News Indonesia - Setup Guide

## Overview
Sistem RSS News Indonesia yang mengambil berita dari 5 sumber terpercaya, update 2x sehari, dan auto-hapus setelah 2 hari.

## Fitur
- ✅ Mengambil berita dari 5 sumber RSS Indonesia (Detik, Kompas, Tempo, CNN Indonesia, Antara)
- ✅ Batasan 5 berita per sumber per update
- ✅ Update otomatis 2x sehari (jam 06:00 dan 18:00 UTC)
- ✅ Auto-hapus berita setelah 2 hari
- ✅ UI responsif dengan loading states
- ✅ Manual refresh button

## Setup Database

1. Jalankan SQL schema di Supabase SQL Editor:
```sql
-- Jalankan file rss-news-schema.sql
```

## Setup Environment Variables

Tambahkan ke Netlify Environment Variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Setup GitHub Actions (Opsional)

Untuk menjalankan RSS processor 2x sehari, setup GitHub Actions:

1. Tambahkan secrets di GitHub repository:
   - `NETLIFY_ACCESS_TOKEN`: Token Netlify untuk akses functions
   - `NETLIFY_SITE_URL`: URL site Netlify Anda

2. File `.github/workflows/rss-processor.yml` sudah dibuat dan akan otomatis berjalan.

## Manual Testing

Untuk test manual RSS processor:

1. Deploy ke Netlify
2. Akses: `https://your-site.netlify.app/.netlify/functions/rss-processor`
3. Atau gunakan curl:
```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/rss-processor
```

## Struktur File

```
├── netlify/
│   └── functions/
│       ├── rss-processor.js      # Main RSS processing function
│       └── rss-scheduler.js      # Scheduler function (deprecated)
├── .github/
│   └── workflows/
│       └── rss-processor.yml     # GitHub Actions untuk scheduling
├── src/
│   └── components/
│       └── RSSNewsSection.tsx    # UI component untuk menampilkan berita
├── rss-news-schema.sql           # Database schema
└── netlify.toml                  # Netlify configuration
```

## RSS Sources

1. **Detik News**: https://rss.detik.com/index.php/detikcom
2. **Kompas**: https://rss.kompas.com/kompascom
3. **Tempo**: https://rss.tempo.co/nasional
4. **CNN Indonesia**: https://www.cnnindonesia.com/nasional/rss
5. **Antara News**: https://www.antaranews.com/rss/terkini.xml

## Monitoring

- Check Netlify Functions logs untuk melihat proses RSS
- Check GitHub Actions logs untuk melihat scheduled runs
- Database akan otomatis cleanup berita expired

## Troubleshooting

1. **RSS tidak ter-update**: Check GitHub Actions atau manual trigger
2. **Berita tidak muncul**: Check database connection dan RLS policies
3. **Error parsing RSS**: Check RSS feed URLs dan network connectivity
