# PAUSE — Màn tạm dừng

Truy vết phía app: FR-13 · US-03 · README §Controls ("Pause: Esc or P · the pause icon in the HUD") · NFR-A11Y-02.

- **REQ-PAUSE-01** Đang chơi, bấm Esc hoặc P thì mở màn "PAUSED" với ba nút RESUME, RETRY, MAP; màn chơi đứng yên — đồng hồ không chạy trong lúc tạm dừng.
- **REQ-PAUSE-02** RESUME, hoặc Esc thêm một lần, trở lại đúng màn đang chơi; đồng hồ chạy tiếp từ chỗ đã dừng, không reset.
- **REQ-PAUSE-03** RETRY chơi lại màn đang chơi từ đầu: đồng hồ về 0, đủ ba tim, 0 xu.
- **REQ-PAUSE-04** MAP thoát về bản đồ, màn vừa chơi được chọn sẵn.
- **REQ-PAUSE-05** Nút tạm dừng (biểu tượng, tên "Pause") trên HUD mở màn tạm dừng bằng chuột như phím Esc.
- **REQ-PAUSE-06** Phím hướng đang giữ lúc tạm dừng và được thả trong lúc tạm dừng thì sau RESUME nhân vật không tự chạy tiếp.
