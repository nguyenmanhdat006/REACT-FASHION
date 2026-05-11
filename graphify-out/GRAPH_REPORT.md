# REACT FASHION E-COMMERCE FRONTEND - ARCHITECTURE GRAPH REPORT
**Generated:** graphify
- 157 files · ~72,084 words
- 589 nodes · 1024 edges
- 75 communities detected

## God Nodes (Most Connected/Critical)

These nodes are central to the architecture and appear in most critical paths:

1. **Button()** (id: `ui_button_button`, degree: 27)
2. **useAuth()** (id: `auth_useauth_useauth`, degree: 17)
3. **Card()** (id: `ui_card_card`, degree: 16)
4. **cn()** (id: `lib_utils_cn`, degree: 16)
5. **ROUTES** (id: `constants_index_routes`, degree: 13)
6. **ApiResponse** (id: `common_common_apiresponse`, degree: 12)
7. **API_ENDPOINTS** (id: `constants_index_api_endpoints`, degree: 11)
8. **handleMockApiRequest()** (id: `handlers_mockapihandlers_handlemockapirequest`, degree: 11)
9. **PageResponse** (id: `common_common_pageresponse`, degree: 11)
10. **User** (id: `auth_auth_user`, degree: 9)

## Surprising Connections

Unexpected edges that reveal hidden dependencies or opportunities for refactoring:

- App() → useTheme()
- ProtectedRoute() → useAuth()
- SignUp() → useAuth()
- Dashboard() → useAuth()
- Layout() → useAuth()

## Communities (Clusters)

**Community 0** (62 nodes):
  - SignUp()
  - SignUpFormData
  - signUpSchema
  - useAuth()
  - Checkout()
  - ... and 57 more

**Community 1** (60 nodes):
  - ActionIconButton()
  - ActionIconButtonProps
  - ActionIconVariant
  - ButtonBaseProps
  - LabelButton()
  - ... and 55 more

**Community 2** (54 nodes):
  - AuthResponse
  - ForgotPasswordData
  - LoginCredentials
  - OAuthExchangeRequest
  - ResetPasswordData
  - ... and 49 more

**Community 3** (53 nodes):
  - API_ENDPOINTS
  - asRecord()
  - clone()
  - createOrderFromCart()
  - delay()
  - ... and 48 more

**Community 4** (50 nodes):
  - ForgotPassword()
  - ButtonBaseProps
  - IconButton()
  - IconButtonProps
  - ButtonBaseProps
  - ... and 45 more

**Community 5** (50 nodes):
  - AdminDashboard()
  - AdminTab
  - BrandFormState
  - CategoryFormState
  - DEFAULT_BRAND_FORM
  - ... and 45 more

**Community 6** (32 nodes):
  - PageResponse
  - PaginationParams
  - notificationMockData.ts
  - orderMockData.ts
  - notificationService.ts
  - ... and 27 more

**Community 7** (30 nodes):
  - AddToCartRequest
  - Cart()
  - CartItem
  - CartStatus
  - CartSummary
  - ... and 25 more

**Community 8** (23 nodes):
  - AdminDashboard
  - AuthCallback
  - Cart
  - Checkout
  - ForgotPassword
  - ... and 18 more

**Community 9** (23 nodes):
  - Address
  - User
  - MOCK_AUTH_RESPONSE
  - MOCK_AUTH_USER
  - MOCK_LOGIN_CREDENTIALS
  - ... and 18 more

**Community 10** (16 nodes):
  - AuthHeader()
  - AuthHeaderProps
  - AuthLayout()
  - AuthLayoutProps
  - AuthSwitchPrompt()
  - ... and 11 more

**Community 11** (15 nodes):
  - Column
  - Table()
  - TableProps
  - Table.tsx
  - Modal.tsx
  - ... and 10 more

**Community 12** (12 nodes):
  - Coding Guide - Feature Development Workflow
  - Reusable Components
  - Constants (API Endpoints, Routes)
  - Custom Hooks
  - i18n Translations
  - ... and 7 more

**Community 13** (9 nodes):
  - JwtProfilePayload
  - JwtRolePayload
  - jwt.ts
  - jwt.ts
  - decodeBase64Url()
  - ... and 4 more

**Community 14** (9 nodes):
  - KeycloakAuthSession
  - KeycloakErrorResponse
  - KeycloakJwtPayload
  - KeycloakLoginCredentials
  - KeycloakLoginExchangeRequest
  - ... and 4 more

**Community 15** (8 nodes):
  - ApiClient
  - .constructor()
  - .delete()
  - .get()
  - .patch()
  - ... and 3 more

**Community 16** (7 nodes):
  - ErrorBoundary
  - .componentDidCatch()
  - .getDerivedStateFromError()
  - .render()
  - Props
  - ... and 2 more

**Community 17** (6 nodes):
  - accent
  - gray
  - primary
  - secondary
  - colors.ts
  - ... and 1 more

**Community 18** (5 nodes):
  - date.ts
  - formatDate()
  - formatDateTime()
  - formatRelativeTime()
  - setLocale()

**Community 19** (4 nodes):
  - Provider
  - providers
  - SocialProviders()
  - SocialProviders.tsx

