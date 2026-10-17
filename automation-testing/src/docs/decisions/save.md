# SAVE — Quyết định

Đi cặp với `docs/requirements/save.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-14), `docs/01-product/journeys.md` (US-01 "localStorage bị chặn",
  US-02 "save cũ / bị sửa tay"), `docs/02-requirements/nfr.md` (NFR-REL-02/04/05, NFR-DATA-03),
  `docs/03-design/invariants.md` (#4), `docs/specs/core-game/design.md` §6, `README.md` ("Progress lives in
  `localStorage` on the player's own machine").
- **Code:** `client/src/core/storage.ts` (`SAVE_KEY`, `loadSave`, `browserStorage`), `client/src/game/saveStore.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Migrate save (NFR-DATA-03): mới có một version, chưa có đường migrate nào chạy được — `loadSave` hiện từ chối
  mọi version khác 1. Kiểm "version lạ → như chưa có save" (REQ-SAVE-03); migrate thật kiểm khi có version 2.
- **Q2** "Chặn localStorage" được dựng bằng cách cho getter `window.localStorage` ném `SecurityError` trước khi trang
  chạy — đúng cách Safari riêng tư / site data bị chặn hành xử.
- **Q3** "Không hiện lỗi kỹ thuật" = không `pageerror`, không `console.error` từ game, và game vẫn vẽ đúng các màn —
  game không có chỗ nào hiện chữ lỗi.
- **Q4** NFR-REL-02 (ghi lại cùng trạng thái không đổi kết quả) đã có unit test ở `client/src/core/storage.test.ts`.

## Tài khoản test

Không có tài khoản. Save gieo bằng `GamePage.seedSave` (chuỗi thô cho save hỏng).

## Ngoài phạm vi

- localStorage đầy (quota) — cùng nhánh `catch` với bị chặn; không dựng được ổn định trong Chromium headless.

## Tech debt liên quan

_(không có)_
