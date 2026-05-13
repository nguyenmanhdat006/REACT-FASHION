# Graph Report - REACT-FASHION  (2026-05-13)

## Corpus Check
- 188 files · ~87,215 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1233 nodes · 2862 edges · 113 communities (65 shown, 48 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 3 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1daf9aac`
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
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
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
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 98|Community 98]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 102|Community 102]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 106|Community 106]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 111|Community 111]]
- [[_COMMUNITY_Community 112|Community 112]]

## God Nodes (most connected - your core abstractions)
1. `Button()` - 49 edges
2. `cn()` - 49 edges
3. `ApiResponse` - 36 edges
4. `Card()` - 26 edges
5. `PageResponse` - 22 edges
6. `API_ENDPOINTS` - 19 edges
7. `useAuth()` - 19 edges
8. `User` - 18 edges
9. `Address` - 18 edges
10. `ROUTES` - 17 edges

## Surprising Connections (you probably didn't know these)
- `cn()` --calls--> `twMerge`  [INFERRED]
  /home/thang/Workspace/REACT-FASHION/src/utils/helpers.ts → src/lib/utils.ts
- `App()` --calls--> `useTheme()`  [EXTRACTED]
  src/App.tsx → /home/thang/Workspace/REACT-FASHION/src/hooks/theme/useTheme.ts
- `Layout()` --calls--> `useAuth()`  [EXTRACTED]
  /home/thang/Workspace/REACT-FASHION/src/components/layout/Layout.tsx → src/hooks/auth/useAuth.ts
- `ProtectedRoute()` --calls--> `useAuth()`  [EXTRACTED]
  /home/thang/Workspace/REACT-FASHION/src/components/navigation/ProtectedRoute.tsx → src/hooks/auth/useAuth.ts
- `useAuth()` --calls--> `SignUp()`  [EXTRACTED]
  src/hooks/auth/useAuth.ts → /home/thang/Workspace/REACT-FASHION/src/pages/auth/SignUp.tsx

## Communities (113 total, 48 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (81): ApiResponse, PageMeta, PageResponse, PaginatedListResponse, PaginationParams, PagedPayload, API_ENDPOINTS, MOCK_CART (+73 more)

### Community 1 - "Community 1"
Cohesion: 0.05
Nodes (59): ActionIconButton(), ActionIconButtonProps, ActionIconVariant, ButtonBaseProps, LabelButton(), LabelButtonProps, LabelButtonTone, TONE_STYLES (+51 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (61): AdminTab, BrandFormState, CategoryFormState, DEFAULT_BRAND_FORM, DEFAULT_CATEGORY_FORM, DEFAULT_PRODUCT_FORM, ProductFormState, Brand (+53 more)

### Community 3 - "Community 3"
Cohesion: 0.05
Nodes (42): AdminProductListProps, AdminProductRow, ADMIN_PRODUCT_LIST_DEMO, AdminTableColumn, AdminTableRowBase, AdminTableViewProps, ButtonBaseProps, IconLabelButton() (+34 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (53): AddressType, FormFieldProps, ProfileAddressesModal(), ProfileAddressesModalProps, ProfileEditModal(), ProfileEditModalProps, ProfileReadOnlyField(), ProfileReadOnlyFieldProps (+45 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (30): adminAddProductFormToCreateRequest(), AdminAddProductSubmitInput, adminAddProductSubmitSchema, optionalUuid(), parseDiscountPercent(), parseMoney(), slugFromName(), statusMap (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.06
Nodes (33): 1. **PROJECT-STRUCTURE.md** (Complete project structure), 2. **API-CONTRACTS.md** (All API documentation), 3. **GITHUB-COPILOT-COMPLETE-GUIDE.md** ⭐ (MOST IMPORTANT!), 🔗 API INTEGRATION, Code Organization:, code:bash (# 1. Create project), code:block2 (Frontend:), code:block3 (src/) (+25 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (21): AddToCartRequest, Cart, CartItem, CartStatus, CartSummary, UpdateCartItemRequest, MOCK_ADD_TO_CART_REQUEST, MOCK_CART_DATA (+13 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (21): Address, User, initialState, userSlice, UserState, createAddressThunk, deleteAddressThunk, fetchAddressesThunk (+13 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (12): Checkout(), Input, InputProps, Products(), queryClient, AppDispatch, persistConfig, persistedReducer (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (9): LastOrderButton(), LastOrderButtonProps, ROUTES, MOCK_PRODUCTS, ProductDetail(), Home(), Button(), buttonVariants (+1 more)

### Community 11 - "Community 11"
Cohesion: 0.09
Nodes (22): AdminDashboard, adminRoute, AuthCallback, authV2Routes, Cart, Checkout, ForgotPassword, ForgotPasswordSentV2 (+14 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (12): ProductDetailsAccordion(), ProductDetailsAccordionProps, ProductDetailsCloseButton(), ProductDetailsShippingItem(), ProductDetailsShippingItemProps, ProductDetailsSizePill(), ProductDetailsSizePillProps, PRODUCT_DETAILS_COLORS (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.16
Nodes (9): SocialProvider, authDataWithNormalizedUser(), authService, finalizeUserFromMeEnvelope(), normalizeUser(), KEYCLOAK_AUTH_ENDPOINTS, KEYCLOAK_CONFIG, SOCIAL_PROVIDER_HINTS (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (17): useV2ProductDetail(), FALLBACK_THUMBS, ProductDetails(), ProductDetailsProps, categoryLabel(), collectProductGalleryUrls(), formatProductPriceUsd(), getPrimaryProductImageUrl() (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (6): AuthHeaderProps, AuthLayoutProps, AuthSwitchPromptProps, ROUTESV2, LoginFormData, loginSchema

### Community 16 - "Community 16"
Cohesion: 0.14
Nodes (20): 10. i18n (`src/constants/locales/en.json` và `vi.json`), 1. Types (`src/types/user.ts`), 2. Constants (`src/constants/index.ts`), 7. Components (`src/components/UserList.tsx`), 8. Page (`src/pages/Users.tsx`), 9. Route (`src/App.tsx`), 9. Route (`src/routes/index.tsx` và khi cần `src/routes/v2/*`), BƯỚC 10: Thêm i18n Translations (Optional) (+12 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (11): AdminAddProductFormValues, BRAND_OPTIONS, CATEGORY_OPTIONS, GALLERY_IMAGES, STATUS_OPTIONS, SUBCATEGORY_OPTIONS, AdminAddProductQuickActionsSectionProps, CardDescription() (+3 more)

### Community 18 - "Community 18"
Cohesion: 0.14
Nodes (12): Login(), LoginFormData, loginSchema, SignUp(), SignUpFormData, signUpSchema, useAuth(), ForgotPasswordSentV2() (+4 more)

### Community 19 - "Community 19"
Cohesion: 0.23
Nodes (10): UserInbound, AUTH_ENDPOINTS, AUTH_STORAGE_KEYS, RetryConfig, clearAuthTokens(), getAccessToken(), getRefreshToken(), setAuthTokens() (+2 more)

### Community 20 - "Community 20"
Cohesion: 0.21
Nodes (12): ForgotPasswordData, authSlice, AuthState, initialAccessToken, initialRefreshToken, initialState, forgotPasswordThunk, getProfileThunk (+4 more)

### Community 21 - "Community 21"
Cohesion: 0.12
Nodes (16): Bố cục file, 📋 Checklist, code:block1 (1. Types (TypeScript Interfaces)), Coding Guide - Workflow cho Feature Development, Forms & Validation (react-hook-form + zod), Graphify & đồ thị codebase, Khi nào áp dụng, ⚠️ Lưu ý file `tailwind.config.js` (+8 more)

### Community 22 - "Community 22"
Cohesion: 0.19
Nodes (9): ADMIN_PRODUCT_LIST_MOCK, OrderStats(), OrderStatsProps, initialsFromDisplayName(), UserButton(), UserButtonProps, IMAGES, QUICK_FILTERS (+1 more)

### Community 23 - "Community 23"
Cohesion: 0.15
Nodes (4): Column, TableProps, ModalProps, cn()

### Community 24 - "Community 24"
Cohesion: 0.19
Nodes (11): HomeHeaderSection(), ADMIN_SHELL_ROUTES, APP_SHELL_ROUTES, AppShellRoute, FALLBACK_META, getCurrentRoute(), getRouteMeta(), matchAdminRoute() (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.19
Nodes (14): 1. Module form thuần — schema + mapper (nguồn sự thật duy nhất), 1. Định nghĩa schema (nguồn sự thật duy nhất), 2. Khởi tạo `useForm`, 5. Submit handler — kết nối với thunk, 5. Submit handler — page gọi hook (toast nằm trong hook), 6. Những điều **không** nên làm, BƯỚC 1: Định nghĩa Types (TypeScript Interfaces), BƯỚC 5: Tạo Redux Slice (State Management) (+6 more)

### Community 26 - "Community 26"
Cohesion: 0.19
Nodes (9): ProductDetailsImage(), ProductDetailsImageProps, THUMB_IMAGES, DragState, HorizontalDragScrollProps, useHorizontalDragScroll(), UseHorizontalDragScrollOptions, ProductDetailsLeftSectionProps (+1 more)

### Community 27 - "Community 27"
Cohesion: 0.24
Nodes (7): ADMIN_PRODUCT_LIST_MOCK, AdminProductListPage(), ButtonBaseProps, IconButton(), IconButtonProps, useAdminProductList(), AdminProductRow

### Community 28 - "Community 28"
Cohesion: 0.21
Nodes (12): 3. Reset khi load data / đổi record, 3. Service (`src/services/userService.ts`), BƯỚC 2: Thêm API Endpoints vào Constants, BƯỚC 6: Tạo Custom Hook (bắt buộc khi có thunk + toast), BƯỚC 6: Tạo Custom Hook (Optional), BƯỚC 7: Tạo Components (Reusable UI), 📝 Chi Tiết Từng Bước, code:typescript (export const API_ENDPOINTS = {) (+4 more)

### Community 29 - "Community 29"
Cohesion: 0.17
Nodes (12): 4. Thunks (`src/store/thunks/userThunks.ts`), 5. Slice (`src/store/slices/userSlice.ts`), 6. Hook (`src/hooks/useUsers.ts`), BƯỚC 3: Tạo Service Layer (API Calls), BƯỚC 8: Tạo Page Component, code:typescript (import apiClient from '@/utils/api';), code:typescript (import React, { useState } from 'react';), code:typescript (// Lazy load page) (+4 more)

### Community 30 - "Community 30"
Cohesion: 0.17
Nodes (12): Coding Guide - Feature Development Workflow, Reusable Components, Constants (API Endpoints, Routes), Custom Hooks, i18n Translations, Page Components, Protected Routes & Auth, Redux Slice (State Management) (+4 more)

### Community 31 - "Community 31"
Cohesion: 0.2
Nodes (7): FormField(), TermsAgreementProps, ForgotPasswordFormData, forgotPasswordSchema, FormSection(), SignUpFormData, signUpSchema

### Community 32 - "Community 32"
Cohesion: 0.18
Nodes (9): Cart, Checkout, OrderDetail, Orders, ProductDetail, Products, Profile, ProfileV2 (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.18
Nodes (11): Body Text - 16px, Caption Extra Small - 9px, Caption Large - 13px, Caption Small - 11px, code:jsx (<span className="text-caption-xs-regular text-gray-400">), code:jsx (// Mặc định đã áp dụng cho toàn bộ app), code:jsx (<p className="text-body-regular text-gray-600">), code:jsx (<span className="text-caption-lg-regular text-gray-500">) (+3 more)

### Community 34 - "Community 34"
Cohesion: 0.36
Nodes (8): AuthResponse, LoginCredentials, SignUpCredentials, MOCK_AUTH_RESPONSE, MOCK_AUTH_USER, MOCK_LOGIN_CREDENTIALS, MOCK_SIGN_UP_CREDENTIALS, MOCK_USER_ADDRESSES

### Community 35 - "Community 35"
Cohesion: 0.24
Nodes (7): Layout(), initialState, Theme, themeSlice, ThemeState, App(), useTheme()

### Community 36 - "Community 36"
Cohesion: 0.22
Nodes (7): APP_SHELL_ROUTES, AppShellRoute, FALLBACK_META, getRouteMeta(), ResolvedAppShellMeta, routesSortedForMatching(), SIDEBAR_NAV_ITEMS

### Community 37 - "Community 37"
Cohesion: 0.2
Nodes (10): Accent Colors (Màu Nhấn), code:jsx (// Background màu xám đậm với text trắng), code:jsx (// Button primary), code:jsx (// Badge hoặc tag), code:jsx (// Warning hoặc notification), Gray Scale, 🎨 Màu Sắc (Colors), Primary Colors (Màu Chính) (+2 more)

### Community 38 - "Community 38"
Cohesion: 0.2
Nodes (10): 1. **Type Safety**, 2. **Error Handling**, 3. **Code Organization**, 4. **Performance**, 5. **Testing**, 6. **Accessibility**, 7. **i18n**, 8. **Tailwind & Design System** (+2 more)

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (4): CreateAddressRequest, OAuthExchangeRequest, ResetPasswordData, UpdateAddressRequest

### Community 40 - "Community 40"
Cohesion: 0.39
Nodes (7): JwtProfilePayload, JwtRolePayload, decodeBase64Url(), extractRolesFromJwtPayload(), getProfileFieldsFromJwtToken(), getRolesFromJwtToken(), parseJwtPayload()

### Community 41 - "Community 41"
Cohesion: 0.22
Nodes (8): KeycloakAuthSession, KeycloakErrorResponse, KeycloakJwtPayload, KeycloakLoginCredentials, KeycloakLoginExchangeRequest, KeycloakRegisterCredentials, KeycloakTokenResponse, KeycloakUserInfo

### Community 42 - "Community 42"
Cohesion: 0.31
Nodes (9): 4. Bind UI, 9a. Trang gốc (`/`, `Layout` cũ), 9b. Trang trong App Shell V2 (`/v2`, `LayoutV2`), BƯỚC 4: Tạo Redux Thunks (Async Actions), BƯỚC 9: Thêm Route, code:typescript (import { createAsyncThunk } from '@reduxjs/toolkit';), code:typescript (export * from './authThunks';), code:tsx (<Controller) (+1 more)

### Community 43 - "Community 43"
Cohesion: 0.5
Nodes (5): accent, gray, primary, secondary, outlineRingOpacityPlugin

### Community 45 - "Community 45"
Cohesion: 0.25
Nodes (8): code:jsx (<h1 className="text-h1-bold text-gray-900">), H1 - 48px, H2 - 40px, H3 - 33px, H4 - 28px, H5 - 23px, H6 - 19px, Heading Styles (H1 - H6)

### Community 46 - "Community 46"
Cohesion: 0.25
Nodes (8): 1. Sử dụng màu nhất quán, 2. Sử dụng typography scale, 3. Hierarchy màu sắc, 4. Text colors, 📋 Best Practices, code:jsx (// ✅ Tốt - Sử dụng các màu đã định nghĩa), code:jsx (// ✅ Tốt - Sử dụng các class text đã định nghĩa), code:jsx (// Hierarchy của text)

### Community 47 - "Community 47"
Cohesion: 0.29
Nodes (3): ErrorBoundary, Props, State

### Community 48 - "Community 48"
Cohesion: 0.29
Nodes (7): Alert Component, Card Component, code:jsx (<div className="bg-white dark:bg-gray-800 shadow-md rounded-), code:jsx (<div className="space-y-2">), code:jsx (<div className="bg-accent-700 border-l-4 border-accent-900 p), 📦 Component Examples, Form Input

### Community 49 - "Community 49"
Cohesion: 0.29
Nodes (6): code:jsx (// Element thay đổi màu theo dark mode), code:jsx (<h1 className="text-h4-bold md:text-h3-bold lg:text-h2-bold"), 🎯 Dark Mode, Hướng Dẫn Sử Dụng Design System - Tailwind CSS, 📚 Resources, 🔧 Responsive Design

### Community 50 - "Community 50"
Cohesion: 0.33
Nodes (5): authV2Routes, ForgotPasswordSentV2, ForgotPasswordV2, LoginV2, SignUpV2

### Community 51 - "Community 51"
Cohesion: 0.33
Nodes (5): authV2Routes, ForgotPasswordSentV2, ForgotPasswordV2, LoginV2, SignUpV2

### Community 52 - "Community 52"
Cohesion: 0.4
Nodes (4): AdminAddProduct, AdminDashboard, AdminProductListPage, adminRoute

### Community 54 - "Community 54"
Cohesion: 0.4
Nodes (5): Border Radius, Box Shadow, code:jsx (<div className="bg-white shadow-md rounded-lg p-4">Card with), code:jsx (// Button với bo góc medium), 🎭 Effects

## Knowledge Gaps
- **291 isolated node(s):** `themeButton`, `ImportMetaEnv`, `ImportMeta`, `DividerProps`, `FormFieldBase` (+286 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **48 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Button()` connect `Community 10` to `Community 1`, `Community 2`, `Community 35`, `Community 3`, `Community 5`, `Community 4`, `Community 7`, `Community 9`, `Community 12`, `Community 47`, `Community 15`, `Community 17`, `Community 18`, `Community 58`, `Community 27`, `Community 31`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 3` to `Community 1`, `Community 4`, `Community 5`, `Community 10`, `Community 12`, `Community 14`, `Community 17`, `Community 22`, `Community 26`, `Community 27`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `ApiResponse` connect `Community 0` to `Community 2`, `Community 7`, `Community 8`, `Community 13`, `Community 19`, `Community 20`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `themeButton`, `ImportMetaEnv`, `ImportMeta` to the rest of the system?**
  _291 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._