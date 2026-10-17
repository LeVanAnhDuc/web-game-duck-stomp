# POWERUP — Nấm, dạng mạnh, phá tường nứt

Truy vết phía app: FR-07 · US-05 · design.md §2 (thứ tự sát thương) + §3 (năng lực của nấm) · README §Features ("A
power-up that turns the player into a stronger form able to smash cracked walls at full speed, opening shortcuts and
hidden coin rooms").

- **REQ-POWERUP-01** Chạm cây nấm thì nhân vật sang dạng mạnh (cùng nhân vật, viền vàng) và cây nấm biến mất.
- **REQ-POWERUP-02** Dạng mạnh trúng đòn thì mất nấm, về dạng thường, tim không đổi — với nấm lấy thật trong màn, không chỉ trạng thái gieo sẵn.
- **REQ-POWERUP-03** Dạng mạnh chạy đủ đà (`|vx| ≥ breakSpeed`) đâm ngang vào khối nứt thì khối vỡ, và lối phía sau mở ra: xu giấu sau tường lấy được, HUD đếm chúng.
- **REQ-POWERUP-04** Dạng mạnh chạm khối nứt khi chưa đủ đà thì khối không vỡ và báo "chưa đủ nhanh" (rung một nhịp), khác với vỡ.
- **REQ-POWERUP-05** Đứng tì vào khối nứt mà giữ hướng chạy (không thật sự di chuyển) không phải là "đủ đà": khối không vỡ.
- **REQ-POWERUP-06** Dạng thường thì khối nứt là tường: chạy hết tốc đâm vào cũng không vỡ, không rung, không qua được.
- **REQ-POWERUP-07** Rơi từ trên xuống khối nứt: dạng mạnh làm khối vỡ; dạng thường đứng lên được, khối còn nguyên.
