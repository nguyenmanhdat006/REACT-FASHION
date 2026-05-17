# Coding Guide - Workflow cho Feature Development

Workflow khi implement feature mới (ưu tiên cho AI / Cursor đọc cùng code thật trong repo).

## 📋 Mục Lục

1. [Tổng Quan Workflow](#tổng-quan-workflow)
2. [Graphify & đồ thị codebase](#graphify--đồ-thị-codebase)
3. [Tailwind & Design System (quy tắc cho AI)](#tailwind--design-system-quy-tắc-cho-ai)
4. [Forms & Validation (react-hook-form + zod)](#forms--validation-react-hook-form--zod)
5. [Chi Tiết Từng Bước](#chi-tiết-từng-bước)
6. [Tham chiếu trong repo (end-to-end)](#tham-chiếu-trong-repo-end-to-end)
7. [Best Practices](#best-practices)
8. [Checklist](#checklist)
9. [Tài Liệu Tham Khảo](#tài-liệu-tham-khảo)

---

## 🎯 Tổng Quan Workflow

Khi implement một feature mới, hãy làm theo thứ tự sau:

```
1. Types (TypeScript Interfaces)
   ↓
2. Constants (API Endpoints, Routes)
   ↓
3. Service Layer (API Calls)
   ↓
4. Redux Thunks (Async Actions)
   ↓
5. Redux Slice (State Management)
   ↓
6. Custom Hooks — **bắt buộc** khi page/feature gọi Redux thunk và cần phản hồi UX (toast, v.v.). Chi tiết: **BƯỚC 6** trong mục [Chi Tiết Từng Bước](#chi-tiết-từng-bước).
   ↓
6.5. Module form — folder `src/forms/<Feature>/` (`schema`, `mapper`, `types`, `hooks`, `components`). Chuẩn: [Forms & Validation](#forms--validation-react-hook-form--zod) · tham chiếu `src/forms/AdminProductV2/`
   ↓
7. Components (Reusable UI) — section form trong `src/forms/<Feature>/components/`; bind RHF qua `register` / `Controller` + `FormField` / `LabeledInputField`
   ↓
8. Pages (Page Components)
   ↓
9. Routes (Routing) — `src/routes/index.tsx`; riêng `/v2` thêm `src/routes/v2/userRoute.tsx` và khi cần shell UI thì `src/routes/v2/appShellRoutes.ts`
   ↓
10. i18n Translations (Optional)
```

**UI / styling:** Sau bước Components & Pages, mọi class Tailwind và token thiết kế phải tuân **[Tailwind & Design System (quy tắc cho AI)](#tailwind--design-system-quy-tắc-cho-ai)** và tài liệu `docs/TAILWIND_DESIGN_SYSTEM.md`.

---

## Graphify & đồ thị codebase

- Trước khi đụng **nhiều file** hoặc câu hỏi **kiến trúc**: đọc `graphify-out/GRAPH_REPORT.md` (god nodes, communities). Repo có wiki theo node trong `graphify-out/wiki/` 
- Sau khi **sửa code** trong session: chạy `graphify update .` (AST-only, không tốn API) để đồng bộ graph.
- Chi tiết quy tắc Cursor: `.cursor/rules/graphify.mdc`.

---

## Tailwind & Design System (quy tắc cho AI)

Dành cho **AI / Cursor** khi chỉnh sửa JSX/TSX, layout, Theme, hoặc thêm UI mới — **ưu tiên đọc tài liệu trước khi tự đặt giá trị tùy ý.**

### Tham chiếu bắt buộc

| File | Vai trò |
| ------ | ------- |
| `docs/TAILWIND_DESIGN_SYSTEM.md` | Chuẩn màu (gray / primary / secondary / accent), typography (`text-h*-*`, `text-body-*`, `text-caption-*-*`), semantic shadcn, shadow, radius, dark mode, responsive, ví dụ component. |
| `tailwind.config.js` | Nơi đăng ký token: `theme.extend.colors`, `fontSize`, `fontFamily`; import palette từ `src/constants/colors.ts` (đường dẫn theo `./src/constants/colors` trong config). |

### Quy tắc cụ thể

1. **Token trước, arbitrary sau** — Dùng class đã có trong design system và `tailwind.config.js`. **Tránh** `bg-[#...]`, `text-[NNpx]` nếu đã có tương đương trong doc (ví dụ `primary-900` thay vì `#5F33E1`; `text-h1-bold` thay vì `text-[48px]`).
2. **Typography** — Heading / body / caption chỉ qua các family class đã định nghĩa trong config (`text-h1-regular` … `text-h6-bold`, `text-body-*`, `text-caption-lg-*`, `text-caption-sm-*`, `text-caption-xs-*`). Không tự ghép stack `font-size` + `line-height`/`font-weight` nếu đã có một class token.
3. **Màu** — Theo hierarchy trong doc: CTA và primary steps (`primary-900`, `primary-800`, …), chữ và nền phụ (`gray-*`), nhấn phụ (`secondary-*`, `accent-*`). Với component **shadcn/ui**, kết hợp semantic như `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-destructive`.
4. **Font** — Mặc định **`font-sans`** (Poppins + fallback trong config); chỉ khác khi có lý do thiết kế rõ ràng.
5. **Bo góc & bóng** — Ưu tiên `rounded-sm` / `rounded-md` / `rounded-lg` (gắn `var(--radius)`), và `shadow-md` khi khớp card/modal trong doc — giữ nhất quán với page/component lân cận.
6. **Dark mode** — Khi chỉnh màn có theme tối, dùng cặp **`dark:`** theo ví dụ trong `TAILWIND_DESIGN_SYSTEM.md` (ví dụ `dark:bg-gray-900`, `dark:text-gray-white`).
7. **Responsive** — Prefix `sm:`, `md:`, `lg:` kết hợp typography responsive như ví dụ trong doc (scale heading theo breakpoint).
8. **`cn()`** — Gộp / điều kiện class dùng `cn()` từ `@/lib/utils` (pattern đồng bộ shadcn), tránh string nối dài khó đọc.
9. **Khi phải thêm token Tailwind mới** — Cập nhật **`tailwind.config.js`** và đồng bộ **`docs/TAILWIND_DESIGN_SYSTEM.md`** để không mất một nguồn sự thật duy nhất.

### ⚠️ Lưu ý file `tailwind.config.js`

Trong repo hiện có đoạn khai báo `colors.secondary` và `colors.accent` **lặp/ghi chồng** (merge object). AI khi chỉnh **chỉ sửa phần cần thiết**, tránh ghi đè nhầm; sau thay đổi luôn chạy **`npm run build`** hoặc dev để Tailwind báo class invalid.

---

## Forms & Validation (react-hook-form + zod)

**Quy tắc bắt buộc:** Mọi form trong ứng dụng (login, signup, profile, admin create/update, …) phải dùng [`react-hook-form`](https://react-hook-form.com/) (`useForm`) kết hợp [`zod`](https://zod.dev/) qua `@hookform/resolvers/zod`. **Không** dùng `useState` rời để giữ form values / errors / submitting flags.

Các dependency đã có sẵn trong `package.json`:

- `react-hook-form` (`^7.x`)
- `@hookform/resolvers`
- `zod`

### Khi nào áp dụng

- ✅ Form có ≥ 2 input, hoặc cần validate (`required`, format, length, async).
- ✅ Mọi form trong page CRUD (create / edit / read).
- ❌ Toggle / select đơn lẻ không có submit (dropdown chuyển trang, theme switch) — vẫn dùng `useState` thường.

### Chuẩn dự án: folder `src/forms/<Feature>/`

**Tham chiếu bắt buộc:** `src/forms/AdminProductV2/` — mọi form CRUD mới (đặc biệt admin) nên theo cùng flow và cấu trúc này.

Form **không** nhét logic vào page. Page chỉ render shell (Helmet, layout, navigate) và import component form:

```tsx
// src/pages/AdminProductV2/AdminCreateProduct/index.tsx
import AdminProductV2Form from '@/forms/AdminProductV2';

<AdminProductV2Form mode="create" onSuccess={() => navigate(ROUTESV2.ADMIN_PRODUCTS)} />
```

#### Cấu trúc thư mục

```txt
src/forms/AdminProductV2/
├── index.tsx                 # Shell JSX: <form>, ghép sections, hidden file input
├── types.ts                  # FormValues, mode (create|update|read), media input types
├── schema.ts                 # zod schema + empty*() — KHÔNG React
├── mapper.ts                 # entity ↔ form ↔ API payload — KHÔNG React
├── constants.ts              # OPTIONS fallback, labels (nếu cần)
├── hooks/
│   ├── useAdminProductV2Form.ts    # useForm + load meta + submit + compose media
│   └── useAdminProductFormMedia.ts # state gallery (cover, urls) — KHÔNG nằm trong RHF
├── utils/
│   └── adminProductMedia.ts        # pure helpers (preview slots, cover index sau xóa)
└── components/
    ├── AdminProductDetailSection.tsx
    ├── AdminProductMediaSection.tsx
    ├── AdminProductGalleryModal.tsx
    └── AdminProductQuickActionsSection.tsx
```

**Dùng chung toàn app (không copy vào form folder):**

| File | Vai trò |
| ---- | ------- |
| `src/utils/formFields.ts` | Parse/format field chung: `parseMoney`, `parseDiscountPercent`, `slugFromName`, `trimOrUndefined`, `optionalNonNegativeInt` |
| `src/hooks/storage/useImageUpload.ts` | Upload ảnh generic (`uploadImage`, `uploadBusy`) — build trên `useStorage` |
| `src/components/FormField.tsx` | Text / password / textarea / select — bind `register` + `error` |
| `src/components/form/LabeledInputField.tsx` | Profile / settings — bind qua `<Controller>` |

#### Luồng dữ liệu

```txt
Page (mỏng)
  └── <AdminProductV2Form />          index.tsx
        └── useAdminProductV2Form()   hooks/useAdminProductV2Form.ts
              ├── useForm + schema.ts + mapper.ts
              ├── useProducts()       toast + thunk (BƯỚC 6)
              └── useAdminProductFormMedia()
                    └── useImageUpload()   src/hooks/storage/
        └── components/*              nhận register | control | errors | media
```

Submit: `handleSubmit` → `adminProductFormToCreateRequest(values, { imageUrls, coverIndex })` trong `mapper.ts` — media gộp vào payload tại hook, không đưa `imageUrls` vào zod schema.

#### Trách nhiệm từng file

| File | Được phép | Không được |
| ---- | --------- | ---------- |
| `types.ts` | Kiểu form values, mode, input phụ (media) | Logic, zod, React |
| `schema.ts` | `zod` schema, `empty*()`, refine gọi `formFields` | React, RHF, API, JSX |
| `mapper.ts` | `*ToFormValues`, `*ToCreateRequest`, map ảnh từ `Product` | React, RHF, toast |
| `hooks/use*Form.ts` | `useForm`, `reset`, effects load record, `handleSubmit`, gọi domain hook | JSX dài, schema zod |
| `hooks/use*Media.ts` | State ngoài RHF (gallery, modal), compose `useImageUpload` | Trùng logic upload generic |
| `index.tsx` | Layout, truyền props xuống sections | Schema, mapper, dispatch thunk |
| `components/*` | UI + bind field | `useForm`, gọi API trực tiếp |

Form **đơn giản** (login, 1 section): có thể gom `schema` + `mapper` vào một file `*Form.ts` cạnh page — xem [Form đơn giản (legacy)](#form-đơn-giản-legacy). Form **CRUD nhiều section** → bắt buộc folder `src/forms/<Feature>/` như AdminProductV2.

### Pattern chuẩn (AdminProductV2)

#### 1. `schema.ts` — validation + default values

```typescript
// src/forms/AdminProductV2/schema.ts
import { z } from 'zod';
import { parseMoney } from '@/utils/formFields';
import type { AdminProductV2FormValues } from './types';

export const adminProductSubmitSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine(v => parseMoney(v) !== null, 'Enter a valid price'),
  // ...
});

export const emptyAdminProductFormValues = (): AdminProductV2FormValues => ({
  name: '',
  price: '',
  // ... đủ mọi key, không undefined
});
```

- Validate trim/format **trong schema**; helper parse dùng `@/utils/formFields`, không duplicate trong schema file.

#### 2. `mapper.ts` — entity ↔ form ↔ API

```typescript
// src/forms/AdminProductV2/mapper.ts
export function productToAdminProductFormValues(product: Product): AdminProductV2FormValues { /* ... */ }
export function productImagesFromProduct(product: Product): { imageUrls: string[]; coverIndex: number } { /* ... */ }
export function adminProductFormToCreateRequest(
  values: AdminProductV2FormValues,
  media?: AdminProductV2FormMediaInput
): CreateProductRequest { /* ... */ }
```

- Payload API và map từ `Product` khi edit/read — **một file mapper**, không scatter trong hook.

#### 3. `hooks/useAdminProductV2Form.ts` — orchestration

```typescript
const form = useForm<AdminProductV2FormValues>({
  resolver: zodResolver(adminProductSubmitSchema),
  defaultValues: emptyAdminProductFormValues(),
  mode: 'onSubmit',
});

const media = useAdminProductFormMedia({ readOnly, initialImageUrls, initialCoverIndex });

// Load record → reset(form) + setMediaSeed
useEffect(() => {
  if (!productDetail) return;
  reset(productToAdminProductFormValues(productDetail));
  setMediaSeed(productImagesFromProduct(productDetail));
}, [productDetail, reset]);

const onSubmit = async (values: AdminProductV2FormValues) => {
  const ok = await createProduct(
    adminProductFormToCreateRequest(values, {
      imageUrls: [...media.productImages],
      coverIndex: media.coverIndex,
    })
  );
  if (ok) onSuccess?.();
};
```

- **`defaultValues` luôn đầy đủ** — không để `undefined`.
- **Reset bằng `reset(values)`** — không `setValue` từng field khi load record.
- Toast + `dispatch` thunk: trong `useProducts()` (domain hook), không trong `index.tsx`.
- `busy` = submitting + meta loading + `media.uploadBusy`.

#### 4. State ngoài RHF (media / gallery)

Field không thuộc zod (upload ảnh, danh sách URL) → hook riêng `useAdminProductFormMedia`:

```typescript
const { uploadImage, uploadBusy } = useImageUpload({ readOnly });
// productImages, coverIndex, gallery modal, intent cover|append — logic gallery ở đây
```

- Upload file **generic** → `useImageUpload`; hook media chỉ quản lý gallery product.
- Các flow khác (avatar, banner, logo): tái dùng `useImageUpload`, không copy paste `uploadFile` + `uploadingCount`.

#### 5. `index.tsx` — shell + sections

```tsx
export default function AdminProductV2Form({ mode, productId, onSuccess }: Props) {
  const { register, control, errors, handleSubmit, media, readOnly, busy, ... } =
    useAdminProductV2Form({ mode, productId, onSuccess });

  return (
    <>
      <input ref={media.mainFileInputRef} type="file" className="sr-only" onChange={media.onMainFileChange} />
      <form onSubmit={readOnly ? e => e.preventDefault() : handleSubmit}>
        <AdminProductMediaSection media={media} readOnly={readOnly} uploadLocked={readOnly || media.uploadBusy} />
        <AdminProductDetailSection register={register} control={control} errors={errors} />
      </form>
    </>
  );
}
```

- `mode: 'create' | 'update' | 'read'` — `readOnly` derive từ mode; sections nhận `readOnly` / `isSubmitting`.

#### 6. Reset khi load data / đổi record

```typescript
useEffect(() => {
  if (mode === 'create' || !productId) {
    reset(emptyAdminProductFormValues());
    setMediaSeed({ urls: [], coverIndex: 0 });
    return;
  }
  void fetchProductById(productId);
}, [mode, productId, ...]);

useEffect(() => {
  if (!productDetail || productDetail.id !== productId) return;
  reset(productToAdminProductFormValues(productDetail));
  setMediaSeed(productImagesFromProduct(productDetail));
}, [productDetail, productId, reset]);
```

#### 7. Bind UI

**Với `<FormField />`** (text/password/textarea/select trong form V2):

```tsx
<FormField
  id="email"
  label="Email"
  type="email"
  placeholder="Enter your email"
  register={register('email')}
  error={errors.email}
/>
```

**Với select hoặc component custom**, dùng `<Controller>`:

```tsx
<Controller
  name="status"
  control={control}
  render={({ field, fieldState }) => (
    <FormField
      variant="selection"
      id="status"
      label="Status"
      placeholder="Choose status"
      options={STATUS_OPTIONS}
      value={field.value}
      onValueChange={field.onChange}
      error={fieldState.error}
    />
  )}
/>
```

**Với `<LabeledInputField />`** (profile / settings page), wrap `<Controller>`:

```tsx
<Controller
  name="fullName"
  control={control}
  render={({ field, fieldState }) => (
    <LabeledInputField
      mode={editing ? 'edit' : 'readonly'}
      id="profile-fullName"
      label="Full name"
      icon={User}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={fieldState.error?.message}
    />
  )}
/>
```

#### 8. Submit — trong `hooks/use*Form.ts`, không ở page

```typescript
// hooks/useAdminProductV2Form.ts — onSubmit nội bộ, export handleSubmit(onSubmit)
const onSubmit = useCallback(async (values: AdminProductV2FormValues) => {
  if (readOnly) return;
  setIsSubmitting(true);
  const ok = await createProduct(
    adminProductFormToCreateRequest(values, {
      imageUrls: [...media.productImages],
      coverIndex: media.coverIndex,
    })
  );
  setIsSubmitting(false);
  if (ok) onSuccess?.();
}, [/* ... */]);

return { handleSubmit: handleSubmit(onSubmit), busy, /* ... */ };
```

```tsx
// index.tsx
<form onSubmit={readOnly ? e => e.preventDefault() : handleSubmit}>...</form>
```

- Mapper (`adminProductFormToCreateRequest`) ở `mapper.ts`; **toast** trong domain hook (`useProducts`), không trong `index.tsx` hay page.
- Dùng `busy` / `isSubmitting` từ hook — không `useState` saving riêng ở page.

#### 9. Những điều **không** nên làm

- ❌ `useState` cho `fieldErrors` → đã có `formState.errors`.
- ❌ Validate thủ công khi đã có zod schema.
- ❌ Schema / mapper / `useForm` trong page hoặc section component.
- ❌ Quên `defaultValues` đầy đủ → uncontrolled warnings.
- ❌ `setValue` hàng loạt khi load record → `reset(mapper(entity))`.
- ❌ Nhét `imageUrls` vào zod — media là hook riêng, gộp lúc submit qua mapper.
- ❌ Copy logic `uploadFile` + `uploadingCount` — dùng `useImageUpload`.
- ❌ Trộn gallery modal state vào `useForm` — modal/upload là hook media hoặc `useState` feature hook.
- ❌ `dispatch(thunk)` + `toast` trong page khi đã có domain hook (BƯỚC 6).

### Form đơn giản (legacy)

Form **một section**, ít field (login, profile account): có thể gom schema + mapper trong **một file** `profileForm.ts` cạnh page, `useForm` gọi trực tiếp trong page/section — **không** bắt buộc folder `src/forms/`.

| Mức độ | Cấu trúc | Ví dụ |
| ------ | --------- | ----- |
| **Chuẩn CRUD** | `src/forms/<Feature>/` đầy đủ | `src/forms/AdminProductV2/` |
| **Đơn giản** | `src/pages/.../<feature>Form.ts` + section | `src/pages/user/ProfileV2/profileForm.ts` |
| **Tối giản** | schema inline trong section | `src/pages/authV2/LoginV2/sections/FormSection.tsx` |

### Tham chiếu trong repo

| Use case | Đường dẫn |
| -------- | --------- |
| **Form CRUD chuẩn (ưu tiên)** | `src/forms/AdminProductV2/` — page: `src/pages/AdminProductV2/AdminCreateProduct/`, `AdminReadProduct/` |
| Upload ảnh generic | `src/hooks/storage/useImageUpload.ts` |
| Parse field form | `src/utils/formFields.ts` |
| Profile + nhiều schema trong một file | `src/pages/user/ProfileV2/profileForm.ts` |
| Login tối giản | `src/pages/authV2/LoginV2/sections/FormSection.tsx` |

---

## 📝 Chi Tiết Từng Bước

### BƯỚC 1: Định nghĩa Types (TypeScript Interfaces)

**📍 Location:** `src/types/[featureName].ts`

**Mục đích:** Định nghĩa tất cả TypeScript interfaces/types cho feature

**Cấu trúc:**

```typescript
// src/types/user.ts
export interface User {
  id: string;
  name: string;
  email: string;
  // ... các fields khác
}

export interface CreateUserData {
  name: string;
  email: string;
  // ... các fields khác
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  // ... các fields optional
}

export interface UserListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}
```

**⚠️ Lưu ý:**

- Export types trong `src/types/index.ts`:

```typescript
export * from './auth';
export * from './user'; // Thêm dòng này
```

---

### BƯỚC 2: Thêm API Endpoints vào Constants

**📍 Location:** `src/constants/index.ts`

**Mục đích:** Định nghĩa API endpoints và routes

**Cấu trúc:**

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    // ...
  },
  USERS: {
    // Thêm mới
    LIST: '/users',
    DETAIL: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
} as const;

export const ROUTES = {
  HOME: '/',
  // ...
  USERS: '/users', // Thêm route mới
} as const;
```

---

### BƯỚC 3: Tạo Service Layer (API Calls)

**📍 Location:** `src/services/[featureName]Service.ts`

**Mục đích:** Tách biệt logic gọi API, dễ test và maintain

**Cấu trúc:**

```typescript
import apiClient from '@/utils/api';
import {
  User,
  CreateUserData,
  UpdateUserData,
  UserListResponse,
} from '@/types/user';
import { API_ENDPOINTS } from '@/constants';

export const userService = {
  // Get all users
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UserListResponse> => {
    const response = await apiClient.get<UserListResponse>(
      API_ENDPOINTS.USERS.LIST,
      { params }
    );
    return response.data;
  },

  // Get user by ID
  getUserById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>(
      API_ENDPOINTS.USERS.DETAIL(id)
    );
    return response.data;
  },

  // Create user
  createUser: async (data: CreateUserData): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(
      API_ENDPOINTS.USERS.CREATE,
      data
    );
    return response.data;
  },

  // Update user
  updateUser: async (
    id: string,
    data: UpdateUserData
  ): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data;
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },
};
```

**⚠️ Lưu ý:**

- Luôn sử dụng `apiClient` từ `@/utils/api` (đã có interceptors)
- Luôn type rõ ràng cho request/response
- Handle errors ở thunks, không handle ở service

---

### BƯỚC 4: Tạo Redux Thunks (Async Actions)

**📍 Location:** `src/store/thunks/[featureName]Thunks.ts`

**Mục đích:** Xử lý async actions với Redux Toolkit

**Cấu trúc:**

```typescript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { userService } from '@/services/userService';
import { CreateUserData, UpdateUserData, UserListResponse } from '@/types/user';

// Fetch users
export const fetchUsersThunk = createAsyncThunk<
  UserListResponse,
  { page?: number; limit?: number; search?: string } | undefined,
  { rejectValue: string }
>('user/fetchUsers', async (params, { rejectWithValue }) => {
  try {
    return await userService.getUsers(params);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to fetch users'
    );
  }
});

// Create user
export const createUserThunk = createAsyncThunk<
  UserResponse,
  CreateUserData,
  { rejectValue: string }
>('user/createUser', async (data, { rejectWithValue }) => {
  try {
    return await userService.createUser(data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to create user'
    );
  }
});

// Update user
export const updateUserThunk = createAsyncThunk<
  UserResponse,
  { id: string; data: UpdateUserData },
  { rejectValue: string }
>('user/updateUser', async ({ id, data }, { rejectWithValue }) => {
  try {
    return await userService.updateUser(id, data);
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to update user'
    );
  }
});

// Delete user
export const deleteUserThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await userService.deleteUser(id);
    return id;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Failed to delete user'
    );
  }
});
```

**⚠️ Lưu ý:**

- Export trong `src/store/thunks/index.ts`:

```typescript
export * from './authThunks';
export * from './userThunks'; // Thêm dòng này
```

---

### BƯỚC 5: Tạo Redux Slice (State Management)

**📍 Location:** `src/store/slices/[featureName]Slice.ts`

**Mục đích:** Quản lý state của feature với Redux Toolkit

**Cấu trúc:**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/user';
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from '../thunks/userThunks';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const initialState: UserState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
  extraReducers: builder => {
    // Fetch users
    builder
      .addCase(fetchUsersThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload.data;
        state.total = action.payload.total;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch users';
      });

    // Create user
    builder.addCase(createUserThunk.fulfilled, (state, action) => {
      state.users.push(action.payload.data);
    });

    // Update user
    builder.addCase(updateUserThunk.fulfilled, (state, action) => {
      const index = state.users.findIndex(u => u.id === action.payload.data.id);
      if (index !== -1) {
        state.users[index] = action.payload.data;
      }
    });

    // Delete user
    builder.addCase(deleteUserThunk.fulfilled, (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
    });
  },
});

export const { clearError, setPage } = userSlice.actions;
export default userSlice.reducer;
```

**⚠️ Lưu ý:**

- Đăng ký slice trong `src/store/index.ts`:

```typescript
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    user: userReducer, // Thêm dòng này
  },
});
```

---

### BƯỚC 6: Tạo Custom Hook (bắt buộc khi có thunk + toast)

**📍 Location:** `src/hooks/use[FeatureName].ts` hoặc theo nhóm domain `src/hooks/<domain>/use[FeatureName].ts` (ví dụ `src/hooks/user/useProfile.ts`, `src/hooks/auth/useAuth.ts`).

**Mục đích:** Hook **bọc `useAppDispatch` / `useAppSelector`**, gọi thunk qua `dispatch`, bọc trong `useCallback`, và **xử lý toast** bằng `Thunk.fulfilled.match(result)` / `Thunk.rejected.match(result)` (hoặc pattern tương đương). Page/component **không** gọi `dispatch(someThunk(...))` kèm `toast.success` / `toast.error` trực tiếp.

**Phân tách với form:**

| Layer | Vai trò | Ví dụ AdminProductV2 |
| --- | --- | --- |
| **Domain hook** (`src/hooks/<domain>/`) | `dispatch` thunk, `toast`, trả `boolean` | `useProducts()` → `createProduct`, `fetchProductById` |
| **Form hook** (`src/forms/<Feature>/hooks/`) | `useForm`, `reset`, `handleSubmit`, compose media, gọi mapper + domain hook | `useAdminProductV2Form` |
| **Form shell** (`src/forms/<Feature>/index.tsx`) | JSX sections, không schema/API | `AdminProductV2Form` |
| **Page** (`src/pages/...`) | Helmet, layout, `navigate`, props `mode` / `onSuccess` | `AdminCreateProduct/index.tsx` |

- Mapper (`adminProductFormToCreateRequest`) ở `mapper.ts`; gọi từ form hook lúc submit, không từ page.

- **SRP trong hook:** mỗi hàm export tương ứng **một** thunk (hoặc một luồng nghiệp vụ đơn). Ví dụ `fetchProfile` và `fetchAddresses` là hai hàm riêng — **không** gộp `Promise.all` nhiều thunk chỉ để “tiện gọi một lần”; page gọi lần lượt hoặc hai `useEffect` nếu cần tải độc lập lúc mount.

**Cấu trúc:**

```typescript
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchUsersThunk,
  fetchUserByIdThunk,
  createUserThunk,
  updateUserThunk,
  deleteUserThunk,
} from '@/store/thunks/userThunks';
import { CreateUserData, UpdateUserData } from '@/types/user';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const { users, currentUser, isLoading, error, total, page, limit } =
    useAppSelector(state => state.user);

  const fetchUsers = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      const result = await dispatch(fetchUsersThunk(params));
      if (fetchUsersThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch users');
      }
      return result;
    },
    [dispatch]
  );

  const fetchUserById = useCallback(
    async (id: string) => {
      const result = await dispatch(fetchUserByIdThunk(id));
      if (fetchUserByIdThunk.rejected.match(result)) {
        toast.error(result.payload || 'Failed to fetch user');
      }
      return result;
    },
    [dispatch]
  );

  const createUser = useCallback(
    async (data: CreateUserData): Promise<boolean> => {
      const result = await dispatch(createUserThunk(data));
      if (createUserThunk.fulfilled.match(result)) {
        toast.success('User created successfully!');
        return true;
      }
      toast.error((result.payload as string) || 'Failed to create user');
      return false;
    },
    [dispatch]
  );

  const updateUser = useCallback(
    async (id: string, data: UpdateUserData): Promise<boolean> => {
      const result = await dispatch(updateUserThunk({ id, data }));
      if (updateUserThunk.fulfilled.match(result)) {
        toast.success('User updated successfully!');
        return true;
      }
      toast.error((result.payload as string) || 'Failed to update user');
      return false;
    },
    [dispatch]
  );

  const deleteUser = useCallback(
    async (id: string): Promise<boolean> => {
      const result = await dispatch(deleteUserThunk(id));
      if (deleteUserThunk.fulfilled.match(result)) {
        toast.success('User deleted successfully!');
        return true;
      }
      toast.error((result.payload as string) || 'Failed to delete user');
      return false;
    },
    [dispatch]
  );

  return {
    users,
    currentUser,
    isLoading,
    error,
    total,
    page,
    limit,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
```

**⚠️ Lưu ý:**

- **Luôn sử dụng `useAppDispatch` và `useAppSelector` từ `@/store/hooks`** thay vì `useDispatch` và `useSelector` trực tiếp (để có type safety tốt hơn).
- **Mọi page/feature có thunk + toast (hoặc feedback tương đương) phải có hook** theo mục này — không xử lý toast thunk trong page.
- Sử dụng `useCallback` cho các hàm gọi `dispatch` trong hook.
- Toast messages nên user-friendly và informative.
- Sử dụng `.fulfilled.match()` và `.rejected.match()` để check kết quả của thunk (hoặc unwrap + try/catch **chỉ** trong hook nếu một pattern thống nhất).
- Hàm trong hook có thể `return true` khi `fulfilled` để page cập nhật UI cục bộ (đóng form, reset local state) **sau** khi thunk thành công.

---

### BƯỚC 7: Tạo Components (Reusable UI)

**📍 Location:** `src/components/[ComponentName].tsx`

**Mục đích:** Tạo các component tái sử dụng được

**Ví dụ: UserList Component**

```typescript
import React, { useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import Table from './Table';
import LoadingSpinner from './LoadingSpinner';

const UserList: React.FC = () => {
  const { users, isLoading, error, fetchUsers } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
  ];

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return <Table data={users} columns={columns} />;
};

export default UserList;
```

**⚠️ Lưu ý:**

- Components nên nhỏ, focused vào một nhiệm vụ
- Sử dụng các components có sẵn (Button, Input, Modal, Card, Table)
- Handle loading và error states

---

### BƯỚC 8: Tạo Page Component

**📍 Location:** `src/pages/[PageName].tsx` hoặc theo module con, ví dụ `src/pages/productV2/[Feature]/index.tsx` (đặt page gần feature, export default cho `React.lazy`).

**Mục đích:** Tạo page component chính cho feature

**Cấu trúc:**

```typescript
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useUsers } from '@/hooks/useUsers';
import UserList from '@/components/UserList';
import UserForm from '@/components/UserForm';
import Modal from '@/components/Modal';
import Button from '@/components/Button';

const Users: React.FC = () => {
  const { t } = useTranslation();
  const { createUser, updateUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingUserId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingUserId(id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    const ok = editingUserId
      ? await updateUser(editingUserId, data)
      : await createUser(data);
    if (ok) {
      setIsModalOpen(false);
      setEditingUserId(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Users - React Boilerplate</title>
        <meta name="description" content="Users management page" />
      </Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{t('pages.users')}</h1>
          <Button onClick={handleCreate}>Create User</Button>
        </div>

        <UserList />

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingUserId(null);
          }}
          title={editingUserId ? 'Edit User' : 'Create User'}
        >
          <UserForm
            userId={editingUserId}
            onSuccess={() => setIsModalOpen(false)}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      </div>
    </>
  );
};

export default Users;
```

**⚠️ Lưu ý:**

- Luôn sử dụng `Helmet` cho SEO
- Sử dụng `useTranslation` cho i18n
- Handle loading, error states
- Sử dụng các components có sẵn
- **Form trong page** phải dùng `react-hook-form` + `zod` (xem [Forms & Validation](#forms--validation-react-hook-form--zod)) — không tự `useState` form values / errors / submitting.
- Sau khi gọi `createUser` / `updateUser` từ hook (BƯỚC 6), chỉ đóng modal / reset UI khi hàm trả về `true` (thunk fulfilled).

### BƯỚC 9: Thêm Route

**Mục đích:** Đăng ký URL cho page mới.

**📍 Cây route thật trong repo:** `src/routes/index.tsx` — export `routes` (mảng `RouteObject[]`). `App.tsx` **không** khai báo từng `Route`; chỉ gọi `useRoutes(routes)`.

#### 9a. Trang gốc (`/`, `Layout` cũ)

Thêm `RouteObject` vào nhánh `path: '/'` trong `src/routes/index.tsx` (lazy import, `ProtectedRoute` / `Outlet` giống pattern sẵn có).

```typescript
// Lazy load page
const Users = React.lazy(() => import('@/pages/Users'));

// Trong routes: children của layout '/', ví dụ
{ path: 'users', element: <Users /> }
// hoặc bọc ProtectedRoute + Outlet theo nhóm route hiện tại
```

**⚠️ Lưu ý:**

- Lazy loading cho page components
- `ProtectedRoute` khi cần đăng nhập / role
- Path string nên thống nhất với constants trong `src/constants/index.ts` (`ROUTES`, …) nếu có

#### 9b. Trang trong App Shell V2 (`/v2`, `LayoutV2`)

Luồng product / UI mới dùng **`LayoutV2`** (sidebar `NavigationMenuSection` + `HomeHeaderSection` + vùng scroll nội dung).

1. **`src/routes/v2/userRoute.tsx`** — Thêm `children` (path **relative** tới `/v2`, không ghi tiền tố `/v2`):

```typescript
const MyPage = React.lazy(() => import('@/pages/productV2/MyFeature'));

// trong userRoute.children, cùng cấp các route 'products', …
{ path: 'my-feature', element: <MyPage /> },
```

URL đầy đủ sẽ là `/v2/my-feature`. Các route được bọc bởi `element: <LayoutV2><Outlet /></LayoutV2>` như đã cấu hình trong `userRoute`.

2. **`src/routes/v2/appShellRoutes.ts`** — Khi page cần **hiện trên sidebar**, **tiêu đề header**, và/hoặc hàng **Filters / Search** hoặc **quick filter** giữa header:

- Thêm một object vào `APP_SHELL_ROUTES` kiểu `AppShellRoute`:

| Field | Ý nghĩa |
| ----- | ------- |
| `to` | **Full path** khớp `location.pathname` (ví dụ `'/v2/my-feature'`) |
| `label` | Chữ trên sidebar |
| `headerTitle` | Tiêu đề trong `HomeHeaderSection` |
| `icon` | Icon Lucide (import từ `lucide-react`) |
| `showInSidebar` | `true` nếu mục xuất hiện trong menu |
| `sidebarOrder` | Thứ tự sort (số nhỏ lên trước) |
| `showHeaderFiltersRow` | Hiện nút Filters + Search bên phải header |
| `showQuickFilter` | Hiện nhóm quick filter (All / Men / Women) giữa header |

- `getCurrentRoute(pathname)` đang **match đúng** chuỗi `to` (không prefix). `to` phải trùng URL thực tế khi user vào page.

3. **Re-export:** `src/components/layout/navigationMenuData.ts` re-export `APP_SHELL_ROUTES` / `SIDEBAR_NAV_ITEMS` — có thể import từ `@/routes/v2/appShellRoutes` hoặc từ `navigationMenuData` tùy chỗ dùng trong codebase.

---

### BƯỚC 10: Thêm i18n Translations (Optional)

**📍 Location:** `src/constants/locales/en.json` và `vi.json`

**Mục đích:** Thêm translations cho feature

**Cấu trúc:**

```json
// en.json
{
  "pages": {
    "users": "Users Management",
    "users.create": "Create User",
    "users.edit": "Edit User"
  },
  "common": {
    "save": "Save",
    "cancel": "Cancel"
  }
}

// vi.json
{
  "pages": {
    "users": "Quản Lý Người Dùng",
    "users.create": "Tạo Người Dùng",
    "users.edit": "Chỉnh Sửa Người Dùng"
  },
  "common": {
    "save": "Lưu",
    "cancel": "Hủy"
  }
}
```

---

## Tham chiếu trong repo (end-to-end)

Ưu tiên đọc code thật thay vì copy mẫu tổng hợp. Các đường dẫn sau khớp workflow (types → constants → service → thunks → slice → domain hook → `src/forms/<Feature>/` → page → route):

| Luồng | File / thư mục |
| ----- | -------------- |
| **Form CRUD chuẩn** (`src/forms/`) | `src/forms/AdminProductV2/`; `src/pages/AdminProductV2/`; `src/hooks/product/useProducts.ts`; `src/hooks/storage/useImageUpload.ts`; `src/utils/formFields.ts` |
| Profile + địa chỉ, `profileForm.ts` | `src/pages/user/ProfileV2/profileForm.ts`, `sections/`, `index.tsx`; `src/hooks/user/useProfile.ts` |
| Auth | `src/hooks/auth/useAuth.ts`; `src/pages/auth/Login.tsx` hoặc `src/pages/authV2/LoginV2/` |
| Route `/` và `/v2`, shell | `src/routes/index.tsx`; `src/routes/v2/userRoute.tsx`; `src/routes/v2/appShellRoutes.ts` |

Chi tiết từng bước: [Chi Tiết Từng Bước](#chi-tiết-từng-bước).

---

## ✅ Best Practices

- **Types & lỗi:** Type trước khi implement; tránh `any`; lỗi HTTP xử lý ở thunk; **toast chỉ trong custom hook** (BƯỚC 6), không trên page; `react-hot-toast`.
- **Cấu trúc:** Một file ~ một trách nhiệm; barrel `index.ts` khi hợp lý.
- **Hiệu năng:** Lazy load page; `useCallback` / `useMemo` khi cần.
- **Test, a11y, i18n:** Ưu tiên test service + thunk; HTML ngữ nghĩa, keyboard; chuỗi UI qua `useTranslation`.
- **Tailwind & form:** Không lặp chi tiết — tuân [Tailwind & Design System](#tailwind--design-system-quy-tắc-cho-ai) và [Forms & Validation](#forms--validation-react-hook-form--zod).

## 📋 Checklist

Khi implement một feature mới, đảm bảo:

- [ ] Đã định nghĩa types trong `src/types/`
- [ ] Đã export types trong `src/types/index.ts`
- [ ] Đã thêm API endpoints vào `src/constants/index.ts`
- [ ] Đã tạo service trong `src/services/`
- [ ] Đã tạo thunks trong `src/store/thunks/`
- [ ] Đã export thunks trong `src/store/thunks/index.ts`
- [ ] Đã tạo slice trong `src/store/slices/`
- [ ] Đã đăng ký slice trong `src/store/index.ts`
- [ ] Đã tạo custom hook trong `src/hooks/` (hoặc `src/hooks/<domain>/`) — **bắt buộc** khi page gọi thunk có toast/feedback; hook bọc `dispatch` + `fulfilled`/`rejected` + toast, page giữ form + UI state
- [ ] Đã tạo components trong `src/components/`
- [ ] Đã tạo page trong `src/pages/` (hoặc module con như `src/pages/productV2/...`)
- [ ] Đã đăng ký route: `src/routes/index.tsx` (trang `/`) và/hoặc `src/routes/v2/userRoute.tsx` (trang `/v2/...`)
- [ ] Với trang trong shell V2: nếu cần sidebar / tiêu đề header / Filters / quick filter — đã thêm (hoặc cập nhật) entry trong `src/routes/v2/appShellRoutes.ts` với `to` khớp chính xác URL
- [ ] Đã thêm i18n translations
- [ ] Đã test feature hoạt động đúng
- [ ] Đã handle loading và error states
- [ ] Code đã pass linting và type checking
- [ ] UI dùng token Tailwind / design system (`docs/TAILWIND_DESIGN_SYSTEM.md`, `tailwind.config.js`)
- [ ] Form CRUD: folder `src/forms/<Feature>/` (`types`, `schema`, `mapper`, `hooks/`, `components/`, `index.tsx`) theo `AdminProductV2`; page mỏng chỉ import form component
- [ ] Form: `useForm` + `zodResolver`; schema/mapper không React; field ngoài RHF (media) = hook riêng; upload ảnh = `useImageUpload`; parse chung = `@/utils/formFields`
- [ ] Không `useState` cho values/errors/submitting; không toast/dispatch thunk trong page khi đã có domain hook
- [ ] Đã chạy `graphify update .` sau khi sửa code (đồng bộ `graphify-out/`)

---

## 🔗 Tài Liệu Tham Khảo

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Hooks Documentation](https://react.dev/reference/react)
- [React Hook Form](https://react-hook-form.com/) — form library bắt buộc trong repo
- [Zod](https://zod.dev/) — schema validation tích hợp qua `@hookform/resolvers/zod`
- Design system trong repo: `docs/TAILWIND_DESIGN_SYSTEM.md`, `tailwind.config.js`, `src/constants/colors.ts`
- Đồ thị codebase: `graphify-out/GRAPH_REPORT.md`, lệnh `graphify update .`

---

**Lưu ý:** Điều chỉnh linh hoạt theo feature; giữ nhất quán với code hiện có và [Tham chiếu trong repo](#tham-chiếu-trong-repo-end-to-end).
