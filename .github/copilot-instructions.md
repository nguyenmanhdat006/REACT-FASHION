## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, your **first tool call must be** to read `graphify-out/GRAPH_REPORT.md` (if it exists).

Triggers: "how do I…", "where is…", "what does … do", "add/modify a <component>",
"explain the architecture", or anything that depends on how files or classes relate.

After reading the report (and `graphify-out/wiki/index.md` for deep questions), answer from the
graph. Only read source files when (a) modifying/debugging specific code, (b) the graph lacks
the needed detail, or (c) the graph is missing or stale.

Type `/graphify` in Copilot Chat to build or update the graph.


### 2. KHI AGENT ĐƯỢC YÊU CẦU VIẾT/SỬA CODE
- Trước khi đề xuất thay đổi, **tra cứu graph** bằng cách đọc `GRAPH_REPORT.md` hoặc dùng lệnh:

/graphify query "mô tả chức năng/module cần sửa"

- Nếu thay đổi liên quan đến nhiều hơn 2 file → bắt buộc xác định "god nodes" và "community structure" từ graph để tránh phá vỡ kiến trúc.
- đọc `CODING_GUIDE.md` để hiểu về phong cách code hiện tại của dự án
### 3. SAU MỖI LẦN SỬA CODE (hoặc sau một loạt thay đổi)
- **Luôn chạy** `graphify update .` để cập nhật graph (chỉ quét lại file thay đổi, rất nhanh, không tốn API).
- Nếu lệnh thất bại → cảnh báo người dùng và **dừng lại**, không tự ý bỏ qua.

### 4. XỬ LÝ TRƯỜNG HỢP THIẾU THÔNG TIN TRONG GRAPH
- Nếu graph cũ hoặc không có thông tin về file/module cần sửa → **hãy đọc trực tiếp file đó** và các file import trực tiếp (tối đa 3 file liên quan).
- Sau khi hiểu, **đề xuất chạy `graphify update .`** để đồng bộ.

### 5. KIỂM TRA TÍNH NHẤT QUÁN
- Nếu agent thực hiện nhiều bước sửa code trong cùng phiên làm việc:
- Sau bước 1 → chạy `graphify update .`
- Sau đó mới bắt đầu bước 2 (dùng graph mới).
- **Không được** dùng graph cũ sau khi đã sửa code.

## Ví dụ tương tác đúng
- User: "Thêm chức năng gửi email sau khi đăng ký"
- Agent:
1. Đọc `graphify-out/GRAPH_REPORT.md` → thấy module `auth` phụ thuộc `notification`, `user`.
2. Xác định file cần sửa: `auth/register.py`, `notification/email.py`.
3. Đề xuất thay đổi, chạy test (nếu có).
4. Chạy `graphify update .`
5. Thông báo: "Đã cập nhật graph, bạn có thể kiểm tra tại graphify-out/"

## Lưu ý
- Graphify chỉ dùng AST, không gọi API → **an toàn về chi phí**, có thể chạy thường xuyên.
- Nếu agent thấy graph quá lớn (>10MB), chỉ đọc `GRAPH_REPORT.md` và phần wiki, không đọc toàn bộ `graph.json`.