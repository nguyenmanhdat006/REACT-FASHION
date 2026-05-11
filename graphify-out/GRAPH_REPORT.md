# Graph Report - REACT-FASHION  (2026-05-11)

## Corpus Check
- 132 files · ~69,414 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 976 nodes · 2321 edges · 77 communities (54 shown, 23 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `33276843`
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
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]

## God Nodes (most connected - your core abstractions)
1. `React` - 104 edges
2. `Button()` - 40 edges
3. `Card()` - 26 edges
4. `useAuth()` - 24 edges
5. `ROUTES` - 23 edges
6. `ApiResponse` - 22 edges
7. `PageResponse` - 21 edges
8. `API_ENDPOINTS` - 19 edges
9. `ECOMMERCE FRONTEND - COMPLETE PACKAGE` - 18 edges
10. `cn()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.tsx → /home/thang/Workspace/REACT-FASHION/src/hooks/theme/useTheme.ts
- `Layout()` --calls--> `useAuth()`  [EXTRACTED]
  /home/thang/Workspace/REACT-FASHION/src/components/layout/Layout.tsx → src/hooks/auth/useAuth.ts
- `SignUp()` --calls--> `useAuth()`  [EXTRACTED]
  /home/thang/Workspace/REACT-FASHION/src/pages/auth/SignUp.tsx → src/hooks/auth/useAuth.ts
- `Dashboard()` --calls--> `useAuth()`  [EXTRACTED]
  /home/thang/Workspace/REACT-FASHION/src/pages/user/Dashboard.tsx → src/hooks/auth/useAuth.ts
- `extractRolesFromKeycloakToken()` --calls--> `extractRolesFromJwtPayload()`  [EXTRACTED]
  src/utils/keycloak.ts → /home/thang/Workspace/REACT-FASHION/src/utils/jwt.ts

## Communities (77 total, 23 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (63): AuthResponse, ForgotPasswordData, LoginCredentials, OAuthExchangeRequest, ResetPasswordData, SignUpCredentials, SocialProvider, authService (+55 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (54): SignUp(), SignUpFormData, signUpSchema, Card UI Component, Checkout(), ROUTES, MOCK_CART, MOCK_ORDERS (+46 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (59): ApiResponse, PaginationParams, API_ENDPOINTS, asRecord(), clone(), createOrderFromCart(), delay(), findProductById() (+51 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (65): AddToCartRequest, Address, AuthHeader, AuthLayout, AuthResponse, AuthSwitchPrompt, BannerSection, Button (+57 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (42): FormFieldProps, IMAGES, FormField Component, Input UI Component, Label UI Component, cn(), Lucide React, navItemClasses() (+34 more)

### Community 5 - "Community 5"
Cohesion: 0.1
Nodes (44): AdminTab, BrandFormState, CategoryFormState, DEFAULT_BRAND_FORM, DEFAULT_CATEGORY_FORM, DEFAULT_PRODUCT_FORM, ProductFormState, PageResponse (+36 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (29): JwtProfilePayload, JwtRolePayload, KeycloakAuthSession, KeycloakErrorResponse, KeycloakJwtPayload, KeycloakLoginCredentials, KeycloakLoginExchangeRequest, KeycloakRegisterCredentials (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (29): src/App.tsx, Button Test, Button UI Component, Class Variance Authority, ErrorBoundary Component, i18n Configuration, i18next, Layout Component (+21 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (33): 1. **PROJECT-STRUCTURE.md** (Complete project structure), 2. **API-CONTRACTS.md** (All API documentation), 3. **GITHUB-COPILOT-COMPLETE-GUIDE.md** ⭐ (MOST IMPORTANT!), 🔗 API INTEGRATION, Code Organization:, code:bash (# 1. Create project), code:block2 (Frontend:), code:block3 (src/) (+25 more)

### Community 9 - "Community 9"
Cohesion: 0.2
Nodes (21): AddToCartRequest, Cart, CartItem, CartStatus, CartSummary, UpdateCartItemRequest, MOCK_ADD_TO_CART_REQUEST, MOCK_CART_DATA (+13 more)

### Community 10 - "Community 10"
Cohesion: 0.16
Nodes (18): Address, User, MOCK_AUTH_RESPONSE, MOCK_AUTH_USER, MOCK_LOGIN_CREDENTIALS, MOCK_SIGN_UP_CREDENTIALS, MOCK_USER_ADDRESSES, initialState (+10 more)

### Community 11 - "Community 11"
Cohesion: 0.1
Nodes (19): AdminDashboard, AuthCallback, Cart, Checkout, ForgotPassword, ForgotPasswordSentV2, ForgotPasswordV2, Home (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.1
Nodes (21): 10. i18n (`src/constants/locales/en.json` và `vi.json`), 1. Types (`src/types/user.ts`), 2. Constants (`src/constants/index.ts`), 3. Service (`src/services/userService.ts`), 4. Thunks (`src/store/thunks/userThunks.ts`), 5. Slice (`src/store/slices/userSlice.ts`), 6. Hook (`src/hooks/useUsers.ts`), 7. Components (`src/components/UserList.tsx`) (+13 more)

### Community 13 - "Community 13"
Cohesion: 0.21
Nodes (12): Column, Table(), TableProps, Modal(), ModalProps, capitalize(), cn(), debounce() (+4 more)

### Community 14 - "Community 14"
Cohesion: 0.11
Nodes (18): BƯỚC 10: Thêm i18n Translations (Optional), BƯỚC 2: Thêm API Endpoints vào Constants, BƯỚC 3: Tạo Service Layer (API Calls), BƯỚC 5: Tạo Redux Slice (State Management), BƯỚC 6: Tạo Custom Hook (Optional), BƯỚC 7: Tạo Components (Reusable UI), BƯỚC 8: Tạo Page Component, BƯỚC 9: Thêm Route (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.17
Nodes (10): 📋 Checklist, code:block1 (1. Types (TypeScript Interfaces)), Coding Guide - Workflow cho Feature Development, ⚠️ Lưu ý file `tailwind.config.js`, 📋 Mục Lục, Quy tắc cụ thể, 🔗 Tài Liệu Tham Khảo, 🎯 Tổng Quan Workflow (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.18
Nodes (11): Body Text - 16px, Caption Extra Small - 9px, Caption Large - 13px, Caption Small - 11px, code:jsx (<span className="text-caption-xs-regular text-gray-400">), code:jsx (// Mặc định đã áp dụng cho toàn bộ app), code:jsx (<p className="text-body-regular text-gray-600">), code:jsx (<span className="text-caption-lg-regular text-gray-500">) (+3 more)

### Community 17 - "Community 17"
Cohesion: 0.2
Nodes (11): Admin Dashboard Page, Forgot Password Page, Home Page, Login Page, LoginV2 Page, Not Found Page, Orders Page, Protected Route Component (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.2
Nodes (10): Accent Colors (Màu Nhấn), code:jsx (// Background màu xám đậm với text trắng), code:jsx (// Button primary), code:jsx (// Badge hoặc tag), code:jsx (// Warning hoặc notification), Gray Scale, 🎨 Màu Sắc (Colors), Primary Colors (Màu Chính) (+2 more)

### Community 19 - "Community 19"
Cohesion: 0.33
Nodes (7): Date Utilities, Dayjs Library, formatDate Function, formatDate(), formatDateTime(), formatRelativeTime(), setLocale()

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (9): 1. **Type Safety**, 2. **Error Handling**, 3. **Code Organization**, 4. **Performance**, 5. **Testing**, 6. **Accessibility**, 7. **i18n**, 8. **Tailwind & Design System** (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.25
Nodes (9): Feature Development Workflow, User Profile Page, Project Overview, Authentication Service, Auth Storage Utils, clearAuthTokens Function, getAccessToken Function, Redux Store (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.22
Nodes (9): CreateOrderRequest Interface, Order Interface, Order Detail Page, OrderItem Interface, OrderStatus Enum, PaymentMethod Enum, PaymentStatus Enum, Order Service (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.64
Nodes (4): accent, gray, primary, secondary

### Community 25 - "Community 25"
Cohesion: 0.25
Nodes (6): code:jsx (// Element thay đổi màu theo dark mode), code:jsx (<h1 className="text-h4-bold md:text-h3-bold lg:text-h2-bold"), 🎯 Dark Mode, Hướng Dẫn Sử Dụng Design System - Tailwind CSS, 📚 Resources, 🔧 Responsive Design

### Community 26 - "Community 26"
Cohesion: 0.25
Nodes (8): code:jsx (<h1 className="text-h1-bold text-gray-900">), H1 - 48px, H2 - 40px, H3 - 33px, H4 - 28px, H5 - 23px, H6 - 19px, Heading Styles (H1 - H6)

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (8): 1. Sử dụng màu nhất quán, 2. Sử dụng typography scale, 3. Hierarchy màu sắc, 4. Text colors, 📋 Best Practices, code:jsx (// ✅ Tốt - Sử dụng các màu đã định nghĩa), code:jsx (// ✅ Tốt - Sử dụng các class text đã định nghĩa), code:jsx (// Hierarchy của text)

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (7): Alert Component, Card Component, code:jsx (<div className="bg-white dark:bg-gray-800 shadow-md rounded-), code:jsx (<div className="space-y-2">), code:jsx (<div className="bg-accent-700 border-l-4 border-accent-900 p), 📦 Component Examples, Form Input

### Community 29 - "Community 29"
Cohesion: 0.29
Nodes (7): Brand Interface, Category Interface, PageResponse Interface, PaginationParams Interface, ProductVariant Interface, Common Types, Product Types

### Community 30 - "Community 30"
Cohesion: 0.29
Nodes (7): Checkout Page, PaymentIntent Interface, Product Interface, API Contracts, Payment Service, Payment Types, Product Service

### Community 31 - "Community 31"
Cohesion: 0.33
Nodes (6): Layout Component, Design System, cn Class Merger Function, debounce Function, Helper Functions, throttle Function

### Community 32 - "Community 32"
Cohesion: 0.6
Nodes (3): Provider, providers, SocialProviders()

### Community 33 - "Community 33"
Cohesion: 0.4
Nodes (5): Border Radius, Box Shadow, code:jsx (<div className="bg-white shadow-md rounded-lg p-4">Card with), code:jsx (// Button với bo góc medium), 🎭 Effects

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (5): ApiClient Class, ApiResponse Interface, API Client, Response Utils, unwrapApiData Function

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (5): CreateReviewRequest Interface, Product Detail Page, Review Interface, Review Service, Review Types

### Community 39 - "Community 39"
Cohesion: 0.5
Nodes (3): Ecommerce API Gateway, Vite, vite.config.ts

### Community 40 - "Community 40"
Cohesion: 0.5
Nodes (4): Shipment, ShippingFeeRequest, ShippingFeeResponse, shippingService

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (3): BƯỚC 4: Tạo Redux Thunks (Async Actions), code:typescript (import { createAsyncThunk } from '@reduxjs/toolkit';), code:typescript (export * from './authThunks';)

### Community 43 - "Community 43"
Cohesion: 0.67
Nodes (3): BƯỚC 1: Định nghĩa Types (TypeScript Interfaces), code:typescript (// src/types/user.ts), code:typescript (export * from './auth';)

### Community 44 - "Community 44"
Cohesion: 1.0
Nodes (3): e2e/example.spec.ts, Playwright, playwright.config.ts

## Knowledge Gaps
- **215 isolated node(s):** `queryClient`, `CardProps`, `USER_ROLES`, `ICONS`, `MockHttpMethod` (+210 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **23 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `React` connect `Community 1` to `Community 0`, `Community 32`, `Community 4`, `Community 5`, `Community 38`, `Community 7`, `Community 37`, `Community 9`, `Community 39`, `Community 11`, `Community 13`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **Why does `Axios Library` connect `Community 6` to `Community 0`, `Community 2`, `Community 34`?**
  _High betweenness centrality (0.167) - this node is a cross-community bridge._
- **Why does `ApiClient Class` connect `Community 34` to `Community 21`, `Community 6`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **What connects `queryClient`, `CardProps`, `USER_ROLES` to the rest of the system?**
  _215 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._