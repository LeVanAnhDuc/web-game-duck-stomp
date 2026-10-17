# HEALTH — Quyết định

Đi cặp với `docs/requirements/health.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-06, FR-07, FR-09, FR-11), `docs/01-product/journeys.md` (US-04 +
  "Điều gì có thể sai"), `docs/specs/core-game/design.md` §2 (thứ tự sát thương) + §5 (chỉ màn 6 có checkpoint),
  `docs/decisions/0003-no-lives-checkpoint-respawn.md`, `docs/03-design/invariants.md` (#8, #9), `README.md` §Features
  ("Three hearts, a mid-level checkpoint, and respawn in under a second").
- **Code:** `client/src/game/scenes/GameScene.ts` (`damage`, `die`, overlap checkpoint, vực ở `heightPx + 24`),
  `client/src/game/entities/Player.ts` (`resetTo`: đủ 3 tim, mất nấm), `client/src/core/tuning.ts` (`invulnMs` 900),
  `client/assets/levels/level-4.json` (gai), `level-6.json` (checkpoint).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Chỉ màn 6 có checkpoint — design.md §5 chốt vậy ("6: dài hơn, có checkpoint ở giữa"). US-04 nói "nửa sau màn
  4, đã qua checkpoint" là ví dụ lệch dữ liệu đã được `.claude/skills/ux-persona-review/references/red-routes.md` ghi
  nhận; không coi là bug của game. Ở màn 1–5 "checkpoint gần nhất" là điểm xuất phát.
- **Q2** Nguồn sát thương dùng trong test là **gai tĩnh** của màn 4: nó đứng yên, nên đặt nhân vật lên là chạm chắc
  chắn. Địch từ cạnh bên đi theo cùng hàm `damage()` (design.md §2 "một luật, không hai"). Trong các case sát thương,
  địch của màn 4 được gỡ khỏi màn trước khi bắt đầu (`GamePage.removeEnemies`): con `walker` đi tuần dần về phía điểm
  xuất phát và từng đâm vào nhân vật vừa hồi sinh ở vài lần chạy, làm kết quả phụ thuộc tốc độ máy thay vì hành vi đang kiểm.
- **Q3** Dạng mạnh (REQ-HEALTH-06) được dựng bằng `player.setPowered(true)` qua `window.duckstomp` — gieo trạng thái
  như gieo save, để case chỉ nói về thứ tự sát thương trên gai. Cùng luật đó với nấm lấy thật trong màn (đội khối "!",
  ăn nấm, trúng sườn walker) là TC-POWERUP-002.
- **Q4** "Dưới một giây" (README, US-04) được kiểm là: sau cú chết, nhân vật đã ở điểm hồi sinh với 3 tim trong vòng
  1 000 ms thời gian thực, và scene vẫn là Game (không có scene nào chen vào).
- **Q5** "Chết ngay tại checkpoint → không hồi sinh vào thứ vừa giết mình" và "chết đúng lúc chạm cờ đích" (US-04) — vị
  trí checkpoint màn 6 không có nguồn sát thương nào trùng; trường hợp cờ đích thuộc `level-complete` (đã xong màn thì
  không chết nữa, `finished`).

- **Q6** Số bước physics của khung hình có cú chết được chốt bằng `GamePage.setDeathFrameSteps`: TC-HEALTH-002 dùng
  khung một bước (60 fps), TC-HEALTH-007 dùng khung hai bước (khung ~33 ms, máy chậm). Arcade chạy bước bù trong cùng
  khung mà không đồng bộ lại thân vật lý từ sprite, nên nếu để máy quyết định, TC-HEALTH-002 đỏ ngẫu nhiên trên CI
  (BUG-HEALTH-01) — kết quả phụ thuộc tải máy thay vì hành vi. Hai case giữ cả hai phía, không phía nào bị bỏ.

## Tài khoản test

Không có tài khoản. Màn 4 và 6 mở bằng save gieo sẵn.

## Ngoài phạm vi

- Đạp đầu địch (`walker`, `flyer`), `spiker` không đạp được và chạm địch từ cạnh bên (FR-08) — module `enemies`.

## Tech debt liên quan

_(không có)_
