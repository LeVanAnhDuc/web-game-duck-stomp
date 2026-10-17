# LEVELPLAY — Vào màn, HUD, điều khiển, xu, sáu màn chơi

Truy vết phía app: FR-03 · FR-04 · FR-05 · FR-06 (HUD) · FR-19 · US-01 · NFR-GAME-04 · ADR-0004.

- **REQ-LEVELPLAY-01** Vào một màn: HUD hiện đủ ba tim, số xu "0/N" với N là tổng xu của màn tính từ file màn (xu thường, xu giấu, xu trong khối "?"), và đồng hồ bắt đầu từ "0:00".
- **REQ-LEVELPLAY-02** Đồng hồ chạy theo thời gian chơi, hiện dạng m:ss (giây làm tròn xuống).
- **REQ-LEVELPLAY-03** Cả sáu màn đều nạp được từ file Tiled mà site phục vụ: mỗi màn có điểm xuất phát, cờ đích, và HUD "0/N" khớp số xu đếm từ file.
- **REQ-LEVELPLAY-04** Giữ → (hoặc D) thì nhân vật đi sang phải; giữ ← (hoặc A) thì đi sang trái; thả phím thì không còn hướng nào được giữ.
- **REQ-LEVELPLAY-05** Space, ↑ và W đều là nút nhảy: đang đứng trên đất mà bấm thì nhân vật rời đất đi lên.
- **REQ-LEVELPLAY-06** Chạm một đồng xu thì HUD tăng đúng 1; quay lại chỗ đồng xu đã ăn không được tính thêm.
