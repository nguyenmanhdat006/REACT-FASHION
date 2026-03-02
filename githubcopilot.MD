# ECOMMERCE FRONTEND - COMPLETE GITHUB COPILOT GUIDE

**Generate entire frontend in 30-40 hours**

---

## 🚀 QUICK START

```bash
# 1. Create Vite project
npm create vite@latest ecommerce-frontend -- --template react-ts
cd ecommerce-frontend

# 2. Install dependencies
npm install react-router-dom @reduxjs/toolkit react-redux axios \
  @stripe/stripe-js @stripe/react-stripe-js react-hook-form zod \
  @hookform/resolvers date-fns clsx react-hot-toast \
  react-loading-skeleton swiper

# 3. Install dev dependencies
npm install -D tailwindcss postcss autoprefixer \
  @types/node

# 4. Init Tailwind
npx tailwindcss init -p

# 5. Open in VS Code
code .

# 6. Follow this guide to generate ALL files with Copilot!
```

---

## 📁 GENERATION ORDER (10 PHASES)

### PHASE 0: Configuration (30 min - 6 files)

#### 1. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          // ... complete color palette
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
```

#### 2. src/styles/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-gray-50 text-gray-900;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition;
  }
}
```

#### 3. vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
```

#### 4. tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### 5. .env.example
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_key
```

#### 6. src/utils/constants.ts
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:slug',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_DASHBOARD: '/admin',
};

export const ORDER_STATUS = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};
```

---

### PHASE 1: Types (1 hour - 7 files)

**Prompt for each type file:**
```
Create TypeScript types for [entity] based on the API contract.
Include all fields with correct types.
Export interfaces and enums.
```

#### src/types/auth.types.ts
```typescript
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}
```

#### src/types/product.types.ts
```typescript
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  stockQuantity: number;
  status: ProductStatus;
  featured: boolean;
  category: Category;
  brand: Brand;
  images: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
}

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText?: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
  children?: Category[];
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
}
```

**Continue for:**
- cart.types.ts
- order.types.ts
- payment.types.ts
- review.types.ts
- common.types.ts (ApiResponse, PageResponse)

---

### PHASE 2: API Services (2 hours - 9 files)

#### src/services/api.ts (Base Axios setup)
```typescript
/**
 * Base Axios instance with interceptors for:
 * - Adding JWT token to requests
 * - Handling 401 errors (redirect to login)
 * - Logging requests/responses in dev mode
 */
import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Then for each service, use this prompt:**
```
Create [ServiceName]Service with methods for all API endpoints from API-CONTRACTS.md.
Use the api instance from ./api.ts.
Return typed responses.
Handle errors with try-catch.
```

#### Example: src/services/authService.ts
```typescript
/**
 * AuthService handles authentication API calls:
 * - register(data): Register new user
 * - login(data): Login user
 * - logout(): Logout user
 * - refreshToken(token): Refresh access token
 * - getProfile(): Get current user profile
 */
// Let Copilot generate based on this!
```

**Continue for:**
- productService.ts (getProducts, getProductById, searchProducts, etc.)
- cartService.ts (getCart, addToCart, updateQuantity, removeItem, clearCart)
- orderService.ts (createOrder, getOrders, getOrderById, cancelOrder)
- paymentService.ts (createPayment, confirmPayment)
- reviewService.ts (getReviews, createReview, voteReview)
- shippingService.ts (calculateFee, trackOrder)
- notificationService.ts (getNotifications)

---

### PHASE 3: Redux Store (3 hours - 15 files)

#### src/app/store.ts
```typescript
/**
 * Redux store configuration with:
 * - auth slice
 * - cart slice
 * - products slice
 * - orders slice
 * - user slice
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import cartReducer from '@/features/cart/cartSlice';
import productsReducer from '@/features/products/productsSlice';
import ordersReducer from '@/features/orders/ordersSlice';
import userReducer from '@/features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    orders: ordersReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### src/app/hooks.ts
```typescript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**For each slice, use this prompt:**
```
Create [SliceName]Slice with Redux Toolkit createSlice.
Include state interface, initial state, and async thunks.
Handle loading, success, error states.
```

