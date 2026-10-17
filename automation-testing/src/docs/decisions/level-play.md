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

- **Q1** Đi tới một chỗ (qua hố, lên bệ) là vật lý theo khung hình và không e2e: test đặt nhân vật tới chỗ cần. Hướng
  (phải / trái / lên) được kiểm bằng phím thật. Cảm giác điều khiển (nhảy theo lực giữ, jump buffer, coyote time) có cả
  unit test ở `client/src/core/movement.test.ts` lẫn e2e ở đây (Q5) — README §Features hứa nó với người chơi.
- **Q2** "Ăn xu" được dựng bằng cách đặt nhân vật lên đồng xu (`GamePage.teleport`): chạm vào là hành vi của game;
  đi tới đó là vật lý (Q1).
- **Q3** Tổng xu N lấy từ **file màn site phục vụ**, đếm như design.md §4 (thường + giấu + khối "?" cho xu) — không
  đọc từ code game, để test không đồng ý với code "theo cấu trúc".
- **Q4** Khối "?" (FR-10), nấm và khối nứt (FR-07), địch (FR-08) có module riêng: `question-blocks`, `power-up`,
  `enemies`. Bệ di động (FR-09) chở người chơi — vật lý, ngoài phạm vi.
- **Q5** Jump buffer (110 ms) và coyote time (90 ms) nhỏ hơn độ trễ của một phím gửi từ tiến trình test, nên cú bấm
  được làm từ bên trong vòng lặp game, trên đồng hồ game (`GamePage.bufferedJump`, `GamePage.coyoteJump`, cùng kiểu
  `jumpRise` cho lực giữ), qua cửa nhập của nút cảm ứng `InputManager.setTouch` — cùng một `InputSnapshot` mà phím đi
  qua. Phím thật đã được TC-LEVELPLAY-004/005 chứng minh. Mỗi case kiểm cả hai phía của cửa sổ thời gian (trong / ngoài)
  và ghi lại thời điểm đo được, để kết quả không đúng "nhờ may".

## Tài khoản test

Không có tài khoản. Màn 2–6 mở bằng save gieo sẵn (`allCleared`).

## Ngoài phạm vi

- Bệ di động chở người chơi (FR-09) — vật lý (Q4).
- NFR-PERF-05/06/09 (60 fps, không cấp phát mỗi frame, bước physics ≤ 50 ms) — đo bằng DevTools, không phải e2e.

## Tech debt liên quan

_(không có)_ — FR-07 / FR-08 / FR-10 có e2e ở `power-up`, `enemies`, `question-blocks`. Ở mức unit, `client/src` chỉ có
`tuning.test.ts` chạm tới cú đạp (bật nhỏ hơn cú nhảy); địch, nấm, khối nứt, khối "?" không có unit test nào.
