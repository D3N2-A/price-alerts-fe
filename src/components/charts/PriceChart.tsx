'use client'

import { Database } from '@/types/database'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type PriceHistory = Database['public']['Tables']['price_history']['Row']

interface PriceChartProps {
  data: PriceHistory[]
}

export default function PriceChart({ data }: PriceChartProps) {
  // Transform and sort data for chart (oldest to newest)
  const chartData = data
    .slice()
    .reverse()
    .map((entry) => ({
      timestamp: new Date(entry.timestamp).toLocaleDateString(),
      price: entry.price,
      currency: entry.currency,
      availability: entry.availability,
      name: entry.name,
      fullTimestamp: entry.timestamp,
    }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Date: {new Date(data.fullTimestamp).toLocaleString()}
          </p>
          <p className="text-lg font-semibold text-green-600">
            {data.currency} {data.price.toFixed(2)}
          </p>
          <p className={`text-sm ${data.availability ? 'text-green-600' : 'text-red-600'}`}>
            {data.availability ? 'Available' : 'Out of Stock'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => `${data[0]?.currency || ''} ${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}