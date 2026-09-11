# ADR-0011 · Node bị khoá vẫn chọn được, nhưng CTA từ chối một cách thấy được

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** FR-02 · US-01 · NFR-A11Y-01 · bất biến #7

## 1. Bối cảnh

Trên bản đồ, `enter()` đã có chốt `if (!isUnlocked(...)) return` từ đầu — nhưng là
một `return` **im lặng**. Phía hiển thị thì không có gì đổi: thẻ dưới đáy vẫn ghi
`LEVEL 2 · BEST -- · 0 xu` như một màn bình thường, và nút `START` vẫn vàng rực, vẫn
có khối bóng, vẫn trông bấm được y như khi chọn màn đang mở.

Review persona 2026-09-12: một persona chọn node khoá, bấm, **không có gì xảy ra**,
và bỏ cuộc ngay tại đó. Bằng chứng là hai ảnh liên tiếp giống nhau từng pixel với
một cú bấm ở giữa — khách quan, không phụ thuộc việc persona có nhận ra hay không.

## 2. Quyết định

Node khoá **vẫn chọn được** — xem trước màn tiếp theo là hành vi có giá trị, không
phải lỗi. Cái phải sửa là mọi thứ đang **nói rằng màn đó chơi được**:

- Thẻ đáy hiện `LOCKED` thay cho `BEST --`, và **ẩn** icon xu + số xu. Hai con số đó
  vô nghĩa với một màn chưa ai vào được.
- `START` chuyển sang trạng thái vô hiệu: mặt trong suốt, viền `--locked`, chữ
  `--ink-dim`, bỏ khối bóng, `disableInteractive()`, và `activate()` không làm gì —
  nên cả chuột, cảm ứng và Enter đều bị từ chối như nhau.

Màu lấy từ `MASTER.md`, không tự chọn: `--locked` được định nghĩa đúng cho *"node
chưa mở, thứ bị vô hiệu"*, nhưng chỉ đo được 3.58:1 trên `night` — đủ cho **viền**
(≥3:1), **không** đủ cho chữ. Nên chữ dùng `--ink-dim` (5.52:1 trên `panel`,
NFR-A11Y-01). Không dùng `--gold` cho nút vô hiệu: bất biến #7 khoá vàng cho xu, kỷ
lục, CTA chính và vòng focus.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Không cho chọn node khoá | Mất khả năng xem trước màn sau. Và vấn đề không phải "chọn được", mà là nút START nói dối |
| Hiện thông báo "màn này chưa mở" | Cả game không có một dòng chữ hướng dẫn nào (`overview.md` §4). Một nút vô hiệu đúng chuẩn đã nói đủ mà không cần câu chữ |
| Vẫn để START vàng, chỉ thêm tiếng "từ chối" | Âm thanh không phải kênh duy nhất được: người tắt tiếng, hoặc chưa mở khoá audio, sẽ không nhận được gì |
| Đổi cả vòng chọn cho đậm hơn | Vòng chọn **đã** phân biệt (vàng vs `--locked`). Chỗ hỏng là thẻ và CTA — hai thứ to nhất trên màn hình — nên sửa ở đó |

## 4. Hệ quả

**Được:**
- Một cú bấm bị từ chối giờ **trông** bị từ chối **trước khi** người ta bấm.
- `Button` có trạng thái vô hiệu dùng lại được cho mọi nút về sau.
- Chuỗi `locked` trong bảng khoá — có sẵn từ đầu mà chưa bao giờ được dùng — giờ có
  chỗ dùng. Giá trị đổi `'Locked'` → `'LOCKED'` cho khớp `BEST` / `START` / `PAUSED`;
  vẫn ASCII nên NFR-I18N-04 không đổi.

**Mất / phải chấp nhận:**
- Người chơi xem trước một node khoá không còn thấy `BEST --` và số xu. Không mất gì
  thật: cả hai luôn là `--` và `0` với màn chưa mở.
- Chữ `LOCKED` ở cỡ `label` 12px bị font pixel làm nhập nhằng (`C` đọc gần như `O`) —
  cùng họ với phát hiện F-09 của review. Trạng thái thị giác của nút mới là thứ
  truyền tải chính; chữ chỉ là lớp thứ hai.

**Điều kiện xem lại quyết định này:** nếu bản đồ có thêm loại trạng thái thứ tư (ví
dụ màn có điều kiện mở khác "xong màn trước"), thì thẻ đáy cần một cách hiển thị
trạng thái tổng quát hơn là một chuỗi cố định.
