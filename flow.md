# System Flow — Luồng hoạt động chi tiết 3 Service

Tài liệu này mô tả chi tiết từng bước trong vòng đời một đơn hàng, bao gồm service nào gọi service nào, gọi endpoint nào, và dữ liệu truyền đi/nhận về là gì.

---

## Tổng quan kiến trúc

```
Frontend (React/Vue...)
    │
    ▼
Order Service (:8084)
    ├──► Shipping Service (:8088)  [tính phí ship khi tạo đơn]
    └──► Payment Service  (:8085)  [khởi tạo giao dịch & cập nhật COD]
```
---

## Luồng 1: Khách đặt hàng — COD (Thanh toán khi nhận hàng)

```
FE → [POST /api/orders] → Order Service
         │
         ├── 1. Xác thực JWT (Keycloak)
         ├── 2. Tính subtotal từ danh sách items
         │
         ├── 3. → [POST /api/shipping/calculate-fee] → Shipping Service
         │         Body: { city, province, weight, orderValue }
         │         ← Response: { shippingFee: 30000, estimatedDays: 2 }
         │
         ├── 4. Tính total = subtotal + shippingFee + tax(10%)
         ├── 5. Lưu Order vào DB (status=PENDING, paymentStatus=PENDING)
         │
         ├── 6. → [POST /api/payments/create] → Payment Service
         │         Body: { orderId, orderNumber, userId, amount, paymentMethod: "COD" }
         │         ← Response: { paymentNumber, paymentUrl: null, status: "PENDING" }
         │
         ├── 7. Lưu paymentId vào Order
         └── 8. ← Response: OrderResponse (paymentUrl = null)

FE: Hiển thị thông tin đơn hàng, nút "Xác nhận đặt hàng"
```

**Sau khi giao hàng (Admin/Shipper thao tác):**
```
Admin → [PUT /api/shipping/{id}/deliver] → Shipping Service
         ← Response: ShipmentResponse (status=DELIVERED)

Admin → [PUT /api/orders/{orderId}/delivered] → Order Service
         ├── Cập nhật status=DELIVERED, paymentStatus=PAID
         ├── → [PUT /api/payments/order/{orderNumber}/success] → Payment Service
         │     ← Response: PaymentResponse (status=PAID)
         └── ← Response: OrderResponse (status=DELIVERED)
```

---

## Luồng 2: Khách đặt hàng — VNPAY (Thanh toán online)

```
FE → [POST /api/orders] → Order Service
         │
         ├── 1. Xác thực JWT (Keycloak)
         ├── 2. Tính subtotal, gọi Shipping tính phí
         ├── 3. Lưu Order (status=PENDING)
         │
         ├── 4. → [POST /api/payments/create] → Payment Service
         │         Body: { ..., paymentMethod: "VNPAY" }
         │         ← Response: { paymentUrl: "https://sandbox.vnpayment.vn/..." }
         │
         └── 5. ← Response: OrderResponse (paymentUrl ≠ null)

FE: Redirect khách đến paymentUrl (trang thanh toán VNPAY)

Khách hoàn tất thanh toán trên VNPAY
         │
         ▼
VNPAY Redirect → [GET /api/payments/vnpay/callback?vnp_ResponseCode=00&...] → Payment Service
         ├── Xác thực chữ ký VNPAY (hash secret)
         └── Cập nhật Payment status=PAID trong DB

FE (trang return URL) → [PUT /api/orders/{id}/payment-confirmed] → Order Service
         Body: { paymentNumber: "PAY-xxx", transactionId: "VNP-xxx" }
         ├── Kiểm tra paymentNumber khớp với order
         ├── Cập nhật paymentStatus=PAID
         ├── Cập nhật status=CONFIRMED
         └── ← Response: OrderResponse (status=CONFIRMED, paymentStatus=PAID)

FE: Hiển thị trang "Đặt hàng thành công"
```

---

## Luồng 3: Xử lý vận chuyển (Sau khi đơn CONFIRMED)

```
Admin Dashboard → [POST /api/shipping/create] → Shipping Service
         Body: {
           orderId, orderNumber,
           recipientName, phone, address,
           shippingFee: 30000,
           codAmount: 0,         ← 0 vì đã thanh toán VNPAY (hoặc = total nếu COD)
           estimatedDays: 2
         }
         ← Response: CreateShipmentResponse (shipmentId, shipmentNumber, status=PENDING)
```

