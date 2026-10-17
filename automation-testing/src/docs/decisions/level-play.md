# LEVELPLAY — Quyết định

Đi cặp với `docs/requirements/level-play.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-03, FR-04, FR-05, FR-10, FR-19), `docs/01-product/journeys.md`
  (US-01 bước 4), `docs/specs/core-game/design.md` §1–§5, `README.md` §Features + §Controls.
- **Code:** `client/src/game/scenes/GameScene.ts`, `client/src/game/scenes/HudScene.ts`, `client/src/game/input.ts`,
  `client/src/game/levelLoader.ts` (`countCoins`), `client/src/core/scoring.ts` (`formatTime`),
  `client/assets/levels/level-{1..6}.json`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Cảm giác điều khiển (tăng tốc, nhảy cao-thấp theo lực giữ, coyote time, jump buffer, phá tường khi đủ đà) là
  vật lý theo khung hình: đã được unit test thuần ở `client/src/core/movement.test.ts`, và design.md §9 cố ý không
  e2e nó. Ở đây chỉ kiểm **hướng** (phải / trái / lên) — điều không phụ thuộc thời gian khung hình.
- **Q2** "Ăn xu" được dựng bằng cách đặt nhân vật lên đồng xu (`GamePage.teleport`): chạm vào là hành vi của game;
  đi tới đó là vật lý (Q1).
- **Q3** Tổng xu N lấy từ **file màn site phục vụ**, đếm như design.md §4 (thường + giấu + khối "?" cho xu) — không
  đọc từ code game, để test không đồng ý với code "theo cấu trúc".
- **Q4** Khối "?" (FR-10), nấm và khối nứt (FR-07), địch (FR-08), bệ di động (FR-09) cần đội / đạp / đâm đúng hướng
  với đúng vận tốc → ngoài phạm vi e2e (Q1). Hệ quả gameplay của chúng (mất tim, hồi sinh) nằm ở module `health`.

## Tài khoản test

Không có tài khoản. Màn 2–6 mở bằng save gieo sẵn (`allCleared`).

## Ngoài phạm vi

- FR-07, FR-08, FR-10 theo Q4. Bệ di động chở người chơi — vật lý.
- NFR-PERF-05/06/09 (60 fps, không cấp phát mỗi frame, bước physics ≤ 50 ms) — đo bằng DevTools, không phải e2e.

## Tech debt liên quan

- FR-07 / FR-08 / FR-10 không có e2e; chỉ unit test phần thuần.
