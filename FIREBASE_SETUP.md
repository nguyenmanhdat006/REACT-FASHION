# Hướng dẫn cấu hình Firebase

## 🔧 Trạng thái hiện tại

Dự án đã được cấu hình để **hoạt động mà không cần Firebase key thật**. File `.env` đã được tạo với các giá trị placeholder.

## ✅ Đã hoàn thành

1. ✅ File `.env` đã được tạo với các giá trị giả
2. ✅ Code đã được cập nhật để xử lý khi Firebase chưa được cấu hình
3. ✅ Ứng dụng sẽ hiển thị thông báo thân thiện thay vì crash khi Firebase chưa được setup

## 🚀 Sử dụng với Firebase giả (hiện tại)

Ứng dụng sẽ:

- ✅ Chạy được mà không cần Firebase key thật
- ✅ Hiển thị thông báo khi người dùng cố gắng đăng nhập: "Firebase is not configured"
- ✅ Không bị crash hay lỗi

## 🔑 Cấu hình Firebase thật (khi cần)

Khi bạn đã có Firebase project, làm theo các bước sau:

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Điền tên project và làm theo hướng dẫn

### 2. Lấy Firebase Config

1. Vào **Project Settings** (⚙️ icon)
2. Scroll xuống phần **Your apps**
3. Click icon **Web** (`</>`)
4. Đăng ký app với nickname (ví dụ: "React Boilerplate")
5. Copy config object

### 3. Cập nhật file `.env`

Mở file `.env` và thay thế các giá trị placeholder:

```env
# Thay thế các giá trị này bằng config thật từ Firebase Console
VITE_FIREBASE_API_KEY=your_actual_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

### 4. Bật Authentication Methods

1. Vào **Authentication** > **Sign-in method**
2. Bật các phương thức bạn muốn sử dụng:
   - ✅ **Email/Password**
   - ✅ **Google** (nếu cần)
   - ✅ **Facebook** (nếu cần)
   - ✅ **GitHub** (nếu cần)

### 5. Khởi động lại Dev Server

Sau khi cập nhật `.env`:

```bash
# Dừng dev server (Ctrl+C) và chạy lại
npm run dev
```

## 📝 Lưu ý

1. **File `.env` không được commit vào Git** (đã có trong `.gitignore`)
2. **Không chia sẻ Firebase keys** công khai
3. **Sử dụng Firebase Security Rules** để bảo vệ dữ liệu
4. **Giới hạn API keys** trong Firebase Console nếu cần

## 🧪 Kiểm tra

Sau khi cấu hình Firebase:

1. Mở ứng dụng: `http://localhost:3000`
2. Thử đăng ký/đăng nhập
3. Kiểm tra console để xem có lỗi không
4. Kiểm tra Firebase Console để xem users đã được tạo chưa

## ❓ Troubleshooting

### Lỗi "Firebase: Error (auth/invalid-api-key)"

- Kiểm tra lại API key trong `.env`
- Đảm bảo không có khoảng trắng thừa
- Khởi động lại dev server sau khi sửa `.env`

### Lỗi "Firebase is not configured"

- Đây là thông báo bình thường khi chưa có Firebase key thật
- Nếu đã có key thật, kiểm tra lại file `.env`

### Lỗi "auth/operation-not-allowed"

- Vào Firebase Console > Authentication > Sign-in method
- Bật phương thức đăng nhập bạn đang sử dụng

---

**Hiện tại**: Ứng dụng đang chạy với Firebase giả và sẽ hiển thị thông báo khi người dùng cố gắng đăng nhập.
