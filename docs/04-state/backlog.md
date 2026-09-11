# Đang làm · Việc tiếp theo · Nợ

> **Trả lời:** Đang làm gì, tiếp theo làm gì, và đang nợ những gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-12 · commit —
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

**Đã chạy review persona lần đầu, và đã sửa hai lỗi chặn đường nó tìm ra.**

Lần chạy `2026-09-12-0104` chạy trên **bản đã phát hành** (GitHub Pages), không phải
local: 8 phiên (5 Red Route + 2 phiên mù + 1 lần chạy lại RR-01), 46 ảnh có tiền tố
phiên hợp lệ đã qua cổng kiểm. Báo cáo + log thô + ảnh của phát hiện Critical/High
nằm ở `docs/specs/touch-controls-and-locked-start/`.

10 phát hiện: 1 Critical, 3 High, 3 Medium, 3 Low. **Hai cái đã sửa trong PR này**
(ADR-0010, ADR-0011) và có test E2E khoá lại trong context `hasTouch: true`:

- **F-01 (Critical)** — người chơi chỉ có cảm ứng **không nhích được một pixel**. Cụm
  nút cảm ứng ẩn tới khi có chạm, mà thứ duy nhất báo có chạm lại là chính mấy nút
  đang ẩn. Đã thấy tận mắt sau khi sửa: giữ nút phải bằng ngón tay thật, nhân vật đi
  từ x=72 tới x=168. Bất biến **#12** mới ghi lại cái bẫy này.
- **F-03 (High)** — node bị khoá vẫn chọn được với nút START vàng rực, bấm thì im
  lặng hoàn toàn. Giờ thẻ ghi `LOCKED`, ẩn số xu, START thành nút viền vô hiệu.

**Số đo mới, đã vào `nfr.md`:** NFR-PERF-07 = **4804 ms** tới Title chơi được trên
Fast 3G ở host thật (ngân sách ≤5000 ms — đạt, dư 196 ms).

Kiểm chứng lúc dừng: `npm run verify` xanh — 96 unit test, **18** test Playwright
(9 smoke cũ + 9 test mới trên ba khổ), `tsc` sạch, build 332.94 kB gzip.

**Ba cái bị loại có chủ ý, không phải bỏ sót:** F-04 (giữ hai phím) là cái giá của
ADR-0004, đã đo và ghi ở **ADR-0012** thay vì sửa · F-07 (màn chặn xoay) mức
**không chắc** vì persona nhìn ảnh tĩnh nên không thấy được hoạt ảnh `nudge` mà
ADR-0004 chốt — ghi rõ trong báo cáo · F-02/F-05/F-06/F-08/F-09/F-10 cần cổng duyệt
thiết kế, nằm ở §Việc tiếp theo.

---

Trước đó: skill `ux-persona-review` đã cài (PR #9), 5 Red Route duyệt nguyên bản
ngày 12.09.2026, dàn 7 persona cố định. Hai bản sửa tay **mất là hỏng im lặng**:
`tools:` trong `.claude/agents/ux-persona.md` phải liệt kê tường minh và **không**
được có `browser_press_key` (`install.sh --update` sẽ ghi đè lại), và mọi brief
dispatch phải mang theo hai mục §Công thức của `canvas-driving.md`.

---

Trước đó: feature `core-game` đã xong: 19/19 FR ở `scope.md`
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
| **Chạy lại RR-05 cho có dữ liệu** — lần chạy 12.09 **không đo được** nó: persona chưa bao giờ tới được bức tường nứt | RR-05 · FR-05 · FR-07 | **cao** | Đây là chỗ **duy nhất** game dạy bằng bố cục thay vì bằng chữ. Câu hỏi "người chơi có tự hiểu đường chạy dài là lời mời không" vẫn chưa có câu trả lời, và một agent LLM lái game qua từng lời gọi tool không đủ tay để tới đó — cần tay người |
| **Đạp đầu địch: 2/2 persona có vốn platformer dày đều mất 2 tim ở con walker đầu tiên** thay vì giết nó | FR-08 · US-04 | **cao** | Đủ 2 persona để nâng bậc theo `lib/frameworks.md`, nhưng cả hai đều là agent tự canh thời gian nhảy nên dẫn chứng yếu. Ứng cử viên số một cho lần chạy có tay người |
| F-02 (High): ba ký hiệu điều khiển ở Title bị **2/7 persona đọc thành ba cái nút bấm được**; vào màn chơi thì không có nút | FR-01 · ADR-0005 | trung bình | Sau ADR-0010 thì lời hứa đó **được giữ** (chạm một cái là nút hiện). Còn lại là câu hỏi thiết kế: hàng ký hiệu đang vừa dạy phím vừa trông như nút — chọn một. Cần cổng duyệt mockup |
| F-05 (Medium): khi input không ăn, **đồng hồ là thứ duy nhất động** — 3/7 persona đọc nó thành "game đang phản hồi tôi" và đi sâu thêm vào giả thuyết sai | FR-12 | trung bình | Đồng hồ đang kiêm hai việc: đo thành tích, và là dấu hiệu duy nhất cho thấy game còn sống |
| F-07 (mức **không chắc**): màn chặn xoay bị đọc thành "trang bị lỗi" trong ~3 giây | FR-16 · ADR-0004 | trung bình | Hoạt ảnh `nudge` **có thật** trong `index.html`, nhưng persona nhìn ảnh tĩnh nên không thấy được. Phần còn đứng: hai khối chữ nhật viền trơn không nói được "đây là điện thoại". Cần một lần chạy có quay video |
| F-06 (Medium): "mở khoá = tôi đã chơi rồi" — trạng thái node có 3 giá trị mà người chơi chỉ đọc ra 2 | FR-02 | thấp | 1 persona. Thẻ đáy bản đồ là chỗ tập trung lỗi đọc của lần chạy (F-03, F-06, F-08 đều ở đó) |
| F-08 (Low): `BEST` bị negative persona hiểu là bảng xếp hạng · F-09 (Low): chữ số `5` ở cỡ label 12px đọc thành `S`, thấy được ở ảnh của 3 phiên · F-10 (Low): `CONTINUE` bị hiểu là "vào thẳng chỗ tôi dừng" | FR-02 · FR-12 · NFR-A11Y-01 | thấp | Cả ba đều 1 persona. F-09 đáng để ý nhất vì `label` 12px đã là sàn của hệ chữ |
| Quyết chỗ lệch US-04 ↔ dữ liệu: US-04 tả "đã qua checkpoint ở màn 4" nhưng `level-4.json` không có object `checkpoint` nào (cả game chỉ màn 6 có một cái) | US-04 · FR-11 | trung bình | Sửa US-04 hay thêm checkpoint là hai quyết định sản phẩm khác nhau, không phải lỗi code |
| Sửa `.githooks/pre-commit`: nó gọi `yarn lint:core` trong một repo **chỉ dùng npm** (commit 1eb16b8 đã xoá `yarn.lock` vì lý do đó) | — | thấp | Chạy được vì máy này có yarn, nhưng nó dạy sai người đọc kế tiếp. Đã sửa thành `npm run` trong PR này |
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
