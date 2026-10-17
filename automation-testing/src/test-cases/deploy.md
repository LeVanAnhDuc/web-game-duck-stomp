# DEPLOY — Test cases

Requirement: `docs/requirements/deploy.md` · quyết định: `docs/decisions/deploy.md`.
Project `app`; chạy được nguyên trạng trên dev và prd (Q1).

### TC-DEPLOY-001 — mọi tài nguyên của site tải được và nằm dưới đường dẫn gốc

- **Requirement:** REQ-DEPLOY-01, REQ-DEPLOY-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./` → Enter → Enter → chờ 30 khung hình; ghi mọi response và request lỗi của chính site
- **Mong đợi:** không response ≥ 400; không request thất bại; mọi URL của site bắt đầu bằng đường dẫn gốc
- **Automated:** `tests/e2e/deploy/static-site.e2e.ts`

### TC-DEPLOY-002 — sáu file màn có ở levels/ dưới đường dẫn gốc

- **Requirement:** REQ-DEPLOY-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 1
- **Bước:** mở `./` → lấy `levels/level-1.json` … `level-6.json` (tương đối)
- **Mong đợi:** cả sáu trả 200, là JSON có ít nhất một lớp `objectgroup`
- **Automated:** `tests/e2e/deploy/static-site.e2e.ts`
