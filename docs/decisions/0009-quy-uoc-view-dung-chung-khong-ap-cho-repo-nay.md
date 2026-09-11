# ADR-0009 · Bộ quy ước view dùng chung phần lớn KHÔNG áp cho repo này

> **Ngày:** 2026-09-11
> **Trạng thái:** accepted
> **Liên quan:** [`docs/code-conventions.md`](../code-conventions.md) · bất biến #2 · bất biến #5

## 1. Bối cảnh

Workspace `web-game` có một bộ quy ước code dùng chung, rút từ
`quapp-developer-frontend` và đã áp thật vào tám repo khác. Repo này là repo thứ chín
được xét, và nó là repo đầu tiên cho thấy bộ rule đó **có biên**.

Bản canon ban đầu chia workspace thành hai cột, Next và Vite, rồi xếp `duck-stomp` vào
cột Vite. Điều đó đúng về công cụ build và **sai về hình dạng code**: repo này không
có một file `.tsx` nào. Màn hình của nó là `Phaser.Scene` trong `src/game/scenes/`,
không phải cây component React.

## 2. Quyết định

**Ghi ➖ (không áp dụng) cho mọi rule nói về component React**, chứ không bịa ra một
tầng để có chỗ áp: R-02 (tầng routing gọi view), R-03 (`mains`/`components`), R-04
(`ghosts`), R-05 (một component một thư mục), R-09 (destructure props), R-10, R-16
(props inline), R-18 (barrel hook). Repo không có component, không có props, không có
hook.

**Áp những rule không phụ thuộc React** — và kiểm thì thấy repo **đã** thoả sẵn:

| Rule | Trạng thái ở đây |
| --- | --- |
| R-01 mỗi vai trò một thư mục | đã đúng: `core/` là TS thuần có test, `game/` là tầng Phaser |
| R-06 đặt tên | đã đúng: `GameScene.ts` PascalCase cho class, `levelLoader.ts` camelCase cho module |
| R-07 test cạnh source | đã đúng: 8 file test, tất cả trong `core/` |
| R-19 · R-20 ranh giới hạ tầng | đã đúng, và **gác chặt hơn** các repo Next: `scripts/check-core-boundary.mjs` chặn `core/` import Phaser, import `game/`, **và** đọc `Date.now()`/`performance.now()` — luật `no-restricted-imports` ở các repo khác không bắt cái cuối |
| R-13 alias `@/` | ➖ — import sâu nhất là `../../core/x`, hai cấp. Thêm alias ở đây là thêm cấu hình cho một vấn đề không có |
| R-22 pre-commit | **thêm mới** — xem dưới |

**Việc duy nhất thay đổi code:** thêm `.githooks/pre-commit`, chạy `yarn lint:core` rồi
`tsc --noEmit`. Không chạy ESLint vì repo không có ESLint, và cũng không cần: thứ gác
kiến trúc ở đây là `check-core-boundary.mjs`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Dựng `src/views/` cho các Scene | Scene của Phaser không phải component. Đổi `game/scenes/` thành `views/` chỉ đổi tên một khái niệm đã đúng, và làm người đọc tưởng ở đây có React |
| Bọc Phaser trong một component React để "có tầng view" | Thêm một framework vào một game không cần nó, để một bảng trạng thái đủ ✅. Đây là cái giá cao nhất trong danh sách này |
| Dựng ESLint để áp R-12/R-21 | `check-core-boundary.mjs` đã gác đúng hai bất biến mà repo này quan tâm, và nó bắt được thứ ESLint không bắt. Thêm ESLint là thêm một cổng thứ hai cho cùng một việc |
| Ghi ✅ cho các rule React vì "không vi phạm" | Không vi phạm và không áp dụng là hai chuyện khác nhau. Ghi ✅ sẽ làm người đọc bảng tin rằng repo này có tầng view |

## 4. Hệ quả

**Được:**
- Bản canon của workspace được sửa: giờ nó mô tả **ba** hình dạng project, và nói rõ
  rule nào không áp cho cột thứ ba. Repo tiếp theo kiểu này không phải xét lại từ đầu.
- Repo có thêm một cổng gác lúc commit, dùng đúng công cụ nó đã có.

**Mất / phải chấp nhận:**
- Repo này không được lợi gì từ phần lớn bộ rule, nên người quen `duck-caro` mở
  `duck-stomp` vẫn phải học lại cây thư mục. Đó là hệ quả của việc chọn Phaser, không
  phải của quyết định này.
- `pre-commit` chạy `tsc` trên cả project. Nhanh, nhưng nó sẽ chậm dần theo repo.
