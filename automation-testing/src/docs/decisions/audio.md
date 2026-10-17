# AUDIO — Quyết định

Đi cặp với `docs/requirements/audio.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-01, FR-17), `docs/01-product/journeys.md` (US-01 bước 2 + "trình
  duyệt chặn âm thanh đến cú chạm đầu tiên"), `docs/decisions/0007-synthesised-webaudio-sfx.md`, `README.md`
  §Features ("Sound effects synthesised in the browser — no audio files to download").
- **Code:** `client/src/game/audio.ts` (`Sfx.unlock`, `play`, `setMuted`), `client/src/game/scenes/TitleScene.ts`,
  `WorldMapScene.ts`, `HudScene.ts`, `PauseScene.ts` (nút tiếng), `client/src/game/saveStore.ts` (`muted` trong save).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Âm thanh được chứng minh không cần loa: bọc `AudioContext` trước khi trang chạy để đếm ngữ cảnh được tạo,
  được `resume`, và oscillator được `start`. "Phát âm thanh" = có oscillator `start`; "không phát" = không có.
- **Q2** "File âm thanh" = request có đuôi `.mp3/.ogg/.wav/.m4a/.aac/.flac/.webm` hoặc response `content-type: audio/*`.
- **Q3** Nút tiếng ở bốn màn dùng cùng `IconButton` + `setMuted`; test bấm ở Title và HUD, và chỉ kiểm có mặt (theo tên)
  ở bản đồ và màn tạm dừng.

## Tài khoản test

Không có tài khoản.

## Ngoài phạm vi

- Âm sắc, độ to, thời lượng từng tiếng (ADR-0007) — nghe bằng tai.

## Tech debt liên quan

_(không có)_
