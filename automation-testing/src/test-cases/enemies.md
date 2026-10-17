# ENEMIES — Test cases

Requirement: `docs/requirements/enemies.md` · quyết định: `docs/decisions/enemies.md`.
Project `app` (667×375). Mọi case đọc trạng thái màn qua `window.duckstomp` → `@dev-build`.

### TC-ENEMIES-001 — đạp lên đầu walker: walker bị hạ, nhân vật nảy lên, không mất tim

- **Requirement:** REQ-ENEMIES-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Tiền điều kiện:** màn 2 đã mở; chỉ còn walker thứ hai, đứng yên
- **Bước:** vào màn 2 → thả nhân vật từ cao hơn đầu walker 6 px
- **Mong đợi:** có `enemyStomped`, không có `playerHit`; walker không còn; 3 tim (HUD cũng 3); điểm cao nhất sau cú đạp cao hơn chỗ chạm ≥ 8 px
- **Automated:** `tests/e2e/enemies/stomp.e2e.ts`

### TC-ENEMIES-002 — đạp lên flyer cũng hạ được nó

- **Requirement:** REQ-ENEMIES-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** màn 5 đã mở; chỉ còn flyer, đứng yên
- **Bước:** vào màn 5 → thả nhân vật lên đầu flyer
- **Mong đợi:** có `enemyStomped`, không có `playerHit`; flyer không còn
- **Automated:** `tests/e2e/enemies/stomp.e2e.ts`

### TC-ENEMIES-003 — rơi lên spiker: mất một tim, spiker không chết

- **Requirement:** REQ-ENEMIES-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 5
- **Tiền điều kiện:** màn 4 đã mở; chỉ còn spiker đầu tiên, đứng yên
- **Bước:** vào màn 4 → thả nhân vật lên đầu spiker
- **Mong đợi:** spiker báo không đạp được; `playerHit` với 2 tim, HUD 2 tim; không có `enemyStomped`; spiker vẫn sống tại chỗ
- **Automated:** `tests/e2e/enemies/stomp.e2e.ts`

### TC-ENEMIES-004 — chạm walker từ cạnh bên: mất một tim, walker còn sống

- **Requirement:** REQ-ENEMIES-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** màn 2 đã mở; chỉ còn walker thứ hai, đứng yên
- **Bước:** đặt nhân vật ngang hàng, chồng 2 px lên sườn trái walker → ngay sau lần chạm, về điểm xuất phát
- **Mong đợi:** `playerHit`, còn 2 tim; không có `enemyStomped`; walker vẫn sống
- **Automated:** `tests/e2e/enemies/stomp.e2e.ts`
