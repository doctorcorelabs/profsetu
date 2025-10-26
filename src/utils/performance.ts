// Performance monitoring utilities

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
}

export const measureAsyncPerformance = async (name: string, fn: () => Promise<any>) => {
  const start = performance.now()
  const result = await fn()
  const end = performance.now()
  console.log(`${name} took ${end - start} milliseconds`)
  return result
}

export const getPerformanceMetrics = () => {
  if ('performance' in window && 'getEntriesByType' in performance) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const paint = performance.getEntriesByType('paint')
    
    return {
      // Navigation timing
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
      
      // Paint timing
      firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime || 0,
      firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
      
      // Resource timing
      resourceCount: performance.getEntriesByType('resource').length,
      
      // Memory usage (if available)
      memory: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null
    }
  }
  
  return null
}

export const logPerformanceMetrics = () => {
  const metrics = getPerformanceMetrics()
  if (metrics) {
    console.group('Performance Metrics')
    console.log('DOM Content Loaded:', `${metrics.domContentLoaded.toFixed(2)}ms`)
    console.log('Load Complete:', `${metrics.loadComplete.toFixed(2)}ms`)
    console.log('Total Load Time:', `${metrics.totalLoadTime.toFixed(2)}ms`)
    console.log('First Paint:', `${metrics.firstPaint.toFixed(2)}ms`)
    console.log('First Contentful Paint:', `${metrics.firstContentfulPaint.toFixed(2)}ms`)
    console.log('Resource Count:', metrics.resourceCount)
    
    if (metrics.memory) {
      console.log('Memory Usage:', {
        used: `${(metrics.memory.used / 1024 / 1024).toFixed(2)}MB`,
        total: `${(metrics.memory.total / 1024 / 1024).toFixed(2)}MB`,
        limit: `${(metrics.memory.limit / 1024 / 1024).toFixed(2)}MB`
      })
    }
    console.groupEnd()
  }
}

// Debounce utility for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle utility for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

