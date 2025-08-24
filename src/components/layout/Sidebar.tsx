'use client'

import { Database } from '@/types/database'
import { ExternalLink, ChevronLeft, Menu } from 'lucide-react'

type Product = Database['public']['Tables']['products']['Row']
type PriceHistory = Database['public']['Tables']['price_history']['Row']

interface ProductWithLatestData extends Product {
  latestData?: PriceHistory
  loading?: boolean
}

interface SidebarProps {
  products: ProductWithLatestData[]
  selectedProduct: string | null
  onProductSelect: (productUrl: string) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export default function Sidebar({ products, selectedProduct, onProductSelect, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        {!isCollapsed && (
          <h2 className="text-xl font-semibold text-gray-900 transition-opacity duration-200">
            Products
          </h2>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isCollapsed ? 'mx-auto' : ''
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Products list */}
      <div className={`${isCollapsed ? 'p-2' : 'p-6'} space-y-2`}>
        {products.map((product) => (
          <button
            key={product.url}
            onClick={() => onProductSelect(product.url)}
            className={`w-full text-left rounded-lg transition-all duration-200 ${
              selectedProduct === product.url
                ? 'bg-blue-50 border border-blue-200'
                : 'hover:bg-gray-50 border border-transparent'
            } ${isCollapsed ? 'p-2' : 'p-3'}`}
            title={isCollapsed && product.latestData ? product.latestData.name : undefined}
          >
            {isCollapsed ? (
              // Collapsed view - show only image or first letter
              <div className="flex items-center justify-center">
                {product.latestData?.main_image_url ? (
                  <img
                    src={product.latestData.main_image_url}
                    alt={product.latestData.name}
                    className="w-8 h-8 object-cover rounded"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-medium text-gray-600">
                    {product.latestData?.name?.[0]?.toUpperCase() || new URL(product.url).hostname[0].toUpperCase()}
                  </div>
                )}
              </div>
            ) : (
              // Expanded view - show full details
              <>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {product.loading ? (
                      <div className="text-sm text-gray-500 truncate">
                        {new URL(product.url).hostname}
                      </div>
                    ) : product.latestData ? (
                      <>
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {product.latestData.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {product.latestData.currency} {product.latestData.price.toFixed(2)}
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-gray-500 truncate">
                        {new URL(product.url).hostname}
                      </div>
                    )}
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {product.is_active ? 'Active' : 'Inactive'}
                </div>
              </>
            )}
          </button>
        ))}
      </div>
      {products.length === 0 && !isCollapsed && (
        <div className="text-gray-500 text-sm text-center py-8">
          No products found
        </div>
      )}
    </div>
  )
}