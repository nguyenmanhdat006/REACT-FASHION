# COMPLETE API CONTRACTS - ALL SERVICES

**Base URL:** `http://localhost:8080` (API Gateway)  
**Authentication:** JWT Bearer Token

---

## 🔐 AUTHENTICATION

### Headers for Protected Routes
```typescript
{
  "Authorization": "Bearer <accessToken>"
}
```

---

## 1️⃣ AUTH SERVICE (User Service - Port 8081)

### POST /api/auth/register
Register new user

**Request:**
```typescript
{
  email: string;          // Required, valid email
  password: string;       // Required, min 8 chars
  fullName: string;       // Required
  phone: string;          // Optional
}
```

**Response:**
```typescript
{
  success: true,
  message: "Registration successful",
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: {
      id: string;
      email: string;
      fullName: string;
      roles: string[];
    }
  }
}
```

### POST /api/auth/login
Login user

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:** Same as register

### POST /api/auth/refresh
Refresh access token

**Request:**
```typescript
{
  refreshToken: string;
}
```

### POST /api/auth/logout
Logout user

---

## 2️⃣ USER SERVICE (Port 8081)

### GET /api/users/profile
Get current user profile

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    avatar: string;
    roles: string[];
    createdAt: string;
  }
}
```

### PUT /api/users/profile
Update profile

**Request:**
```typescript
{
  fullName?: string;
  phone?: string;
  avatar?: string;
}
```

### GET /api/addresses
Get user addresses

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string;
      fullName: string;
      phone: string;
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
      isDefault: boolean;
    }
  ]
}
```

### POST /api/addresses
Add address

### PUT /api/addresses/{id}
Update address

### DELETE /api/addresses/{id}
Delete address

---

## 3️⃣ PRODUCT SERVICE (Port 8082)

### GET /api/products
Get all products (paginated)

**Query Params:**
```typescript
{
  page?: number;          // Default: 0
  size?: number;          // Default: 20
  sortBy?: string;        // name, price, createdAt
  sortDirection?: string; // asc, desc
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  published?: boolean;
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    content: [
      {
        id: string;
        name: string;
        slug: string;
        description: string;
        shortDescription: string;
        price: number;
        salePrice?: number;
        stockQuantity: number;
        status: "DRAFT" | "PUBLISHED" | "ARCHIVED" | "OUT_OF_STOCK";
        featured: boolean;
        category: {
          id: string;
          name: string;
          slug: string;
        };
        brand: {
          id: string;
          name: string;
          slug: string;
        };
        images: [
          {
            id: string;
            imageUrl: string;
            altText: string;
            isPrimary: boolean;
            displayOrder: number;
          }
        ];
        variants: [
          {
            id: string;
            sku: string;
            size?: string;
            color?: string;
            priceAdjustment: number;
            stockQuantity: number;
          }
        ];
        createdAt: string;
        updatedAt: string;
      }
    ],
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    isLast: boolean;
  }
}
```

### GET /api/products/{id}
Get product by ID

### GET /api/products/slug/{slug}
Get product by slug

### GET /api/products/featured
Get featured products

### GET /api/products/search
Search products

**Query Params:**
```typescript
{
  keyword: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  size?: number;
}
```

### GET /api/categories
Get all categories

**Response:**
```typescript
{
  success: true,
  data: [
    {
      id: string;
      name: string;
      slug: string;
      description: string;
      imageUrl: string;
      parentId?: string;
      children: Category[];
      productCount: number;
      active: boolean;
    }
  ]
}
```

### GET /api/categories/tree
Get category tree (hierarchical)

### GET /api/brands
Get all brands

---

## 4️⃣ CART SERVICE (Port 8083)

