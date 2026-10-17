# PRIVACY — Không thu thập gì, không gọi ra ngoài

Truy vết phía app: NFR-DATA-01 · NFR-SEC-04 · NFR-REL-01 · ADR-0013 (ngoại lệ chỉ khi cờ bật) · README ("no game accounts, no backend").

- **REQ-PRIVACY-01** Chơi trọn một màn không để lại cookie nào.
- **REQ-PRIVACY-02** Thứ duy nhất game ghi xuống máy là `localStorage` khoá `platformer.save.v1`; `sessionStorage` trống (cờ Ducker ID tắt).
- **REQ-PRIVACY-03** Save chỉ chứa `version`, `levels` (cleared / bestTimeMs / coins theo màn) và `muted` — không định danh máy, không thời điểm, không gì khác.
- **REQ-PRIVACY-04** Từ lúc mở tới lúc đang chơi, mọi request chỉ đi tới chính site và Google Fonts — không analytics, không bên thứ ba nào khác.
