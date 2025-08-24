'use client'

import { useState } from 'react'
import { Bell, BellOff, Settings } from 'lucide-react'
import { notificationManager } from '@/lib/notifications'

interface NotificationSettingsProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

export default function NotificationSettings({ enabled, onToggle }: NotificationSettingsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleNotifications = async () => {
    setIsLoading(true)
    
    try {
      if (!enabled) {
        const permission = await notificationManager.requestPermission()
        if (permission === 'granted') {
          // Try to subscribe to push notifications
          await notificationManager.subscribeToPushNotifications()
          onToggle(true)
          
          // Show a test notification
          await notificationManager.showNotification({
            title: 'Notifications Enabled! 🔔',
            body: 'You will now receive price alerts for your tracked products.',
          })
        } else {
          alert('Notifications permission is required to receive price alerts.')
        }
      } else {
        onToggle(false)
      }
    } catch (error) {
      console.error('Failed to toggle notifications:', error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title={enabled ? 'Notifications enabled' : 'Notifications disabled'}
      >
        {enabled ? (
          <Bell className="h-5 w-5 text-blue-600" />
        ) : (
          <BellOff className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50">
          <div className="flex items-center space-x-2 mb-3">
            <Settings className="h-4 w-4 text-gray-600" />
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Price Alerts</span>
              <button
                onClick={handleToggleNotifications}
                disabled={isLoading}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  enabled ? 'bg-blue-600' : 'bg-gray-200'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    enabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              {enabled 
                ? 'You will receive notifications when prices drop for your tracked products.'
                : 'Enable notifications to get alerts when prices change.'
              }
            </p>

            {enabled && (
              <button
                onClick={async () => {
                  await notificationManager.showNotification({
                    title: 'Test Notification 📱',
                    body: 'This is how price alerts will appear!',
                  })
                  setIsOpen(false)
                }}
                className="w-full text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded hover:bg-blue-100 transition-colors"
              >
                Test Notification
              </button>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </div>
  )
}