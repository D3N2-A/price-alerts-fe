import { createClient } from '@/lib/supabase-server'

export async function getProducts() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_deleted', false)
    .order('url')

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export async function getPriceHistory(productUrl: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('price_history')
    .select('*')
    .eq('product_url', productUrl)
    .order('timestamp', { ascending: false })
    .limit(100) // Limit to last 100 entries for performance

  if (error) {
    console.error('Error fetching price history:', error)
    return []
  }

  return data || []
}