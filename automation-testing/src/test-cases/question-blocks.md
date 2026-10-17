# QUESTIONBLOCKS — Test cases

Requirement: `docs/requirements/question-blocks.md` · quyết định: `docs/decisions/question-blocks.md`.
Project `app` (667×375). Mọi case đọc trạng thái màn qua `window.duckstomp` → `@dev-build`.

### TC-QUESTIONBLOCKS-001 — đội khối "?" từ dưới: được đúng 1 xu, đội lần nữa không được thêm

- **Requirement:** REQ-QUESTIONBLOCKS-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1, 5
- **Tiền điều kiện:** màn 2 đã mở, địch đã gỡ
- **Bước:** đứng dưới khối "?" → nhảy hết cỡ → đứng lại dưới khối → nhảy lần nữa
- **Mong đợi:** sau lần 1: một `blockBumped`, khối đã dùng, HUD "1/N"; sau lần 2: vẫn một `blockBumped`, một `coinCollected`, HUD "1/N"
- **Automated:** `tests/e2e/question-blocks/bump.e2e.ts`

### TC-QUESTIONBLOCKS-002 — đội khối "!" từ dưới: một cây nấm hiện ngay trên khối, khối hết

- **Requirement:** REQ-QUESTIONBLOCKS-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** màn 3 đã mở, địch đã gỡ
- **Bước:** đứng dưới khối "!" → nhảy hết cỡ
- **Mong đợi:** trước khi đội không có nấm nào; sau: một cây nấm ở đúng cột, cao hơn khối 16 px; khối đã dùng; số xu vẫn 0
- **Automated:** `tests/e2e/question-blocks/bump.e2e.ts`
