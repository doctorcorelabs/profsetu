# Setiya Utama Vision - Admin Dashboard

Sebuah website portfolio dengan admin dashboard untuk mengelola berita dan kegiatan.

## 🚀 Fitur

### Public Website
- Landing page dengan profil, program kerja, berita, dan galeri
- **RSS News Indonesia**: Berita terkini dari 5 sumber terpercaya (Detik, Kompas, Tempo, CNN Indonesia, Antara)
- Halaman detail artikel dengan SEO-friendly URLs
- Archive halaman dengan pencarian dan filter
- Responsive design untuk semua perangkat

### Admin Dashboard
- **Hidden Access**: Triple-click pada logo untuk akses admin
- **Authentication**: Login dengan username: `setiyautama`, password: `genjahan24`
- **Posts Management**: CRUD operations dengan rich text editor
- **Categories & Tags**: Kelola kategori dan tags
- **Media Upload**: Upload gambar dengan optimasi
- **Performance**: Lazy loading, caching, dan virtual scrolling

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** + **shadcn/ui**
- **React Router DOM** (routing)
- **React Hook Form** + **Zod** (forms & validation)
- **TanStack Query** (data fetching)
- **TipTap** (rich text editor)

### Backend & Database
- **Supabase** (database, auth, storage)
- **Netlify Functions** (API endpoints)
- **RSS Parser** (berita Indonesia dari 5 sumber terpercaya)

### Performance
- **Service Worker** (caching)
- **Lazy Loading** (images)
- **Virtual Scrolling** (large lists)
- **Image Optimization** (WebP, responsive)

## 📰 RSS News Indonesia

### Fitur RSS News
- **5 Sumber Terpercaya**: Detik, Kompas, Tempo, CNN Indonesia, Antara
- **Update Otomatis**: 2x sehari (jam 06:00 dan 18:00 UTC)
- **Auto-Cleanup**: Berita dihapus setelah 2 hari
- **Batasan**: Maksimal 5 berita per sumber per update
- **Manual Refresh**: Tombol refresh untuk update manual

### Setup RSS News
1. Jalankan SQL schema: `rss-news-schema.sql`
2. Setup environment variables (lihat `env-template.txt`)
3. Deploy ke Netlify dengan functions
4. Setup GitHub Actions untuk scheduling (opsional)

Lihat `RSS_NEWS_SETUP.md` untuk panduan lengkap.

## 📁 Struktur Proyek

```
src/
├── components/
│   ├── Admin/           # Admin components
│   ├── ui/              # shadcn/ui components
│   ├── ErrorBoundary.tsx
│   ├── LazyImage.tsx
│   ├── RSSNewsSection.tsx  # RSS News component
│   └── ...
├── pages/
│   ├── Admin/           # Admin pages
│   ├── PostDetail.tsx
│   └── PostsArchive.tsx
├── hooks/
│   ├── useAuth.ts
│   └── usePerformance.ts
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   └── validations.ts
├── utils/
│   ├── security.ts
│   ├── performance.ts
│   └── imageOptimization.ts
└── types/
    └── database.ts

netlify/
├── functions/
│   ├── rss-processor.js      # RSS processing function
│   ├── rss-scheduler.js      # Scheduler function
│   ├── manual-rss-trigger.js # Manual trigger
│   └── package.json         # Functions dependencies

.github/
└── workflows/
    └── rss-processor.yml    # GitHub Actions scheduler
```

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Supabase
1. Buat proyek Supabase baru
2. Jalankan SQL schema dari `supabase-schema.sql`
3. Buat file `.env`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Development
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## 🔐 Admin Access

1. Triple-click pada logo di header
2. Login dengan:
   - Username: `setiyautama`
   - Password: `genjahan24`

## 📊 Performance Features

- **Lazy Loading**: Images dimuat saat diperlukan
- **Service Worker**: Caching untuk offline support
- **Virtual Scrolling**: Untuk list dengan banyak data
- **Image Optimization**: WebP format, responsive images
- **Bundle Optimization**: Code splitting dan tree shaking

## 🛡️ Security Features

- **Input Sanitization**: Mencegah XSS attacks
- **Rate Limiting**: Mencegah brute force attacks
- **File Upload Validation**: Validasi tipe dan ukuran file
- **Password Hashing**: SHA-256 hashing
- **CSRF Protection**: Token-based protection

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching
- **Accessibility**: WCAG compliant
- **Loading States**: Skeleton screens dan spinners
- **Error Handling**: Graceful error boundaries

## 📱 Mobile Support

- Responsive breakpoints
- Touch-friendly interactions
- Mobile-optimized forms
- Swipe gestures support

## 🔧 Development

### Code Quality
- **ESLint**: Code linting
- **TypeScript**: Type safety
- **Prettier**: Code formatting
- **Husky**: Git hooks

### Testing
- **Unit Tests**: Component testing
- **Integration Tests**: API testing
- **E2E Tests**: User journey testing

## 📈 Monitoring

- **Performance Metrics**: Core Web Vitals
- **Error Tracking**: Error boundaries
- **Analytics**: User behavior tracking
- **Uptime Monitoring**: Service health

## 🚀 Deployment

### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

Untuk pertanyaan atau dukungan, silakan hubungi:
- Email: support@setiyautama.com
- Website: https://setiyautama.com