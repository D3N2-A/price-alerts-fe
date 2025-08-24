export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          url: string
          is_active: boolean | null
          is_deleted: boolean | null
        }
        Insert: {
          url: string
          is_active?: boolean | null
          is_deleted?: boolean | null
        }
        Update: {
          url?: string
          is_active?: boolean | null
          is_deleted?: boolean | null
        }
      }
      price_history: {
        Row: {
          id: string
          product_url: string | null
          name: string
          price: number
          currency: string
          main_image_url: string | null
          availability: boolean | null
          timestamp: string
          additional_data: any | null
        }
        Insert: {
          id: string
          product_url?: string | null
          name: string
          price: number
          currency: string
          main_image_url?: string | null
          availability?: boolean | null
          timestamp: string
          additional_data?: any | null
        }
        Update: {
          id?: string
          product_url?: string | null
          name?: string
          price?: number
          currency?: string
          main_image_url?: string | null
          availability?: boolean | null
          timestamp?: string
          additional_data?: any | null
        }
      }
    }
  }
}