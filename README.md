# Price Alerts Dashboard

A modern, responsive Progressive Web App (PWA) for tracking price history of wishlist items with real-time push notifications.

## 📱 Features

### Responsive Design
- **Mobile-First**: Optimized layouts for phones, tablets, and desktops
- **Touch-Friendly**: Large touch targets and intuitive mobile navigation
- **Adaptive Charts**: Price history charts that scale beautifully across all screen sizes
- **Collapsible Sidebar**: Desktop sidebar that can be collapsed for more chart space

### PWA Capabilities
- **🏠 Installable**: Add to home screen on mobile and desktop
- **📡 Offline Support**: Service worker caches for offline functionality
- **🔔 Push Notifications**: Real-time price alerts with rich notifications
- **⚡ Fast Loading**: Optimized performance with Next.js

### Core Functionality
- **📊 Price History**: Interactive charts showing price trends over time
- **🏷️ Product Tracking**: Monitor multiple products from your wishlist
- **🔍 Product Details**: View current price, availability, and product images
- **🌙 Modern UI**: Clean, accessible interface with Tailwind CSS

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for data storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd price-alerts-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage

### Mobile Experience
1. **Navigation**: Tap the hamburger menu to access the product sidebar
2. **Product Selection**: Choose a product to view its price history
3. **Notifications**: Enable push notifications via the bell icon in the header
4. **Installation**: Use "Add to Home Screen" for native app experience

### Desktop Experience
1. **Sidebar**: Use the collapsible sidebar to browse products
2. **Charts**: View detailed price history with hover interactions
3. **Notifications**: Enable alerts via the notification icon (top-right)
4. **Installation**: Install as PWA via browser's install prompt

### Push Notifications Setup
1. Click the bell icon (🔔) in the app header
2. Grant notification permissions when prompted
3. Test notifications using the "Test Notification" button
4. Receive automatic price alerts when tracked items change

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

### Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with PWA config
│   └── page.tsx           # Main dashboard page
├── components/
│   ├── charts/            # Chart components (Recharts)
│   │   └── PriceChart.tsx # Responsive price history chart
│   ├── layout/            # Layout components
│   │   ├── MainPanel.tsx  # Main content area (responsive)
│   │   └── Sidebar.tsx    # Product navigation (responsive)
│   └── ui/                # UI components
│       └── NotificationSettings.tsx # PWA notification controls
├── lib/
│   ├── notifications.ts   # Push notification manager
│   ├── supabase.ts       # Supabase client (browser)
│   ├── supabase-server.ts # Supabase client (server)
│   └── queries.ts        # Database queries
├── types/
│   └── database.ts       # TypeScript database types
public/
├── icons/                # PWA icons
├── manifest.json         # PWA manifest
└── sw.js                # Service worker
```

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: Custom Service Worker
- **TypeScript**: Full type safety

## 📊 Database Schema

The app expects these Supabase tables:

```sql
-- Products table
CREATE TABLE products (
  url character varying PRIMARY KEY,
  is_active boolean,
  is_deleted boolean
);

-- Price history table  
CREATE TABLE price_history (
  id character varying PRIMARY KEY,
  product_url character varying REFERENCES products(url),
  name character varying NOT NULL,
  price double precision NOT NULL,
  currency character varying NOT NULL,
  main_image_url character varying,
  availability boolean,
  timestamp timestamp without time zone NOT NULL,
  additional_data json
);
```

## 🌐 PWA Features

### Installation
- **Chrome/Edge**: Full PWA support with install prompts
- **Firefox**: Basic PWA support  
- **Safari**: Limited PWA support on iOS

### Offline Support
- Essential assets cached via service worker
- Graceful degradation when offline
- Background sync when connection returns

### Notifications
- **Desktop**: Rich notifications with action buttons
- **Mobile**: Native-style notifications
- **Actions**: "View Product" and "Dismiss" options

## 🔧 Configuration

### Notification Setup
For push notifications to work, you'll need to:
1. Generate VAPID keys for your application
2. Update the `vapidPublicKey` in `/src/lib/notifications.ts`
3. Set up a backend service to send push notifications

### PWA Customization
- **Icons**: Replace icons in `/public/icons/` with your app icons
- **Manifest**: Update `/public/manifest.json` with your app details
- **Service Worker**: Customize caching strategy in `/public/sw.js`

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify  
- Railway
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

For support and questions:
- Check the [PWA Features Guide](PWA_FEATURES.md) for detailed PWA documentation
- Open an issue for bugs or feature requests
- Review the database schema requirements above

## 🎯 Roadmap

- [ ] Price target alerts with custom thresholds
- [ ] Email notification support
- [ ] Bulk product import
- [ ] Advanced filtering and search
- [ ] Price comparison across retailers
- [ ] Historical price analytics
