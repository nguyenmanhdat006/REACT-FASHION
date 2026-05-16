# API Contract — 3 Services Ecommerce

> **Base URL:** Tất cả đều chạy ở `localhost`. Context-path của Payment Service là `/api`.
> **Auth:** Order Service yêu cầu `Authorization: Bearer <JWT>` (Keycloak). Payment & Shipping hiện không yêu cầu auth.

---

## Enums & Types

### OrderStatus
| Giá trị | Mô tả |
|---------|-------|
| `PENDING` | Đơn vừa tạo, chờ thanh toán |
| `CONFIRMED` | Đã xác nhận thanh toán |
| `PROCESSING` | Đang chuẩn bị hàng |
| `SHIPPED` | Đang vận chuyển |
| `DELIVERED` | Đã giao thành công |
| `CANCELLED` | Đã huỷ |
| `REFUNDED` | Đã hoàn tiền |

**Transition hợp lệ:**
`PENDING` → `CONFIRMED` | `CANCELLED`  
`CONFIRMED` → `PROCESSING` | `CANCELLED`  
`PROCESSING` → `SHIPPED` | `CANCELLED`  
`SHIPPED` → `DELIVERED`  

### PaymentStatus
`PENDING` | `PAID` | `FAILED` | `REFUNDED`

### PaymentMethod (Order Service)
`COD` *(alias của CASH_ON_DELIVERY)* | `VNPAY` | `CREDIT_CARD` | `DEBIT_CARD` | `BANK_TRANSFER` | `MOMO`

### PaymentMethod (Payment Service)
`COD` | `VNPAY`

### ShipmentStatus
| Giá trị | Mô tả |
|---------|-------|
| `PENDING` | Chờ lấy hàng |
| `PICKED_UP` | Đã lấy hàng |
| `IN_TRANSIT` | Đang vận chuyển |
| `OUT_FOR_DELIVERY` | Đang giao (shipper đang đi) |
| `DELIVERED` | Đã giao thành công |
| `FAILED_DELIVERY` | Giao không thành công |
| `CANCELLED` | Đã huỷ |

---

## 1. Order Service — Port `8084`

> **Auth Header bắt buộc:** `Authorization: Bearer <Keycloak JWT>`

### POST `/api/orders` — Tạo đơn hàng mới

**Request Body:**
```json
{
  "items": [
    {
      "productId": "PROD-001",        // string, required
      "productName": "Điện thoại iPhone 15", // string, required
      "quantity": 1,                   // integer >= 1, required
      "price": 25000000               // decimal >= 0, required (VND)
    }
  ],
  "paymentMethod": "COD",             // string, required — "COD" hoặc "VNPAY"
  "shippingAddress": {
    "recipientName": "Nguyen Van A",  // string, required
    "phone": "0901234567",            // string, required
    "address": "123 Le Loi, Q1",      // string, required
    "city": "Ho Chi Minh",            // string, required
    "province": "Ho Chi Minh",        // string, required
    "zipCode": "700000"               // string, required
  },
  "note": "Giao sau 5h chiều"         // string, optional
}
```

