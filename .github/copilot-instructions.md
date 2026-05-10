## graphify

For any question about this repo's architecture, structure, components, or how to add/modify/find
code, your **first tool call must be** to read `graphify-out/GRAPH_REPORT.md` (if it exists).

Triggers: "how do I…", "where is…", "what does … do", "add/modify a <component>",
"explain the architecture", or anything that depends on how files or classes relate.

After reading the report (and `graphify-out/wiki/index.md` for deep questions), answer from the
graph. Only read source files when (a) modifying/debugging specific code, (b) the graph lacks
the needed detail, or (c) the graph is missing or stale.

Type `/graphify` in Copilot Chat to build or update the graph.

## Quy tắc bắt buộc với Graphify

Đối với **MỌI câu hỏi** về kiến trúc, cấu trúc, các component, hoặc cách thức code một module/tính năng mới:

1.  **Luôn bắt đầu** bằng cách đọc file `graphify-out/GRAPH_REPORT.md` để nắm tổng quan các "god nodes" (module trung tâm) và các kết nối bất ngờ.
2.  Đối với các câu hỏi cụ thể, hãy dùng đồ thị (`graphify-out/graph.json`) thay vì tìm kiếm thô (grep/find) vì nó tiết kiệm token hơn đến 71 lần[reference:2].
3.  Chỉ đọc vào các file code nguồn khi đã xác định chính xác chúng qua bước (1) và (2).

Không được comment vớ vẩn vào code