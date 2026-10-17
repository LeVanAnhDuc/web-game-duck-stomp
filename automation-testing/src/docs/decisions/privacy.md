# PRIVACY — Quyết định

Đi cặp với `docs/requirements/privacy.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/nfr.md` (NFR-DATA-01 + bảng "Trường PII", NFR-SEC-04, NFR-REL-01 "lệnh gọi ra
  ngoài duy nhất là Google Fonts"), `docs/01-product/overview.md` (Non-Goals), `docs/decisions/0013-ducker-id-sign-in-behind-a-flag.md`.
- **Code:** `client/src/core/storage.ts` (`SaveData`), `client/index.html` (Google Fonts), `client/src/game/auth/` (chỉ
  chạy khi cờ bật).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Phạm vi là bản cờ tắt (bản deploy). Ngoại lệ PII khi cờ bật (tên / email trong bộ nhớ) đã kiểm ở module
  `ducker-id` (TC-DUCKERID-006).
- **Q2** "Một vòng chơi" = Title → bản đồ → màn 1 → về đích; về đích cần `window.duckstomp` nên TC-PRIVACY-001 gắn
  `@dev-build`. TC-PRIVACY-003 (mạng) dừng ở lúc đang chơi màn 1 để chạy được cả trên prd.
- **Q3** `data:` và `blob:` không phải request mạng ra ngoài (icon trang là `data:` SVG; texture sinh trong trình duyệt).

## Tài khoản test

Không có tài khoản.

## Ngoài phạm vi

- Chơi offline sau khi đã tải — NFR không hứa (không có service worker).

## Tech debt liên quan

_(không có)_
