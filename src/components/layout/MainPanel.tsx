import { Database } from '@/types/database'
import PriceChart from '@/components/charts/PriceChart'
import { ExternalLink } from 'lucide-react'

type PriceHistory = Database['public']['Tables']['price_history']['Row']

interface MainPanelProps {
  selectedProduct: string | null
  priceHistory: PriceHistory[]
  loading: boolean
}

export default function MainPanel({ selectedProduct, priceHistory, loading }: MainPanelProps) {
  if (!selectedProduct) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Select a product
          </h3>
          <p className="text-gray-500">
            Choose a product from the sidebar to view its price history
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading price history...</p>
        </div>
      </div>
    )
  }

  if (priceHistory.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No price history found
          </h3>
          <p className="text-gray-500">
            No price data available for this product
          </p>
        </div>
      </div>
    )
  }

  const latestEntry = priceHistory[0]

  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Product Header */}
        <div className="flex items-start space-x-4 mb-6 pb-6 border-b border-gray-200">
          {latestEntry.main_image_url && (
            <img
              src={latestEntry.main_image_url}
              alt={latestEntry.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-xl font-semibold text-gray-900">
                {latestEntry.name}
              </h1>
              <a
                href={selectedProduct}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors ml-4"
              >
                <span className="text-sm">View Product</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-bold text-green-600">
                {latestEntry.currency} {latestEntry.price.toFixed(2)}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${
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
  )
}