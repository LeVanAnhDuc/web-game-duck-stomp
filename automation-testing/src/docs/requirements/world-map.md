# WORLDMAP — Bản đồ thế giới sáu màn, mở khoá tuần tự

Truy vết phía app: FR-02 · FR-12 · US-01 · US-02 · ADR-0011 · NFR-A11Y-02.

- **REQ-WORLDMAP-01** Bản đồ có sáu node. Máy mới: chỉ màn 1 mở, màn 2–6 khoá.
- **REQ-WORLDMAP-02** Mở khoá tuần tự: màn N mở khi và chỉ khi màn N−1 đã xong. Save sửa tay đánh dấu xong màn 4 (mà 1–3 chưa) chỉ mở thêm màn 5 — không mở màn 2, 3 hay 6.
- **REQ-WORLDMAP-03** Thẻ của màn đang chọn ghi "LEVEL n", kỷ lục "BEST m:ss" (hoặc "BEST --" khi chưa xong) và số xu tốt nhất; thanh trên cùng ghi tổng xu tốt nhất của mọi màn.
- **REQ-WORLDMAP-04** Node khoá vẫn chọn được để xem trước: thẻ ghi "LOCKED" thay cho kỷ lục và không hiện số xu; START bị vô hiệu — Enter, Space hay bấm START đều không vào màn, bản đồ đứng yên.
- **REQ-WORLDMAP-05** Bàn phím: ← / → (và A / D) đổi node đang chọn, đi vòng từ màn 6 về màn 1; Enter hoặc Space vào màn đang chọn nếu nó đã mở.
- **REQ-WORLDMAP-06** Chuột: bấm một node chỉ chọn nó (chưa vào màn); bấm START mới vào màn.
