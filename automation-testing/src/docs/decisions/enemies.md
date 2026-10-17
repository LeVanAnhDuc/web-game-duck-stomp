# ENEMIES — Quyết định

Đi cặp với `docs/requirements/enemies.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-08), `docs/01-product/journeys.md` (US-04),
  `docs/specs/core-game/design.md` §2, `README.md` §Features.
- **Code:** `client/src/game/entities/enemies.ts` (`stompable`, `Walker`, `Spiker`, `Flyer`),
  `client/src/game/scenes/GameScene.ts` (`onEnemyTouch`: đạp khi `vy > 0` và đáy nhân vật ≤ đỉnh địch + 8 px),
  `client/src/core/tuning.ts` (`stompBounce` 190), `client/assets/levels/level-{2,4,5}.json`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Rơi xuống đầu địch" được dựng bằng cách giữ lại đúng con địch cần kiểm, đứng yên tại chỗ
  (`GamePage.keepOnlyEnemy`), rồi đặt nhân vật cao hơn đỉnh hitbox của nó 6 px (`GamePage.dropOnto`) — trọng lực của
  game làm phần còn lại. Đứng yên và gỡ các con khác là cô lập test: con `walker` đi tuần về phía điểm xuất phát và trên
  máy chậm đã đâm vào nhân vật trước khi case bắt đầu. Hướng chạm (từ trên, vận tốc rơi) vẫn do game tính.
- **Q2** Chạm cạnh bên: đặt nhân vật ngang hàng, chồng 2 px lên sườn trái của địch, rồi đưa về điểm xuất phát ngay sau
  lần chạm đầu (`GamePage.brush`) — để cú bật lùi trên máy chậm không đưa nhân vật quay lại đạp hoặc trúng con đó lần
  hai, làm case nói về lần chạm thứ hai.
- **Q3** "Nảy lên" (REQ-ENEMIES-01) được kiểm là: điểm cao nhất sau cú đạp cao hơn chỗ chạm ít nhất 8 px. Bật nhỏ hơn
  cú nhảy thật là quan hệ giữa hai hằng số, đã có unit test `client/src/core/tuning.test.ts`.
- **Q4** Màn dùng: walker thứ hai của màn 2 (không có khối nào phía trên chặn cú nảy), spiker đầu tiên của màn 4,
  flyer của màn 5.

## Tài khoản test

Không có tài khoản. Màn 2–5 mở bằng save gieo sẵn (`allCleared`).

## Ngoài phạm vi

- Quỹ đạo tuần tra (quay đầu ở mép, `turnAtEdge`) và đường bay của flyer — chuyển động theo khung hình, không phải
  hành vi người chơi thấy được bằng một lần chạm.

## Tech debt liên quan

_(không có)_
