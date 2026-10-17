# ORIENTATION — Test cases

Requirement: `docs/requirements/orientation.md` · quyết định: `docs/decisions/orientation.md`.
Project `app`. Xoay = đổi viewport 375×667 ↔ 667×375 (Q1).

### TC-ORIENTATION-001 — cầm dọc: màn chặn phủ cả trang và không có chữ

- **Requirement:** REQ-ORIENTATION-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** viewport 375×667 → mở `./`
- **Mong đợi:** `#rotate-gate` hiện, phủ 375×667; `innerText` rỗng
- **Automated:** `tests/e2e/orientation/rotate-gate.e2e.ts`

### TC-ORIENTATION-002 — cầm ngang: không có màn chặn

- **Requirement:** REQ-ORIENTATION-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 2
- **Bước:** viewport 667×375 → mở `./`
- **Mong đợi:** `#rotate-gate` ẩn
- **Automated:** `tests/e2e/orientation/rotate-gate.e2e.ts`

### TC-ORIENTATION-003 — mở khi cầm dọc, xoay ngang thì vào được game

- **Requirement:** REQ-ORIENTATION-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** viewport 375×667 → mở `./` → đổi sang 667×375 → Enter
- **Mong đợi:** màn chặn biến mất; Enter mở bản đồ
- **Automated:** `tests/e2e/orientation/rotate-gate.e2e.ts`

### TC-ORIENTATION-004 — đang chơi xoay dọc thì tạm dừng, xoay lại ngang thì chơi tiếp

- **Requirement:** REQ-ORIENTATION-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Bước:** vào màn 1 → ăn một xu → đổi sang 375×667 → chờ 30 khung hình → đổi lại 667×375
- **Mong đợi:** lúc dọc: màn chặn hiện, scene Game tạm dừng, thời gian chơi đứng yên, không có màn tạm dừng; lúc ngang: màn chặn ẩn, scene Game chạy lại, đồng hồ chạy tiếp, xu đã ăn vẫn còn
- **Automated:** `tests/e2e/orientation/rotate-gate.e2e.ts`

### TC-ORIENTATION-005 — màn tạm dừng của người chơi vẫn còn sau khi xoay dọc rồi ngang

- **Requirement:** REQ-ORIENTATION-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** vào màn 1 → Esc → đổi sang 375×667 → đổi lại 667×375
- **Mong đợi:** màn tạm dừng vẫn mở, scene Game vẫn tạm dừng
- **Automated:** `tests/e2e/orientation/rotate-gate.e2e.ts`
