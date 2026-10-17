# PAUSE — Quyết định

Đi cặp với `docs/requirements/pause.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-13), `README.md` §Controls, `docs/01-product/journeys.md` (US-03),
  `docs/design-system/platformer/MASTER.md` (một nút chính RESUME, hai nút phụ).
- **Code:** `client/src/game/scenes/PauseScene.ts`, `client/src/game/scenes/GameScene.ts` (`requestPause`: thả mọi
  input rồi tạm dừng; phím ESC / P), `client/src/game/scenes/HudScene.ts` (nút "Pause").

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** REQ-PAUSE-06 suy từ code (`requestPause` gọi `inputs.releaseAll()` "khi tạm dừng") và từ US-03 ("phải xử lý
  dứt khoát, không được kẹt vào một hướng"): ý định là không có hướng nào bị kẹt qua một lần tạm dừng. Kiểm theo kịch
  bản người chơi thật: giữ →, bấm Esc, thả → trong lúc menu mở, rồi RESUME.
- **Q2** "Đồng hồ không chạy" kiểm bằng thời gian chơi của màn (`elapsedMs`) đứng yên qua nhiều khung hình khi
  scene Game tạm dừng.
- **Q3** Nút tiếng trên màn tạm dừng thuộc module `audio`.

## Tài khoản test

Không có tài khoản.

## Ngoài phạm vi

_(không có)_

## Tech debt liên quan

_(không có)_