#### Example: src/features/auth/authSlice.ts
```typescript
/**
 * Auth slice manages authentication state:
 * - user: Current user or null
 * - isAuthenticated: boolean
 * - loading: boolean
 * - error: string | null
 * 
 * Async thunks:
 * - loginUser(credentials)
 * - registerUser(data)
 * - logoutUser()
 * - refreshUserToken()
 * 
 * Reducers:
 * - setUser, clearUser, setError
 */
// Let Copilot generate!
```

**Continue for:**
- cart/cartSlice.ts (cart state, add/remove items)
- products/productsSlice.ts (products list, filters, search)
- orders/ordersSlice.ts (orders list, current order)
- user/userSlice.ts (profile, addresses)

---

### PHASE 4: Common Components (4 hours - 15 files)

**For each component, describe what it does:**

#### src/components/Common/Button.tsx
```typescript
/**
 * Reusable Button component with variants:
 * - primary: Blue background
 * - secondary: Gray background
 * - outline: Border only
 * - danger: Red background
 * 
 * Sizes: sm, md, lg
 * Supports: disabled, loading, full width
 * Props: variant, size, children, onClick, disabled, loading, fullWidth
 */
```

#### src/components/Common/Input.tsx
```typescript
/**
 * Reusable Input component for forms.
 * Supports: text, email, password, number types
 * Shows error message if error prop provided
 * Props: label, type, value, onChange, error, placeholder, required
 */
```

**Continue for:**
- Modal.tsx (Overlay modal with close button)
- Loading.tsx (Spinner with optional text)
- Pagination.tsx (Page numbers with prev/next)
- Rating.tsx (Star rating display)
- Toast.tsx (Notification toast)
- Card.tsx (Container with shadow)
- Badge.tsx (Status badges)
- Dropdown.tsx (Dropdown menu)
- Tabs.tsx (Tab navigation)
- Accordion.tsx (Collapsible sections)
- EmptyState.tsx (No data message)
- ErrorState.tsx (Error message with retry)
- SkeletonLoader.tsx (Loading skeleton)

---

### PHASE 5: Layout Components (2 hours - 5 files)

#### src/components/Layout/Header.tsx
```typescript
/**
 * Header component with:
 * - Logo (link to home)
 * - Search bar
 * - Navigation links (Home, Products, Categories)
 * - User menu (Login/Register or Profile/Logout)
 * - Cart icon with item count badge
 * - Mobile responsive (hamburger menu)
 */
```

#### src/components/Layout/Footer.tsx
```typescript
/**
 * Footer component with:
 * - 4 columns: About, Customer Service, My Account, Follow Us
 * - Links to pages
 * - Social media icons
 * - Copyright text
 */
```

**Continue for:**
- Navbar.tsx (Main navigation)
- Sidebar.tsx (Filter sidebar for products)
- MobileMenu.tsx (Mobile navigation drawer)

---

### PHASE 6: Product Components (3 hours - 8 files)

#### src/components/Product/ProductCard.tsx
```typescript
/**
 * Product card displaying:
 * - Product image with hover effect
 * - Product name
 * - Price (with sale price if available)
 * - Rating stars
 * - "Add to Cart" button on hover
 * - Discount badge if on sale
 * - "Out of Stock" overlay if no stock
 * Props: product, onAddToCart
 */
```

#### src/components/Product/ProductGrid.tsx
```typescript
/**
 * Grid layout for product cards.
 * Responsive: 1 column on mobile, 2 on tablet, 4 on desktop.
 * Shows loading skeleton when loading.
 * Shows empty state if no products.
 * Props: products, loading, onAddToCart
 */
```

**Continue for:**
- ProductFilter.tsx (Filter by category, brand, price)
- ProductSort.tsx (Sort dropdown)
- ProductReviews.tsx (List of reviews with rating)
- ProductGallery.tsx (Image gallery with thumbnails)
- ProductVariants.tsx (Size/color selector)
- QuickView.tsx (Product quick view modal)

