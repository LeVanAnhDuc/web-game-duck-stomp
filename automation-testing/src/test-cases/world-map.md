# WORLDMAP — Test cases

Requirement: `docs/requirements/world-map.md` · quyết định: `docs/decisions/world-map.md`.
Project `app` (667×375). Mọi case đọc chữ vẽ trong canvas → `@dev-build`.

### TC-WORLDMAP-001 — máy mới: màn 1 mở, năm màn còn lại khoá

- **Requirement:** REQ-WORLDMAP-01, REQ-WORLDMAP-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** mở `./` → PLAY → lần lượt → qua sáu node
- **Mong đợi:** sáu node; màn 1: thẻ "LEVEL 1", "BEST --", START bật; màn 2–6: "LOCKED", START tắt; tổng xu "0"
- **Automated:** `tests/e2e/world-map/nodes.e2e.ts`

### TC-WORLDMAP-002 — xong màn 1 thì màn 2 mở, thẻ màn 1 hiện kỷ lục và xu

- **Requirement:** REQ-WORLDMAP-02, REQ-WORLDMAP-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Tiền điều kiện:** save: chỉ màn 1 xong, kỷ lục 42 300 ms, 5 xu
- **Bước:** mở `./` → PLAY → chọn màn 1, màn 2, màn 3
- **Mong đợi:** màn 1: "BEST 0:42", "5"; màn 2: "BEST --", START bật; màn 3: "LOCKED", START tắt; thanh trên "5"
- **Automated:** `tests/e2e/world-map/nodes.e2e.ts`

### TC-WORLDMAP-003 — save sửa tay xong màn 4 chỉ mở thêm màn 5

- **Requirement:** REQ-WORLDMAP-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 5
- **Tiền điều kiện:** save chỉ có màn 4 đã xong
- **Bước:** mở `./` → PLAY → đi qua sáu node
- **Mong đợi:** START bật ở màn 1 và 5; tắt ở màn 2, 3, 4 (màn 3 chưa xong) và 6
- **Automated:** `tests/e2e/world-map/nodes.e2e.ts`

### TC-WORLDMAP-004 — node khoá: chọn được, thẻ ghi LOCKED, Enter / Space / bấm START không vào màn

- **Requirement:** REQ-WORLDMAP-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 5
- **Bước:** máy mới → PLAY → → (chọn màn 2) → Enter → Space → bấm START
- **Mong đợi:** thẻ "LEVEL 2", "LOCKED", không có số xu; sau cả ba cách vẫn ở bản đồ, màn 2 vẫn được chọn
- **Automated:** `tests/e2e/world-map/nodes.e2e.ts`

### TC-WORLDMAP-005 — ← / → và A / D đổi node, đi vòng 6 → 1

- **Requirement:** REQ-WORLDMAP-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** PLAY → ← (từ màn 1) → → → D → A
- **Mong đợi:** ← từ màn 1 sang màn 6; → từ màn 6 về màn 1; D sang màn 2; A về màn 1
- **Automated:** `tests/e2e/world-map/navigation.e2e.ts`

### TC-WORLDMAP-006 — Space vào màn đang mở như Enter

- **Requirement:** REQ-WORLDMAP-05
- **Layer:** e2e · **Priority:** P2 · **Tags:** @dev-build · **Lăng kính:** 2
- **Bước:** save màn 1 xong → PLAY → → (màn 2) → Space
- **Mong đợi:** đang chơi màn 2
- **Automated:** `tests/e2e/world-map/navigation.e2e.ts`

### TC-WORLDMAP-007 — bấm node chỉ chọn; bấm START mới vào màn

- **Requirement:** REQ-WORLDMAP-06
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Tiền điều kiện:** save màn 1 xong
- **Bước:** PLAY → bấm node 2 → bấm node 2 lần nữa → bấm START
- **Mong đợi:** sau hai lần bấm node vẫn ở bản đồ, màn 2 được chọn; sau START đang chơi màn 2
- **Automated:** `tests/e2e/world-map/navigation.e2e.ts`
