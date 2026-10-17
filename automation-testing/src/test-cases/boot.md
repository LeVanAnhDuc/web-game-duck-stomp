# BOOT — Test cases

Requirement: `docs/requirements/boot.md` · quyết định: `docs/decisions/boot.md`.
Lăng kính: 1 truy vết · 2 phân vùng · 3 biên · 4 chuyển trạng thái · 5 negative · 6 ngoài lề. Project `app` (667×375).

### TC-BOOT-001 — mở link tới thẳng màn Title

- **Requirement:** REQ-BOOT-01
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 1
- **Bước:** mở `./`
- **Mong đợi:** `data-scene` = `Title`; tiêu đề tab "Duck Stomp"; đúng một canvas
- **Automated:** `tests/e2e/boot/title.e2e.ts`

### TC-BOOT-002 — máy mới chỉ có PLAY, không có CONTINUE

- **Requirement:** REQ-BOOT-01, REQ-BOOT-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 2
- **Tiền điều kiện:** không có save
- **Bước:** mở `./`
- **Mong đợi:** Title vẽ "DUCK STOMP" và "PLAY"; không có "CONTINUE"
- **Automated:** `tests/e2e/boot/title.e2e.ts`

### TC-BOOT-003 — đã xong màn 1 và 2 thì CONTINUE mở bản đồ ở màn 3

- **Requirement:** REQ-BOOT-02
- **Layer:** e2e · **Priority:** P1 · **Tags:** @dev-build · **Lăng kính:** 4
- **Tiền điều kiện:** save có màn 1, 2 đã xong
- **Bước:** mở `./` → bấm "CONTINUE"
- **Mong đợi:** Title có cả "PLAY" và "CONTINUE"; sau khi bấm, bản đồ mở với màn 3 được chọn
- **Automated:** `tests/e2e/boot/title.e2e.ts`

### TC-BOOT-004 — hai lần Enter từ Title là đang chơi màn 1

- **Requirement:** REQ-BOOT-03
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke, @dev-build · **Lăng kính:** 1
- **Bước:** mở `./` → Enter (PLAY) → Enter (START)
- **Mong đợi:** sau Enter đầu: bản đồ, màn 1 được chọn; sau Enter thứ hai: scene Game và Hud chạy, màn 1 có xu và nhân vật đã đặt
- **Automated:** `tests/e2e/boot/title.e2e.ts`

### TC-BOOT-005 — canvas là bội số nguyên của 320×180 ở ba khổ đã kiểm

- **Requirement:** REQ-BOOT-04
- **Layer:** e2e · **Priority:** P0 · **Tags:** @smoke · **Lăng kính:** 3
- **Bước:** mở `./` ở 667×375, 1024×768, 1440×900
- **Mong đợi:** kích thước canvas lần lượt 640×360, 960×540, 1280×720 — chiều rộng chia hết 320, chiều cao chia hết 180, cùng hệ số
- **Automated:** `tests/e2e/boot/scale.e2e.ts`

### TC-BOOT-006 — đổi cỡ cửa sổ qua một bậc zoom thì canvas tính lại, game không khởi động lại

- **Requirement:** REQ-BOOT-05
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 4
- **Bước:** mở `./` ở 667×375 → Enter (vào bản đồ) → đổi viewport sang 1440×900
- **Mong đợi:** canvas từ 640×360 thành 1280×720; vẫn ở bản đồ (`data-scene` = `WorldMap`)
- **Automated:** `tests/e2e/boot/scale.e2e.ts`

### TC-BOOT-007 — từ lúc mở tới lúc vào màn 1, console im lặng

- **Requirement:** REQ-BOOT-06
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 6
- **Bước:** mở `./` → Enter → Enter, ghi mọi `console.error`, `console.warn`, `pageerror`
- **Mong đợi:** không có dòng nào ngoài nhiễu driver GL
- **Automated:** `tests/e2e/boot/title.e2e.ts`

### TC-BOOT-008 — Google Fonts bị chặn vẫn vào chơi được

- **Requirement:** REQ-BOOT-07
- **Layer:** e2e · **Priority:** P1 · **Lăng kính:** 5
- **Tiền điều kiện:** mọi request tới `fonts.googleapis.com` / `fonts.gstatic.com` bị huỷ
- **Bước:** mở `./` → Enter → Enter
- **Mong đợi:** tới Title, rồi tới màn chơi (`data-scene` = `Game`)
- **Automated:** `tests/e2e/boot/title.e2e.ts`
