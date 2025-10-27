import { z } from 'zod'

// Post validation schema
export const postSchema = z.object({
  title: z.string()
    .min(1, 'Judul harus diisi')
    .max(255, 'Judul tidak boleh lebih dari 255 karakter'),
  slug: z.string()
    .min(1, 'Slug harus diisi')
    .max(255, 'Slug tidak boleh lebih dari 255 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  excerpt: z.string()
    .max(500, 'Excerpt tidak boleh lebih dari 500 karakter')
    .optional(),
  content: z.string()
    .min(1, 'Konten harus diisi'),
  status: z.enum(['draft', 'published']),
  category_id: z.string().optional(),
  featured_image: z.string()
    .url('URL gambar tidak valid')
    .optional()
    .or(z.literal('')),
  tags: z.array(z.string()).optional()
})

// Category validation schema
export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Nama kategori harus diisi')
    .max(100, 'Nama kategori tidak boleh lebih dari 100 karakter'),
  slug: z.string()
    .min(1, 'Slug harus diisi')
    .max(100, 'Slug tidak boleh lebih dari 100 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung'),
  description: z.string()
    .max(500, 'Deskripsi tidak boleh lebih dari 500 karakter')
    .optional()
})

// Tag validation schema
export const tagSchema = z.object({
  name: z.string()
    .min(1, 'Nama tag harus diisi')
    .max(50, 'Nama tag tidak boleh lebih dari 50 karakter'),
  slug: z.string()
    .min(1, 'Slug harus diisi')
    .max(50, 'Slug tidak boleh lebih dari 50 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh mengandung huruf kecil, angka, dan tanda hubung')
})

// Admin login validation schema
export const adminLoginSchema = z.object({
  username: z.string()
    .min(1, 'Username harus diisi')
    .max(50, 'Username tidak boleh lebih dari 50 karakter'),
  password: z.string()
    .min(1, 'Password harus diisi')
    .min(6, 'Password minimal 6 karakter')
})

// Search validation schema
export const searchSchema = z.object({
  query: z.string()
    .max(100, 'Kata kunci pencarian tidak boleh lebih dari 100 karakter')
    .optional(),
  category: z.string().optional(),
  page: z.number()
    .min(1, 'Halaman harus lebih dari 0')
    .optional()
})

// Image upload validation
export const imageUploadSchema = z.object({
  file: z.instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, 'Ukuran file tidak boleh lebih dari 5MB')
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Format file harus JPEG, PNG, atau WebP'
    )
})

// Utility functions for validation
export const validateSlug = (slug: string): boolean => {
  return /^[a-z0-9-]+$/.test(slug)
}

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}


