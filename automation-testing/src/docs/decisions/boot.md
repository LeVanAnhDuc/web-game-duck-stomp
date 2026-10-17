# BOOT — Quyết định

Đi cặp với `docs/requirements/boot.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-01, FR-18), `docs/01-product/journeys.md` (US-01, US-02 + "Điều gì
  có thể sai"), `docs/02-requirements/nfr.md` (NFR-GAME-01, NFR-REL-01), `docs/03-design/invariants.md` (#1),
  `README.md` §Features ("Renders at 320×180 scaled by a whole number").
- **Code:** `client/src/main.ts` (Scale.NONE, resize, `data-scene`), `client/src/core/scale.ts` (`computeScale`),
  `client/src/game/scenes/TitleScene.ts` (PLAY / CONTINUE), `client/src/game/scenes/BootScene.ts` (chờ font tối đa 1,2s),
  `client/src/core/progress.ts` (`hasAnyProgress`, `currentLevel`).
- **Test đã gom (gợi ý):** `src/tests/e2e/boot/title.e2e.ts` (từ `tests/smoke.spec.ts`) — chuẩn hoá tại chỗ.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Bộ cũ chạy mọi spec ở ba khổ; giờ khẳng định phụ thuộc khổ màn hình (bội số nguyên) chạy ở đủ ba khổ trong
  TC-BOOT-005, còn lại chạy một lần ở 667×375 (khổ thiết kế, ADR-0004).
- **Q2** "Không lỗi console" chỉ bỏ qua đúng hai mẫu nhiễu của driver GL (`GL Driver Message`, `.WebGL-0x`) như bộ cũ —
  mọi thứ khác game ghi ra là lỗi.
- **Q3** Chặn Google Fonts bằng `page.route(...).abort()`: BootScene chờ font tối đa 1,2s rồi đi tiếp với font dự phòng,
  nên Title phải tới trong thời gian chờ mặc định.
- **Q4** Đọc chữ vẽ trong canvas (PLAY, CONTINUE, LEVEL n) cần `window.duckstomp` → các case đó gắn `@dev-build`.
  TC-BOOT-001/005/006/007/008 chỉ dùng DOM (`data-scene`, kích thước canvas) và bàn phím nên chạy được cả trên prd.

## Tài khoản test

Không có tài khoản. Save gieo bằng `GamePage.seedSave` (khoá `platformer.save.v1`).

## Ngoài phạm vi

- "Chữ không nhảy bố cục khi font tải muộn" (US-01) — cần so ảnh theo thời gian; thử tay.
- "Bấm nhảy trước khi màn nạp xong" (US-01) — màn nạp đồng bộ trong `create()`; không có khoảng để chen phím.

## Tech debt liên quan

_(không có)_
