# SAVE — Test cases

Requirement: `docs/requirements/save.md` · quyết định: `docs/decisions/save.md`.
Project `app` (667×375). Mọi case đọc chữ / trạng thái trong canvas → `@dev-build`.

### TC-SAVE-001 — xong màn 1 rồi tải lại: CONTINUE, màn 2 mở, kỷ lục còn

- **Requirement:** REQ-SAVE-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Bước:** máy mới → vào màn 1 → về đích → tải lại trang → CONTINUE
- **Mong đợi:** sau tải lại Title có "CONTINUE"; bản đồ chọn màn 2, START bật; thẻ màn 1 ghi "BEST m:ss" (không phải "--")
- **Automated:** `tests/e2e/save/persistence.e2e.ts`

### TC-SAVE-002 — save hỏng bị coi như chưa có save

- **Requirement:** REQ-SAVE-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 5
- **Tiền điều kiện:** `platformer.save.v1` = `{not json`
- **Bước:** mở `./` → PLAY → → (màn 2) → ← → Enter
- **Mong đợi:** Title chỉ có "PLAY"; màn 2 "LOCKED"; vào chơi được màn 1; không `pageerror`, không `console.error`
- **Automated:** `tests/e2e/save/corrupt.e2e.ts`

### TC-SAVE-003 — save của phiên bản khác bị coi như chưa có save

- **Requirement:** REQ-SAVE-03
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** save có màn 1 xong nhưng `version: 2`; lần khác thiếu `version`
- **Bước:** mở `./`
- **Mong đợi:** Title không có "CONTINUE"
- **Automated:** `tests/e2e/save/corrupt.e2e.ts`

### TC-SAVE-004 — bản ghi hỏng của một màn bị bỏ, màn hợp lệ còn giữ

- **Requirement:** REQ-SAVE-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Tiền điều kiện:** save version 1: màn 1 hợp lệ (xong, 30 000 ms, 2 xu); màn 2 `coins: -1`; màn 3 `bestTimeMs: "fast"`
- **Bước:** mở `./` → CONTINUE → xem thẻ màn 1, 2, 3, 4
- **Mong đợi:** màn 1 "BEST 0:30", "2"; màn 2 mở (vì màn 1 xong) nhưng "BEST --"; màn 3 "LOCKED" (màn 2 không được tính xong); màn 4 "LOCKED"
- **Automated:** `tests/e2e/save/corrupt.e2e.ts`

### TC-SAVE-005 — localStorage bị chặn: chơi hết một màn và đi tiếp màn kế

- **Requirement:** REQ-SAVE-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 6
- **Tiền điều kiện:** getter `window.localStorage` ném `SecurityError`
- **Bước:** mở `./` → Enter → Enter → về đích → Enter (màn kế)
- **Mong đợi:** bảng "LEVEL 1 CLEAR" có "NEW BEST"; vào được màn 2 trong phiên; không `pageerror`, không `console.error`
- **Automated:** `tests/e2e/save/blocked-storage.e2e.ts`
