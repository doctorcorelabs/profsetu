# 🚀 Netlify Deployment Guide - Environment Variables

## 📋 **Environment Variables yang Diperlukan untuk Netlify**

### **1. Supabase Configuration (WAJIB)**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_service_role_key_here
```

### **2. Admin Credentials (WAJIB)**
```
ADMIN_USERNAME=daivanlabs
ADMIN_PASSWORD=codecure
ADMIN_PASSWORD_HASH=a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d
```

### **3. Application Settings (OPSIONAL)**
```
NODE_ENV=production
VITE_APP_TITLE=Setiya Utama Vision
VITE_APP_DESCRIPTION=Website resmi Setiya Utama dengan admin dashboard dan RSS news
```

### **4. RSS Configuration (OPSIONAL)**
```
RSS_FEEDS_COUNT=5
RSS_CLEANUP_DAYS=2
```

### **5. Performance & Security (OPSIONAL)**
```
ENABLE_SECURITY_HEADERS=true
ENABLE_IMAGE_OPTIMIZATION=true
MAX_IMAGE_SIZE=5242880
CACHE_DURATION=3600
ENABLE_DETAILED_LOGGING=true
```

## 🔧 **Cara Setup di Netlify Dashboard**

### **Step 1: Login ke Netlify**
1. Buka [netlify.com](https://netlify.com)
2. Login dengan akun Anda
3. Pilih site "Setiya Utama Vision"

### **Step 2: Buka Environment Variables**
1. Klik **Site settings**
2. Scroll ke bawah, klik **Environment variables**
3. Klik **Add variable**

### **Step 3: Tambahkan Variables Satu per Satu**

#### **A. Supabase URL**
- **Key:** `VITE_SUPABASE_URL`
- **Value:** `https://your-project-id.supabase.co`
- **Scopes:** All scopes

#### **B. Supabase Anon Key**
- **Key:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_anon_key_here`
- **Scopes:** All scopes

#### **C. Supabase Service Role Key**
- **Key:** `SUPABASE_SERVICE_ROLE_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_service_role_key_here`
- **Scopes:** All scopes

#### **D. Admin Username**
- **Key:** `ADMIN_USERNAME`
- **Value:** `daivanlabs`
- **Scopes:** All scopes

#### **E. Admin Password**
- **Key:** `ADMIN_PASSWORD`
- **Value:** `codecure`
- **Scopes:** All scopes

#### **F. Admin Password Hash**
- **Key:** `ADMIN_PASSWORD_HASH`
- **Value:** `a3033f5ee7ff1376a03a2c43a40466fa0ac33ba49e28f081cfaa621d5cd0ea5d`
- **Scopes:** All scopes

### **Step 4: Deploy Ulang**
1. Setelah semua variables ditambahkan
2. Klik **Deploys** di menu utama
3. Klik **Trigger deploy** → **Deploy site**

## 🔍 **Cara Mendapatkan Supabase Keys**

### **1. Supabase URL & Anon Key**
1. Buka [supabase.com](https://supabase.com)
2. Login dan pilih project Anda
3. Klik **Settings** → **API**
4. Copy **Project URL** dan **anon public** key

### **2. Service Role Key**
1. Di halaman yang sama (Settings → API)
2. Copy **service_role** key (yang secret)
3. **PENTING:** Key ini memiliki akses penuh ke database!

## ⚠️ **Keamanan Penting**

### **DO's:**
- ✅ Gunakan environment variables untuk semua data sensitif
- ✅ Rotate credentials secara berkala
- ✅ Monitor access logs
- ✅ Gunakan password yang kuat
- ✅ Enable 2FA di semua akun

### **DON'Ts:**
- ❌ Jangan commit file `.env` ke repository
- ❌ Jangan hardcode credentials di source code
- ❌ Jangan share service role key
- ❌ Jangan gunakan credentials yang sama untuk dev/prod

## 🧪 **Testing Environment Variables**

### **1. Test Supabase Connection**
```bash
# Test di browser console setelah deploy
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
```

### **2. Test Admin Login**
1. Buka website production
2. Coba login dengan credentials admin
3. Pastikan bisa akses dashboard

### **3. Test RSS Functions**
1. Buka: `https://your-site.netlify.app/.netlify/functions/manual-rss-trigger`
2. Pastikan RSS news ter-update

## 🚨 **Troubleshooting**

### **Problem: Supabase connection failed**
- **Solution:** Check VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY

### **Problem: Admin login failed**
- **Solution:** Check ADMIN_USERNAME dan ADMIN_PASSWORD_HASH

### **Problem: RSS functions not working**
- **Solution:** Check SUPABASE_SERVICE_ROLE_KEY

### **Problem: Build failed**
- **Solution:** Check semua required environment variables sudah ada

## 📞 **Support**

Jika ada masalah:
1. Check Netlify function logs
2. Check Supabase logs
3. Verify semua environment variables sudah benar
4. Test di local development dulu
