# DUCKERID — Test cases

Requirement: `docs/requirements/ducker-id.md` · quyết định: `docs/decisions/ducker-id.md`.
TC-DUCKERID-001/002 chạy trên bản cờ tắt (project `app`, cả dev và prd); còn lại trên bản cờ bật (project `app-auth`,
1024×768, chỉ dev) với `fakeIssuer`.

### TC-DUCKERID-001 — cờ tắt: không nút đăng nhập, không chạm storage, không request ra ngoài

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./`
- **Mong đợi:** không nút "SIGN IN"; `#account-overlay` ẩn và rỗng; `sessionStorage` không có `ducker.pkce`; không request nào ngoài site, `data:`, `blob:` và Google Fonts
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-002 — cờ tắt: query giống OAuth bị để nguyên

- **Requirement:** REQ-DUCKERID-01
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Bước:** mở `./?code=c1&state=s1`
- **Mong đợi:** URL vẫn `?code=c1&state=s1`; overlay rỗng
- **Automated:** `tests/e2e/ducker-id/flag-off.e2e.ts`

### TC-DUCKERID-003 — đăng nhập: thấy tài khoản, URL sạch, menu đủ, đăng xuất trả lại nút

- **Requirement:** REQ-DUCKERID-02, REQ-DUCKERID-03, REQ-DUCKERID-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở `./` → "SIGN IN" → mở avatar → "SIGN OUT"
- **Mong đợi:** avatar hiện; URL không query; token gọi đúng 1 lần; menu có tên, email, "DUCKER ID PROFILE" trỏ `http://ducker.test/profile`; sau SIGN OUT nút "SIGN IN" hiện; console im lặng
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-004 — tham số game trên URL còn nguyên sau vòng đăng nhập

- **Requirement:** REQ-DUCKERID-02
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** mở `./?seed=7` → "SIGN IN"
- **Mong đợi:** avatar hiện; URL đúng `?seed=7`
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-005 — Esc đóng menu tài khoản và trả focus về avatar

- **Requirement:** REQ-DUCKERID-03
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** đăng nhập → mở avatar → Esc
- **Mong đợi:** `aria-expanded` từ `true` về `false`; avatar có focus
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-006 — hồ sơ chỉ trong bộ nhớ: tải lại là chưa đăng nhập, storage không giữ gì

- **Requirement:** REQ-DUCKERID-05
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** đăng nhập → đọc `localStorage` + `sessionStorage` → tải lại
- **Mong đợi:** không chỗ nào chứa email; không còn `ducker.pkce`; sau tải lại nút "SIGN IN" hiện
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-007 — từ chối ở Ducker ID: về chưa đăng nhập, URL sạch, không gọi token

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Tiền điều kiện:** issuer giả ở chế độ `deny`
- **Bước:** mở `./?level=2` → "SIGN IN"
- **Mong đợi:** nút "SIGN IN" hiện; URL đúng `?level=2`; token không được gọi
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-008 — state bị sửa thì bị từ chối mà không gọi token

- **Requirement:** REQ-DUCKERID-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 6
- **Bước:** mở `./?code=stolen&state=evil`
- **Mong đợi:** nút "SIGN IN" hiện; URL không query; token không được gọi
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-009 — sessionStorage bị chặn thì SIGN IN không đưa đi đâu

- **Requirement:** REQ-DUCKERID-07
- **Layer:** e2e · **Priority:** P2 · **Lăng kính:** 6
- **Tiền điều kiện:** getter `window.sessionStorage` ném `SecurityError`
- **Bước:** mở `./` → "SIGN IN"
- **Mong đợi:** không có request nào tới `/oauth/authorize`; vẫn ở Title của game
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-010 — nút SIGN IN ≥ 44 px, trong màn hình, không đè nút tiếng

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** mở `./`
- **Mong đợi:** nút rộng và cao ≥ 44; mép phải của nút ở bên trái nút tiếng; nằm trong viewport
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-011 — menu tài khoản nằm trọn ở 667×375 và 568×320, không làm overlay xê dịch

- **Requirement:** REQ-DUCKERID-08
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 3
- **Bước:** đặt viewport → đăng nhập → mở avatar
- **Mong đợi:** hộp menu nằm trong viewport; menu `position: absolute`; khung overlay không đổi
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`

### TC-DUCKERID-012 — rời Title thì overlay tài khoản biến mất

- **Requirement:** REQ-DUCKERID-09
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** mở `./` (thấy "SIGN IN") → Enter (vào bản đồ)
- **Mong đợi:** `#account-overlay` ẩn
- **Automated:** `tests/e2e/ducker-id/sign-in.e2e.ts`
