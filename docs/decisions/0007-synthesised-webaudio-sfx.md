# ADR-0007 · SFX tổng hợp bằng WebAudio, không dùng file âm thanh

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** FR-17 · NFR-PERF-08 · ADR-0006

## 1. Bối cảnh

Brainstorm chốt "SFX thôi, không nhạc", và định lấy SFX từ pack CC0. Nhưng cùng lý
do như ADR-0006, không lấy được file từ luồng trình duyệt của itch.io — và ở đây
vấn đề nặng hơn: một pack SFX CC0 khớp phong cách phải **đi tìm và nghe thử**, chứ
không chọn được bằng cách đọc mô tả.

Sáu tiếng cần có đều là tiếng arcade đơn giản: nhảy, ăn xu, đạp địch, mất tim, phá
khối, xong màn.

## 2. Quyết định

`game/audio` tổng hợp SFX trực tiếp bằng **WebAudio**: oscillator vuông/tam giác +
envelope ngắn, mỗi tiếng dưới 300ms. Sáu tiếng, mỗi tiếng vài dòng số.

Đây không phải giải pháp tạm — với chip-tune SFX nó **đúng** hơn là file wav: cùng
chất 8-bit, 0 byte tải, và sửa cao độ là sửa một con số thay vì đi tìm file khác.

AudioContext khởi tạo ở cú bấm **PLAY** trên màn Title — đó là cửa duy nhất mọi
người chơi đi qua, nên không cần cơ chế "chạm để bật tiếng" riêng.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Pack SFX CC0 (Kenney Audio…) | Không tải được từ dòng lệnh, và chọn SFX cần nghe. Cũng thêm dung lượng tải cho thứ WebAudio làm được miễn phí |
| Không có âm thanh | Đã bị loại từ lúc brainstorm — SFX là phần juice rẻ nhất mà hiệu quả cao nhất |
| Thư viện chip-tune (howler + jsfxr…) | Thêm dependency cho sáu tiếng. Phaser đã có WebAudio; jsfxr sinh ra wav rồi mới phát, tức là vòng vo hơn |

## 4. Hệ quả

**Được:**
- 0 byte asset âm thanh; giúp NFR-PERF-08
- Không phụ thuộc pack nào, nên FR-17 không bị chặn bởi ADR-0006
- Sửa một tiếng là sửa một con số, không phải thay file

**Mất / phải chấp nhận:**
- Sáu tiếng sẽ đơn giản hơn SFX thu sẵn. Chấp nhận — thẩm mỹ 8-bit hợp với nó
- `AudioContext` bị chặn hoặc không hỗ trợ → phải im lặng gọn gàng, không crash.
  Đây là một nhánh phải test, không phải giả định
- Không có nhạc nền, và quyết định này không mở đường cho nhạc: nhạc vẫn là Non-Goal

**Điều kiện xem lại:** muốn thêm nhạc nền (phải sửa Non-Goal ở `overview.md`
trước), hoặc SFX tổng hợp nghe tệ trên máy thật đến mức người chơi tắt tiếng.
