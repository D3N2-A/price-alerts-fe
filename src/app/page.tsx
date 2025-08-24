"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database";
import Sidebar from "@/components/layout/Sidebar";
import MainPanel from "@/components/layout/MainPanel";
import NotificationSettings from "@/components/ui/NotificationSettings";
import { notificationManager } from "@/lib/notifications";

type Product = Database["public"]["Tables"]["products"]["Row"];
type PriceHistory = Database["public"]["Tables"]["price_history"]["Row"];

interface ProductWithLatestData extends Product {
  latestData?: PriceHistory;
  loading?: boolean;
}

export default function Home() {
  const [products, setProducts] = useState<ProductWithLatestData[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Fetch products and their latest price data
  useEffect(() => {
    async function fetchProducts() {
      const { data: productsData, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .eq("is_deleted", false)
        .order("url");

      if (error) {
        console.error("Error fetching products:", error);
        return;
      }

      if (!productsData) return;

      // Initialize products with loading state
      const productsWithLoading = productsData.map((product: Product) => ({
        ...product,
        loading: true,
      }));
      setProducts(productsWithLoading);

      // Fetch latest price data for each product
      const productsWithData = await Promise.all(
        productsData.map(async (product: Product) => {
          const { data: latestData } = await supabase
            .from("price_history")
            .select("*")
            .eq("product_url", product.url as string)
            .order("timestamp", { ascending: false })
            .limit(1)
            .single();

          return {
            ...product,
            latestData: latestData || undefined,
            loading: false,
          };
        })
      );

      setProducts(productsWithData);
    }

    fetchProducts();
  }, []);

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      const initialized = await notificationManager.initialize();
      if (initialized) {
        const permission = await notificationManager.requestPermission();
        setNotificationsEnabled(permission === 'granted');
      }
    };

    initNotifications();
  }, []);

  // Handle mobile breakpoint detection
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Fetch price history when product is selected
  useEffect(() => {
    async function fetchPriceHistory() {
      if (!selectedProduct) {
        setPriceHistory([]);
        return;
      }

      setLoading(true);

      const { data, error } = await supabase
        .from("price_history")
        .select("*")
        .eq("product_url", selectedProduct)
        .order("timestamp", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching price history:", error);
      } else {
        setPriceHistory(data || []);
      }

      setLoading(false);
    }

    fetchPriceHistory();
  }, [selectedProduct]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile overlay backdrop */}
      {isMobile && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Notification settings - Desktop only in top right */}
      {!isMobile && (
        <div className="fixed top-4 right-4 z-30">
          <NotificationSettings 
            enabled={notificationsEnabled}
            onToggle={setNotificationsEnabled}
          />
        </div>
      )}
      
      <Sidebar
        products={products}
        selectedProduct={selectedProduct}
        onProductSelect={(url) => {
          setSelectedProduct(url);
          if (isMobile) {
            setMobileMenuOpen(false);
          }
        }}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => {
          if (isMobile) {
            setMobileMenuOpen(!mobileMenuOpen);
          } else {
            setSidebarCollapsed(!sidebarCollapsed);
          }
        }}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
      />
      <MainPanel
        selectedProduct={selectedProduct}
        priceHistory={priceHistory}
        loading={loading}
        isMobile={isMobile}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        notificationsEnabled={notificationsEnabled}
        onToggleNotifications={setNotificationsEnabled}
      />
    </div>
  );
}
