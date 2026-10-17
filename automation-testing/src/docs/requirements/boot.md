# BOOT — Mở game, màn Title, render phóng số nguyên

Truy vết phía app: FR-01 · FR-18 · US-01 · US-02 · NFR-GAME-01 · NFR-REL-01 · invariant #1.

- **REQ-BOOT-01** Mở link thì tới màn Title: tab tên "Duck Stomp", chữ "DUCK STOMP" và nút PLAY; không qua màn nào cần bấm.
- **REQ-BOOT-02** Máy chưa xong màn nào: Title chỉ có PLAY. Đã xong ít nhất một màn: thêm CONTINUE, và CONTINUE mở bản đồ ở màn đang dang dở (màn mở đầu tiên chưa xong).
- **REQ-BOOT-03** PLAY mở bản đồ với màn 1 được chọn; từ Title vào chơi màn 1 được chỉ bằng hai lần Enter.
- **REQ-BOOT-04** Canvas luôn là bội số nguyên của 320×180, cùng một hệ số cho hai chiều, ở cả 667×375, 1024×768 và 1440×900; phần dư là letterbox.
- **REQ-BOOT-05** Đổi kích thước cửa sổ qua một bậc zoom thì canvas tính lại thành bội số nguyên mới, game vẫn chạy tiếp ở màn đang mở.
- **REQ-BOOT-06** Từ lúc mở tới lúc vào màn 1, game không ghi lỗi hay cảnh báo nào ra console (trừ nhiễu của driver GL, không phải của game).
- **REQ-BOOT-07** Google Fonts bị chặn thì vẫn tới Title và vào chơi được màn 1 bằng font dự phòng.