---

### PHASE 7: Pages (8 hours - 30 files)

**For each page, describe:**

#### src/pages/Home/HomePage.tsx
```typescript
/**
 * Homepage with:
 * - Hero banner with CTA
 * - Featured products section
 * - Categories grid
 * - New arrivals section
 * - Newsletter signup
 * 
 * Fetches featured products on mount.
 * Uses ProductGrid component.
 */
```

#### src/pages/Products/ProductListPage.tsx
```typescript
/**
 * Product listing page with:
 * - Sidebar with filters (category, brand, price range)
 * - Product grid with pagination
 * - Sort dropdown
 * - Breadcrumbs
 * - Total products count
 * 
 * Fetches products based on filters and page.
 * Updates URL params when filtering.
 */
```

#### src/pages/Products/ProductDetailPage.tsx
```typescript
/**
 * Product detail page with:
 * - Product image gallery
 * - Product name, price, rating
 * - Variant selector (size, color)
 * - Quantity selector
 * - Add to Cart button
 * - Product description tabs (Description, Reviews, Shipping)
 * - Related products section
 * 
 * Fetches product by slug from URL param.
 * Fetches reviews for this product.
 * Handles add to cart with selected variant and quantity.
 */
```

**Continue for all 30 pages** (see PROJECT-STRUCTURE.md for full list)

Key pages prompts:
- CartPage.tsx: Cart items list, summary, checkout button
- CheckoutPage.tsx: Multi-step form (shipping, payment, review)
- OrdersPage.tsx: Order history with filters
- OrderDetailPage.tsx: Order items, status, tracking
- LoginPage.tsx: Login form with validation
- RegisterPage.tsx: Registration form
- ProfilePage.tsx: User info with edit form
- Admin/DashboardPage.tsx: Stats cards, charts

---

### PHASE 8: Cart & Checkout (3 hours - 8 files)

#### src/components/Cart/CartItem.tsx
```typescript
/**
 * Single cart item displaying:
 * - Product image
 * - Product name (link to detail)
 * - Variant info (size, color)
 * - Price per unit
 * - Quantity selector (with +/- buttons)
 * - Total price (price × quantity)
 * - Remove button
 * Props: item, onUpdateQuantity, onRemove
 */
```

#### src/components/Cart/CartSummary.tsx
```typescript
/**
 * Cart summary box with:
 * - Subtotal
 * - Shipping (calculated or "Free")
 * - Tax (calculated)
 * - Total (bold, large)
 * - Checkout button
 * Props: cart, onCheckout
 */
```

**Continue for:**
- MiniCart.tsx (Dropdown cart in header)
- CheckoutSteps.tsx (Step indicator)
- ShippingForm.tsx (Address form)
- PaymentForm.tsx (Stripe card form)
- OrderReview.tsx (Final review before submit)
- OrderSuccess.tsx (Success message with order number)

---

### PHASE 9: Order & Payment (2 hours - 6 files)

#### src/components/Order/OrderCard.tsx
```typescript
/**
 * Order card for order list:
 * - Order number
 * - Order date
 * - Status badge
 * - Product images (first 3)
 * - Total amount
 * - "View Details" button
 * Props: order, onViewDetails
 */
```

#### src/components/Order/OrderStatus.tsx
```typescript
/**
 * Order status badge with colors:
 * - Pending: Yellow
 * - Confirmed: Blue
 * - Processing: Purple
 * - Shipped: Orange
 * - Delivered: Green
 * - Cancelled: Red
 * Props: status
 */
```

**Continue for:**
- OrderTimeline.tsx (Timeline of order statuses)
- TrackingInfo.tsx (Tracking number and status)
- StripeCheckout.tsx (Stripe Elements integration)
- PaymentMethods.tsx (Payment method selector)

---

### PHASE 10: Admin Panel (4 hours - 10 files)

