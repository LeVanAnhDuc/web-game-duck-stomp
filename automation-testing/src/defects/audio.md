# AUDIO — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-AUDIO-01](#bug-audio-01) | Thấp | TC-AUDIO-007 | Phaser tạo một AudioContext thứ hai ngay lúc tải trang, trước cú bấm PLAY |

### BUG-AUDIO-01

- **TC:** TC-AUDIO-007 · **Requirement:** REQ-AUDIO-01
- **Bước tái hiện:** mở game, đứng ở màn Title, không bấm gì.
- **Mong đợi:** chưa có `AudioContext` nào — ADR-0007: "AudioContext khởi tạo ở cú bấm PLAY trên màn Title"; US-01:
  "tiếng phải bật đúng ở bước 2, không phải lúc tải".
- **Thực tế:** một `AudioContext` đã được tạo lúc tải (trạng thái `suspended`). Stack:
  `new Phaser.Game` (`client/src/main.ts`) → `WebAudioSoundManager.createAudioContext`. Config game không tắt `audio`,
  nên sound manager mặc định của Phaser tự tạo ngữ cảnh riêng — game không dùng nó (SFX đi qua `Sfx` của
  `client/src/game/audio.ts`, tạo ngữ cảnh thứ hai ở PLAY). Hệ quả: hai ngữ cảnh âm thanh cho một trang, và trên trình
  duyệt có chính sách autoplay chặt, ngữ cảnh tạo trước cử chỉ có thể sinh cảnh báo console. Không nghe thấy gì sai.
- **Ghi chú:** ghi ngày 2026-10-18, thấy trên Chromium (Windows) qua Vite dev server. Hướng sửa gợi ý (không làm trong
  PR test): `audio: { noAudio: true }` trong config `Phaser.Game`.

## Đã sửa

_(chưa có)_
