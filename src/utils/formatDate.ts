// Simple date formatting without external dependencies
export const formatDate = (date: string | Date, formatString: string = 'dd MMMM yyyy'): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }
    return dateObj.toLocaleDateString('id-ID', options)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export const formatDateTime = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return dateObj.toLocaleDateString('id-ID', options)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}

export const formatDateShort = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
    return dateObj.toLocaleDateString('id-ID', options)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid date'
  }
}
