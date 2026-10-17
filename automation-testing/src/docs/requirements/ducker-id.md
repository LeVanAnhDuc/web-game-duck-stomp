# DUCKERID — Đăng nhập Ducker ID tuỳ chọn (sau cờ tính năng)

Truy vết phía app: FR-20 · US-06 · ADR-0013 · NFR-DATA-01 · NFR-SEC-04 · NFR-A11Y-03.

- **REQ-DUCKERID-01** Cờ tắt hoặc thiếu biến (bản deploy): không có nút SIGN IN, overlay tài khoản trống, không đọc URL (`?code=` để nguyên), không chạm `sessionStorage`, không request nào ngoài site và Google Fonts.
- **REQ-DUCKERID-02** Cờ bật: Title có nút SIGN IN; bấm thì đi qua Ducker ID và quay về Title với URL sạch (không `code` / `state`), tham số khác của URL còn nguyên, nút thành avatar tài khoản; console im lặng.
- **REQ-DUCKERID-03** Menu tài khoản hiện tên, email, mục "DUCKER ID PROFILE" trỏ tới trang hồ sơ trên issuer, và "SIGN OUT"; Esc đóng menu và trả focus về avatar.
- **REQ-DUCKERID-04** SIGN OUT đưa nút SIGN IN trở lại.
- **REQ-DUCKERID-05** Hồ sơ chỉ nằm trong bộ nhớ của tab: tải lại là chưa đăng nhập; `localStorage` / `sessionStorage` không chứa email; khoá `ducker.pkce` bị xoá khi quay về.
- **REQ-DUCKERID-06** Từ chối ở Ducker ID, hoặc `state` bị sửa, thì về chưa đăng nhập, im lặng, URL sạch (tham số khác còn); `state` sai thì không bao giờ gọi tới token endpoint.
- **REQ-DUCKERID-07** `sessionStorage` bị chặn thì bấm SIGN IN không đưa đi đâu cả, người chơi vẫn ở Title.
- **REQ-DUCKERID-08** Nút SIGN IN có vùng bấm ≥ 44 px, nằm trong màn hình và không đè nút tiếng; menu tài khoản nằm trọn trong khổ 667×375 và 568×320 và mở ra không làm overlay xê dịch.
- **REQ-DUCKERID-09** Overlay tài khoản chỉ ở màn Title: rời Title (vào bản đồ) thì nó biến mất.
