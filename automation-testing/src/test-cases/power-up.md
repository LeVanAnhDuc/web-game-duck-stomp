# POWERUP — Test cases

Requirement: `docs/requirements/power-up.md` · quyết định: `docs/decisions/power-up.md`.
Project `app` (667×375). Mọi case đọc trạng thái màn qua `window.duckstomp` → `@dev-build`.

### TC-POWERUP-001 — ăn nấm thì sang dạng mạnh

- **Requirement:** REQ-POWERUP-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1, 4
- **Tiền điều kiện:** màn 3 đã mở; chỉ còn walker đầu tiên, đứng yên
- **Bước:** đội khối "!" bằng một cú nhảy → đặt nhân vật lên cây nấm vừa hiện
- **Mong đợi:** `powerUpTaken`; trạng thái dạng mạnh, sprite `player-powered`; cây nấm biến mất
- **Automated:** `tests/e2e/power-up/pickup.e2e.ts`

### TC-POWERUP-002 — nấm lấy thật: trúng đòn thì mất nấm, tim không đổi

- **Requirement:** REQ-POWERUP-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Tiền điều kiện:** tiếp TC-POWERUP-001 (cùng một test)
- **Bước:** chạm sườn walker một lần → về điểm xuất phát
- **Mong đợi:** `powerUpLost`, không có `playerHit`; về sprite `player`; vẫn 3 tim
- **Automated:** `tests/e2e/power-up/pickup.e2e.ts`

### TC-POWERUP-003 — dạng mạnh chạy đủ đà đâm vào tường nứt: tường vỡ, khoang xu giấu mở ra

- **Requirement:** REQ-POWERUP-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Tiền điều kiện:** màn 3, dạng mạnh, địch đã gỡ
- **Bước:** đứng cách tường 6 ô → giữ → tới khi qua đồng xu giấu xa nhất
- **Mong đợi:** đúng một `blockBroken`, không `blockThudded`; khối dưới không còn; số xu = số xu giấu sau tường, HUD khớp
- **Automated:** `tests/e2e/power-up/cracked-wall.e2e.ts`

### TC-POWERUP-004 — dạng mạnh bước chậm tới tường: tường rung "chưa đủ nhanh", không vỡ

- **Requirement:** REQ-POWERUP-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Tiền điều kiện:** màn 3, dạng mạnh, địch đã gỡ
- **Bước:** đứng cách tường 3 px → giữ → tới khi khối báo sự kiện đầu tiên
- **Mong đợi:** sự kiện đầu tiên của khối là `blockThudded` — lần chạm đầu không làm vỡ
- **Automated:** `tests/e2e/power-up/cracked-wall.e2e.ts`

### TC-POWERUP-005 — dạng mạnh đứng tì vào tường giữ hướng chạy: tường vẫn không vỡ

- **Requirement:** REQ-POWERUP-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 5
- **Tiền điều kiện:** màn 3, dạng mạnh, địch đã gỡ
- **Bước:** đứng cách tường 3 px → giữ → 1,5 s
- **Mong đợi:** không có `blockBroken`; khối còn nguyên; nhân vật vẫn ở trước tường
- **Automated:** `tests/e2e/power-up/cracked-wall.e2e.ts`

### TC-POWERUP-006 — dạng thường chạy đủ đà đâm vào tường: không rung không vỡ

- **Requirement:** REQ-POWERUP-06
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** màn 3, dạng thường, địch đã gỡ
- **Bước:** đứng cách tường 6 ô → giữ → 1,5 s
- **Mong đợi:** không `blockBroken`, không `blockThudded`; khối còn nguyên; nhân vật ở trước tường; 0 xu
- **Automated:** `tests/e2e/power-up/cracked-wall.e2e.ts`

### TC-POWERUP-007 — rơi từ trên xuống khối nứt: dạng thường đứng lên được, dạng mạnh làm vỡ

- **Requirement:** REQ-POWERUP-07
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** màn 3, địch đã gỡ
- **Bước:** dạng thường: thả lên khối trên của tường → đứng vững; sang dạng mạnh → thả lại từ cao hơn 24 px
- **Mong đợi:** lần 1: không sự kiện khối, khối còn, nhân vật đứng trên nó; lần 2: `blockBroken`, khối không còn
- **Automated:** `tests/e2e/power-up/cracked-wall.e2e.ts`
