"use client";

import { Database } from "@/types/database";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type PriceHistory = Database["public"]["Tables"]["price_history"]["Row"];

interface PriceChartProps {
  data: PriceHistory[];
}

export default function PriceChart({ data }: PriceChartProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Transform and sort data for chart (oldest to newest)
  const transformedData = data
    .slice()
    .reverse()
    .map((entry) => {
      const date = new Date(entry.timestamp);
      return {
        date,
        timestamp: isMobile
          ? date.toLocaleDateString("en-US", { month: "short", day: "2-digit" })
          : date.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            }),
        price: entry.price,
        currency: entry.currency,
        availability: entry.availability,
        name: entry.name,
        fullTimestamp: entry.timestamp,
        localTime: date.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
      };
    });

  const chartData = {
    labels: transformedData.map((item) => item.timestamp),
    datasets: [
      {
        label: "Price",
        data: transformedData.map((item) => item.price),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.1)",
        borderWidth: isMobile ? 2 : 3,
        pointBackgroundColor: "#2563eb",
        pointBorderColor: "#ffffff",
        pointBorderWidth: isMobile ? 2 : 3,
        pointRadius: isMobile ? 4 : 5,
        pointHoverRadius: isMobile ? 6 : 8,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "white",
        titleColor: "#374151",
        bodyColor: "#374151",
        borderColor: "#d1d5db",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: function (context: any) {
            const index = context[0].dataIndex;
            return transformedData[index]?.name || "";
          },
          label: function (context: any) {
            const index = context.dataIndex;
            const dataPoint = transformedData[index];
            return [
              `Date: ${dataPoint?.localTime}`,
              `${dataPoint?.currency} ${context.parsed.y.toFixed(2)}`,
              `${dataPoint?.availability ? "Available" : "Out of Stock"}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: "#f3f4f6",
          drawBorder: true,
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: isMobile ? 10 : 12,
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: 0,
        },
        border: {
          color: "#d1d5db",
          width: 2,
        },
      },
      y: {
        display: true,
        position: "left" as const,
        grid: {
          color: "#f3f4f6",
          drawBorder: true,
        },
        ticks: {
          color: "#374151",
          font: {
            size: isMobile ? 11 : 14,
            weight: "bold" as const,
          },
          padding: 8,
          callback: function (value: any) {
            const currency = data[0]?.currency || "";
            return isMobile ? `${value}` : `${currency} ${value.toFixed(2)}`;
          },
        },
        border: {
          color: "#374151",
          width: 3,
        },
        beginAtZero: false,
        // Enhanced y-axis styling for better visibility
        afterDataLimits: function (scale: any) {
          const range = scale.max - scale.min;
          scale.max = scale.max + range * 0.1;
          scale.min = scale.min - range * 0.1;
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: "#ffffff",
        hoverBorderColor: "#2563eb",
        hoverBorderWidth: 3,
      },
    },
    interaction: {
      intersect: false,
      mode: "index" as const,
    },
  };

  return (
    <div className="h-64 sm:h-80 md:h-96 p-2">
      <Line data={chartData} options={options} />
    </div>
  );
}
