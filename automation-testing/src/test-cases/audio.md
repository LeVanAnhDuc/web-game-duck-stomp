# AUDIO — Test cases

Requirement: `docs/requirements/audio.md` · quyết định: `docs/decisions/audio.md`.
Project `app` (667×375). `AudioContext` được bọc trước khi trang chạy để đếm (Q1).

### TC-AUDIO-001 — PLAY tạo đúng một ngữ cảnh âm thanh mới và cho nó chạy

- **Requirement:** REQ-AUDIO-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Bước:** mở `./`, chờ ở Title → bấm "PLAY"
- **Mong đợi:** PLAY tạo thêm đúng 1 ngữ cảnh âm thanh và gọi `resume` cho nó
- **Automated:** `tests/e2e/audio/sound.e2e.ts`

### TC-AUDIO-002 — tiếng bật: PLAY và ăn xu phát âm thanh tổng hợp

- **Requirement:** REQ-AUDIO-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 1
- **Bước:** máy mới → PLAY → START → ăn một xu
- **Mong đợi:** sau PLAY có oscillator được `start`; sau khi ăn xu số oscillator tăng thêm
- **Automated:** `tests/e2e/audio/sound.e2e.ts`

### TC-AUDIO-003 — từ lúc mở tới lúc chơi không tải file âm thanh nào

- **Requirement:** REQ-AUDIO-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở `./` → Enter → Enter, ghi mọi request
- **Mong đợi:** không request nào là file âm thanh (Q2)
- **Automated:** `tests/e2e/audio/sound.e2e.ts`

### TC-AUDIO-004 — tắt tiếng ở Title: tên nút đổi, lựa chọn còn sau khi tải lại

- **Requirement:** REQ-AUDIO-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** mở `./` → bấm nút "Sound on" → tải lại trang
- **Mong đợi:** sau bấm nút tên "Sound off"; save `muted: true`; sau tải lại nút vẫn "Sound off"; bản đồ cũng có nút "Sound off"
- **Automated:** `tests/e2e/audio/mute.e2e.ts`

### TC-AUDIO-005 — đã tắt tiếng thì PLAY, ăn xu, nhảy đều im lặng

- **Requirement:** REQ-AUDIO-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** save `muted: true`
- **Bước:** mở `./` → PLAY → START → ăn một xu → nhảy
- **Mong đợi:** không oscillator nào được `start`
- **Automated:** `tests/e2e/audio/mute.e2e.ts`

### TC-AUDIO-006 — nút tiếng trên HUD và màn tạm dừng: tắt giữa màn thì im ngay

- **Requirement:** REQ-AUDIO-04, REQ-AUDIO-05
- **Layer:** e2e · **Priority:** P2 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** máy mới → vào màn 1 → bấm "Sound on" trên HUD → ăn một xu → Esc
- **Mong đợi:** nút HUD thành "Sound off"; ăn xu không thêm oscillator nào; màn tạm dừng có nút "Sound off"
- **Automated:** `tests/e2e/audio/mute.e2e.ts`

### TC-AUDIO-007 — chưa bấm gì thì chưa có ngữ cảnh âm thanh nào

- **Requirement:** REQ-AUDIO-01
- **Layer:** e2e · **Priority:** P2 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** mở `./`, chờ ở Title 30 khung hình, không bấm gì
- **Mong đợi:** 0 ngữ cảnh âm thanh được tạo
- **Automated:** `tests/e2e/audio/sound.e2e.ts`
