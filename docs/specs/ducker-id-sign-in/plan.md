# Kế hoạch — đăng nhập Ducker ID cho Duck Stomp

> **Trạng thái:** 🟢 xong (chờ review và merge)
> **Thiết kế:** `design.md` · **Kế hoạch chung:** `web-game/docs/superpowers/plans/2026-10-04-ducker-id-sign-in.md`

Mỗi task dưới đây tương ứng một commit, và mọi subject kết thúc bằng ` [skip release]`
(ADR-0013).

- [x] **Task 0 — worktree và baseline.** `.worktrees/ducker-id-sign-in` từ `origin/main`;
  baseline xanh (`lint:core`, `tsc`, 96 test, build, bundle 321.9 kB gzip).
- [x] **Task 1 — env và cấu hình.** `readDuckerConfig` (+ test từng biến thiếu, từng
  giá trị cờ, issuer không có scheme), `src/env.d.ts`, `vite.config.ts` đọc
  `VITE_BASE_PATH` bằng `loadEnv`, `.env.example`, `deploy.yml` đặt base và **không**
  truyền cờ, `.worktrees/` vào `.gitignore`. Kiểm base path: build với
  `VITE_BASE_PATH=/web-game-duck-stomp/` cho asset bắt đầu bằng `/web-game-duck-stomp/`;
  build không đặt base cho asset ở gốc.
- [x] **Task 2 — lõi auth.** `core/pkce.ts` (vector RFC 7636 phụ lục B), `game/auth/*`
  (callback hợp lệ / lỗi / sai state / không có pending / giữ tham số game / khôi phục
  `returnTo`; store đổi code đúng một lần, lỗi → signed-out, sign-out). Không có test
  grep NFR nào trong repo này để nới allowlist.
- [x] **Task 3 — UI.** `accountOverlay.ts` + CSS trong `index.html` + nhãn ở
  `core/strings.ts`; nối với TitleScene; `happy-dom` thêm làm devDependency. Đã nhìn
  ảnh ở 667×375, 1024×768, 1440×900 (và 375×667 dọc: màn chặn xoay che overlay).
- [x] **Task 4 — e2e.** Hai spec: cờ bật (vòng đi-về với Ducker ID giả, tên hiện, URL
  sạch, tham số giữ nguyên, Esc, tải lại là chưa đăng nhập, IdP lỗi, state bị đổi,
  mục tiêu ≥ 44px và không đè nút tiếng) và cờ tắt (không nút, không request ngoài).
- [x] **Task 5 — tài liệu.** Non-Goal, ADR-0013, NFR/invariant ngoại lệ, FR-20/US-06,
  kiến trúc, backlog (nợ `[skip release]`), README, spec này.
- [x] **Task 6 — cổng, push, PR** (không merge; người điều phối merge sau khi chạy
  thật với Ducker ID local).
