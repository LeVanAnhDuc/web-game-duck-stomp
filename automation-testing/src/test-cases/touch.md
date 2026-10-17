# TOUCH — Test cases

Requirement: `docs/requirements/touch.md` · quyết định: `docs/decisions/touch.md`.
Project `app-touch` (667×375, `hasTouch`). Mọi case đọc trạng thái input qua `window.duckstomp` → `@dev-build`.

### TC-TOUCH-001 — chưa chạm thì không có nút; bấm chuột cũng không làm chúng hiện

- **Requirement:** REQ-TOUCH-01
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 6
- **Bước:** vào màn 1 bằng bàn phím → bấm chuột vào giữa màn chơi
- **Mong đợi:** cụm nút cảm ứng ẩn trước và sau cú bấm chuột
- **Automated:** `tests/e2e/touch/controls.e2e.ts`

### TC-TOUCH-002 — một cú chạm bất kỳ đâu trong màn chơi làm hiện cụm nút

- **Requirement:** REQ-TOUCH-02
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** chạm PLAY → chạm START → chạm giữa màn chơi
- **Mong đợi:** trước cú chạm trong màn: ẩn; sau: hiện
- **Automated:** `tests/e2e/touch/controls.e2e.ts`

### TC-TOUCH-003 — giữ nút hướng phải / trái thì nhân vật nhận hướng đó, nhấc ngón là hết

- **Requirement:** REQ-TOUCH-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** vào màn bằng chạm → chạm để hiện nút → giữ nút phải → nhấc → giữ nút trái → nhấc
- **Mong đợi:** lúc giữ phải: hướng phải được giữ; lúc giữ trái: hướng trái; sau mỗi lần nhấc: không hướng nào
- **Automated:** `tests/e2e/touch/controls.e2e.ts`

### TC-TOUCH-004 — chạm nút nhảy thì nhân vật nhảy lên

- **Requirement:** REQ-TOUCH-04
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 1
- **Bước:** vào màn bằng chạm → hiện nút → đứng yên → giữ nút nhảy
- **Mong đợi:** nhân vật lên cao hơn chỗ đứng ít nhất 8 px
- **Automated:** `tests/e2e/touch/controls.e2e.ts`

### TC-TOUCH-005 — bấm phím thì cụm nút cảm ứng ẩn lại

- **Requirement:** REQ-TOUCH-05
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Bước:** vào màn bằng chạm → hiện nút → giữ → rồi thả
- **Mong đợi:** cụm nút ẩn
- **Automated:** `tests/e2e/touch/controls.e2e.ts`

### TC-TOUCH-006 — nút hướng ≥ 72 px ở góc trái dưới, nút nhảy ≥ 88 px ở góc phải dưới

- **Requirement:** REQ-TOUCH-06
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 3
- **Bước:** vào màn bằng chạm → hiện nút → đo ba nút
- **Mong đợi:** hai nút hướng rộng và cao ≥ 72, nằm nửa trái và nửa dưới canvas; nút nhảy ≥ 88, nằm nửa phải và nửa dưới
- **Automated:** `tests/e2e/touch/controls.e2e.ts`

### TC-TOUCH-007 — giữ hai nút hướng cùng lúc rồi nhấc cả hai thì không hướng nào kẹt

- **Requirement:** REQ-TOUCH-07
- **Layer:** e2e · **Priority:** P2 · **Tags:** @dev-build · **Lăng kính:** 5
- **Bước:** vào màn bằng chạm → hiện nút → đặt hai ngón lên trái và phải → nhấc cả hai
- **Mong đợi:** sau khi nhấc: không hướng nào được giữ
- **Automated:** `tests/e2e/touch/controls.e2e.ts`

### TC-TOUCH-008 — chạm node khoá thì xem trước được, chạm START không đưa đi đâu

- **Requirement:** REQ-TOUCH-08
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 5
- **Bước:** chạm PLAY → chạm node 2 (khoá) → chạm START
- **Mong đợi:** node 2 được chọn, thẻ ghi "LOCKED"; sau khi chạm START vẫn ở bản đồ
- **Automated:** `tests/e2e/touch/controls.e2e.ts`
