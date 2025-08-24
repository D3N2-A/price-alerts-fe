'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Database } from '@/types/database'
import Sidebar from '@/components/layout/Sidebar'
import MainPanel from '@/components/layout/MainPanel'

type Product = Database['public']['Tables']['products']['Row']
type PriceHistory = Database['public']['Tables']['price_history']['Row']

interface ProductWithLatestData extends Product {
  latestData?: PriceHistory
  loading?: boolean
}

export default function Home() {
  const [products, setProducts] = useState<ProductWithLatestData[]>([])
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Fetch products and their latest price data
  useEffect(() => {
    async function fetchProducts() {
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .order('url')

      if (error) {
        console.error('Error fetching products:', error)
        return
      }

      if (!productsData) return

      // Initialize products with loading state
      const productsWithLoading = productsData.map(product => ({
        ...product,
        loading: true
      }))
      setProducts(productsWithLoading)

      // Fetch latest price data for each product
      const productsWithData = await Promise.all(
        productsData.map(async (product) => {
          const { data: latestData } = await supabase
            .from('price_history')
            .select('*')
            .eq('product_url', product.url)
            .order('timestamp', { ascending: false })
            .limit(1)
            .single()

          return {
            ...product,
            latestData: latestData || undefined,
            loading: false
          }
        })
      )

      setProducts(productsWithData)
    }

    fetchProducts()
  }, [])

  // Fetch price history when product is selected
  useEffect(() => {
    async function fetchPriceHistory() {
      if (!selectedProduct) {
        setPriceHistory([])
        return
      }

      setLoading(true)
      
      const { data, error } = await supabase
        .from('price_history')
        .select('*')
        .eq('product_url', selectedProduct)
        .order('timestamp', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Error fetching price history:', error)
      } else {
        setPriceHistory(data || [])
      }

      setLoading(false)
    }

    fetchPriceHistory()
  }, [selectedProduct])

  return (
    <div className="h-screen flex">
      <Sidebar
        products={products}
        selectedProduct={selectedProduct}
        onProductSelect={setSelectedProduct}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <MainPanel
        selectedProduct={selectedProduct}
        priceHistory={priceHistory}
        loading={loading}
      />
    </div>
  )
}