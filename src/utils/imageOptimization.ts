// Image optimization utilities

export const optimizeImageUrl = (url: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: 'webp' | 'jpeg' | 'png'
} = {}): string => {
  if (!url) return url

  const { width, height, quality = 80, format = 'webp' } = options

  // For Supabase Storage images
  if (url.includes('supabase')) {
    const baseUrl = url.split('?')[0]
    const params = new URLSearchParams()
    
    if (width) params.append('width', width.toString())
    if (height) params.append('height', height.toString())
    if (quality) params.append('quality', quality.toString())
    if (format) params.append('format', format)
    
    return `${baseUrl}?${params.toString()}`
  }

  // For other image URLs, return as is
  return url
}

export const generateImageVariants = (baseUrl: string) => {
  return {
    thumbnail: optimizeImageUrl(baseUrl, { width: 300, height: 200, quality: 70 }),
    medium: optimizeImageUrl(baseUrl, { width: 600, height: 400, quality: 80 }),
    large: optimizeImageUrl(baseUrl, { width: 1200, height: 800, quality: 85 }),
    original: baseUrl
  }
}

export const getResponsiveImageSrc = (baseUrl: string, sizes: string) => {
  const variants = generateImageVariants(baseUrl)
  
  // Generate srcset for different screen sizes
  const srcSet = Object.entries(variants)
    .filter(([key]) => key !== 'original')
    .map(([key, url]) => {
      const width = key === 'thumbnail' ? 300 : key === 'medium' ? 600 : 1200
      return `${url} ${width}w`
    })
    .join(', ')

  return {
    src: variants.medium,
    srcSet,
    sizes
  }
}




