# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟡 một phần — §Đang làm và §Nợ đã thật; §Việc tiếp theo chưa gắn FR vì scope.md còn 🔴
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** bắt đầu/kết thúc một việc · brainstorm ra việc mới · cố ý đi đường tắt

<!-- CÁCH ĐIỀN
Mục "Đang làm" là chỗ một phiên làm việc MỚI đọc đầu tiên. Giữ nó ngắn: đang làm
gì, dừng ở bước nào, cái gì đang chặn. Cập nhật nó TRƯỚC KHI DỪNG phiên, không
phải sau.

Mục "Nợ kỹ thuật" chỉ ghi thứ CỐ Ý làm tạm, và ghi NGAY LÚC ĐÓ. Bug thì không
thuộc đây. Việc chưa làm cũng không — đó là mục 2.

KHÔNG chứa: tính năng ngoài phạm vi (-> 01-product/overview.md §Non-Goals).
-->

## Đang làm

**Brainstorm thiết kế game — chưa có một dòng code nào, chưa có `package.json`.**

Đã chốt qua đối thoại (mỗi cái có ADR): thể loại platformer hướng Mario · 6 màn
tay-thiết-kế · static 100%, không backend, localStorage · desktop và cảm ứng ngang
hàng · bắt buộc màn hình ngang · đúng 2 điều khiển khi chơi · 3 tim + nấm đổi sprite
cho năng lực phá khối · bản đồ thế giới cách điệu dùng lại pack · SFX không nhạc ·
Phaser 3.90 + Arcade + Tiled + TypeScript + Vite + npm.

`design-bootstrap` đã chạy đủ 3 bước → `docs/design-system/platformer/MASTER.md`
(🟡) + ADR-0002. Wireframe ASCII 4 màn hình đã được duyệt trong hội thoại.

**Dừng ở bước:** canvas mockup đã dựng và đã lưu — 16 artboard (5 màn hình × 3 khổ
`667×375 · 1024×768 · 1440×900`, cộng màn chặn xoay 375×667 chỉ có một bản).
File nguồn ở `.design/*.dc.html` + `canvas.json`; mọi lần sửa là seed lại từ đó.
**Đang chờ người dùng duyệt.** Mockup được duyệt **là** cổng duyệt của
brainstorming, không có cổng thứ hai — duyệt xong mới viết `design.md` và `plan.md`.

Đã chốt thêm trong lúc dựng mockup: nhãn UI **tiếng Anh, toàn ASCII** (ADR-0005 —
font pixel không có glyph tiếng Việt có dấu thanh); thang chữ của `MASTER.md` là
thang ở **zoom 2**, tablet ×1.5 và desktop ×2. Tên game `RUNUP` chỉ là **đề xuất**,
chưa chốt.

**Đang chặn:** chưa tải pack **Pixel Adventure (Pixel Frog)** — CC0 đã xác nhận từ
trang gốc, nhưng itch.io tải qua luồng trình duyệt. Chưa tải thì chưa sample được
palette thật và chưa xác nhận được kích thước tile.

**Chưa viết:** `docs/specs/<feature>/design.md`, `plan.md`, và 4 file tier-1 còn 🔴
(`overview.md` §Non-Goals đã có nội dung để điền — xem §Việc tiếp theo).

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Tải pack Pixel Adventure 1 + 2, đối chiếu với danh mục địch/hazard/khối đã thiết kế | ADR-0002 | cao | Chặn hai mục 🟡 của `MASTER.md`, và có thể chặn cả thiết kế nếu pack thiếu địch gai hoặc địch bay |
| Canvas mockup 5 màn hình × 3 khổ, rồi xin duyệt | — | cao | Là cổng duyệt của brainstorming. Bố cục quyết định file nào mỗi task chạm, nên `writing-plans` phải chờ nó |
| Điền `overview.md` — §Non-Goals đã có 5 mục bị từ chối có lý do | — | cao | File này là nơi duy nhất chặn scope creep, và đang 🔴 |
| Cấp `FR-xx` trong `scope.md` + `US-xx` trong `journeys.md` | — | cao | Không có ID thì ADR, commit và test không tham chiếu được gì |
| Rà `nfr.md`: xoá phần Security/Data/PII và các ngưỡng endpoint/migration | — | trung bình | Không có server, không có DB, không có PII. Giữ nguyên là để lại tài liệu **sai**, không phải tài liệu thừa |
| Thêm 3 bất biến riêng vào `invariants.md`; xoá 9 bất biến mặc định về server/ORM | — | trung bình | Bất biến thật của dự án này: phóng pixel số nguyên · `core/` không import `phaser` · không hình khối màn chơi trong code · save luôn có `version` |
| Đo bundle Phaser thật rồi mới đặt ngưỡng thời gian tải ở `nfr.md` | ADR-0001 | trung bình | ADR-0001 ghi rõ con số này chưa đo |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| `MASTER.md` §Palette | 9 token màu chốt **trước khi** sample palette thật của pack | Pack tải qua luồng trình duyệt nên chưa có; chặn ở đây thì cả bước design đứng. Palette là lựa chọn thiết kế độc lập, chỉ cần kiểm hoà sắc sau | Ngay sau khi tải pack. Lệch thì sửa **token**, không sửa sprite |
| `MASTER.md` §Lưới pixel | Base `320×180` chọn theo lý do phóng-số-nguyên, chưa biết tile pack bao nhiêu px | 320×180 phóng nguyên lên 640×360/960×540/1280×720 nên đúng bất kể tile size; chỉ số tile nhìn thấy là chưa chắc | Ngay sau khi tải pack, trước khi vẽ màn đầu tiên trong Tiled |
| `docs/01-product/glossary.md` | Để ⚪ chưa áp dụng | Chưa có code nên chưa có cặp "tên nghiệp vụ ↔ tên trong code" nào để khoá | Khi `core/` có module đầu tiên |
