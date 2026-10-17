# QUESTIONBLOCKS — Quyết định

Đi cặp với `docs/requirements/question-blocks.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-10), `docs/specs/core-game/design.md` §4.
- **Code:** `client/src/game/entities/props.ts` (`QuestionBlock.bump`, `spent`), `client/src/game/scenes/GameScene.ts`
  (`onQuestionBlock`: chỉ khi chạm từ dưới; nấm sinh ở `block.y - TILE`), `client/scripts/make-level.mjs` (`?` cho xu,
  `!` cho nấm), `client/assets/levels/level-{2,3}.json`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Đội khối được làm bằng một cú nhảy thật của game: đặt nhân vật đứng trên đất ngay dưới khối, chờ đứng vững,
  rồi giữ nút nhảy 30 bước game qua cửa nhập nút cảm ứng (`GamePage.jumpRise`, cùng lý do như `level-play` Q5). Phím
  Space thật đã có TC-LEVELPLAY-005; giữ phím từ ngoài trên máy bận từng không ra cú nhảy nào trong thời gian chờ, làm
  case nói về đường truyền phím chứ không về khối. Khối ở hàng 6, cách mặt đất 2 ô — cú nhảy đủ cao 49 px chạm tới nó.
- **Q2** Khối "?" dùng là khối của màn 2 (cột 12, có đất bên dưới). Khối "?" của màn 1 nằm trên vực nên không đứng
  dưới được. Khối "!" dùng là khối của màn 3. Địch của màn được gỡ ngay khi vào màn.

## Tài khoản test

Không có tài khoản. Màn 2 và 3 mở bằng save gieo sẵn.

## Ngoài phạm vi

_(không có)_

## Tech debt liên quan

_(không có)_
