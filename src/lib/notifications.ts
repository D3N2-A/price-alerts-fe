'use client'

export interface NotificationOptions {
  title: string
  body: string
  url?: string
  icon?: string
}

export class NotificationManager {
  private registration: ServiceWorkerRegistration | null = null

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Notifications not supported in this browser')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.ready
      return true
    } catch (error) {
      console.error('Failed to initialize notification manager:', error)
      return false
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  async showNotification(options: NotificationOptions): Promise<void> {
    const permission = await this.requestPermission()
    
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    if (this.registration) {
      await this.registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        data: {
          url: options.url || '/',
          timestamp: Date.now()
        },
        actions: [
          {
            action: 'view',
            title: 'View Product',
            icon: '/icons/icon-72x72.png'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ]
      } as NotificationOptions & { badge: string, data: any, actions: any[] })
    } else {
      // Fallback to basic notification
      new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/icons/icon-192x192.png'
      })
    }
  }

  async subscribeToPushNotifications(): Promise<PushSubscription | null> {
    if (!this.registration) {
      console.error('Service worker not registered')
      return null
    }

    try {
      // You'll need to replace this with your actual VAPID public key
      const vapidPublicKey = 'your-vapid-public-key-here'
      
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      })

      console.log('Push subscription successful:', subscription)
      return subscription
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error)
      return null
    }
  }

  private urlBase64ToUint8Array(base64String: string): BufferSource {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  // Example method to check for price alerts
  async checkPriceAlerts(products: Array<{ url: string, name: string, currentPrice: number, targetPrice?: number }>): Promise<void> {
    for (const product of products) {
      if (product.targetPrice && product.currentPrice <= product.targetPrice) {
        await this.showNotification({
          title: 'Price Alert! 🔔',
          body: `${product.name} is now $${product.currentPrice} (Target: $${product.targetPrice})`,
          url: `/?product=${encodeURIComponent(product.url)}`
        })
      }
    }
  }
}

// Global instance
export const notificationManager = new NotificationManager()