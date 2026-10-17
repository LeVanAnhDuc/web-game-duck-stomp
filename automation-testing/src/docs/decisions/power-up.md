# POWERUP — Quyết định

Đi cặp với `docs/requirements/power-up.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-07), `docs/01-product/journeys.md` (US-05 + "Điều gì có thể
  sai"), `docs/specs/core-game/design.md` §2 + §3, `README.md` §Features.
- **Code:** `client/src/game/scenes/GameScene.ts` (`onCrackedBlock`, overlap `powerUps`, `damage`),
  `client/src/game/entities/props.ts` (`CrackedBlock.break` / `thud`, `PowerUp`), `client/src/game/entities/Player.ts`
  (`setPowered`, texture `tex-player-powered`), `client/src/core/movement.ts` (`canBreakByRunning`),
  `client/src/core/tuning.ts` (`breakSpeed` 90), `client/assets/levels/level-3.json` (tường nứt 2 khối ở cột 56, 2 xu
  giấu ngay sau).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Nấm được lấy thật (REQ-POWERUP-01/02): đội khối "!" của màn 3 rồi đặt nhân vật lên cây nấm vừa hiện. Cú trúng
  đòn sau đó là sườn của một walker (giữ lại một con, đứng yên — xem `enemies` Q1/Q2).
- **Q2** Các case tường nứt gieo dạng mạnh bằng `player.setPowered(true)`: đường tới đó (đội khối, ăn nấm) đã được
  TC-POWERUP-001 chứng minh, lặp lại nó ở mỗi case chỉ thêm thời gian chạy.
- **Q3** "Đủ đà" được dựng bằng chạy thật: phím → thật, đà chạy 6 ô (tốc `breakSpeed` 90 px/s đạt sau khoảng một ô).
  "Chưa đủ đà" là đứng cách tường 3 px rồi bước tới.
- **Q4** "Không thật sự di chuyển thì không phải đủ đà" (REQ-POWERUP-05): design.md §3 định nghĩa đủ đà là
  `|vx| ≥ breakSpeed` và US-05 nói "không đủ đà mà đâm vào → tường không vỡ, báo chưa đủ nhanh". Người chơi đứng tì vào
  tường thì đứng yên trên màn hình — nên tường phải đứng. Game hiện đọc `vx` của máy trạng thái chuyển động, vốn vẫn
  tăng khi bị tường chặn, nên đứng tì 0,3 s là tường vỡ: ghi BUG-POWERUP-01, không sửa kỳ vọng.
- **Q5** "Mở lối tắt và phòng xu giấu" được kiểm bằng phòng xu của màn 3: sau khi tường vỡ, giữ → chạy qua chỗ tường
  và HUD đếm đúng số xu giấu nằm sau nó.

## Tài khoản test

Không có tài khoản. Màn 3 mở bằng save gieo sẵn.

## Ngoài phạm vi

- Mất nấm giữa đường chạy rồi phải quay lại lấy nấm khác (US-05) — là REQ-POWERUP-02 cộng việc đi lại, không thêm hành vi mới.

## Tech debt liên quan

_(không có)_
