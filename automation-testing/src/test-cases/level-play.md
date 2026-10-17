# LEVELPLAY — Test cases

Requirement: `docs/requirements/level-play.md` · quyết định: `docs/decisions/level-play.md`.
Project `app` (667×375). Mọi case đọc trạng thái màn qua `window.duckstomp` → `@dev-build`.

### TC-LEVELPLAY-001 — vào màn 1: ba tim, 0/N xu, đồng hồ 0:00

- **Requirement:** REQ-LEVELPLAY-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** Title → Enter → Enter
- **Mong đợi:** HUD: 3 tim đầy; xu "0/N" với N đếm từ `levels/level-1.json` (= 9); đồng hồ "0:00" lúc vào
- **Automated:** `tests/e2e/level-play/hud.e2e.ts`

### TC-LEVELPLAY-002 — đồng hồ chạy và hiện m:ss

- **Requirement:** REQ-LEVELPLAY-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** vào màn 1, chờ thời gian chơi qua 1 000 ms
- **Mong đợi:** HUD đồng hồ "0:01" khi thời gian chơi trong [1 000, 2 000) ms
- **Automated:** `tests/e2e/level-play/hud.e2e.ts`

### TC-LEVELPLAY-003 — cả sáu màn nạp được, HUD khớp số xu trong file

- **Requirement:** REQ-LEVELPLAY-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** save đã xong cả sáu màn
- **Bước:** với từng màn 1…6: vào màn từ bản đồ
- **Mong đợi:** file màn trả 200 và có `spawn`, `goal`; game đang chơi đúng màn đó; HUD "0/N" với N đếm từ file
- **Automated:** `tests/e2e/level-play/levels.e2e.ts`

### TC-LEVELPLAY-004 — giữ → hoặc D đi sang phải, giữ ← hoặc A đi sang trái

- **Requirement:** REQ-LEVELPLAY-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 2
- **Bước:** vào màn 1, đứng yên → giữ → → thả → giữ ← → thả → giữ D → thả → giữ A → thả
- **Mong đợi:** mỗi lần giữ hướng phải thì x tăng, hướng trái thì x giảm; sau khi thả, không hướng nào còn được giữ
- **Automated:** `tests/e2e/level-play/controls.e2e.ts`

### TC-LEVELPLAY-005 — Space, ↑ và W đều làm nhân vật nhảy lên

- **Requirement:** REQ-LEVELPLAY-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Bước:** với từng phím Space / ArrowUp / w: đứng yên trên đất → giữ phím
- **Mong đợi:** y giảm (đi lên) ít nhất 8 px so với lúc đứng
- **Automated:** `tests/e2e/level-play/controls.e2e.ts`

### TC-LEVELPLAY-006 — chạm đồng xu thì HUD tăng đúng 1, không tính lại

- **Requirement:** REQ-LEVELPLAY-06
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 5
- **Bước:** vào màn 1 → đặt nhân vật lên đồng xu đầu tiên → đặt ra chỗ khác → đặt lại lên cùng chỗ
- **Mong đợi:** HUD "1/N" sau lần chạm đầu và vẫn "1/N" sau lần thứ hai
- **Automated:** `tests/e2e/level-play/hud.e2e.ts`

### TC-LEVELPLAY-007 — giữ nút nhảy lâu thì nhảy cao hơn nhấn nhả nhanh

- **Requirement:** REQ-LEVELPLAY-07
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** vào màn 1, đứng yên → nhảy, giữ nút đúng 2 bước game → đứng lại → nhảy, giữ 60 bước
- **Mong đợi:** cú giữ lên > 40 px; cú nhấn nhả lên > 0 và < 70% cú giữ
- **Automated:** `tests/e2e/level-play/movement-feel.e2e.ts`

### TC-LEVELPLAY-008 — bấm nhảy ngay trước khi chạm đất thì vẫn nhảy lúc chạm đất

- **Requirement:** REQ-LEVELPLAY-08
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** vào màn 1 → thả nhân vật từ 64 px; bấm và giữ nhảy khi còn cách đất 10 px → đứng lại → thả lại, bấm khi còn cách đất 56 px
- **Mong đợi:** lần 1: bấm → chạm đất < 110 ms (đồng hồ game) và nhân vật bật lên ngay khi chạm đất; lần 2: bấm → chạm đất ≥ 110 ms và không bật lên
- **Automated:** `tests/e2e/level-play/movement-feel.e2e.ts`

### TC-LEVELPLAY-009 — vừa chạy khỏi mép vực vẫn nhảy được trong chốc lát

- **Requirement:** REQ-LEVELPLAY-09
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** vào màn 1 → chạy sang phải khỏi mép đất trước vực đầu tiên → bấm nhảy ≥ 30 ms sau bước cuối còn chạm đất
- **Mong đợi:** lúc bấm < 90 ms sau bước cuối còn chạm đất; nhân vật bật lên
- **Automated:** `tests/e2e/level-play/movement-feel.e2e.ts`

### TC-LEVELPLAY-010 — chạy khỏi mép quá lâu rồi mới bấm thì không nhảy giữa không trung

- **Requirement:** REQ-LEVELPLAY-10
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** như TC-LEVELPLAY-009 nhưng bấm ≥ 160 ms sau bước cuối còn chạm đất
- **Mong đợi:** lúc bấm ≥ 90 ms sau đó; nhân vật không bật lên
- **Automated:** `tests/e2e/level-play/movement-feel.e2e.ts`