### GET /api/cart
Get current user's cart

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userId: string;
    status: "ACTIVE" | "ABANDONED" | "CONVERTED_TO_ORDER";
    items: [
      {
        id: string;
        productId: string;
        productVariantId?: string;
        productName: string;
        productImageUrl: string;
        quantity: number;
        price: number;
        total: number;
        inStock: boolean;
        createdAt: string;
      }
    ];
    totalItems: number;
    subtotal: number;
    discount: number;
    total: number;
    createdAt: string;
    updatedAt: string;
  }
}
```

### POST /api/cart/items
Add item to cart

**Request:**
```typescript
{
  productId: string;
  quantity: number;       // 1-100
  productVariantId?: string;
}
```

### PUT /api/cart/items/{itemId}
Update quantity

**Request:**
```typescript
{
  quantity: number;       // 0 to remove
}
```

### DELETE /api/cart/items/{itemId}
Remove item

### DELETE /api/cart
Clear cart

### GET /api/cart/summary
Get cart summary

---

## 5️⃣ ORDER SERVICE (Port 8084)

### POST /api/orders
Create order from cart

**Request:**
```typescript
{
  paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "PAYPAL" | "CASH_ON_DELIVERY" | "VNPAY";
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: Address;  // Optional, use shipping if null
  notes?: string;
}
```

**Response:**
```typescript
{
  success: true,
  message: "Order created successfully",
  data: {
    id: string;
    orderNumber: string;        // ORD-20240221-0001
    userId: string;
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
    paymentMethod: string;
    items: [
      {
        id: string;
        productId: string;
        productName: string;
        productImageUrl: string;
        quantity: number;
        price: number;
        subtotal: number;
      }
    ];
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
    shippingAddress: Address;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderedAt: string;
    createdAt: string;
  }
}
```

### GET /api/orders
Get my orders (paginated)

**Query:** `?page=0&size=20`

### GET /api/orders/{id}
Get order details

### GET /api/orders/number/{orderNumber}
Get order by number

### POST /api/orders/{id}/cancel
Cancel order

**Request:**
```typescript
{
  reason: string;
}
```

---

## 6️⃣ PAYMENT SERVICE (Port 8085)

### POST /api/payments
Create payment intent

**Request:**
```typescript
{
  orderId: string;
  amount: number;
  currency: string;       // "USD", "VND"
  paymentMethod: "CREDIT_CARD" | "VNPAY" | "PAYPAL";
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    paymentId: string;
    clientSecret: string;   // For Stripe.js
    amount: number;
    status: "PENDING";
  }
}
```

### POST /api/payments/{id}/confirm
Confirm payment

**Request:**
```typescript
{
  paymentIntentId: string;
}
```

### GET /api/payments/{id}
Get payment details

### GET /api/payments/order/{orderId}
Get payment by order

---

## 7️⃣ REVIEW SERVICE (Port 8086)

### POST /api/reviews
Create review

**Request:**
```typescript
{
  productId: string;
  orderId: string;
  rating: number;         // 1-5
  title: string;
  comment: string;
  images?: string[];
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    userName: string;
    rating: number;
    title: string;
    comment: string;
    verified: boolean;    // Purchased
    helpfulCount: number;
    createdAt: string;
  }
}
```

### GET /api/reviews/product/{productId}
Get product reviews

**Query:** `?page=0&size=20&sort=helpful|newest|rating`

**Response:**
```typescript
{
  success: true,
  data: {
    content: Review[];
    averageRating: number;
    totalReviews: number;
    page: number;
    size: number;
    totalElements: number;
  }
}
```

### GET /api/reviews/product/{productId}/summary
Get rating summary

**Response:**
```typescript
{
  success: true,
  data: {
    averageRating: number;
    totalReviews: number;
    distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    }
  }
}
```

### POST /api/reviews/{id}/vote
Vote review

**Request:**
```typescript
{
  helpful: boolean;       // true=helpful, false=unhelpful
}
```

### GET /api/reviews/user/me
Get my reviews

---

## 8️⃣ NOTIFICATION SERVICE (Port 8087)

### GET /api/notifications/user/me
Get my notifications

**Query:** `?page=0&size=20`

**Response:**
```typescript
{
  success: true,
  data: {
    content: [
      {
        id: string;
        type: "ORDER_CONFIRMED" | "ORDER_SHIPPED" | "ORDER_DELIVERED";
        subject: string;
        status: "SENT" | "FAILED";
        sentAt: string;
        createdAt: string;
      }
    ]
  }
}
```

### PUT /api/notifications/{id}/mark-read
Mark as read

---

## 9️⃣ SHIPPING SERVICE (Port 8088)

### POST /api/shipping/calculate-fee
Calculate shipping cost

**Request:**
```typescript
{
  fromAddress: {
    province: string;
    district: string;
  };
  toAddress: {
    province: string;
    district: string;
  };
  weight: number;         // grams
  provider: "GHN" | "GHTK";
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    fee: number;
    estimatedDays: number;
  }
}
```

### GET /api/shipping/order/{orderId}
Get shipment by order

**Response:**
```typescript
{
  success: true,
  data: {
    id: string;
    trackingNumber: string;
    provider: "GHN" | "GHTK";
    status: "PENDING" | "PICKED_UP" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED";
    currentLocation: string;
    estimatedDelivery: string;
  }
}
```

### GET /api/shipping/track/{trackingNumber}
Track shipment

**Response:**
```typescript
{
  success: true,
  data: {
    trackingNumber: string;
    status: string;
    currentLocation: string;
    history: [
      {
        status: string;
        location: string;
        timestamp: string;
      }
    ]
  }
}
```

---

## 🔟 ADMIN APIs (All Services)

### Products (Admin)
- POST /api/products
- PUT /api/products/{id}
- DELETE /api/products/{id}
- POST /api/products/{id}/images

### Categories (Admin)
- POST /api/categories
- PUT /api/categories/{id}
- DELETE /api/categories/{id}

### Brands (Admin)
- POST /api/brands
- PUT /api/brands/{id}
- DELETE /api/brands/{id}

### Orders (Admin)
- GET /api/orders/search
- PUT /api/orders/{id}/status
- GET /api/orders/summary

### Reviews (Admin)
- PUT /api/reviews/{id}/moderate

### Users (Admin)
- GET /api/users
- PUT /api/users/{id}/roles

---

## 📝 COMMON RESPONSE FORMAT

**Success Response:**
```typescript
{
  success: true,
  message?: string,
  data: T,
  timestamp: string
}
```

**Error Response:**
```typescript
{
  success: false,
  message: string,
  data?: any,
  timestamp: string
}
```

**Validation Error:**
```typescript
{
  success: false,
  message: "Validation failed",
  data: {
    field1: "Error message",
    field2: "Error message"
  }
}
```

---

## 🔐 ERROR CODES

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 💡 AXIOS SETUP EXAMPLE

```typescript
// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

**All APIs documented! Ready for frontend implementation.** 🚀