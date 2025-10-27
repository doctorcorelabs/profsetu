# RSS News Troubleshooting Guide

## Masalah Umum dan Solusinya

### 1. Error 401 Unauthorized

**Gejala:**
```
Failed to load resource: the server responded with a status of 401
Error loading RSS news
```

**Solusi:**
1. Jalankan SQL schema yang sudah diperbaiki: `rss-news-schema.sql`
2. Pastikan Service Role key ada di Netlify Environment Variables
3. Cek apakah tabel sudah dibuat di Supabase

## Checklist Setup RSS News

- [ ] Jalankan SQL schema di Supabase
- [ ] Set environment variables di Netlify
- [ ] Deploy ke Netlify
- [ ] Test RSS processor
