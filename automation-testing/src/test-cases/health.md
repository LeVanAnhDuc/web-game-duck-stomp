# HEALTH — Test cases

Requirement: `docs/requirements/health.md` · quyết định: `docs/decisions/health.md`.
Project `app` (667×375). Mọi case đọc tim / vị trí qua `window.duckstomp` → `@dev-build`.

### TC-HEALTH-001 — chạm gai mất đúng một tim, rồi bất tử một lúc

- **Requirement:** REQ-HEALTH-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Tiền điều kiện:** màn 4 đã mở
- **Bước:** vào màn 4 → đặt nhân vật lên gai đầu tiên → đặt lại lên gai ngay lập tức
- **Mong đợi:** HUD 2 tim sau cú chạm đầu; ngay sau đó vẫn 2 tim (đang bất tử)
- **Automated:** `tests/e2e/health/damage.e2e.ts`

### TC-HEALTH-002 — mất tim cuối thì hồi sinh ngay ở điểm xuất phát với đủ ba tim

- **Requirement:** REQ-HEALTH-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Bước:** vào màn 4 → chạm gai ba lần, mỗi lần chờ hết bất tử
- **Mong đợi:** sau lần thứ ba trong vòng 1 s: nhân vật ở điểm xuất phát, 3 tim, HUD 3 tim; scene vẫn là Game, không có scene khác
- **Automated:** `tests/e2e/health/damage.e2e.ts`

### TC-HEALTH-003 — rơi xuống vực khi đủ ba tim là hồi sinh ngay

- **Requirement:** REQ-HEALTH-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 6
- **Bước:** vào màn 1 → đặt nhân vật dưới mép dưới của màn
- **Mong đợi:** trong vòng 1 s nhân vật về điểm xuất phát, vẫn 3 tim, HUD không bao giờ hiện 2 tim
- **Automated:** `tests/e2e/health/respawn.e2e.ts`

### TC-HEALTH-004 — chết và hồi sinh không reset đồng hồ

- **Requirement:** REQ-HEALTH-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 4
- **Bước:** vào màn 1 → chờ thời gian chơi qua 1 000 ms → rơi xuống vực
- **Mong đợi:** sau hồi sinh thời gian chơi ≥ trước khi chết, HUD vẫn ≥ "0:01"
- **Automated:** `tests/e2e/health/respawn.e2e.ts`

### TC-HEALTH-005 — đã chạm checkpoint thì hồi sinh tại checkpoint

- **Requirement:** REQ-HEALTH-05, REQ-HEALTH-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Tiền điều kiện:** màn 6 đã mở
- **Bước:** vào màn 6 → đặt nhân vật lên checkpoint → rơi xuống vực
- **Mong đợi:** hồi sinh ở toạ độ checkpoint, không ở điểm xuất phát
- **Automated:** `tests/e2e/health/respawn.e2e.ts`

### TC-HEALTH-007 — chết trên gai ở một khung hình chậm vẫn hồi sinh với đủ ba tim

- **Requirement:** REQ-HEALTH-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 5
- **Tiền điều kiện:** màn 4 đã mở; khung hình của cú chết chạy hai bước physics (như một khung ~33 ms trên máy chậm)
- **Bước:** vào màn 4 → đứng trên gai tới khi chết → chờ 10 khung
- **Mong đợi:** `playerRespawned` với 3 tim; không có `playerHit` nào sau đó; nhân vật vẫn 3 tim
- **Automated:** `tests/e2e/health/damage.e2e.ts`

### TC-HEALTH-006 — dạng mạnh trúng đòn mất nấm, tim không đổi

- **Requirement:** REQ-HEALTH-06
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Bước:** vào màn 4 → nhân vật ở dạng mạnh → chạm gai
- **Mong đợi:** hết dạng mạnh; vẫn 3 tim
- **Automated:** `tests/e2e/health/damage.e2e.ts`
