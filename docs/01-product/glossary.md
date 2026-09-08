# Từ điển thuật ngữ

> **Trả lời:** Khái niệm này gọi là gì trong code, và hiện ra sao trên UI?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** xuất hiện một khái niệm nghiệp vụ mới trong code hoặc UI

<!-- CÁCH ĐIỀN
File này KHOÁ CÁCH ĐẶT TÊN. Một khái niệm có đúng một tên trong code và đúng một
tên trên UI. Thiếu nó thì cùng một thứ sẽ có ba tên ở ba chỗ.

KHÔNG chứa: mô tả chức năng (-> 02-requirements/scope.md), luồng (-> journeys.md).
-->

Chuỗi UI **chỉ ASCII và bằng tiếng Anh** (ADR-0005). Hội thoại và tài liệu bằng
tiếng Việt — cột đầu là tên tiếng Việt dùng khi nói chuyện, **không** phải chuỗi
hiển thị.

| Khái niệm (khi nói chuyện) | Tên trong code | Hiện trên UI |
| --- | --- | --- |
| Màn chơi | `level` | `LEVEL 3` |
| Node trên bản đồ | `mapNode` | số `1`…`6` |
| Bản đồ thế giới | `WorldMapScene` | `MAP` |
| Tim / máu | `hearts` | icon tim, không chữ |
| Đồng xu | `coin` | icon xu + `COINS` |
| Xu giấu | `hiddenCoin` | không phân biệt trên UI — cố ý |
| Nấm / vật phẩm tăng năng lực | `powerUp` | không có nhãn, chỉ sprite |
| Dạng mạnh (sau khi ăn nấm) | `poweredForm` | sprite nhân vật khác |
| Khối nứt (phá được ở dạng mạnh) | `crackedBlock` | vết nứt trên khối |
| Khối đội từ dưới | `questionBlock` | dấu `?` |
| Địch đi bộ | `walker` | — |
| Địch có gai, không đạp được | `spiker` | — |
| Địch bay | `flyer` | — |
| Vực (rơi là chết) | `pit` | — |
| Gai tĩnh | `spikes` | — |
| Bệ di động | `movingPlatform` | — |
| Checkpoint giữa màn | `checkpoint` | cột cờ |
| Cờ đích | `goal` | cờ lớn |
| Thời gian tốt nhất | `bestTimeMs` | `BEST 0:42` |
| Kỷ lục mới | `isNewBest` | `NEW BEST` |
| Đạp lên đầu địch | `stomp` | — |
| Thời gian nhảy muộn còn được chấp nhận | `coyoteTimeMs` | — |
| Bấm nhảy sớm trước khi chạm đất | `jumpBufferMs` | — |
| Tăng tốc theo thời gian giữ hướng | `runRamp` | — |
| Hệ số phóng số nguyên | `zoomFactor` | — |
| Màn chặn khi cầm dọc | `RotateGate` | không chữ, chỉ hình |
| Tiến độ đã lưu | `SaveData` | — |
