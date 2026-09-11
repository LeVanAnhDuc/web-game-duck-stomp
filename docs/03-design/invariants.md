# Bất biến chịu lực

> **Trả lời:** Sửa gì thì hệ thống sai **âm thầm** — test vẫn xanh mà kết quả vẫn sai?
> **Trạng thái:** 🟢 đủ — đã rà theo dự án
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** phát hiện một bất biến mới — thường là ngay sau khi ai đó vừa phá nó

<!-- CÁCH ĐIỀN
ĐỌC FILE NÀY TRƯỚC KHI SỬA BẤT KỲ DÒNG CODE NÀO.

Bất biến ở đây KHÁC quy ước code. Quy ước format/naming thì ESLint bắt được; bất
biến thì không có công cụ nào bắt, và vi phạm nó thì code vẫn chạy, test vẫn xanh,
chỉ có kết quả là sai.

VIỆC CỦA BẠN: xoá dòng không áp dụng, thêm bất biến riêng của dự án, đổi sang 🟢.

GIỮ FILE NÀY < 40 DÒNG NỘI DUNG. Nó được đọc mỗi lần sửa code; dài ra là không ai
đọc nữa. Thứ gì không thuộc loại "sai âm thầm" thì bỏ ra khỏi đây.

KHÔNG chứa: quy ước format/naming (-> lint config), kiến trúc (-> architecture.md).
-->

Chín bất biến mặc định của scaffold nói về server, ORM, migration và soft-delete —
đã xoá, vì dự án không có thứ nào trong đó. Đây là bất biến thật của **game này**.

| # | Bất biến | Vi phạm thì sao |
| --- | --- | --- |
| 1 | **Độ phóng canvas chỉ là số nguyên.** Base 320×180, phóng ×2 ×3 ×4, letterbox phần dư | Pixel mờ và **rung** khi camera cuộn. Không có test nào đỏ, ảnh chụp vẫn có, chỉ mắt thấy sai |
| 2 | `src/core/` **không import `phaser`** và không import `src/game/` | Mất khả năng unit test cảm giác điều khiển. Mọi lần gọt lại số thành một lần thử tay toàn bộ |
| 3 | **Không có hình khối màn chơi nào trong code.** Màn chơi chỉ sống trong file Tiled | Màn chơi sống ở hai nơi và không ai biết nơi nào đúng. Sửa Tiled không thấy đổi gì |
| 4 | Save trong localStorage **luôn có `version`**, và **không bao giờ đọc save mà không validate** | Save cũ tồn tại trên máy người chơi lâu hơn code. Đọc thẳng thì crash ở người chơi cũ, còn máy dev thì luôn sạch |
| 5 | Máy trạng thái di chuyển nhận **delta time truyền vào**, không tự đọc `Date.now()` hay `performance.now()` | Test viết theo giờ máy vẫn xanh; game chạy khác nhau giữa màn 60Hz và 120Hz |
| 6 | Vòng `update()` **không cấp phát object mới** | GC giật mỗi vài giây. Không lỗi, không log, chỉ cảm giác điều khiển tệ đi ở đúng lúc không nên |
| 7 | `--gold` chỉ dùng cho xu / kỷ lục / CTA / focus; `--heart` chỉ dùng cho máu | Ngữ nghĩa màu vỡ. Người chơi học "vàng = đáng lấy" rồi gặp vàng ở chỗ vô nghĩa |
| 8 | Rơi khỏi màn là **chết ngay, bỏ qua tim** — ngoại lệ duy nhất của luật sát thương | Người chơi rơi xuống vực mà chỉ mất một tim rồi lơ lửng ở đâu đó ngoài màn |
| 9 | Đồng hồ **không reset khi hồi sinh** | Kỷ lục thời gian trở thành vô nghĩa, mà bảng tổng kết vẫn hiện số bình thường |
| 10 | Mọi chuỗi hiển thị **chỉ ASCII** và đi qua bảng khoá | Chữ có dấu rơi sang font dự phòng — hỏng một phần, trông như lỗi ngẫu nhiên |
| 11 | Nút cảm ứng hiện/ẩn theo **input thật đã nhận**, không theo user-agent | Laptop cảm ứng bị đoán sai; nút che màn chơi của người đang dùng bàn phím |
| 12 | Cờ "đã thấy cảm ứng" phải bật được **từ ngoài** cụm nút cảm ứng (pointerdown ở phạm vi scene + `wasTouch`) | Nút ẩn cho tới khi có chạm, mà thứ duy nhất báo có chạm lại là chính mấy nút đang ẩn — vòng tròn tự khoá. Người chơi cảm ứng vào được màn chơi rồi **không nhích một pixel**. Không test nào đỏ, không log nào lỗi (ADR-0010) |
