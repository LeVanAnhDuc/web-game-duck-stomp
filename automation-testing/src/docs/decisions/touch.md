# TOUCH — Quyết định

Đi cặp với `docs/requirements/touch.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-15), `docs/01-product/journeys.md` (US-03 + "Điều gì có thể sai"),
  `docs/decisions/0004-force-landscape-two-controls.md`, `docs/decisions/0010-touch-controls-revealed-by-any-real-touch.md`,
  `docs/decisions/0011-locked-node-stays-selectable-cta-refuses-visibly.md`,
  `docs/specs/touch-controls-and-locked-start/design.md`, `docs/02-requirements/nfr.md` (NFR-A11Y-03, NFR-A11Y-06),
  `docs/03-design/invariants.md` (#11), `README.md` §Controls.
- **Code:** `client/src/game/input.ts` (`sawTouch` từ `pointer.wasTouch`, `sawKey`), `client/src/game/scenes/HudScene.ts`
  (`buildTouchControls`: 72 / 88 px × `s`, lề 16).
- **Test đã gom (gợi ý):** `src/tests/e2e/touch/controls.e2e.ts` (từ `tests/touch-and-locked.spec.ts`) — chuẩn hoá tại
  chỗ, ba case cũ thành TC-TOUCH-002/003/005/008.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Project `app-touch` = Desktop Chrome 667×375 có `hasTouch` (không đổi user agent): đúng tình huống "laptop cảm
  ứng" mà invariant #11 nói tới — nút phải đến từ cú chạm thật, không từ thiết bị.
- **Q2** Giữ ngón tay đi qua CDP `Input.dispatchTouchEvent` (Playwright `touchscreen` chỉ tap được); giữ hai ngón dùng
  hai `touchPoints` cùng lúc.
- **Q3** Kích thước đo bằng toạ độ trang của hình chữ nhật nút (game tự báo) ở khổ 667×375, nơi zoom = 2 và `s` = 1, nên
  72 / 88 px của MASTER.md là px CSS.
- **Q4** "Giữ hai hướng cùng lúc" (US-03): chuyển động khi giữ cả hai do `core/movement` quyết định (unit test); ở đây
  kiểm phần có thể sai âm thầm ở tầng input — nhấc hai ngón thì không hướng nào còn kẹt.

## Tài khoản test

Không có tài khoản.

## Ngoài phạm vi

- Nút cảm ứng mờ "không che màn chơi" — đánh giá thị giác.
- Chơi hết màn chỉ bằng cảm ứng (NFR-A11Y-06) — vật lý; các phần cấu thành (hiện nút, giữ hướng, nhảy) được kiểm riêng.

## Tech debt liên quan

_(không có)_
