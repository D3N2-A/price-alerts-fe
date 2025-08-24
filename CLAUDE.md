# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a frontend application for displaying time series data scraped from wishlist items, as part of a price alerts system. The project is currently in its initial stages with only basic documentation and licensing files present.

## Current State

- The repository contains only README.md and LICENSE files
- No source code, configuration files, or build system has been set up yet
- This appears to be a greenfield project ready for initial development

## Development Setup

### Initial Project Setup
1. Initialize Next.js project with TypeScript:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app
   ```

2. Install Supabase client and chart dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   npm install recharts lucide-react
   ```

### Development Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Notes

### Next.js + Supabase Integration
- Use `@supabase/supabase-js` and `@supabase/ssr` for server-side rendering support
- Store Supabase credentials in environment variables (`.env.local`)
- Implement data fetching in Server Components for better performance
- Use Client Components only for interactive chart components

### Data Flow (Read-Only)
- Fetch price history data from Supabase in Server Components
- Pass data to Client Components for chart rendering
- Use Recharts for time series visualization
- Implement proper loading and error states

### Project Structure
```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── charts/          # Recharts visualization components
│   ├── ui/              # Reusable UI components
│   └── layout/          # Layout components
├── lib/
│   ├── supabase.ts      # Supabase client (server)
│   ├── supabase-browser.ts # Supabase client (browser)
│   └── utils.ts         # Utility functions
└── types/
    └── database.ts      # Supabase database types
```

## Environment Variables
Create `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Configuration
1. Create Supabase clients for server and browser contexts
2. Expected tables for price/wishlist data (structure TBD)
3. Use Row Level Security if needed for data access
4. Generate TypeScript types from Supabase schema

## Development Guidelines
- Use Server Components for data fetching from Supabase
- Use Client Components for interactive charts and user interactions
- Implement proper error handling and loading states
- Follow Next.js App Router conventions
- Use Tailwind CSS for styling
- Keep chart components lightweight and focused on visualization

## Data information
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

```CREATE TABLE public.price_history (
  id character varying NOT NULL,
  product_url character varying,
  name character varying NOT NULL,
  price double precision NOT NULL,
  currency character varying NOT NULL,
  main_image_url character varying,
  availability boolean,
  timestamp timestamp without time zone NOT NULL,
  additional_data json,
  CONSTRAINT price_history_pkey PRIMARY KEY (id),
  CONSTRAINT price_history_product_url_fkey FOREIGN KEY (product_url) REFERENCES public.products(url)
);
CREATE TABLE public.products (
  url character varying NOT NULL,
  is_active boolean,
  is_deleted boolean,
  CONSTRAINT products_pkey PRIMARY KEY (url)
);
```
## UI information
-- Left sidebar : Show product links 
-- Main panel : Display price history of that product in form of chart. 
   -- Along with graph make sure to display image and title 


## Next Steps for Basic Setup
1. Initialize Next.js project with TypeScript and Tailwind
2. Configure Supabase clients for server and browser
3. Set up environment variables
4. Create basic page structure with App Router
5. Generate database types from Supabase
6. Implement data fetching and chart display components