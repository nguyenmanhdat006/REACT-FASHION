# Graph Report - REACT-FASHION  (2026-05-10)

## Corpus Check
- 117 files · ~40,661 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 803 nodes · 1418 edges · 71 communities (51 shown, 20 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4915787d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

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
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]

## God Nodes (most connected - your core abstractions)
1. `React` - 57 edges
2. `Button()` - 19 edges
3. `ECOMMERCE FRONTEND - COMPLETE PACKAGE` - 17 edges
4. `Route Definitions` - 16 edges
5. `Card()` - 14 edges
6. `useAuth()` - 14 edges
7. `ROUTES` - 13 edges
8. `ApiResponse` - 12 edges
9. `API_ENDPOINTS` - 11 edges
10. `handleMockApiRequest()` - 11 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.tsx → src/hooks/theme/useTheme.ts
- `Cart` --uses--> `Cart Service`  [INFERRED]
  /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_W2dHsRSu3TeL2UdQVQkte4CM__vscode-1778320141720/content.txt → /home/thang/.config/Code/User/workspaceStorage/02f751c77592664cdf86ec6a8ec33960/GitHub.copilot-chat/chat-session-resources/ad91ed13-c21b-4b17-b444-b535eee14c8c/call_Tv5PPAH0uKPiLzjre9iRoRYp__vscode-1778320141721/content.txt
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/navigation/ProtectedRoute.tsx → src/hooks/auth/useAuth.ts
- `Login()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/auth/Login.tsx → src/hooks/auth/useAuth.ts
- `SignUp()` --calls--> `useAuth()`  [EXTRACTED]
  src/pages/auth/SignUp.tsx → src/hooks/auth/useAuth.ts

## Communities (71 total, 20 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (65): AddToCartRequest, Address, AuthHeader, AuthLayout, AuthResponse, AuthSwitchPrompt, BannerSection, Button (+57 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (40): Address, AuthResponse, ForgotPasswordData, LoginCredentials, ResetPasswordData, SignUpCredentials, User, MOCK_LOGIN_CREDENTIALS (+32 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (40): AdminTab, BrandFormState, CategoryFormState, DEFAULT_BRAND_FORM, DEFAULT_CATEGORY_FORM, DEFAULT_PRODUCT_FORM, ProductFormState, Brand (+32 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (33): JwtProfilePayload, JwtRolePayload, KeycloakAuthSession, KeycloakErrorResponse, KeycloakJwtPayload, KeycloakLoginCredentials, KeycloakLoginExchangeRequest, KeycloakRegisterCredentials (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (35): 10. i18n (`src/constants/locales/en.json` và `vi.json`), 1. **Type Safety**, 1. Types (`src/types/user.ts`), 2. Constants (`src/constants/index.ts`), 2. **Error Handling**, 3. **Code Organization**, 3. Service (`src/services/userService.ts`), 4. **Performance** (+27 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (30): src/App.tsx, Button UI Component, Class Variance Authority, ErrorBoundary Component, i18n Configuration, i18next, Layout Component, LoadingSpinner Component (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (33): 1. **PROJECT-STRUCTURE.md** (Complete project structure), 2. **API-CONTRACTS.md** (All API documentation), 3. **GITHUB-COPILOT-COMPLETE-GUIDE.md** ⭐ (MOST IMPORTANT!), 🔗 API INTEGRATION, Code Organization:, code:bash (# 1. Create project), code:block2 (Frontend:), code:block3 (src/) (+25 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (21): AddToCartRequest, Cart, CartItem, CartStatus, CartSummary, UpdateCartItemRequest, MOCK_ADD_TO_CART_REQUEST, MOCK_CART_DATA (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.11
Nodes (25): MOCK_AUTH_RESPONSE, MOCK_AUTH_USER, MOCK_USER_ADDRESSES, asRecord(), clone(), createOrderFromCart(), delay(), findProductById() (+17 more)

### Community 9 - "Community 9"
Cohesion: 0.14
Nodes (17): FormField(), FormFieldProps, TermsAgreementProps, FormField Component, Input UI Component, Label UI Component, cn(), Lucide React (+9 more)

### Community 10 - "Community 10"
Cohesion: 0.1
Nodes (16): Button Test, Card UI Component, AuthHeaderProps, AuthLayoutProps, slides, ESLint, eslint.config.js, Input Form Component (+8 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (4): MOCK_ORDERS, PaymentMethod, Card(), CardProps

### Community 12 - "Community 12"
Cohesion: 0.14
Nodes (18): PaginationParams, CreateOrderRequest, Order, OrderItem, OrderPage, OrderStatus, PaymentStatus, MOCK_CREATE_ORDER_REQUEST (+10 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (24): BƯỚC 10: Thêm i18n Translations (Optional), BƯỚC 1: Định nghĩa Types (TypeScript Interfaces), BƯỚC 2: Thêm API Endpoints vào Constants, BƯỚC 3: Tạo Service Layer (API Calls), BƯỚC 4: Tạo Redux Thunks (Async Actions), BƯỚC 5: Tạo Redux Slice (State Management), BƯỚC 6: Tạo Custom Hook (Optional), BƯỚC 7: Tạo Components (Reusable UI) (+16 more)

### Community 14 - "Community 14"
Cohesion: 0.13
Nodes (16): Login(), LoginFormData, loginSchema, SignUp(), SignUpFormData, signUpSchema, useAuth(), ROUTES (+8 more)

### Community 15 - "Community 15"
Cohesion: 0.12
Nodes (15): AdminDashboard, Cart, Checkout, ForgotPassword, Home, Login, LoginV2, NotFound (+7 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (4): Column, TableProps, ModalProps, cn()

### Community 17 - "Community 17"
Cohesion: 0.18
Nodes (5): AuthSwitchPromptProps, AUTH_STORAGE_KEYS, KEYCLOAK_AUTH_ENDPOINTS, ROUTESV2, USER_ROLES

### Community 18 - "Community 18"
Cohesion: 0.29
Nodes (9): CreateReviewRequest, Review, ReviewPage, ReviewSummary, MOCK_CREATE_REVIEW_REQUEST, MOCK_REVIEW_PAGE, MOCK_REVIEW_SUMMARY, MOCK_REVIEWS (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.26
Nodes (9): API_ENDPOINTS, ConfirmPaymentRequest, CreatePaymentRequest, PaymentIntent, MOCK_CONFIRM_PAYMENT_REQUEST, MOCK_CONFIRMED_PAYMENT_INTENT, MOCK_CREATE_PAYMENT_REQUEST, MOCK_PAYMENT_INTENT (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (11): Body Text - 16px, Caption Extra Small - 9px, Caption Large - 13px, Caption Small - 11px, code:jsx (<span className="text-caption-xs-regular text-gray-400">), code:jsx (// Mặc định đã áp dụng cho toàn bộ app), code:jsx (<p className="text-body-regular text-gray-600">), code:jsx (<span className="text-caption-lg-regular text-gray-500">) (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.2
Nodes (11): Admin Dashboard Page, Forgot Password Page, Home Page, Login Page, LoginV2 Page, Not Found Page, Orders Page, Protected Route Component (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.2
Nodes (10): Accent Colors (Màu Nhấn), code:jsx (// Background màu xám đậm với text trắng), code:jsx (// Button primary), code:jsx (// Badge hoặc tag), code:jsx (// Warning hoặc notification), Gray Scale, 🎨 Màu Sắc (Colors), Primary Colors (Màu Chính) (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.28
Nodes (3): MOCK_PRODUCTS, Button(), buttonVariants

### Community 24 - "Community 24"
Cohesion: 0.31
Nodes (7): MOCK_SHIPMENT, MOCK_SHIPPING_FEE_REQUEST, MOCK_SHIPPING_FEE_RESPONSE, Shipment, ShippingFeeRequest, ShippingFeeResponse, shippingService

### Community 25 - "Community 25"
Cohesion: 0.22
Nodes (9): Order Interface, Order Detail Page, Product Interface, Product Detail Page, Review Interface, API Contracts, Order Service, Product Service (+1 more)

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (9): Feature Development Workflow, CreateOrderRequest Interface, OrderItem Interface, OrderStatus Enum, PaymentMethod Enum, PaymentStatus Enum, Project Overview, Order Types (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.25
Nodes (3): Date Utilities, Dayjs Library, formatDate Function

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (8): 1. Sử dụng màu nhất quán, 2. Sử dụng typography scale, 3. Hierarchy màu sắc, 4. Text colors, 📋 Best Practices, code:jsx (// ✅ Tốt - Sử dụng các màu đã định nghĩa), code:jsx (// ✅ Tốt - Sử dụng các class text đã định nghĩa), code:jsx (// Hierarchy của text)

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (8): code:jsx (<h1 className="text-h1-bold text-gray-900">), H1 - 48px, H2 - 40px, H3 - 33px, H4 - 28px, H5 - 23px, H6 - 19px, Heading Styles (H1 - H6)

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 32 - "Community 32"
Cohesion: 0.38
Nodes (5): PageResponse, MOCK_NOTIFICATION_PAGE, MOCK_NOTIFICATIONS, NotificationItem, notificationService

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (6): code:jsx (// Element thay đổi màu theo dark mode), code:jsx (<h1 className="text-h4-bold md:text-h3-bold lg:text-h2-bold"), 🎯 Dark Mode, Hướng Dẫn Sử Dụng Design System - Tailwind CSS, 📚 Resources, 🔧 Responsive Design

### Community 34 - "Community 34"
Cohesion: 0.29
Nodes (7): Alert Component, Card Component, code:jsx (<div className="bg-white dark:bg-gray-800 shadow-md rounded-), code:jsx (<div className="space-y-2">), code:jsx (<div className="bg-accent-700 border-l-4 border-accent-900 p), 📦 Component Examples, Form Input

### Community 35 - "Community 35"
Cohesion: 0.29
Nodes (7): Brand Interface, Category Interface, CreateReviewRequest Interface, PageResponse Interface, ProductVariant Interface, Product Types, Review Types

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (7): ApiClient Class, ApiResponse Interface, PaginationParams Interface, API Client, Common Types, Response Utils, unwrapApiData Function

### Community 37 - "Community 37"
Cohesion: 0.6
Nodes (4): accent, gray, primary, secondary

### Community 38 - "Community 38"
Cohesion: 0.4
Nodes (6): User Profile Page, Authentication Service, Auth Storage Utils, clearAuthTokens Function, getAccessToken Function, setAuthTokens Function

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (6): Layout Component, Design System, cn Class Merger Function, debounce Function, Helper Functions, throttle Function

### Community 40 - "Community 40"
Cohesion: 0.4
Nodes (5): Border Radius, Box Shadow, code:jsx (<div className="bg-white shadow-md rounded-lg p-4">Card with), code:jsx (// Button với bo góc medium), 🎭 Effects

### Community 41 - "Community 41"
Cohesion: 0.5
Nodes (3): Ecommerce API Gateway, Vite, vite.config.ts

### Community 42 - "Community 42"
Cohesion: 0.5
Nodes (4): Checkout Page, PaymentIntent Interface, Payment Service, Payment Types

### Community 43 - "Community 43"
Cohesion: 0.5
Nodes (4): Shipment, ShippingFeeRequest, ShippingFeeResponse, shippingService

### Community 45 - "Community 45"
Cohesion: 1.0
Nodes (3): e2e/example.spec.ts, Playwright, playwright.config.ts

## Knowledge Gaps
- **273 isolated node(s):** `themeButton`, `queryClient`, `ImportMetaEnv`, `ImportMeta`, `FormFieldProps` (+268 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **20 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Axios Library` connect `Community 1` to `Community 8`, `Community 3`, `Community 36`?**
  _High betweenness centrality (0.187) - this node is a cross-community bridge._
- **Why does `ApiClient Class` connect `Community 36` to `Community 1`, `Community 38`?**
  _High betweenness centrality (0.184) - this node is a cross-community bridge._
- **Why does `Auth Storage Utils` connect `Community 38` to `Community 36`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **What connects `themeButton`, `queryClient`, `ImportMetaEnv` to the rest of the system?**
  _273 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._