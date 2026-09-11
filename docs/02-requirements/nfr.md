# Yêu cầu phi chức năng

> **Trả lời:** Ngưỡng nào áp cho **mọi** feature, để không phải nhắc lại từng lần?
> **Trạng thái:** 🟢 đủ — đã rà theo dự án; các ngưỡng của server/DB đã retire tại chỗ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** thêm loại tài nguyên mới · thêm nhóm người dùng · sau sự cố sinh ra ngưỡng mới

<!-- CÁCH ĐIỀN
Đây là file AI BỎ QUA ÂM THẦM nếu nó trống — code vẫn chạy, test vẫn xanh, và
không có cảnh báo nào. Vì vậy nó được điền sẵn bằng các ngưỡng mặc định hợp lý.

VIỆC CỦA BẠN: đọc một lượt, XOÁ dòng không áp dụng, SỬA con số cho khớp dự án,
rồi đổi trạng thái sang 🟢. Giữ nguyên nguyên văn mặc định cũng được, nhưng phải
là lựa chọn có ý thức.

Mỗi dòng phải ĐO ĐƯỢC. Không viết được cách kiểm thì chưa phải yêu cầu:
  Sai:  "API phải nhanh"      Đúng: "p95 < 300ms cho endpoint đọc"
  Sai:  "phải bảo mật"        Đúng: "mọi mutation kiểm quyền ở server"

ID không tái dùng. Bỏ một ngưỡng thì đổi thành ~~(bỏ)~~, không xoá dòng.
Tài liệu thiết kế của feature tham chiếu ID ở dòng `Liên quan:` — KHÔNG chép nội dung sang.
-->

**Dự án này là một game static, không có server và không có datastore.** Vì thế
phần lớn ngưỡng mặc định của scaffold nói về endpoint, truy vấn và PII đã được
**retire tại chỗ** — giữ số, đánh `(bỏ)`. Giữ nguyên chúng thì tệ hơn là xoá: nó
để lại tài liệu **sai**, và một phiên sau sẽ đi tìm cái server không tồn tại.

## Performance

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| ~~NFR-PERF-01~~ | ~~Phân trang endpoint danh sách~~ **(bỏ)** — không có endpoint nào | — |
| ~~NFR-PERF-02~~ | ~~p95 endpoint đọc/ghi~~ **(bỏ)** — không có endpoint nào | — |
| ~~NFR-PERF-03~~ | ~~Không truy vấn N+1~~ **(bỏ)** — không có datastore | — |
| ~~NFR-PERF-04~~ | ~~Index cho cột filter/sort~~ **(bỏ)** — không có datastore | — |
| NFR-PERF-05 | Giữ **60 fps** trong lúc chơi ở cả ba khổ đã kiểm; không có frame nào > 32ms | Phaser debug FPS + Performance panel, đi hết một màn |
| NFR-PERF-06 | Vòng `update()` **không cấp phát object mới** mỗi frame — không tạo array/object/closure trong đó | review code + Memory panel: sawtooth GC không được xuất hiện khi đứng yên |
| NFR-PERF-07 | Từ mở link tới màn Title chơi được: **≤ 5s** trên profile *Fast 3G*. **Đo 12.09.2026 trên bản đã phát hành (GitHub Pages): 4804 ms** — đạt, dư 196 ms. 342 KB qua 8 request. Cùng phép đo trên bản build ở localhost: 4519 ms | CDP `Network.emulateNetworkConditions` (562.5 ms RTT · 1.6 Mbit/s) rồi chờ `data-scene="Title"`. Cách làm ở `.claude/skills/ux-persona-review/references/canvas-driving.md` §Mạng chậm |
| NFR-PERF-08 | Tổng asset tải lần đầu **≤ 3 MB** đã gzip. **Đo 08.09.2026: 332.81 kB gzip** (1,246 kB raw) — đạt, dư gần 9 lần | `npm run build` in ra số; Network panel để kiểm lại |
| NFR-PERF-09 | Một bước physics **không bao giờ vượt 50ms**, bất kể frame trước cách bao lâu | test tay: chuyển tab đi 30s rồi quay lại, nhân vật không được xuyên sàn |

## Security

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| ~~NFR-SEC-01~~ | ~~Mọi mutation kiểm quyền ở server~~ **(bỏ)** — không có server. Toàn bộ trạng thái nằm trên máy người chơi và **không đáng tin theo thiết kế**; không có gì để bảo vệ khỏi chính họ | — |
| ~~NFR-SEC-02~~ | ~~Không log PII~~ **(bỏ)** — không thu PII nào. Xem NFR-DATA-01 | — |
| ~~NFR-SEC-03~~ | ~~Rate limit đăng nhập~~ **(bỏ)** — không có tài khoản | — |
| NFR-SEC-04 | Không có secret nào trong repo. Dự án này **không cần biến môi trường nào để chạy** | `grep` + `.env.example` giữ trạng thái rỗng có chủ ý |
| NFR-SEC-05 | Dependency không có lỗ hổng mức high trở lên | `npm audit --audit-level=high` |
| ~~NFR-SEC-06~~ | ~~Lỗi trả client không chứa stack trace~~ **(bỏ)** — client-only, không có biên server/client | — |

