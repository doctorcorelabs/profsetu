// Security utilities

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '')
}

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
}

export const validateSlug = (slug: string): boolean => {
  // Only allow lowercase letters, numbers, and hyphens
  return /^[a-z0-9-]+$/.test(slug) && !slug.startsWith('-') && !slug.endsWith('-')
}

export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 6) {
    errors.push('Password minimal 6 karakter')
  }
  
  if (password.length > 128) {
    errors.push('Password maksimal 128 karakter')
  }
  
  // Check for common weak passwords
  const commonPasswords = ['password', '123456', 'admin', 'qwerty']
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password terlalu umum, gunakan password yang lebih kuat')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const rateLimit = (() => {
  const attempts = new Map<string, { count: number; resetTime: number }>()
  
  return (key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean => {
    const now = Date.now()
    const attempt = attempts.get(key)
    
    if (!attempt || now > attempt.resetTime) {
      attempts.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (attempt.count >= maxAttempts) {
      return false
    }
    
    attempt.count++
    return true
  }
})()

export const validateFileUpload = (file: File, options: {
  maxSize?: number
  allowedTypes?: string[]
  allowedExtensions?: string[]
} = {}): { isValid: boolean; error?: string } => {
  const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'], allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'] } = options
  
  if (file.size > maxSize) {
    return { isValid: false, error: `Ukuran file tidak boleh lebih dari ${maxSize / 1024 / 1024}MB` }
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Format file tidak didukung' }
  }
  
  const extension = '.' + file.name.split('.').pop()?.toLowerCase()
  if (!allowedExtensions.includes(extension)) {
    return { isValid: false, error: 'Ekstensi file tidak didukung' }
  }
  
  return { isValid: true }
}

export const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

export const validateUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    return ['http:', 'https:'].includes(parsedUrl.protocol)
  } catch {
    return false
  }
}




