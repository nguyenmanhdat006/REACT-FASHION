# Graph Report - REACT-FASHION  (2026-05-11)

## Corpus Check
- 148 files · ~72,970 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 816 nodes · 1313 edges · 92 communities (45 shown, 47 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `77b59a22`
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
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
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
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 91|Community 91]]

## God Nodes (most connected - your core abstractions)
1. `Button()` - 28 edges
2. `cn()` - 18 edges
3. `Card()` - 17 edges
4. `useAuth()` - 17 edges
5. `ECOMMERCE FRONTEND - COMPLETE PACKAGE` - 17 edges
6. `ROUTES` - 13 edges
7. `ApiResponse` - 12 edges
8. `API_ENDPOINTS` - 11 edges
9. `handleMockApiRequest()` - 11 edges
10. `PageResponse` - 11 edges

## Surprising Connections (you probably didn't know these)
- `App()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.tsx → /home/thang/Workspace/REACT-FASHION/src/hooks/theme/useTheme.ts
- `Layout()` --calls--> `useAuth()`  [EXTRACTED]
  /home/thang/Workspace/REACT-FASHION/src/components/layout/Layout.tsx → src/hooks/auth/useAuth.ts
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  /home/thang/Workspace/REACT-FASHION/src/components/navigation/ProtectedRoute.tsx → src/hooks/auth/useAuth.ts
- `useAuth()` --calls--> `SignUp()`  [EXTRACTED]
  src/hooks/auth/useAuth.ts → /home/thang/Workspace/REACT-FASHION/src/pages/auth/SignUp.tsx
- `useAuth()` --calls--> `Dashboard()`  [EXTRACTED]
  src/hooks/auth/useAuth.ts → /home/thang/Workspace/REACT-FASHION/src/pages/user/Dashboard.tsx

## Communities (92 total, 47 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (50): Address, AuthResponse, ForgotPasswordData, LoginCredentials, OAuthExchangeRequest, ResetPasswordData, SignUpCredentials, SocialProvider (+42 more)

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (40): AdminTab, BrandFormState, CategoryFormState, DEFAULT_BRAND_FORM, DEFAULT_CATEGORY_FORM, DEFAULT_PRODUCT_FORM, ProductFormState, Brand (+32 more)

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (20): SignUpFormData, signUpSchema, ROUTES, MOCK_CART, MOCK_ORDERS, MOCK_PRODUCTS, Input, InputProps (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (38): LayoutV2Props, NavigationMenuSection(), AdminDashboard, adminRoute, AuthCallback, authV2Routes, Cart, Checkout (+30 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (20): SignUp(), useAuth(), AuthHeaderProps, AuthLayoutProps, AuthSwitchPromptProps, FormField(), TermsAgreementProps, ROUTESV2 (+12 more)

### Community 5 - "Community 5"
Cohesion: 0.05
Nodes (40): 10. i18n (`src/constants/locales/en.json` và `vi.json`), 1. **Type Safety**, 1. Types (`src/types/user.ts`), 2. Constants (`src/constants/index.ts`), 2. **Error Handling**, 3. **Code Organization**, 3. Service (`src/services/userService.ts`), 4. **Performance** (+32 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (28): ButtonBaseProps, IconLabelButton(), IconLabelButtonPillVariant, IconLabelButtonProps, PILL_VARIANT_STYLES, OrderStats(), OrderStatsProps, UserButton() (+20 more)

### Community 7 - "Community 7"
Cohesion: 0.05
Nodes (36): 1. Sử dụng màu nhất quán, 2. Sử dụng typography scale, 3. Hierarchy màu sắc, 4. Text colors, Accent Colors (Màu Nhấn), Alert Component, 📋 Best Practices, Border Radius (+28 more)

### Community 8 - "Community 8"
Cohesion: 0.06
Nodes (33): 1. **PROJECT-STRUCTURE.md** (Complete project structure), 2. **API-CONTRACTS.md** (All API documentation), 3. **GITHUB-COPILOT-COMPLETE-GUIDE.md** ⭐ (MOST IMPORTANT!), 🔗 API INTEGRATION, Code Organization:, code:bash (# 1. Create project), code:block2 (Frontend:), code:block3 (src/) (+25 more)

### Community 9 - "Community 9"
Cohesion: 0.15
Nodes (20): AddToCartRequest, Cart, CartItem, CartStatus, CartSummary, UpdateCartItemRequest, MOCK_ADD_TO_CART_REQUEST, MOCK_CART_DATA (+12 more)

### Community 10 - "Community 10"
Cohesion: 0.08
Nodes (24): BƯỚC 10: Thêm i18n Translations (Optional), BƯỚC 1: Định nghĩa Types (TypeScript Interfaces), BƯỚC 2: Thêm API Endpoints vào Constants, BƯỚC 3: Tạo Service Layer (API Calls), BƯỚC 4: Tạo Redux Thunks (Async Actions), BƯỚC 5: Tạo Redux Slice (State Management), BƯỚC 6: Tạo Custom Hook (Optional), BƯỚC 7: Tạo Components (Reusable UI) (+16 more)

### Community 11 - "Community 11"
Cohesion: 0.12
Nodes (22): asRecord(), clone(), createOrderFromCart(), delay(), findProductById(), handleMockApiRequest(), mockAddresses, mockCart (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.11
Nodes (16): Layout(), routes, initialState, Theme, themeSlice, ThemeState, App(), queryClient (+8 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (19): Body Text - 16px, Caption Extra Small - 9px, Caption Large - 13px, Caption Small - 11px, code:jsx (<span className="text-caption-xs-regular text-gray-400">), code:jsx (// Mặc định đã áp dụng cho toàn bộ app), code:jsx (<h1 className="text-h1-bold text-gray-900">), code:jsx (<p className="text-body-regular text-gray-600">) (+11 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (12): ActionIconButton(), ActionIconButtonProps, ActionIconVariant, PromoCardProps, FEATURED_PROMO, LAST_ORDERS, LastOrderItem, LEFT_BOTTOM_PROMOS (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.16
Nodes (11): Divider(), DividerProps, LastOrderButton(), LastOrderButtonProps, NavButton(), NavButtonProps, PRIMARY_NAV_ITEMS, PrimaryNavigationItem (+3 more)

### Community 16 - "Community 16"
Cohesion: 0.15
Nodes (4): Column, TableProps, ModalProps, cn()

### Community 17 - "Community 17"
Cohesion: 0.24
Nodes (10): promoBg(), PromoCard(), FEATURED_PROMO, LastOrderItem, LEFT_BOTTOM_PROMOS, LEFT_TOP_PROMOS, PrimaryNavItem, ProductTile (+2 more)

### Community 18 - "Community 18"
Cohesion: 0.19
Nodes (8): ButtonBaseProps, IconButton(), IconButtonProps, CATEGORY_FILTERS, CategoryFilter, EXPLORE_PRODUCTS, ExploreCategoryId, ExploreProductTile

### Community 19 - "Community 19"
Cohesion: 0.21
Nodes (7): DEFAULT_SWATCHES, ProductCardProps, ProductSwatch, CardContent(), CardDescription(), CardProps, CardTitle()

### Community 20 - "Community 20"
Cohesion: 0.23
Nodes (9): CreateOrderRequest, orderService, initialState, ordersSlice, OrdersState, cancelOrderThunk, createOrderThunk, fetchOrderByIdThunk (+1 more)

### Community 21 - "Community 21"
Cohesion: 0.29
Nodes (9): CreateReviewRequest, Review, ReviewPage, ReviewSummary, MOCK_CREATE_REVIEW_REQUEST, MOCK_REVIEW_PAGE, MOCK_REVIEW_SUMMARY, MOCK_REVIEWS (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.17
Nodes (12): Coding Guide - Feature Development Workflow, Reusable Components, Constants (API Endpoints, Routes), Custom Hooks, i18n Translations, Page Components, Protected Routes & Auth, Redux Slice (State Management) (+4 more)

### Community 23 - "Community 23"
Cohesion: 0.27
Nodes (5): ProductCard(), PRODUCT_TILES, PRODUCT_TILES, HomeMainSection(), HomeProductCardsSection()

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (8): ConfirmPaymentRequest, CreatePaymentRequest, PaymentIntent, MOCK_CONFIRM_PAYMENT_REQUEST, MOCK_CONFIRMED_PAYMENT_INTENT, MOCK_CREATE_PAYMENT_REQUEST, MOCK_PAYMENT_INTENT, paymentService

### Community 25 - "Community 25"
Cohesion: 0.31
Nodes (7): MOCK_SHIPMENT, MOCK_SHIPPING_FEE_REQUEST, MOCK_SHIPPING_FEE_RESPONSE, Shipment, ShippingFeeRequest, ShippingFeeResponse, shippingService

### Community 26 - "Community 26"
Cohesion: 0.47
Nodes (5): ApiResponse, PageResponse, PaginationParams, NotificationItem, notificationService

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (8): KeycloakAuthSession, KeycloakErrorResponse, KeycloakJwtPayload, KeycloakLoginCredentials, KeycloakLoginExchangeRequest, KeycloakRegisterCredentials, KeycloakTokenResponse, KeycloakUserInfo

### Community 28 - "Community 28"
Cohesion: 0.39
Nodes (7): JwtProfilePayload, JwtRolePayload, decodeBase64Url(), extractRolesFromJwtPayload(), getProfileFieldsFromJwtToken(), getRolesFromJwtToken(), parseJwtPayload()

### Community 29 - "Community 29"
Cohesion: 0.5
Nodes (4): FormFieldProps, cn(), Input, Label()

### Community 31 - "Community 31"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 32 - "Community 32"
Cohesion: 0.6
Nodes (4): accent, gray, primary, secondary

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (5): ButtonBaseProps, LabelButton(), LabelButtonProps, LabelButtonTone, TONE_STYLES

### Community 35 - "Community 35"
Cohesion: 0.5
Nodes (3): MOCK_ADDRESSES, MOCK_USER_PROFILE, MOCK_USER_UPDATE_PAYLOAD

## Knowledge Gaps
- **271 isolated node(s):** `themeButton`, `queryClient`, `ImportMetaEnv`, `ImportMeta`, `FormFieldProps` (+266 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `Community 2` to `Community 0`, `Community 33`, `Community 1`, `Community 4`, `Community 6`, `Community 12`, `Community 14`, `Community 15`, `Community 18`, `Community 29`, `Community 31`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Why does `Card()` connect `Community 2` to `Community 0`, `Community 1`, `Community 4`, `Community 14`, `Community 17`, `Community 19`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Why does `getAccessToken()` connect `Community 0` to `Community 12`?**
  _High betweenness centrality (0.024) - this node is a cross-community bridge._
- **What connects `themeButton`, `queryClient`, `ImportMetaEnv` to the rest of the system?**
  _271 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._