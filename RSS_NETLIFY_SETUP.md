# 📰 RSS Auto-Update - Netlify Scheduled Functions

## ✨ Ringkasan

Sistem auto-update berita Indonesia menggunakan **Netlify Scheduled Functions** yang berjalan otomatis 2x sehari.

---

## 🎯 Fitur

- ⏰ **Auto-update**: 2x sehari (13:00 & 01:00 WIB)
- 🗑️ **Auto-delete**: Berita otomatis terhapus setelah 3 hari
- 📡 **Sumber**: CNN Indonesia & Antara News
- 📊 **Volume**: 20 berita per sumber (total 40)
- 🎨 **Display**: 12 berita random di carousel
- 💰 **Biaya**: 100% GRATIS!

---

## 🚀 Quick Start

### Development (Local)

```bash
# Fetch RSS news
npm run rss:fetch

# Start dev server
npm run dev
```

### Production (Netlify)

1. **Deploy ke Netlify**
   ```bash
   git push origin master
   # Atau connect repo di Netlify Dashboard
   ```

2. **Set Environment Variables** di Netlify Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. **Done!** ✅ Scheduled function akan aktif otomatis

**Detail:** Lihat [`NETLIFY_DEPLOYMENT_GUIDE.md`](NETLIFY_DEPLOYMENT_GUIDE.md)

---

## 📁 File Structure

```
netlify/
├── functions/
│   ├── rss-scheduler.js      # ⏰ Scheduled (2x/hari)
│   ├── rss-processor.js      # 🔧 Manual trigger
│   └── package.json
│
netlify.toml                   # ⚙️ Config scheduled function
run-rss-processor-local.js     # 💻 Local development
```

---

## ⏰ Schedule

| Waktu UTC | Waktu WIB | Status |
|-----------|-----------|--------|
| 06:00 | 13:00 | ✅ Auto-run |
| 18:00 | 01:00 | ✅ Auto-run |

Dikonfigurasi di `netlify.toml`:
```toml
[functions."rss-scheduler"]
  schedule = "0 6,18 * * *"
```

---

## 🧪 Testing

### Manual Trigger (Local)
```bash
npm run rss:fetch
```

### Manual Trigger (Production)
```bash
curl -X POST https://YOUR-SITE.netlify.app/.netlify/functions/rss-processor
```

### Pre-Deployment Test
```bash
npm run test:deploy
```

---

## 📊 How It Works

```
┌─────────────────────────────┐
│  Netlify Scheduled Function │
│  Cron: 0 6,18 * * *         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  RSS Parser                 │
│  - CNN Indonesia (20)       │
│  - Antara News (20)         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Supabase Database          │
│  - Insert/Update            │
│  - Expires in 3 days        │
│  - Auto cleanup             │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  React Website              │
│  - Display 12 random news   │
│  - Auto-scroll carousel     │
└─────────────────────────────┘
```

---

## 📦 Dependencies

```json
{
  "@netlify/functions": "^5.0.1",    // Scheduled functions
  "@supabase/supabase-js": "^2.76.1", // Database
  "rss-parser": "^3.13.0"             // RSS parsing
}
```

---

## 🔧 Configuration Files

### `netlify.toml`
```toml
[functions."rss-scheduler"]
  schedule = "0 6,18 * * *"  # Auto-run 2x sehari
```

### `netlify/functions/rss-scheduler.js`
```javascript
import { schedule } from '@netlify/functions';

const handler = schedule('0 6,18 * * *', async (event) => {
  // Auto-run RSS processor
  // Fetch from CNN & Antara
  // Insert to Supabase
  // Cleanup expired news
});
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Functions tidak muncul | Check `netlify.toml` di root |
| Scheduled function tidak jalan | Install `@netlify/functions` |
| Missing env vars | Set di Netlify Dashboard → Redeploy |
| Berita tidak muncul | Run manual trigger untuk populate data |

**Detail:** Lihat [`NETLIFY_DEPLOYMENT_GUIDE.md`](NETLIFY_DEPLOYMENT_GUIDE.md)

---

## ✅ Status

- [x] Netlify Scheduled Functions configured
- [x] Auto-update 2x sehari
- [x] Auto-delete setelah 3 hari
- [x] Manual trigger tersedia
- [x] Local development script
- [x] Production ready
- [x] No GitHub Actions needed!

---

## 📚 Documentation

- [`NETLIFY_DEPLOYMENT_GUIDE.md`](NETLIFY_DEPLOYMENT_GUIDE.md) - Complete deployment guide
- [`RSS_QUICK_START.md`](RSS_QUICK_START.md) - Quick reference
- [`RSS_TROUBLESHOOTING_SOLVED.md`](RSS_TROUBLESHOOTING_SOLVED.md) - Troubleshooting

---

## 💡 Tips

- **Development**: Use `npm run rss:fetch` untuk test lokal
- **Production**: Netlify Scheduled Functions berjalan otomatis
- **Monitoring**: Check Functions → Logs di Netlify Dashboard
- **Manual Trigger**: Tersedia via endpoint `/rss-processor`

---

**🎉 100% Gratis dengan Netlify Free Tier!**

Last Updated: 29 Oktober 2025
