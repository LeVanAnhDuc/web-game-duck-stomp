# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
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

**Không có việc nào đang dở.** Feature `core-game` đã xong: 19/19 FR ở `scope.md`
là `xong`, và mỗi cái đã được **nhìn thấy chạy trong browser thật**, không chỉ
compile.

Trạng thái kiểm chứng lúc dừng: `npm run verify` xanh — 96 unit test (`core/`),
9 smoke test Playwright trên ba khổ, `tsc` sạch, build 332.81 kB gzip.

Đã chơi và nhìn tận mắt: Title → bản đồ → màn 1 → chạy/nhảy/qua vực → ăn xu →
đội khối `?` → chết ở vực và hồi sinh (đồng hồ **không** reset) → về đích → thẻ
tổng kết có `NEW BEST` → node 2 mở với đường mòn tự vẽ → tạm dừng → cổng xoay màn
ở khổ dọc → nút cảm ứng hiện/ẩn theo input thật. Đo bằng cách lái game:
đạp walker thì nó chết và nhân vật bật lên; rơi lên spiker thì **mất tim mà spiker
sống**; tường nứt có đúng ba kết cục — không nấm thì đặc, có nấm mà chậm thì
`thud`, có nấm và đủ đà thì vỡ.

**Đã phát hành.** Chơi được ở
https://levananhduc.github.io/web-game-duck-stomp/ (kiểm: HTTP 200,
`<title>Duck Stomp</title>`).

**Tên hiển thị đổi từ `DuckStomp` thành `Duck Stomp`** (2026-09-08) — cả họ game
trong workspace dùng dạng `Duck X` có khoảng trắng (Duck Runner, Duck Caro, Duck
Mines, Duck Solitaire, Duck Defense), `DuckStomp` là cái duy nhất viết liền. Slug
repo `web-game-duck-stomp` **không** đổi, nên URL Pages không đổi. Handle debug
`window.duckstomp` giữ nguyên: đó là identifier, không phải tên hiển thị.

Repo đổi tên từ `-web-game-duc-stomp` thành `web-game-duck-stomp` — GitHub giữ
redirect cho tên cũ. **Thư mục local vẫn là `web-game-platformer`**: thương hiệu
đổi, đường dẫn không, và đổi đường dẫn sẽ làm chết mọi link đang trỏ tới.

Ba PR đã merge, remote chỉ còn `main`. Tag: **`v1.0.0`** (note nhóm theo
Conventional Commits) và **`v1.0.1`** (ảnh README). Cả `ci.yml`, `deploy.yml`,
`release.yml` đều đã chạy xanh thật trên `main`, không phải chỉ trên giấy.

Hai cấu hình repo đã bật bằng quyền chủ repo, vì repo cùng họ đều đã có và cái
thứ nhất là điều kiện để CI xanh: **dependency graph** — thiếu nó thì job
`Dependency review` đỏ với đúng thông báo *"Dependency review is not supported on
this repository"* — và **Pages, source = GitHub Actions**, tức bước thủ công
một-lần mà ADR-0008 nói `GITHUB_TOKEN` không làm được.

Ảnh README đã chụp bằng tool của skill `readme-game` trên URL live
(`docs/assets/screenshot.png`, 7KB — pixel art màu phẳng nén rất tốt; tôi đã mở
ra xem chứ không tin con số). `readme_audit.py` giờ báo **OK**: đủ 13 mục.

**Một cái bẫy đã trả giá và đã ghi lại.** `[skip release]` chỉ được đọc từ
**subject của commit trên `main`**. Đặt nó vào tiêu đề PR thì vô tác dụng: PR một
commit thì squash dùng lại message của commit đó. Tôi đã mắc đúng lỗi này ở PR #2
nên `v1.0.1` vẫn được cắt. Quan trọng hơn: **lẽ ra không nên dùng marker ở đó** —
ghi chú của skill `readme-game` nói commit `docs:` tạo một patch release là thiết
kế, marker chỉ dành cho commit docs đi cùng đợt push với một `feat:`. Nên
`v1.0.1` là đúng và được giữ. Cơ chế đã kiểm lại ở PR #3: log job in nguyên văn
`skipped: HEAD subject carries [skip release]` và không có `v1.0.2`.

