# Graph Report - /home/thang/Workspace/REACT-FASHION  (2026-05-09)

## Corpus Check
- Corpus is ~40,139 words - fits in a single context window. You may not need a graph.

## Summary
- 192 nodes · 229 edges · 29 communities (12 shown, 17 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `Route Definitions` - 16 edges
2. `React` - 14 edges
3. `src/main.tsx` - 10 edges
4. `Order Types` - 8 edges
5. `Cart` - 8 edges
6. `Button UI Component` - 7 edges
7. `Products` - 7 edges
8. `addToCartThunk` - 6 edges
9. `Button` - 6 edges
10. `Redux Store` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Cart` --uses--> `Cart Service`  [INFERRED]
  /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_W2dHsRSu3TeL2UdQVQkte4CM__vscode-1778320141720/content.txt → /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_Tv5PPAH0uKPiLzjre9iRoRYp__vscode-1778320141721/content.txt
- `Route Definitions` --renders--> `Cart`  [EXTRACTED]
  /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_Tv5PPAH0uKPiLzjre9iRoRYp__vscode-1778320141721/content.txt → /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_W2dHsRSu3TeL2UdQVQkte4CM__vscode-1778320141720/content.txt
- `Orders` --dispatches--> `fetchOrdersThunk`  [EXTRACTED]
  /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_4cTm2Sea6bVQdoRcD9toeefA__vscode-1778320141719/content.txt → /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_W2dHsRSu3TeL2UdQVQkte4CM__vscode-1778320141720/content.txt
- `ProductDetail` --dispatches--> `fetchProductBySlugThunk`  [EXTRACTED]
  /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_4cTm2Sea6bVQdoRcD9toeefA__vscode-1778320141719/content.txt → /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_W2dHsRSu3TeL2UdQVQkte4CM__vscode-1778320141720/content.txt
- `ProductDetail` --dispatches--> `addToCartThunk`  [EXTRACTED]
  /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_4cTm2Sea6bVQdoRcD9toeefA__vscode-1778320141719/content.txt → /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_W2dHsRSu3TeL2UdQVQkte4CM__vscode-1778320141720/content.txt

## Hyperedges (group relationships)
- **UI Components** —  [INFERRED]
- **React Components** —  [INFERRED]
- **Build & Development Configuration** —  [INFERRED]
- **Testing Stack** —  [INFERRED]
- **Authentication Flow** — Login, auth-service, getAccessToken, setAuthTokens, ApiClient, ProtectedRoute [INFERRED]
- **Order Management** — Order, OrderItem, OrderStatus, order-service, Orders, OrderDetail, Checkout [INFERRED]
- **Product Catalog** — Product, Category, Brand, ProductVariant, product-service, ProductDetail, Cart [INFERRED]
- **Payment Processing** — PaymentIntent, PaymentStatus, PaymentMethod, payment-service, Checkout, Order [INFERRED]
- **Utilities Layer** — authStorage.ts, date.ts, helpers.ts, jwt.ts, response.ts, api.ts [INFERRED]
- **auth_flow** — LoginV2_page, SignUpV2_page, LoginFormSection_comp, SignUpFormSection_comp, useAuth_hook, authService [INFERRED]
- **product_browsing_flow** — Home_page, Products_page, ProductDetail_page, fetchProductsThunk, fetchProductBySlugThunk, fetchCategoriesThunk, fetchBrandsThunk [INFERRED]
- **cart_order_flow** — ProductDetail_page, Products_page, Orders_page, addToCartThunk, fetchOrdersThunk, cartService, orderService [INFERRED]
- **user_profile_flow** — Profile_page, Dashboard_page, fetchProfileThunk, updateProfileThunk, authService [INFERRED]
- **Authentication Flow** — authSlice, loginThunk, signUpThunk, logoutThunk, refreshTokenThunk, User, AuthResponse [INFERRED]
- **Cart Management** — cartSlice, fetchCartThunk, addToCartThunk, updateCartItemThunk, removeCartItemThunk, clearCartThunk, Cart, CartItem [INFERRED]
- **Product Catalog** — productsSlice, fetchProductsThunk, fetchFeaturedProductsThunk, fetchProductBySlugThunk, fetchCategoriesThunk, fetchBrandsThunk, productService [INFERRED]
- **Order Management** — ordersSlice, fetchOrdersThunk, fetchOrderByIdThunk, createOrderThunk, cancelOrderThunk [INFERRED]
- **User Profile Management** — userSlice, fetchProfileThunk, updateProfileThunk, fetchAddressesThunk, User, Address [INFERRED]

## Communities (29 total, 17 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.0
Nodes (27): Brand Interface, Feature Development Workflow, Category Interface, CreateOrderRequest Interface, CreateReviewRequest Interface, Order Interface, Order Detail Page, OrderItem Interface (+19 more)

### Community 1 - "Community 1"
Cohesion: 0.0
Nodes (23): Button Test, Button UI Component, Card UI Component, Class Variance Authority, Ecommerce API Gateway, ErrorBoundary Component, ESLint, eslint.config.js (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.0
Nodes (23): AddToCartRequest, Address, Button, Card, Home, Input, ProductDetail, Products (+15 more)

### Community 3 - "Community 3"
Cohesion: 0.0
Nodes (21): Admin Dashboard Page, Checkout Page, Forgot Password Page, Home Page, Layout Component, Login Page, LoginV2 Page, Not Found Page (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.0
Nodes (17): AuthHeader, AuthLayout, AuthSwitchPrompt, BannerSection, Dashboard, FormField, LoginFormSection, LoginV2 (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.0
Nodes (16): src/App.tsx, i18n Configuration, i18next, Layout Component, LoadingSpinner Component, src/main.tsx, postcss.config.js, ProtectedRoute Component (+8 more)

### Community 6 - "Community 6"
Cohesion: 0.0
Nodes (16): AuthResponse, Orders, User, authSlice, cancelOrderThunk, createOrderThunk, fetchOrderByIdThunk, fetchOrdersThunk (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.0
Nodes (12): ApiClient Class, ApiResponse Interface, User Profile Page, API Client, Authentication Service, Auth Storage Utils, Axios Library, clearAuthTokens Function (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.0
Nodes (9): Cart, CartItem, CartStatus, UpdateCartItemRequest, Cart Service, cartSlice, clearCartThunk, removeCartItemThunk (+1 more)

### Community 9 - "Community 9"
Cohesion: 0.0
Nodes (4): Shipment, ShippingFeeRequest, ShippingFeeResponse, shippingService

### Community 10 - "Community 10"
Cohesion: 0.0
Nodes (3): e2e/example.spec.ts, Playwright, playwright.config.ts

### Community 11 - "Community 11"
Cohesion: 0.0
Nodes (3): Date Utilities, Dayjs Library, formatDate Function

## Knowledge Gaps
- **82 isolated node(s):** `src/vite-env.d.ts`, `Table Component`, `Input Form Component`, `Modal Component`, `Card UI Component` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **17 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.