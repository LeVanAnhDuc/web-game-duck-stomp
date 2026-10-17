# ACCESSIBILITY — Test cases

Requirement: `docs/requirements/accessibility.md` · quyết định: `docs/decisions/accessibility.md`.
Project `app` (667×375). Mọi case đọc trạng thái nút / chữ trong canvas → `@dev-build`.

### TC-ACCESSIBILITY-001 — mỗi menu mở ra đã có đúng một nút có vòng focus

- **Requirement:** REQ-ACCESSIBILITY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** Title → vào màn 1 → Esc → Esc → về đích
- **Mong đợi:** Title: focus "PLAY"; tạm dừng: focus "RESUME"; bảng tổng kết: focus "LEVEL 2"
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-002 — mũi tên và Tab chuyển focus theo vòng, Space kích hoạt nút đang focus

- **Requirement:** REQ-ACCESSIBILITY-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** vào màn 1 → Esc → ↓ → Tab → Tab → ↑ → → → Space
- **Mong đợi:** focus lần lượt RETRY → MAP → RESUME (vòng) → MAP → RESUME; Space kích hoạt RESUME, màn chơi chạy lại
- **Automated:** `tests/e2e/accessibility/keyboard.e2e.ts`

### TC-ACCESSIBILITY-003 — bật giảm chuyển động thì đường đi tới màn mới vẽ xong ngay

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** `prefers-reduced-motion: reduce`
- **Bước:** máy mới → xong màn 1 → bấm "MAP"
- **Mong đợi:** ngay khi bản đồ mở, đường đi đã vẽ hết (`trailProgress` = 1)
- **Automated:** `tests/e2e/accessibility/motion.e2e.ts`

### TC-ACCESSIBILITY-004 — không bật giảm chuyển động thì đường đi tự vẽ dần

- **Requirement:** REQ-ACCESSIBILITY-03
- **Layer:** e2e · **Priority:** P2 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** `prefers-reduced-motion: no-preference`
- **Bước:** máy mới → xong màn 1 → bấm "MAP"
- **Mong đợi:** ngay khi bản đồ mở, đường đi chưa vẽ hết (`trailProgress` < 1), rồi vẽ hết
- **Automated:** `tests/e2e/accessibility/motion.e2e.ts`

### TC-ACCESSIBILITY-005 — mọi chữ game vẽ ra chỉ có ký tự ASCII

- **Requirement:** REQ-ACCESSIBILITY-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 6
- **Tiền điều kiện:** màn 1 đã xong (để có CONTINUE, kỷ lục, xu)
- **Bước:** gom chữ ở Title → bản đồ → HUD màn 2 → tạm dừng → bảng tổng kết
- **Mong đợi:** không chữ nào có ký tự mã > 127
- **Automated:** `tests/e2e/accessibility/text.e2e.ts`

### TC-ACCESSIBILITY-006 — mọi nút biểu tượng đều có tên

- **Requirement:** REQ-ACCESSIBILITY-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 1
- **Bước:** Title → bản đồ → vào màn 1 → Esc
- **Mong đợi:** Title, bản đồ, tạm dừng: nút "Sound on"; HUD: "Sound on" và "Pause"; không nút biểu tượng nào không tên
- **Automated:** `tests/e2e/accessibility/text.e2e.ts`
