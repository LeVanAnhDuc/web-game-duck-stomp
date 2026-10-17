# WORLDMAP — Quyết định

Đi cặp với `docs/requirements/world-map.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-02), `docs/01-product/journeys.md` (US-01 bước 3, US-02 bước 2),
  `docs/decisions/0011-locked-node-stays-selectable-cta-refuses-visibly.md`,
  `docs/specs/touch-controls-and-locked-start/design.md`, `README.md` §Features + §Controls ("Menus: ← → to move,
  Enter or Space to choose").
- **Code:** `client/src/game/scenes/WorldMapScene.ts` (layout, `select`, `enter`, `step`), `client/src/core/progress.ts`
  (`isUnlocked` chỉ nhìn màn liền trước, `totalCoins`), `client/src/core/scoring.ts` (`formatTime`).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Một tap chọn, tap thứ hai vào" (comment trong `WorldMapScene`) được hiểu là: bấm node chỉ chọn, vào màn
  bằng START. Bấm node lần hai **không** vào màn — code không làm thế và không tài liệu nào hứa thế.
- **Q2** Node khoá được chọn bằng chuột ở module này; bản chạm (tap) của cùng hành vi nằm ở module `touch`
  (TC-TOUCH-004, từ bộ cũ).
- **Q3** Số xu trên thẻ và trên thanh trên là số **tốt nhất** đã lưu (`coins` của save), không phải tổng xu của màn —
  US-01 nói "số xu đã lấy trên tổng số xu của màn" là về bảng tổng kết (module `level-complete`).
- **Q4** Vòng chọn đổi màu khi chọn node khoá (vàng → `--locked`) là chi tiết thị giác; test kiểm trạng thái START
  (`enabled`) và chữ trên thẻ, không đo màu.

## Tài khoản test

Không có tài khoản. Save gieo bằng `GamePage.seedSave`.

## Ngoài phạm vi

- Hoạt ảnh đường đi tự vẽ khi mở màn mới — module `accessibility` (giảm chuyển động) và `level-complete` (MAP sau khi xong).

## Tech debt liên quan

_(không có)_