#### src/pages/Admin/DashboardPage.tsx
```typescript
/**
 * Admin dashboard with:
 * - 4 stat cards (Total Sales, Orders, Products, Users)
 * - Recent orders table
 * - Sales chart (last 7 days)
 * - Top products list
 * 
 * Fetches dashboard stats on mount.
 */
```

#### src/components/Admin/DataTable.tsx
```typescript
/**
 * Reusable data table with:
 * - Column headers with sorting
 * - Row actions (view, edit, delete)
 * - Pagination
 * - Search filter
 * - Bulk actions
 * Props: columns, data, onSort, onEdit, onDelete, loading
 */
```

**Continue for:**
- ProductsManagePage.tsx (Product CRUD)
- ProductForm.tsx (Create/Edit product form)
- OrdersManagePage.tsx (All orders with filters)
- UsersManagePage.tsx (User list)
- ReviewsManagePage.tsx (Moderate reviews)
- StatCard.tsx (Dashboard stat card)
- SalesChart.tsx (Chart.js line chart)
- AdminSidebar.tsx (Admin navigation)

---

### PHASE 11: Routes & Auth (1 hour - 3 files)

#### src/routes/AppRoutes.tsx
```typescript
/**
 * All application routes with React Router v6.
 * Public routes: Home, Products, ProductDetail, Login, Register
 * Private routes: Cart, Checkout, Orders, Profile (require auth)
 * Admin routes: Dashboard, Manage* (require admin role)
 */
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/Home/HomePage';
import ProductListPage from '@/pages/Products/ProductListPage';
// ... import all pages
import PrivateRoute from './PrivateRoute';
import AdminRoute from './AdminRoute';

// Let Copilot generate all routes!
```

#### src/routes/PrivateRoute.tsx
```typescript
/**
 * Protected route component.
 * Redirects to /login if user not authenticated.
 * Checks auth state from Redux store.
 */
```

#### src/routes/AdminRoute.tsx
```typescript
/**
 * Admin-only route component.
 * Redirects to /login if not authenticated.
 * Redirects to / if not admin role.
 */
```

---

### PHASE 12: Hooks & Utils (2 hours - 10 files)

#### src/hooks/useAuth.ts
```typescript
/**
 * Custom hook for authentication.
 * Returns: user, isAuthenticated, login, logout, register
 * Uses Redux auth slice.
 */
```

#### src/hooks/useCart.ts
```typescript
/**
 * Custom hook for cart operations.
 * Returns: cart, addToCart, removeFromCart, updateQuantity, clearCart
 * Uses Redux cart slice.
 */
```

**Continue for:**
- useDebounce.ts (Debounce search input)
- useLocalStorage.ts (Persist state to localStorage)
- useToast.ts (Show toast notifications)
- useInfiniteScroll.ts (Infinite scroll for products)
- useMediaQuery.ts (Responsive breakpoints)

#### src/utils/formatters.ts
```typescript
/**
 * Utility functions for formatting:
 * - formatPrice(amount, currency): Format price with currency symbol
 * - formatDate(date): Format date to readable string
 * - formatPhoneNumber(phone): Format phone number
 */
```

**Continue for:**
- validators.ts (Form validation functions)
- helpers.ts (General helper functions)

---

### PHASE 13: Final Setup (1 hour - 3 files)

#### src/main.tsx
```typescript
/**
 * Application entry point.
 * Setup:
 * - Redux Provider with store
 * - React Router BrowserRouter
 * - Toast container
 * - Stripe provider (if using Stripe)
 */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './app/store';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

#### src/App.tsx
```typescript
/**
 * Root App component.
 * Renders:
 * - Header
 * - AppRoutes (all pages)
 * - Footer
 * 
 * Checks authentication on mount.
 * Loads cart from localStorage.
 */
```

---

## ✅ VERIFICATION CHECKLIST

```
Phase 0: Configuration
[ ] tailwind.config.js
[ ] globals.css
[ ] vite.config.ts
[ ] tsconfig.json
[ ] .env
[ ] constants.ts

Phase 1: Types (7 files)
[ ] auth.types.ts
[ ] product.types.ts
[ ] cart.types.ts
[ ] order.types.ts
[ ] payment.types.ts
[ ] review.types.ts
[ ] common.types.ts

