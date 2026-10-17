# LEVELCOMPLETE — Về đích, bảng tổng kết, kỷ lục

Truy vết phía app: FR-12 · FR-14 · US-01 bước 5–6 · US-02 · invariant #9.

- **REQ-LEVELCOMPLETE-01** Chạm cờ đích thì hiện bảng "LEVEL n CLEAR" với TIME (m:ss của thời gian chơi lúc chạm cờ) và COINS "x/N" (xu ăn được trên tổng xu của màn); màn chơi dừng lại phía sau.
- **REQ-LEVELCOMPLETE-02** Xong một màn chưa từng có kỷ lục thì bảng có "NEW BEST", và máy lưu màn đó là đã xong, kèm thời gian và số xu.
- **REQ-LEVELCOMPLETE-03** Về đích nhanh hơn kỷ lục thì có "NEW BEST" và kỷ lục mới ghi đè; về đích chậm hơn thì không có "NEW BEST" và kỷ lục cũ giữ nguyên.
- **REQ-LEVELCOMPLETE-04** Số xu tốt nhất chỉ tăng: lần chơi lấy ít xu hơn không làm giảm số đã lưu.
- **REQ-LEVELCOMPLETE-05** Bảng có RETRY (chơi lại màn từ 0:00), MAP (về bản đồ) và — trừ màn 6 — nút vàng "LEVEL n+1" vào thẳng màn kế, được chọn sẵn để Enter là đi tiếp. Màn 6 không có nút màn kế.
- **REQ-LEVELCOMPLETE-06** Lần đầu xong một màn rồi bấm MAP thì bản đồ chọn sẵn màn vừa mở và màn đó vào được.
