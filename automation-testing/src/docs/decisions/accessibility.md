# ACCESSIBILITY — Quyết định

Đi cặp với `docs/requirements/accessibility.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-A11Y-01…06, NFR-I18N-01/04), `docs/decisions/0002-design-tokens-override-generator.md`
  (trạng thái đổi tức thì), `docs/decisions/0005-english-ascii-ui-strings.md`, `docs/design-system/platformer/MASTER.md`
  (vòng focus vàng), `README.md` §Controls ("Menus: ← → to move, Enter or Space to choose").
- **Code:** `client/src/game/ui.ts` (`Menu`: LEFT/UP/A lùi, RIGHT/DOWN/D/TAB tiến, ENTER/SPACE kích hoạt; `Button.setFocused`
  vẽ vòng focus; `IconButton.setName`), `client/src/game/scenes/WorldMapScene.ts` (`prefers-reduced-motion` bỏ qua
  hoạt ảnh `trailProgress`), `client/src/core/strings.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Focus thấy được" kiểm bằng vòng focus (`ring`) của nút đang focus có được vẽ — màu và tương phản (NFR-A11Y-01)
  là token, đo bằng script trên token, không phải e2e.
- **Q2** Bản đồ không dùng `Menu` (← → đổi node, Enter vào màn) — đã kiểm ở module `world-map`; ở đây chỉ các menu có nút.
- **Q3** "Tên nút biểu tượng" (NFR-A11Y-04 viết "aria-label") trong canvas là tên của đối tượng Phaser (`IconButton.setName`)
  — canvas không có cây accessibility; đó là nơi duy nhất tên tồn tại. Kiểm tên có và đúng chuỗi trong `strings.ts`.
- **Q4** Hoạt ảnh đường đi kéo dài 400 ms; "không bật giảm chuyển động" kiểm bằng `trailProgress < 1` ngay sau khi bản
  đồ mở, "bật" kiểm bằng `trailProgress = 1` ngay lúc đó.
- **Q5** NFR-I18N-04 cho phép tên/email người dùng Ducker ID không ASCII — chúng vẽ bằng DOM, không thuộc các scene
  kiểm ở đây.

## Tài khoản test

Không có tài khoản.

## Ngoài phạm vi

- NFR-A11Y-01 (tương phản) — script trên token; NFR-A11Y-03 (kích thước nút cảm ứng) — module `touch`.

## Tech debt liên quan

_(không có)_