Phase 2: API Services (9 files)
[ ] api.ts
[ ] authService.ts
[ ] productService.ts
[ ] cartService.ts
[ ] orderService.ts
[ ] paymentService.ts
[ ] reviewService.ts
[ ] shippingService.ts
[ ] notificationService.ts

Phase 3: Redux (15 files)
[ ] store.ts
[ ] hooks.ts
[ ] authSlice.ts + authAPI.ts
[ ] cartSlice.ts + cartAPI.ts
[ ] productsSlice.ts + productsAPI.ts
[ ] ordersSlice.ts + ordersAPI.ts
[ ] userSlice.ts + userAPI.ts

Phase 4: Common Components (15 files)
[ ] Button, Input, Modal, Loading
[ ] Pagination, Rating, Toast
[ ] Card, Badge, Dropdown, Tabs
[ ] Accordion, EmptyState, ErrorState
[ ] SkeletonLoader

Phase 5: Layout (5 files)
[ ] Header, Footer, Navbar
[ ] Sidebar, MobileMenu

Phase 6: Product Components (8 files)
[ ] ProductCard, ProductGrid
[ ] ProductFilter, ProductSort
[ ] ProductReviews, ProductGallery
[ ] ProductVariants, QuickView

Phase 7: Pages (30 files)
[ ] HomePage
[ ] ProductListPage, ProductDetailPage, SearchResultsPage
[ ] CartPage
[ ] CheckoutPage, ShippingPage, PaymentPage
[ ] OrdersPage, OrderDetailPage, OrderTrackingPage
[ ] LoginPage, RegisterPage, ForgotPasswordPage
[ ] ProfilePage, AddressesPage, SettingsPage
[ ] Admin: Dashboard, Products, Orders, Users

Phase 8: Cart & Checkout (8 files)
[ ] CartItem, CartSummary, MiniCart
[ ] CheckoutSteps, ShippingForm
[ ] PaymentForm, OrderReview, OrderSuccess

Phase 9: Order & Payment (6 files)
[ ] OrderCard, OrderStatus, OrderTimeline
[ ] TrackingInfo, StripeCheckout, PaymentMethods

Phase 10: Admin (10 files)
[ ] DashboardPage, DataTable
[ ] ProductsManagePage, ProductForm
[ ] OrdersManagePage, UsersManagePage
[ ] StatCard, SalesChart, AdminSidebar

Phase 11: Routes (3 files)
[ ] AppRoutes, PrivateRoute, AdminRoute

Phase 12: Hooks & Utils (10 files)
[ ] useAuth, useCart, useDebounce
[ ] useLocalStorage, useToast
[ ] formatters, validators, helpers

Phase 13: Final Setup (3 files)
[ ] main.tsx
[ ] App.tsx
[ ] index.html

Total: ~120 files
```

---

## 🎯 COPILOT TIPS

### 1. Start with JSDoc comments
```typescript
/**
 * Describe what the component/function does
 * List all props/parameters
 * Mention any special behavior
 */
// Then let Copilot generate!
```

### 2. Use descriptive file names
- ✅ ProductCard.tsx (Copilot knows it's a product card)
- ❌ Card.tsx (too generic)

### 3. Import types first
```typescript
import { Product } from '@/types/product.types';
// Copilot will use the type when generating
```

### 4. One component per file
- Easier for Copilot to understand
- Better code organization

### 5. Review generated code
- Check prop types
- Verify API calls
- Test functionality

---

## 🚀 RUNNING THE APP

```bash
# Development
npm run dev

# Build
npm run build

# Preview build
npm run preview
```

---

## 🔗 INTEGRATION WITH BACKEND

1. Start all backend services
2. Start API Gateway (port 8080)
3. Set VITE_API_BASE_URL=http://localhost:8080
4. Run frontend (port 3000)
5. Test full flow!

---

**TOTAL TIME: 30-40 hours**
**TOTAL FILES: ~120 files**
**YOU CAN DO THIS! 🚀**