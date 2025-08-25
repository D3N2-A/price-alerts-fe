'use client'

import { Database } from '@/types/database'
import { useState, useEffect } from 'react'
import moment from 'moment'
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  // Transform and sort data for chart (oldest to newest)
  const chartData = data
    .slice()
    .reverse()
    .map((entry) => {
      // Create proper Date object from timestamp
      const date = new Date(entry.timestamp)
      
      return {
        timestamp: isMobile 
          ? date.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })
          : date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }),
        price: entry.price,
        currency: entry.currency,
        availability: entry.availability,
        name: entry.name,
        fullTimestamp: entry.timestamp,
        localTime: date.toLocaleString('en-US', { 
          year: 'numeric',
          month: 'long', 
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
      }
    })

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Date: {data.localTime}
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
    <div className="h-64 sm:h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={chartData} 
          margin={{ 
            top: 5, 
            right: isMobile ? 10 : 30, 
            left: isMobile ? 10 : 20, 
            bottom: isMobile ? 40 : 5 
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="timestamp" 
            stroke="#6b7280"
            fontSize={isMobile ? 10 : 12}
            tick={{ fill: '#6b7280' }}
            interval={isMobile ? 'preserveStartEnd' : 0}
            angle={isMobile ? -45 : 0}
            textAnchor={isMobile ? 'end' : 'middle'}
            height={isMobile ? 60 : 30}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={isMobile ? 10 : 12}
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value) => isMobile 
              ? `${value}` 
              : `${data[0]?.currency || ''} ${value}`
            }
            width={isMobile ? 40 : 60}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            strokeWidth={isMobile ? 1.5 : 2}
            dot={{ 
              fill: '#2563eb', 
              strokeWidth: isMobile ? 1 : 2, 
              r: isMobile ? 3 : 4 
            }}
            activeDot={{ 
              r: isMobile ? 5 : 6, 
              stroke: '#2563eb', 
              strokeWidth: 2, 
              fill: '#ffffff' 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}