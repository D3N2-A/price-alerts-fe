import { Database } from '@/types/database'
import PriceChart from '@/components/charts/PriceChart'
import NotificationSettings from '@/components/ui/NotificationSettings'
import { ExternalLink, Menu } from 'lucide-react'

type PriceHistory = Database['public']['Tables']['price_history']['Row']

interface MainPanelProps {
  selectedProduct: string | null
  priceHistory: PriceHistory[]
  loading: boolean
  isMobile?: boolean
  onOpenMobileMenu?: () => void
  notificationsEnabled?: boolean
  onToggleNotifications?: (enabled: boolean) => void
}

export default function MainPanel({ selectedProduct, priceHistory, loading, isMobile, onOpenMobileMenu, notificationsEnabled, onToggleNotifications }: MainPanelProps) {
  if (!selectedProduct) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
              <button
                onClick={onOpenMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                title="Open menu"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Price Alerts</h1>
            </div>
            {notificationsEnabled !== undefined && onToggleNotifications && (
              <NotificationSettings 
                enabled={notificationsEnabled}
                onToggle={onToggleNotifications}
              />
            )}
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Select a product
            </h3>
            <p className="text-gray-500">
              Choose a product from the {isMobile ? 'menu' : 'sidebar'} to view its price history
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
              <button
                onClick={onOpenMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                title="Open menu"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Price Alerts</h1>
            </div>
            {notificationsEnabled !== undefined && onToggleNotifications && (
              <NotificationSettings 
                enabled={notificationsEnabled}
                onToggle={onToggleNotifications}
              />
            )}
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading price history...</p>
          </div>
        </div>
      </div>
    )
  }

  if (priceHistory.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center">
              <button
                onClick={onOpenMobileMenu}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
                title="Open menu"
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">Price Alerts</h1>
            </div>
            {notificationsEnabled !== undefined && onToggleNotifications && (
              <NotificationSettings 
                enabled={notificationsEnabled}
                onToggle={onToggleNotifications}
              />
            )}
          </div>
        )}
        
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No price history found
            </h3>
            <p className="text-gray-500">
              No price data available for this product
            </p>
          </div>
        </div>
      </div>
    )
  }

  const latestEntry = priceHistory[0]

  return (
    <div className="flex-1 flex flex-col">
      {/* Mobile header */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center">
            <button
              onClick={onOpenMobileMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
              title="Open menu"
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Price Alerts</h1>
          </div>
          {notificationsEnabled !== undefined && onToggleNotifications && (
            <NotificationSettings 
              enabled={notificationsEnabled}
              onToggle={onToggleNotifications}
            />
          )}
        </div>
      )}

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          {/* Product Header */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6 pb-6 border-b border-gray-200">
            {latestEntry.main_image_url && (
              <img
                src={latestEntry.main_image_url}
                alt={latestEntry.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg mx-auto sm:mx-0"
              />
            )}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 space-y-2 sm:space-y-0">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 break-words">
                  {latestEntry.name}
                </h1>
                <a
                  href={selectedProduct}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center sm:justify-start space-x-1 text-blue-600 hover:text-blue-800 transition-colors sm:ml-4"
                >
                  <span className="text-sm">View Product</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <span className="text-xl sm:text-2xl font-bold text-green-600">
                  {latestEntry.currency} {latestEntry.price.toFixed(2)}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full inline-block ${
                  latestEntry.availability 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {latestEntry.availability ? 'Available' : 'Out of Stock'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Last updated: {new Date(latestEntry.timestamp).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Price Chart */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Price History</h2>
            <PriceChart data={priceHistory} />
          </div>
        </div>
      </div>
    </div>
  )
}