**Response `201 Created`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",  // UUID
  "orderNumber": "ORD-20260516-0001",
  "status": "PENDING",
  "paymentStatus": "PENDING",
  "paymentMethod": "CASH_ON_DELIVERY",
  "paymentUrl": "https://sandbox.vnpayment.vn/...",  // null nếu COD
  "shipmentId": null,
  "items": [
    {
      "id": "uuid",
      "productId": "PROD-001",
      "productName": "Điện thoại iPhone 15",
      "quantity": 1,
      "price": 25000000,
      "subtotal": 25000000
    }
  ],
  "subtotal": 25000000,
  "discount": 0,
  "shipping": 30000,     // phí ship tính từ Shipping Service
  "tax": 2500000,        // 10% của subtotal
  "total": 27530000,
  "shippingAddress": {
    "recipientName": "Nguyen Van A",
    "phone": "0901234567",
    "address": "123 Le Loi, Q1",
    "city": "Ho Chi Minh",
    "province": "Ho Chi Minh",
    "zipCode": "700000"
  },
  "createdAt": "2026-05-16T09:00:00"
}
```

**Lưu ý:** Khi tạo đơn, Order Service tự động:
1. Gọi Shipping Service để tính phí ship.
2. Gọi Payment Service để khởi tạo giao dịch — trả về `paymentUrl` nếu là VNPAY.

---

### GET `/api/orders/{id}` — Lấy chi tiết đơn hàng

**Path param:** `id` — UUID của đơn hàng

**Response `200 OK`:** cùng cấu trúc `OrderResponse` như trên.

**Lưu ý:** User chỉ xem được đơn của chính mình (xác thực qua JWT).

---

### PUT `/api/orders/{id}/confirm` — Xác nhận đơn hàng thủ công

**Path param:** `id` — UUID của đơn hàng  
**Request Body:** không có  
**Response `200 OK`:** `OrderResponse` với `status: "CONFIRMED"`

---

### PUT `/api/orders/{id}/payment-confirmed` — Callback xác nhận thanh toán

Dùng sau khi khách hoàn tất thanh toán (VNPAY redirect về FE, FE gọi lại endpoint này).

**Path param:** `id` — UUID của đơn hàng

**Request Body:**
```json
{
  "paymentNumber": "PAY-20260516-001",  // string, optional — mã giao dịch Payment Service
  "transactionId": "VNP-123456789"      // string, optional — mã giao dịch từ cổng thanh toán
}
```

**Response `200 OK`:** `OrderResponse` với `status: "CONFIRMED"`, `paymentStatus: "PAID"`

---

### PUT `/api/orders/{id}/delivered` — Xác nhận giao hàng thành công

**Path param:** `id` — UUID của đơn hàng  
**Request Body:** không có  
**Response `200 OK`:** `OrderResponse` với `status: "DELIVERED"`, `paymentStatus: "PAID"`

**Lưu ý:** Endpoint này tự động gọi Payment Service để mark payment success (dùng cho COD).

---

## 2. Payment Service — Port `8085`

> **Context-path:** `/api` — Tất cả endpoint đều bắt đầu bằng `/api/payments`

### POST `/api/payments/create` — Tạo giao dịch thanh toán

**Request Body:**
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",  // string (UUID), required
  "orderNumber": "ORD-20260516-0001",                  // string, required
  "userId": "user-keycloak-uuid",                      // string, required
  "amount": 27530000,                                  // decimal >= 1000 (VND), required
  "paymentMethod": "VNPAY",                            // "COD" | "VNPAY", required
  "description": "Thanh toán đơn hàng ORD-20260516-0001" // string, optional
}
```

**Response `200 OK`:**
```json
{
  "id": 1,
  "paymentNumber": "PAY-20260516-0001",
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "orderNumber": "ORD-20260516-0001",
  "amount": 27530000,
  "currency": "VND",
  "paymentMethod": "VNPAY",
  "status": "PENDING",
  "paymentUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?...", // null nếu COD
  "createdAt": "2026-05-16T09:00:00"
}
```

---

### GET `/api/payments/{id}` — Lấy chi tiết giao dịch theo ID

**Path param:** `id` — Long (numeric ID)  
**Response `200 OK`:** `PaymentResponse` như trên.

---

### GET `/api/payments/order/{orderId}` — Lấy giao dịch theo mã đơn hàng

**Path param:** `orderId` — `orderNumber` string (ví dụ: `ORD-20260516-0001`)  
**Response `200 OK`:** `PaymentResponse`

---

### PUT `/api/payments/order/{orderNumber}/success` — Đánh dấu thanh toán thành công

Dùng nội bộ (Order Service gọi sau khi giao hàng COD thành công).

**Path param:** `orderNumber` — mã đơn hàng  
**Request Body:** không có  
**Response `200 OK`:** `PaymentResponse` với `status: "PAID"`

---

### GET `/api/payments/vnpay/callback` — VNPay Return URL (Callback)

Đây là URL mà VNPay redirect về sau khi thanh toán. **FE không cần gọi trực tiếp endpoint này.**  
VNPay sẽ redirect về URL: `http://localhost:8085/api/payments/vnpay/callback?vnp_ResponseCode=00&...`

