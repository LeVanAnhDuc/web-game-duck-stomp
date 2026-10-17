# HEALTH — Tim, chết, hồi sinh, checkpoint

Truy vết phía app: FR-06 · FR-07 (thứ tự sát thương) · FR-09 · FR-11 · US-04 · ADR-0003 · invariants #8, #9.

- **REQ-HEALTH-01** Chạm nguồn sát thương (gai, địch từ cạnh bên) thì mất đúng 1 tim, HUD còn 2 tim; ngay sau cú trúng có một khoảng bất tử ngắn — đứng tiếp trên gai không mất thêm tim ngay lập tức.
- **REQ-HEALTH-02** Mất tim cuối thì hồi sinh ngay (dưới một giây) với đủ 3 tim, ở checkpoint gần nhất đã chạm hoặc ở điểm xuất phát nếu chưa chạm checkpoint nào; không có màn hình "game over" hay màn nào phải bấm qua.
- **REQ-HEALTH-03** Rơi xuống vực là chết ngay, bỏ qua tim: đang đủ 3 tim vẫn hồi sinh ngay, không qua bước mất từng tim.
- **REQ-HEALTH-04** Đồng hồ của màn không reset khi chết và hồi sinh.
- **REQ-HEALTH-05** Chạm checkpoint (màn 6) thì lần chết sau hồi sinh tại checkpoint, không về điểm xuất phát.
- **REQ-HEALTH-06** Đang ở dạng mạnh mà trúng đòn thì mất nấm trước, tim không đổi.
