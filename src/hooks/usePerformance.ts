import { useEffect, useCallback } from 'react'
import { getPerformanceMetrics, logPerformanceMetrics } from '@/utils/performance'

export const usePerformance = () => {
  const logMetrics = useCallback(() => {
    logPerformanceMetrics()
  }, [])

  useEffect(() => {
    // Log performance metrics after page load
    const timer = setTimeout(() => {
      logMetrics()
    }, 2000)

    return () => clearTimeout(timer)
  }, [logMetrics])

  return {
    getMetrics: getPerformanceMetrics,
    logMetrics
  }
}