## Accessibility

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-A11Y-01 | Tương phản chữ ≥ 4.5:1, icon và thành phần UI ≥ 3:1 | script tính WCAG trên token, không ước lượng bằng mắt |
| NFR-A11Y-02 | Mọi hành động ngoài lúc chơi thao tác được bằng bàn phím, focus luôn thấy được | thử tay ở cả 5 màn hình |
| NFR-A11Y-03 | Vùng bấm ≥ 44×44px; nút hướng ≥ 72px, nút nhảy ≥ 88px | đo trên máy thật |
| ~~NFR-A11Y-04~~ | ~~Mọi input có label liên kết~~ → **thay bằng**: mọi nút chỉ có icon phải có `aria-label`; game không có ô nhập text nào | grep `aria-label` trên mọi nút icon |
| NFR-A11Y-05 | Tôn trọng `prefers-reduced-motion`: animation vẽ đường bản đồ bị tắt, vẽ ngay trạng thái cuối | thử tay với flag bật |
| NFR-A11Y-06 | Game chơi được hết chỉ bằng bàn phím, và chơi được hết chỉ bằng cảm ứng. ⚠️ **Nửa cảm ứng từng SAI trên thực tế** tới 12.09.2026 (ADR-0010): nút cảm ứng không bao giờ hiện được. ⚠️ Và có một nhóm mà **cả hai** đường đều không tới được: ai không giữ được hai phím cùng lúc thì không qua hố đầu màn 1 — đo được, ADR-0012 | `tests/touch-and-locked.spec.ts` chạy trong context `hasTouch: true` (nửa cảm ứng, tự động) + đi hết màn 1 bằng bàn phím |

## i18n

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-I18N-01 | Không hardcode chuỗi hiển thị trong code; mọi chuỗi đi qua một bảng khoá duy nhất | grep chuỗi literal trong `src/game/` |
| ~~NFR-I18N-02~~ | ~~Thời gian lưu ở UTC~~ **(bỏ)** — không lưu mốc thời gian nào, chỉ lưu **khoảng** thời gian (ms) | — |
| ~~NFR-I18N-03~~ | ~~Định dạng số/tiền/ngày theo locale~~ **(bỏ)** — chỉ hiện `m:ss` và số nguyên | — |
| NFR-I18N-04 | Mọi chuỗi hiển thị **chỉ dùng ASCII** — font pixel không có glyph tiếng Việt có dấu thanh (ADR-0005) | test tự động: quét bảng chuỗi, fail nếu có codepoint > 127 |

## Reliability

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-REL-01 | Lệnh gọi ra ngoài duy nhất là Google Fonts, và nó **không được chặn gameplay**: font lỗi thì chơi vẫn được bằng font dự phòng | chặn `fonts.googleapis.com` trong DevTools rồi chơi |
| NFR-REL-02 | Ghi save là idempotent: ghi lại cùng trạng thái không đổi kết quả, và không tạo bản ghi trùng | unit test trên `core/storage` |
| NFR-REL-03 | Không có trạng thái loading vô hạn: nạp màn thất bại phải hiện được đường ra (về bản đồ) | test tay với file màn bị xoá |
| NFR-REL-04 | Save hỏng, thiếu trường, hoặc sai `version` → coi như **chưa có save**, không crash và không hiện lỗi kỹ thuật | unit test với 6 payload rác |
| NFR-REL-05 | localStorage bị chặn hoặc đầy → game vẫn chơi được **hết**, chỉ là không lưu | test với storage throw |

## Data & Privacy

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-DATA-01 | **Dự án không thu thập bất kỳ PII nào.** Không tên, không email, không định danh máy, không analytics, không cookie | bảng dưới + review mọi lệnh ghi storage |
| ~~NFR-DATA-02~~ | ~~Xoá tài khoản thì xoá PII~~ **(bỏ)** — không có tài khoản. Người chơi xoá dữ liệu bằng cách xoá site data của trình duyệt | — |
| NFR-DATA-03 | Có đường migrate save khi cấu trúc đổi, và đường đó **đã chạy thật một lần** trong test | unit test migrate từ mọi version cũ lên version hiện tại |

**Trường PII trong dự án này:**

| Trường | Nằm ở | Giữ bao lâu |
| --- | --- | --- |
| _không có_ | — | — |

## Game — riêng của dự án này

| ID | Ngưỡng | Cách kiểm |
| --- | --- | --- |
| NFR-GAME-01 | Độ phóng canvas **luôn là số nguyên**; phần dư letterbox. Không bao giờ có hệ số 2.34× | test tự động trên hàm tính scale với 20 kích thước viewport |
| NFR-GAME-02 | Máy trạng thái di chuyển là **thuần và tất định**: cùng chuỗi input + cùng trạng thái đầu → cùng kết quả, không phụ thuộc thời gian thực | unit test `core/movement` |
| NFR-GAME-03 | Nhảy phản hồi **trong đúng frame** nhận input — không có nhánh nào hoãn sang frame sau | review code + test máy trạng thái |
| NFR-GAME-04 | Thêm một màn chơi **không sửa một dòng code nào** — chỉ thêm file Tiled + một node trên bản đồ | thử thật: thêm màn thứ 7 rồi xoá đi |
