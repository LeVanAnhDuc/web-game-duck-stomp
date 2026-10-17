# LEVELCOMPLETE — Quyết định

Đi cặp với `docs/requirements/level-complete.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-12, FR-14), `docs/01-product/journeys.md` (US-01 bước 5–6, US-02
  + "Điều gì có thể sai": về đích chậm hơn không có dấu kỷ lục, xu không tụt), `docs/specs/core-game/design.md` §6,
  `README.md` §Features ("a best time and a coin count remembered per level").
- **Code:** `client/src/game/scenes/LevelCompleteScene.ts`, `client/src/game/scenes/GameScene.ts` (`complete`),
  `client/src/core/scoring.ts` (`mergeResult`: thời gian lấy nhỏ nhất, xu lấy lớn nhất, bằng kỷ lục không phải kỷ lục
  mới), `client/src/game/saveStore.ts`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Về đích = đặt nhân vật lên cờ đích (`GamePage.teleport`); chạy tới đó là vật lý (`level-play` Q1).
- **Q2** "Nhanh hơn / chậm hơn kỷ lục" được dựng bằng kỷ lục gieo sẵn: 999 000 ms (mọi lần chơi trong test đều nhanh
  hơn) và 1 ms (mọi lần chơi đều chậm hơn). Biên "bằng kỷ lục" đã có unit test ở `client/src/core/scoring.test.ts`;
  không dựng được chính xác tới mili giây qua trình duyệt.
- **Q3** Hoạt ảnh đường đi tự vẽ sau MAP thuộc module `accessibility` (giảm chuyển động); ở đây chỉ kiểm bản đồ chọn
  sẵn màn vừa mở và START bật.
- **Q4** "Chết đúng lúc chạm cờ đích" (US-04): sau khi chạm cờ, màn đã `finished` nên không còn sát thương nào tính —
  kiểm bằng việc màn dừng hẳn (scene Game tạm dừng) khi bảng hiện.

## Tài khoản test

Không có tài khoản. Kỷ lục cũ gieo bằng `GamePage.seedSave`.

## Ngoài phạm vi

_(không có)_

## Tech debt liên quan

_(không có)_
