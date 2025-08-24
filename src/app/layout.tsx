import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Price Alerts Dashboard',
  description: 'Frontend for showing time series data scraped from wishlist items',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  )
}