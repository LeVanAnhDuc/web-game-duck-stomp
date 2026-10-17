# PRIVACY — Test cases

Requirement: `docs/requirements/privacy.md` · quyết định: `docs/decisions/privacy.md`.
Project `app` (bản cờ Ducker ID tắt).

### TC-PRIVACY-001 — chơi trọn màn 1: không cookie, chỉ một khoá localStorage, sessionStorage trống

- **Requirement:** REQ-PRIVACY-01, REQ-PRIVACY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 6
- **Bước:** máy mới → vào màn 1 → về đích
- **Mong đợi:** không cookie nào; `localStorage` có đúng một khoá `platformer.save.v1`; `sessionStorage` trống
- **Automated:** `tests/e2e/privacy/storage.e2e.ts`

### TC-PRIVACY-002 — save chỉ có version, levels và muted

- **Requirement:** REQ-PRIVACY-03
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 6
- **Bước:** máy mới → vào màn 1 → về đích → đọc save
- **Mong đợi:** khoá gốc đúng `levels`, `muted`, `version`; bản ghi màn đúng `bestTimeMs`, `cleared`, `coins`
- **Automated:** `tests/e2e/privacy/storage.e2e.ts`

### TC-PRIVACY-003 — từ lúc mở tới lúc đang chơi chỉ gọi tới site và Google Fonts

- **Requirement:** REQ-PRIVACY-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./` → Enter → Enter → chờ 30 khung hình, ghi mọi request
- **Mong đợi:** mọi request có origin là site, `fonts.googleapis.com` hoặc `fonts.gstatic.com` (bỏ qua `data:` / `blob:`)
- **Automated:** `tests/e2e/privacy/network.e2e.ts`
