# DUCKERID — Quyết định

Đi cặp với `docs/requirements/ducker-id.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `docs/02-requirements/scope.md` (FR-20), `docs/01-product/journeys.md` (US-06 + "Điều gì có thể sai"),
  `docs/decisions/0013-ducker-id-sign-in-behind-a-flag.md`, `docs/specs/ducker-id-sign-in/design.md`,
  `docs/02-requirements/nfr.md` (NFR-DATA-01 ngoại lệ có giới hạn, NFR-SEC-04), `README.md` §Commands (đăng nhập tuỳ chọn).
- **Code:** `client/src/game/auth/` (`config.ts` cờ + 4 biến, `duckerAuth.ts`, `session.ts`, `requests.ts`),
  `client/src/game/accountOverlay.ts` (DOM, chỉ ở Title), `client/src/core/auth.ts`, `client/src/core/pkce.ts`.
- **Test đã gom (gợi ý):** `src/tests/e2e/ducker-id/flag-off.e2e.ts`, `src/tests/e2e/ducker-id/sign-in.e2e.ts` (từ
  `tests/ducker-id-sign-in*.spec.ts`) — chuẩn hoá tại chỗ; issuer giả tách thành fixture `fakeIssuer`.

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Ducker ID thật không dùng: bản cờ bật là Vite dev server thứ hai (:4174) với issuer giả `http://ducker.test`;
  mọi request tới nó do fixture `fakeIssuer` trả lời (ADR-0013 đã chọn cách này cho bộ cũ).
- **Q2** Bản cờ tắt chạy ở project `app` — trên dev và trên prd (bản deploy, cờ tắt). Bản cờ bật ở `app-auth`, chỉ có trên dev.
- **Q3** "Từ chối ở Ducker ID" được dựng bằng `fakeIssuer.setMode("deny")` (issuer trả `error=access_denied` qua
  redirect thật); "state bị sửa" bằng mở thẳng URL callback với `state` lạ, như bộ cũ.
- **Q4** Nút SIGN IN khớp tên **chính xác**: nhãn lúc đang đi là "SIGNING IN...", chứa "SIGN IN".
- **Q5** Issuer treo, tab thứ hai, bấm đúp, Back giữa chừng (US-06) — đã có unit test ở `client/src/game/auth/*.test.ts`
  (timeout của request, cờ `starting`, phiên chờ cũ); không e2e lần này.
- **Q6** Hồ sơ có ảnh đại diện từ issuer (NFR-DATA-01 cho phép) — issuer giả không trả `picture`.

## Tài khoản test

Không có tài khoản thật. Người dùng giả của issuer giả: `DUCKER.user` trong `src/data/test-data.ts`.

## Ngoài phạm vi

- Đăng nhập với Ducker ID thật ở local (README) — thử tay.

## Tech debt liên quan

- Q5: các tình huống đồng thời của US-06 chỉ có unit test.