---

## 3. Shipping Service — Port `8088`

### POST `/api/shipping/calculate-fee` — Tính phí vận chuyển

Dùng để ước tính phí ship trước khi đặt hàng.

**Request Body:**
```json
{
  "city": "Ho Chi Minh",    // string, required
  "province": "Ho Chi Minh", // string, required
  "weight": 1500,            // integer (gram) >= 1, required
  "orderValue": 500000       // decimal >= 0 (VND), required
}
```

**Response `200 OK`:**
```json
{
  "shippingFee": 30000,    // decimal (VND)
  "estimatedDays": 2       // integer (số ngày dự kiến)
}
```

---

### POST `/api/shipping/create` — Tạo vận đơn

Gọi sau khi đơn hàng đã được `CONFIRMED` và Admin chuẩn bị xử lý.

**Request Body:**
```json
{
  "orderId": "550e8400-e29b-41d4-a716-446655440000",  // string (UUID), required
  "orderNumber": "ORD-20260516-0001",                  // string, required
  "recipientName": "Nguyen Van A",                     // string, required
  "phone": "0901234567",                               // string, required — format VN: 0xx hoặc +84xx
  "address": "123 Le Loi, Q1, HCM",                   // string, required
  "shippingFee": 30000,                                // decimal >= 0, required
  "codAmount": 27530000,                               // decimal >= 0, required (0 nếu đã thanh toán online)
  "estimatedDays": 2,                                  // integer >= 1, required
  "note": "Gọi trước khi giao"                        // string, optional
}
```

**Response `200 OK`:**
```json
{
  "shipmentId": 1,
  "shipmentNumber": "SHIP-20260516-0001",
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "orderNumber": "ORD-20260516-0001",
  "status": "PENDING",
  "shippingFee": 30000,
  "codAmount": 27530000,
  "estimatedDelivery": "2026-05-18T09:00:00",
  "createdAt": "2026-05-16T09:00:00"
}
```

---

### GET `/api/shipping/{id}` — Lấy thông tin vận đơn

**Path param:** `id` — Long (numeric ID)

**Response `200 OK`:**
```json
{
  "id": 1,
  "orderId": "550e8400-e29b-41d4-a716-446655440000",
  "orderNumber": "ORD-20260516-0001",
  "status": "IN_TRANSIT",
  "shippingFee": 30000,
  "codAmount": 27530000,
  "recipientName": "Nguyen Van A",
  "recipientPhone": "0901234567",
  "address": "123 Le Loi, Q1, HCM",
  "estimatedDelivery": "2026-05-18T09:00:00",
  "createdAt": "2026-05-16T09:00:00",
  "updatedAt": "2026-05-16T12:00:00"
}
```

---

### PUT `/api/shipping/{id}/status` — Cập nhật trạng thái vận đơn

**Path param:** `id` — Long

**Request Body:**
```json
{
  "status": "IN_TRANSIT"   // ShipmentStatus enum — xem bảng Enums ở trên
}
```

**Response `200 OK`:** `ShipmentResponse` đã cập nhật.

---

### PUT `/api/shipping/{id}/deliver` — Xác nhận giao hàng thành công

**Path param:** `id` — Long

**Request Body:**
```json
{
  "deliveredAt": "2026-05-18T14:30:00",  // LocalDateTime, optional (null = now)
  "signature": "Nguyen Van A"             // string, optional — chữ ký người nhận
}
```

**Response `200 OK`:** `ShipmentResponse` với `status: "DELIVERED"`

---

## Error Response Format

Tất cả các service trả về lỗi theo cấu trúc:

```json
{
  "timestamp": "2026-05-16T09:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Mô tả lỗi cụ thể",
  "path": "/api/orders"
}
```

| HTTP Status | Ý nghĩa |
|-------------|---------|
| `400` | Request sai (validation failed, logic error) |
| `401` | Chưa xác thực (thiếu/sai JWT) |
| `403` | Không có quyền truy cập |
| `404` | Không tìm thấy resource |
| `500` | Lỗi server nội bộ |
