# Setup Admin Dashboard

## 🚀 Quick Setup

### 1. Environment Variables
File `.env` sudah dibuat dengan kredensial Supabase Anda:
```
VITE_SUPABASE_URL=https://vvzbiqjsnvmegbewruif.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Database Setup
Jalankan script SQL di Supabase SQL Editor:

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. **Pilih Project**: vvzbiqjsnvmegbewruif
3. **Go to SQL Editor**
4. **Copy & Paste** isi file `setup-database.sql`
5. **Run** script tersebut

### 3. Start Development Server
```bash
npm run dev
```

## 🔐 Admin Access

### Login Credentials
- **Username**: `setiyautama`
- **Password**: `genjahan24`

### How to Access
1. **Triple-click** pada logo di header
2. **Login modal** akan muncul
3. **Masukkan credentials** di atas
4. **Redirect** ke admin dashboard

## 📊 Features Available

### ✅ Public Website
- Landing page dengan semua section
- Posts archive dengan search & filter
- Post detail pages
- Responsive design

### ✅ Admin Dashboard
- **Dashboard**: Overview dengan statistik
- **Posts**: CRUD operations dengan rich text editor
- **Categories**: Kelola kategori
- **Tags**: Kelola tags
- **Media Upload**: Upload gambar ke Supabase Storage

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Database, Auth, Storage)
- **Rich Text**: TipTap editor
- **State Management**: TanStack Query, React Context
- **Performance**: Lazy loading, Service worker, Virtual scrolling

## 📁 File Structure

```
src/
├── components/
│   ├── Admin/           # Admin components
│   ├── ui/              # shadcn/ui components
│   └── ...
├── pages/
│   ├── Admin/           # Admin pages
│   └── ...
├── lib/
│   ├── supabase.ts      # Supabase client
│   ├── auth.ts          # Authentication
│   └── validations.ts    # Form validation
├── hooks/
│   ├── useAuth.ts       # Auth context
│   └── ...
└── utils/
    ├── security.ts       # Security utilities
    ├── performance.ts    # Performance monitoring
    └── ...
```

## 🔧 Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Restart development server
   - Check file `.env` exists

2. **Database Connection Error**
   - Verify Supabase URL dan API key
   - Check network connection

3. **Admin Login Not Working**
   - Ensure database setup script has been run
   - Check admin user exists in database

4. **Images Not Loading**
   - Check Supabase Storage bucket exists
   - Verify storage policies are set

### Development Tips

- **Hot Reload**: Changes auto-reload
- **Error Boundaries**: Graceful error handling
- **Type Safety**: Full TypeScript support
- **Performance**: Optimized for many posts

## 🚀 Production Deployment

### Netlify Deployment
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Environment Variables for Production
```
VITE_SUPABASE_URL=https://vvzbiqjsnvmegbewruif.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## 📞 Support

Jika ada masalah atau pertanyaan:
- Check console untuk error messages
- Verify database setup
- Ensure all dependencies installed

**Happy Coding! 🎉**

