# ORIENTATION — Quyết định

Đi cặp với `docs/requirements/orientation.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-16), `docs/01-product/journeys.md` (US-03 bước 1–2 + "xoay ngay
  giữa lúc đang nhảy"), `docs/decisions/0004-force-landscape-two-controls.md`, `docs/decisions/0005-english-ascii-ui-strings.md`.
- **Code:** `client/src/game/rotateGate.ts` (tạm dừng trước rồi mới hiện; chỉ gỡ tạm dừng do mình gây ra),
  `client/src/core/scale.ts` (`isPortrait`: cao > rộng), `client/index.html` (`#rotate-gate`, không chữ).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** "Xoay" được dựng bằng đổi kích thước viewport (375×667 ↔ 667×375); `rotateGate` nghe `resize` và
  `orientationchange`, và chỉ dựa vào tỉ lệ cao/rộng.
- **Q2** "Không chữ" = `innerText` của màn chặn rỗng sau khi bỏ khoảng trắng; hình là hai khối điện thoại và một SVG
  `aria-hidden`.
- **Q3** REQ-ORIENTATION-01/02/03 chỉ dùng DOM (`#rotate-gate`, `data-scene`) nên chạy cả trên prd;
  REQ-ORIENTATION-04/05 đọc trạng thái tạm dừng của scene → `@dev-build`.
- **Q4** "Người chơi khoá xoay màn hình → màn chặn hiện mãi" (US-03) là hệ quả đã chấp nhận ở ADR-0004, không test.

## Tài khoản test

Không có tài khoản.

## Ngoài phạm vi

_(không có)_

## Tech debt liên quan

_(không có)_
