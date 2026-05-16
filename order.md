# API CONTRACT - ORDER SERVICE

**Backend URL:** `http://localhost:8084`

---

## Summary

Order Service now uses synchronous REST calls between services . Key flows:
- Create order → Order Service saves order, creates payment record via Payment Service
- Order Service calls Shipping Service to create shipment (COD orders synchronously)
- Shipping Service calls back Order Service when shipment is created
- When delivery completes, Shipping Service (or operator) calls Order Service delivery endpoint which updates payment via Payment Service

---

## 🛍️ ORDER APIs

### POST /api/orders
Create order from cart.

Notes:
- Response includes `paymentUrl` when the payment provider returns a redirect URL (e.g., VNPAY).
- For `CASH_ON_DELIVERY` orders the Order Service will create the shipment synchronously and set the order to `CONFIRMED`.

**Request:**
```typescript
{
  paymentMethod: "CASH_ON_DELIVERY" | "VNPAY";
  shippingAddress: {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    wardCode?: string;
    districtId?: number;
    zipCode?: string;
    country?: string;
  };
  billingAddress?: Address;  // Optional, use shipping if null
  notes?: string;
}
```

**Response:** `OrderResponse` (201 CREATED)

### GET /api/orders
Get authenticated user's orders (paginated)

**Query:** `?page=0&size=20`

### GET /api/orders/{id}
Get order details (user can only access their own orders)

### GET /api/orders/number/{orderNumber}
Get order by order number

### PUT /api/orders/{id}/status
Update order status (Admin only)

**Request:**
```typescript
{
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  notes?: string;
}
```

### POST /api/orders/{id}/cancel
Cancel order

**Request:**
```typescript
{
  reason: string;
}
```

### POST /api/orders/{id}/payment-confirmed
Payment Service calls this endpoint to notify Order Service that a payment succeeded.

**Request (example):**
```json
{
  "paymentId": "PAY-20260515-1234",
  "status": "SUCCESS"
}
```

### POST /api/orders/{id}/shipment-confirmed
Shipping Service calls this endpoint after creating a shipment (replaces previous Kafka event `order.shipped`).

**Query parameters:** `?shipmentId=...&trackingNumber=...`

**Effect:** Order Service saves `shipmentId` and `trackingNumber` on the order.

### POST /api/orders/{id}/delivery-completed
Called when delivery is completed (by Shipping Service or an operator). Marks order as `DELIVERED` and triggers payment update for COD.

**Effect:**
- Sets order `status = DELIVERED` and `deliveredAt` timestamp
- If `paymentMethod == CASH_ON_DELIVERY`, Order Service will call Payment Service to update payment status to `SUCCESS` (via `PUT /api/payments/order/{orderId}/status?status=SUCCESS`).

### GET /api/orders/search
Search orders (Admin only)

**Query:**
```
?keyword=...
&status=PENDING
&startDate=2024-01-01
&endDate=2024-12-31
&page=0&size=20
```

### GET /api/orders/summary
Get order statistics (Admin only)

---

## 📝 TYPESCRIPT TYPES (sample)

```typescript
interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  paymentUrl?: string; // redirect URL for VNPAY / payment provider
  shipmentId?: string;
  trackingNumber?: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string;
  orderedAt: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

type PaymentMethod =
  | "CASH_ON_DELIVERY"
  | "VNPAY";
```

---

## Migration note

- The application was migrated from a Kafka-based event flow to REST-based callbacks between services. Old Kafka producers/listeners are commented out in the codebase to keep history, but runtime behavior uses the REST endpoints documented above.

---

If bạn muốn, tôi có thể thêm ví dụ request/response cụ thể cho `shipment-confirmed` và `delivery-completed` hoặc tạo Postman collection tương ứng.