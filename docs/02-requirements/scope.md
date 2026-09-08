# Danh mục chức năng

> **Trả lời:** Hệ thống có những chức năng nào, mỗi cái đang ở trạng thái gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** brainstorm ra chức năng mới (cấp FR mới) · một FR chuyển trạng thái

<!-- CÁCH ĐIỀN
Chỉ LIỆT KÊ. Một dòng một chức năng, tên ngắn. Cách làm thuộc tài liệu thiết kế
của feature, không thuộc đây.

ID cấp tăng dần, không tái dùng, không xoá. Bỏ một chức năng thì đổi trạng thái
thành (bỏ) và giữ số — vì commit và test cũ vẫn tham chiếu ID đó.

Trạng thái: chưa · đang · xong · (bỏ)

KHÔNG chứa: cách hiện thực, ngưỡng phi chức năng (-> nfr.md), lý do chọn giải pháp
(-> decisions/).
-->

| ID | Chức năng | Thuộc luồng | Trạng thái |
| --- | --- | --- | --- |
| FR-01 | Màn Title; cú bấm đầu tiên mở khoá âm thanh | US-01 · US-02 | chưa |
| FR-02 | Bản đồ thế giới 6 node; mở khoá tuần tự | US-01 · US-02 | chưa |
| FR-03 | Di chuyển: tăng tốc theo thời gian giữ, nhảy cao-thấp theo lực giữ, coyote time, jump buffer | US-01 · US-03 | chưa |
| FR-04 | Nạp màn chơi từ file Tiled JSON | US-01 | chưa |
| FR-05 | Đồng xu, gồm xu giấu; đếm theo màn | US-01 · US-05 | chưa |
| FR-06 | 3 tim; chạm địch mất tim; hết tim hồi sinh ở checkpoint | US-04 | chưa |
| FR-07 | Nấm → dạng mạnh; phá khối nứt khi đủ đà hoặc rơi từ trên | US-04 · US-05 | chưa |
| FR-08 | Ba loại địch: đi bộ, có gai không đạp được, bay theo quỹ đạo | US-04 | chưa |
| FR-09 | Hazard: vực (chết ngay), gai tĩnh, bệ di động | US-04 | chưa |
| FR-10 | Khối đội từ dưới nhả ra xu hoặc nấm | US-01 | chưa |
| FR-11 | Checkpoint giữa màn | US-04 | chưa |
| FR-12 | Bảng tổng kết màn: thời gian, xu, dấu kỷ lục mới | US-01 · US-02 | chưa |
| FR-13 | Màn tạm dừng | US-03 | chưa |
| FR-14 | Lưu tiến độ vào localStorage, có version và migrate | US-01 · US-02 | chưa |
| FR-15 | Nút cảm ứng; hiện sau cú chạm đầu, ẩn sau phím đầu | US-03 | chưa |
| FR-16 | Bắt buộc màn hình ngang; màn chặn xoay không chữ | US-03 | chưa |
| FR-17 | SFX và nút tắt tiếng | US-01 | chưa |
| FR-18 | Render phóng số nguyên trên nền 320×180, letterbox phần dư | US-01 · US-03 | chưa |
| FR-19 | Sáu màn chơi tay-thiết-kế, mỗi màn dạy thêm một thứ | US-01 | chưa |
