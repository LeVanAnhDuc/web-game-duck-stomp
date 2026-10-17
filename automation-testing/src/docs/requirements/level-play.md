# LEVELPLAY — Vào màn, HUD, điều khiển, xu, sáu màn chơi

Truy vết phía app: FR-03 (cả cảm giác điều khiển: nhảy theo lực giữ, coyote time, jump buffer) · FR-04 · FR-05 · FR-06 (HUD) · FR-19 · US-01 · NFR-GAME-04 · ADR-0004.

- **REQ-LEVELPLAY-01** Vào một màn: HUD hiện đủ ba tim, số xu "0/N" với N là tổng xu của màn tính từ file màn (xu thường, xu giấu, xu trong khối "?"), và đồng hồ bắt đầu từ "0:00".
- **REQ-LEVELPLAY-02** Đồng hồ chạy theo thời gian chơi, hiện dạng m:ss (giây làm tròn xuống).
- **REQ-LEVELPLAY-03** Cả sáu màn đều nạp được từ file Tiled mà site phục vụ: mỗi màn có điểm xuất phát, cờ đích, và HUD "0/N" khớp số xu đếm từ file.
- **REQ-LEVELPLAY-04** Giữ → (hoặc D) thì nhân vật đi sang phải; giữ ← (hoặc A) thì đi sang trái; thả phím thì không còn hướng nào được giữ.
- **REQ-LEVELPLAY-05** Space, ↑ và W đều là nút nhảy: đang đứng trên đất mà bấm thì nhân vật rời đất đi lên.
- **REQ-LEVELPLAY-06** Chạm một đồng xu thì HUD tăng đúng 1; quay lại chỗ đồng xu đã ăn không được tính thêm.
- **REQ-LEVELPLAY-07** Độ cao cú nhảy theo lực giữ: giữ nút nhảy suốt cú nhảy thì lên cao (> 40 px, gần ba ô), nhấn rồi nhả ngay thì thấp hơn rõ rệt (dưới 70% cú giữ).
- **REQ-LEVELPLAY-08** Jump buffer: bấm nhảy khi còn trên không, trong vòng 110 ms trước lúc chạm đất, thì nhân vật tự nhảy ngay lúc chạm đất mà không cần bấm lại; bấm sớm hơn thế thì không.
- **REQ-LEVELPLAY-09** Coyote time: vừa chạy khỏi mép đất, trong vòng 90 ms kể từ lúc còn chạm đất, bấm nhảy vẫn nhảy được.
- **REQ-LEVELPLAY-10** Quá 90 ms sau khi rời mép mới bấm thì không nhảy giữa không trung.
