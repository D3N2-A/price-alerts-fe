# PWA & Responsive Features

## Responsive Design

The Price Alerts Dashboard is now fully responsive and optimized for all screen sizes:

### Mobile Features (< 768px)
- **Mobile Navigation**: Sidebar transforms into a slide-out menu with overlay backdrop
- **Touch-Friendly**: Larger touch targets and improved spacing
- **Optimized Layout**: Stacked layouts for better mobile viewing
- **Responsive Charts**: Charts adapt with smaller margins, rotated labels, and touch-optimized interactions
- **Mobile Header**: Hamburger menu and notification settings in mobile header

### Tablet & Desktop (≥ 768px)
- **Collapsible Sidebar**: Click to expand/collapse the product sidebar
- **Fixed Notification Settings**: Notification toggle in top-right corner
- **Optimized Chart Display**: Full-size charts with detailed axis labels
- **Responsive Grid**: Flexible layouts that adapt to screen size

## PWA (Progressive Web App) Features

### Installation
- **Add to Home Screen**: Install the app on mobile devices and desktops
- **Standalone Mode**: Runs like a native app without browser chrome
- **App Icons**: Custom icons for different screen sizes and platforms

### Offline Support
- **Service Worker**: Caches essential resources for offline functionality
- **Background Sync**: Works offline and syncs when connection returns

### Push Notifications

#### Setup
1. **Enable Notifications**: Click the bell icon to enable push notifications
2. **Grant Permission**: Allow notification permission when prompted
3. **Test Notification**: Use the "Test Notification" button to verify setup

#### Features
- **Price Alerts**: Get notified when tracked product prices change
- **Action Buttons**: "View Product" and "Dismiss" actions in notifications
- **Rich Notifications**: Include product images, prices, and timestamps
- **Cross-Platform**: Works on desktop and mobile browsers

#### Notification Types
- **Price Drop Alerts**: When a product price decreases
- **Availability Alerts**: When out-of-stock items become available
- **Test Notifications**: Manual test notifications to verify setup

### PWA Manifest Features
- **App Name**: "Price Alerts Dashboard"
- **Theme Colors**: Blue theme (#2563eb) matching the UI
- **Display Mode**: Standalone for app-like experience
- **Orientation**: Portrait-primary for mobile optimization
- **Categories**: Productivity, Shopping, Utilities

### Browser Compatibility
- **Chrome/Edge**: Full PWA support including push notifications
- **Firefox**: Most features supported, limited push notification support
- **Safari**: Basic PWA features, limited notification support on iOS

### Usage Instructions

#### Mobile Usage
1. Open the app in a mobile browser
2. Tap the menu button (hamburger icon) to access the product list
3. Select a product to view its price history
4. Enable notifications via the bell icon in the header
5. Add to home screen for easy access

#### Desktop Usage
1. Use the collapsible sidebar to navigate products
2. Enable notifications via the bell icon (top-right)
3. Install as PWA via browser's install prompt
4. Resize window to test responsive behavior

### Technical Implementation

#### Service Worker (`/public/sw.js`)
- Caches static assets and API responses
- Handles push notification events
- Provides offline functionality

#### Notification Manager (`/src/lib/notifications.ts`)
- Handles permission requests
- Manages push subscriptions
- Shows local and push notifications

#### Responsive Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 768px (md)
- Desktop: > 768px (lg+)

### Future Enhancements
- **Background Sync**: Sync data when connection returns
- **Price Target Setting**: Set custom price alerts for products
- **Rich Notifications**: Include product images and detailed info
- **Push Server**: Backend service for server-sent push notifications
- **App Store Distribution**: Consider native app store distribution

### Development Notes
- Built with Next.js App Router
- Responsive design using Tailwind CSS
- Service Worker for PWA functionality
- TypeScript for type safety
- Modern browser APIs for notifications