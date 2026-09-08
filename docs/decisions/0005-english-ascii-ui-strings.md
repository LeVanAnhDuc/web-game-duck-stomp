# ADR-0005 · Chuỗi hiển thị dùng tiếng Anh, toàn bộ ASCII

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** NFR-I18N-01 · NFR-A11Y-04 · ADR-0002

## 1. Bối cảnh

ADR-0002 chốt cặp font pixel `Jersey 15` + `Pixelify Sans`. Khi viết copy cho mockup
mới phát hiện: **không font pixel nào trên Google Fonts có subset `vietnamese`.**

Kiểm bằng CSS gốc của Google Fonts, không suy từ bảng Unicode. Subset `latin-ext`
của cả hai font phủ `U+1E00–1E9F` và `U+1EF2–1EFF`, nhưng **bỏ trống
`U+1EA0–U+1EF1`** — đúng dải chứa gần toàn bộ chữ tiếng Việt có dấu thanh trên
nguyên âm đã có dấu phụ.

Hệ quả cụ thể: `CHƠI` còn glyph (`Ơ` = `U+01A0`, nằm trong `U+0100-02BA`), nhưng
`TẠM DỪNG` mất `Ạ` (`U+1EA0`) và `Ừ` (`U+1EEA`); `chưa mở` mất `Ở` (`U+1EDE`);
`kỷ lục` mất `ụ` (`U+1EE5`). Đây là **hỏng một phần** — kiểu tệ nhất, vì vài chữ
đẹp còn vài chữ rơi sang font fallback, đọc ra như lỗi ngẫu nhiên.

Thiết kế này vốn gần như không có chữ: không màn hướng dẫn, màn chặn xoay là icon,
chú giải điều khiển là ký hiệu. Còn lại khoảng 10 nhãn.

## 2. Quyết định

Mọi chuỗi hiển thị trong game là **tiếng Anh và chỉ dùng ASCII**: `PLAY` ·
`CONTINUE` · `START` · `PAUSED` · `RESUME` · `RETRY` · `MAP` · `LEVEL 3 CLEAR` ·
`TIME` · `COINS` · `BEST` · `NEW BEST`.

Chữ HOA được giữ cho nhãn nút và tiêu đề màn hình — đó là ngôn ngữ của game arcade.

Hội thoại với người dùng vẫn bằng tiếng Việt; đây chỉ nói về chuỗi **trong sản
phẩm**. Chuỗi vẫn đi qua tầng i18n theo `NFR-I18N-01`, nên đổi ngôn ngữ về sau là
thêm một bảng dịch, không phải sửa code.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ tiếng Việt, tự host một font pixel có dấu | Đúng ý nhất, nhưng font pixel phủ `U+1EA0–1EF1` rất ít, phải tự kiểm license, và phải tìm **hai** font đủ hai vai display + UI. Rủi ro không tìm được, và nó chặn cả bước design |
| Đổi sang font có `vietnamese` nhưng không phải font pixel | Phá toàn bộ chất pixel — cái đắt nhất của thiết kế này |
| Tiếng Việt không dấu (`CHOI`, `TAM DUNG`) | Mọi glyph đều có, và đúng chất máy arcade Việt ngày xưa. Nhưng với người không có ký ức đó thì nó chỉ trông như làm tắt |
| Bỏ hết chữ, chỉ icon | Không có vấn đề ngôn ngữ nào cả, nhưng `RESUME` và `RETRY` gần như không phân biệt được bằng hình, và icon không nhãn là rủi ro a11y thật (`NFR-A11Y-04`) |

## 4. Hệ quả

**Được:**
- Mọi font pixel đều dùng được — không còn bị khoá vào một font cụ thể vì lý do glyph
- Nhất quán với quy ước code/identifier/commit tiếng Anh của dự án
- Không cần tải thêm subset font nào, nên nhẹ hơn

**Mất / phải chấp nhận:**
- Người chơi Việt không đọc tiếng Anh phải đoán nghĩa vài nhãn. Giảm nhẹ được vì
  phần lớn giao diện đã là icon và số
- Nếu sau này muốn UI tiếng Việt thì **phải** đổi font, và đổi font là đổi ADR-0002

**Điều kiện xem lại:** tìm được một cặp font pixel phủ `U+1EA0–1EF1` với license
dùng được, hoặc có người chơi thật báo rào cản ngôn ngữ.