## Việc tiếp theo

| Việc | Liên quan | Ưu tiên | Vì sao ưu tiên đó |
| --- | --- | --- | --- |
| Tải pack **Pixel Adventure** (+ pack 2) và thay art thật | ADR-0006 | cao | Game đang trông như bản thử. Đây là thứ duy nhất còn giữa "chạy được" và "chơi được cho người khác xem" |
| Sample palette pack rồi rà lại 9 token, gỡ 🟡 của `MASTER.md` | ADR-0002 | cao | Nếu palette pack lệch hue với UI thì phải sửa **token**, không sửa sprite |
| Xác nhận tile pack có đúng 16px; nếu khác thì nền 320×180 và mọi file Tiled phải tính lại | ADR-0006 | cao | Con số này lan ra khắp nơi. Sai thì sửa muộn rất đắt |
| Gọt `core/tuning` trên máy thật (đặc biệt `coyoteTimeMs`, `jumpBufferMs`, `accel`) | FR-03 | trung bình | Số hiện tại là điểm khởi đầu có lý, **chưa hề được cảm nhận bằng tay** |
| Đo NFR-PERF-07 (thời gian tải trên Fast 3G) và NFR-PERF-05 (60fps) | NFR-PERF-05 · NFR-PERF-07 | trung bình | Cả hai còn là **ngân sách**, chưa phải số đo. Bundle thì đã đo rồi |
| Kiểm `prefers-reduced-motion` tắt animation vẽ đường bản đồ | NFR-A11Y-05 | thấp | Có code nhánh đó nhưng chưa bật flag để xem |
| Chơi thử trên điện thoại thật | NFR-A11Y-03 · NFR-A11Y-06 | thấp | Nút 72/88px chỉ mới đo trong DevTools, chưa bằng ngón tay thật |

## Nợ kỹ thuật — cố ý làm tạm

| Chỗ nào | Đã đánh đổi gì | Vì sao chấp nhận | Khi nào buộc phải trả |
| --- | --- | --- | --- |
| `src/game/textures.ts` | Toàn bộ art sinh bằng code, không phải pack thật | itch.io phát hành qua luồng trình duyệt; chặn ở đây thì cả dự án đứng vì một file 204 kB. Mọi texture nằm sau một module nên thay là sửa một chỗ (ADR-0006) | Ngay khi có pack trong `assets/` |
| `MASTER.md` §Palette, §Lưới pixel | 9 token màu và nền 320×180 chốt **trước khi** sample pack | Palette là lựa chọn thiết kế độc lập; chỉ cần kiểm hoà sắc sau | Cùng lúc với việc trên |
| `src/main.ts` — `window.duckstomp` khi `import.meta.env.DEV` | Một cửa debug lộ ra ở bản dev | Mọi thứ trong Phaser nằm trong một canvas, nên từ ngoài không quan sát được scene nào đang chạy. Không có nó thì smoke test chỉ khẳng định được "có một canvas". Bị strip khỏi bản production | Khi có cách quan sát scene mà không cần cửa này |
| `playwright.config.ts` | Smoke test chạy trên **dev bundle**, không phải bản production | Vì lý do trên. Bản production được `npm run build` che (type-check + build, lỗi là chặn cứng) | Nếu từng có lỗi chỉ xuất hiện ở bản production |
| `src/core/tuning.ts` | Mọi con số cảm giác điều khiển là **suy ra, chưa gọt bằng tay** | Chúng có cơ sở (tầm nhảy 4.9 tile khớp với luật vực ≤ 4 tile trong `make-level.mjs`) và test chỉ khoá **quan hệ** giữa chúng, nên gọt lại rẻ | Sau lần chơi thử đầu tiên trên máy thật |
| Không có unit test nào cho `src/game/` | Toàn bộ tầng Phaser chỉ được bọc bởi 9 smoke test + kiểm bằng tay | Có ý thức, ghi ở `design.md` §9: E2E cho physics chập chờn, và test bị tắt tệ hơn test không có. Luật quan trọng nhất (cảm giác điều khiển) đã nằm trong `core/` và có 25 test | Nếu tầng `game/` bắt đầu tự sinh regression |
