# LEVELCOMPLETE — Test cases

Requirement: `docs/requirements/level-complete.md` · quyết định: `docs/decisions/level-complete.md`.
Project `app` (667×375). Mọi case đặt nhân vật lên cờ đích qua `window.duckstomp` → `@dev-build`.

### TC-LEVELCOMPLETE-001 — chạm cờ đích màn 1 lần đầu: bảng tổng kết có NEW BEST, máy lưu kết quả

- **Requirement:** REQ-LEVELCOMPLETE-01, REQ-LEVELCOMPLETE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** máy mới → vào màn 1 → ăn một đồng xu → đặt nhân vật lên cờ đích
- **Mong đợi:** bảng "LEVEL 1 CLEAR", TIME = m:ss của thời gian chơi lúc chạm cờ, COINS "1/9", "NEW BEST"; scene Game tạm dừng;
  save có màn 1 `cleared: true`, `bestTimeMs` = thời gian đó, `coins: 1`
- **Automated:** `tests/e2e/level-complete/summary.e2e.ts`

### TC-LEVELCOMPLETE-002 — về đích nhanh hơn kỷ lục: NEW BEST và kỷ lục ghi đè

- **Requirement:** REQ-LEVELCOMPLETE-03
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Tiền điều kiện:** màn 1 đã xong, kỷ lục 999 000 ms
- **Bước:** vào màn 1 → đặt lên cờ đích
- **Mong đợi:** có "NEW BEST"; `bestTimeMs` đã lưu nhỏ hơn 999 000
- **Automated:** `tests/e2e/level-complete/records.e2e.ts`

### TC-LEVELCOMPLETE-003 — về đích chậm hơn kỷ lục: không NEW BEST, kỷ lục cũ giữ nguyên

- **Requirement:** REQ-LEVELCOMPLETE-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 3
- **Tiền điều kiện:** màn 1 đã xong, kỷ lục 1 ms
- **Bước:** vào màn 1 → đặt lên cờ đích
- **Mong đợi:** không có "NEW BEST"; `bestTimeMs` vẫn là 1
- **Automated:** `tests/e2e/level-complete/records.e2e.ts`

### TC-LEVELCOMPLETE-004 — chơi lại lấy ít xu hơn không làm tụt số xu đã lưu

- **Requirement:** REQ-LEVELCOMPLETE-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 5
- **Tiền điều kiện:** màn 1 đã xong với 5 xu
- **Bước:** vào màn 1 → đặt lên cờ đích không ăn xu nào
- **Mong đợi:** bảng ghi COINS "0/9"; save vẫn `coins: 5`
- **Automated:** `tests/e2e/level-complete/records.e2e.ts`

### TC-LEVELCOMPLETE-005 — nút màn kế được chọn sẵn: Enter vào thẳng màn 2

- **Requirement:** REQ-LEVELCOMPLETE-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Bước:** máy mới → xong màn 1 → Enter
- **Mong đợi:** bảng có "RETRY", "MAP", "LEVEL 2"; sau Enter đang chơi màn 2, đồng hồ từ đầu
- **Automated:** `tests/e2e/level-complete/summary.e2e.ts`

### TC-LEVELCOMPLETE-006 — RETRY chơi lại màn từ 0:00

- **Requirement:** REQ-LEVELCOMPLETE-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** xong màn 1 → bấm "RETRY"
- **Mong đợi:** đang chơi màn 1, thời gian chơi nhỏ hơn lúc về đích, 0 xu, 3 tim
- **Automated:** `tests/e2e/level-complete/summary.e2e.ts`

### TC-LEVELCOMPLETE-007 — lần đầu xong màn 1, MAP chọn sẵn màn 2 vừa mở

- **Requirement:** REQ-LEVELCOMPLETE-06
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** máy mới → xong màn 1 → bấm "MAP"
- **Mong đợi:** bản đồ, màn 2 được chọn, START bật
- **Automated:** `tests/e2e/level-complete/summary.e2e.ts`

### TC-LEVELCOMPLETE-008 — màn 6 không có nút màn kế

- **Requirement:** REQ-LEVELCOMPLETE-05
- **Layer:** e2e · **Priority:** P2 · **Tags:** @dev-build · **Lăng kính:** 3
- **Tiền điều kiện:** cả sáu màn đã mở
- **Bước:** vào màn 6 → đặt lên cờ đích
- **Mong đợi:** bảng "LEVEL 6 CLEAR" có "RETRY", "MAP", không có nút "LEVEL 7"
- **Automated:** `tests/e2e/level-complete/summary.e2e.ts`
