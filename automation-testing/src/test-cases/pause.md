# PAUSE — Test cases

Requirement: `docs/requirements/pause.md` · quyết định: `docs/decisions/pause.md`.
Project `app` (667×375). Mọi case đọc trạng thái màn qua `window.duckstomp` → `@dev-build`.

### TC-PAUSE-001 — Esc mở màn tạm dừng, đồng hồ đứng yên

- **Requirement:** REQ-PAUSE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** vào màn 1 → Esc → chờ 30 khung hình
- **Mong đợi:** "PAUSED", "RESUME", "RETRY", "MAP"; scene Game tạm dừng; thời gian chơi không đổi
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-002 — P cũng mở màn tạm dừng

- **Requirement:** REQ-PAUSE-01
- **Layer:** e2e · **Priority:** P2 · **Tags:** @dev-build · **Lăng kính:** 2
- **Bước:** vào màn 1 → P
- **Mong đợi:** màn tạm dừng hiện, scene Game tạm dừng
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-003 — RESUME và Esc lần hai trở lại màn, đồng hồ chạy tiếp không reset

- **Requirement:** REQ-PAUSE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Bước:** vào màn 1 → Esc → bấm "RESUME" → chờ đồng hồ chạy → Esc → Esc
- **Mong đợi:** sau RESUME scene Game chạy, thời gian chơi ≥ lúc dừng và tăng tiếp; Esc thứ hai đóng màn tạm dừng như RESUME
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-004 — RETRY chơi lại màn từ đầu

- **Requirement:** REQ-PAUSE-03
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** vào màn 1 → ăn một xu, chờ qua 1 s → Esc → bấm "RETRY"
- **Mong đợi:** màn 1 chạy lại: thời gian chơi nhỏ hơn lúc dừng, 0 xu, 3 tim; màn tạm dừng đã đóng
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-005 — MAP thoát về bản đồ, màn vừa chơi được chọn

- **Requirement:** REQ-PAUSE-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Tiền điều kiện:** màn 1–2 đã xong (màn 3 mở)
- **Bước:** vào màn 3 → Esc → bấm "MAP"
- **Mong đợi:** bản đồ, màn 3 được chọn; scene Game và Hud không còn chạy
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-006 — nút Pause trên HUD mở màn tạm dừng bằng chuột

- **Requirement:** REQ-PAUSE-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Bước:** vào màn 1 → bấm nút "Pause" trên HUD
- **Mong đợi:** màn tạm dừng hiện, scene Game tạm dừng
- **Automated:** `tests/e2e/pause/pause.e2e.ts`

### TC-PAUSE-007 — thả phím hướng trong lúc tạm dừng thì sau RESUME nhân vật không tự chạy

- **Requirement:** REQ-PAUSE-06
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 5
- **Bước:** vào màn 1 → giữ → tới khi nhân vật chạy → Esc (vẫn giữ →) → thả → → RESUME → chờ 30 khung hình
- **Mong đợi:** sau RESUME không còn hướng nào được giữ; nhân vật không đi tiếp sang phải
- **Automated:** `tests/e2e/pause/pause.e2e.ts`
