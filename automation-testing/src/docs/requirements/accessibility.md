# ACCESSIBILITY — Bàn phím, giảm chuyển động, chữ ASCII, tên nút biểu tượng

Truy vết phía app: NFR-A11Y-02 · NFR-A11Y-04 · NFR-A11Y-05 · NFR-A11Y-06 (nửa bàn phím) · NFR-I18N-04 · ADR-0002 · ADR-0005.

- **REQ-ACCESSIBILITY-01** Mọi menu ngoài lúc chơi (Title, tạm dừng, bảng tổng kết) luôn có đúng một nút đang được focus và vòng focus của nó hiện ra ngay khi menu mở.
- **REQ-ACCESSIBILITY-02** Trong menu, ← ↑ / → ↓ / Tab chuyển focus theo vòng, và Enter hoặc Space kích hoạt nút đang focus.
- **REQ-ACCESSIBILITY-03** Bật `prefers-reduced-motion`: sau khi mở màn mới, đường đi trên bản đồ được vẽ xong ngay, không có hoạt ảnh; không bật thì đường đi tự vẽ dần.
- **REQ-ACCESSIBILITY-04** Mọi chữ game vẽ ra (Title, bản đồ, HUD, tạm dừng, bảng tổng kết) chỉ dùng ký tự ASCII.
- **REQ-ACCESSIBILITY-05** Mọi nút chỉ có biểu tượng (tiếng, tạm dừng) có tên đọc được ("Sound on" / "Sound off", "Pause").
