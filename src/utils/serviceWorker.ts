// Service Worker registration
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered successfully:', registration.scope)
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, prompt user to refresh
              if (confirm('New content is available. Refresh the page?')) {
                window.location.reload()
              }
            }
          })
        }
      })
      
      return registration
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }
}

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(registrations.map(registration => registration.unregister()))
      console.log('Service Workers unregistered')
    } catch (error) {
      console.error('Service Worker unregistration failed:', error)
    }
  }
}