**Cập nhật trạng thái vận chuyển theo thời gian:**
```
Admin/Shipper → [PUT /api/shipping/{id}/status]
         Body: { "status": "PICKED_UP" }      ← Đã lấy hàng từ kho
         ← ShipmentResponse

Admin/Shipper → [PUT /api/shipping/{id}/status]
         Body: { "status": "IN_TRANSIT" }     ← Đang trên đường vận chuyển
         ← ShipmentResponse

Admin/Shipper → [PUT /api/shipping/{id}/status]
         Body: { "status": "OUT_FOR_DELIVERY" } ← Shipper đang giao đến tay khách
         ← ShipmentResponse
```

**Khi giao thành công:**
```
Shipper → [PUT /api/shipping/{id}/deliver] → Shipping Service
         Body: { deliveredAt: "2026-05-18T14:30:00", signature: "Nguyen Van A" }
         ← ShipmentResponse (status=DELIVERED)

         [Sau đó Admin/Hệ thống gọi:]
Admin → [PUT /api/orders/{id}/delivered] → Order Service
         ├── Cập nhật status=DELIVERED, paymentStatus=PAID
         ├── (Nếu COD) → [PUT /api/payments/order/{orderNumber}/success] → Payment Service
         └── ← OrderResponse (status=DELIVERED)
```

---

## Luồng 4: Huỷ đơn hàng

```
Chỉ huỷ được khi đơn ở trạng thái PENDING hoặc CONFIRMED.

FE → [PUT /api/orders/{id}/status] → Order Service
         Body: { "status": "CANCELLED", "notes": "Khách đổi ý" }
         ├── Validate transition (PENDING→CANCELLED hoặc CONFIRMED→CANCELLED)
         ├── Cập nhật status=CANCELLED
         ├── Khôi phục tồn kho sản phẩm (nếu có tích hợp Product Service)
         └── ← OrderResponse (status=CANCELLED)
```

---

## Luồng 5: Kiểm tra phí ship trước khi đặt hàng (FE tự gọi)

FE có thể hiển thị phí ship ước tính ngay ở trang giỏ hàng/checkout mà không cần đặt đơn:

```
FE → [POST /api/shipping/calculate-fee] → Shipping Service
     Body: {
       "city": "Ho Chi Minh",
       "province": "Ho Chi Minh",
       "weight": 1500,
       "orderValue": 500000
     }
     ← Response: { "shippingFee": 30000, "estimatedDays": 2 }

FE: Hiển thị "Phí vận chuyển: 30.000đ | Dự kiến giao: 2 ngày"
```

---

## Sơ đồ trạng thái đơn hàng

```
                   ┌──────────────────┐
                   │     PENDING      │  ← Mới tạo, chờ thanh toán
                   └──────────────────┘
                    /                 \
                   ▼                   ▼
         ┌──────────────────┐    ┌──────────────┐
         │    CONFIRMED     │    │  CANCELLED   │
         │ (Đã thanh toán)  │    │              │
         └──────────────────┘    └──────────────┘
                   |
                   ▼
         ┌──────────────────┐
         │   PROCESSING     │  ← Đang chuẩn bị hàng
         └──────────────────┘
                   |
                   ▼
         ┌──────────────────┐
         │     SHIPPED      │  ← Đang vận chuyển
         └──────────────────┘
                   |
                   ▼
         ┌──────────────────┐
         │    DELIVERED     │  ← Giao thành công ✓
         └──────────────────┘
```

## Sơ đồ trạng thái vận đơn

```
PENDING → PICKED_UP → IN_TRANSIT → OUT_FOR_DELIVERY → DELIVERED
                                                    ↘ FAILED_DELIVERY
                                    ↘ CANCELLED (bất kỳ bước nào trước giao)
```

---

## Lưu ý tích hợp cho Frontend

| Tình huống | FE cần làm |
|-----------|-----------|
| Sau khi tạo đơn COD | Hiển thị tóm tắt đơn, không cần redirect |
| Sau khi tạo đơn VNPAY | Redirect đến `orderResponse.paymentUrl` |
| VNPAY trả về trang success | Gọi `PUT /api/orders/{id}/payment-confirmed` với params từ URL |
| VNPAY trả về trang fail | Thông báo thất bại, cho phép thử lại |
| Kiểm tra trạng thái đơn | Poll `GET /api/orders/{id}` (hoặc dùng WebSocket nếu có) |
| Hiển thị phí ship ở checkout | Gọi `POST /api/shipping/calculate-fee` |
