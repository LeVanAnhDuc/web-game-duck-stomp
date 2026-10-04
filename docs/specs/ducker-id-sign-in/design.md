# Đăng nhập Ducker ID (tuỳ chọn, sau cờ) — thiết kế riêng cho Duck Stomp

> **Trả lời:** Duck Stomp hiện thực đăng nhập Ducker ID thế nào, đặt ở đâu, trông ra sao?
> **Trạng thái:** 🟢 đủ
> **Nguồn chung:** `web-game/docs/superpowers/specs/2026-10-04-ducker-id-sign-in-design.md`
> (hành vi, copy, env — ràng buộc). File này chỉ là phần riêng của repo này.
> **Quyết định:** ADR-0013 · **FR/US:** FR-20 · US-06

## Phạm vi

Chỉ **danh tính**: nút đăng nhập, avatar, menu tài khoản. Không đụng save, điểm,
cài đặt. Ship dark: chỉ hiện khi cờ `VITE_FEATURE_DUCKER_SIGN_IN=true` và đủ bốn giá
trị `VITE_DUCKER_*`; `deploy.yml` không truyền chúng.

## Vị trí và hình dạng

Game không có React (ADR-0009), nên đây là một **DOM overlay** theo mẫu `#rotate-gate`:
phần tử tĩnh `#account-overlay` trong `index.html`, CSS ở đó, nội dung do
`src/game/accountOverlay.ts` dựng.

- **Chỉ hiện khi TitleScene đang chạy** (nghe `create` / `shutdown` của scene). Vào
  bản đồ hay màn chơi là ẩn.
- **Góc phải trên của canvas, bên trái nút tiếng** của TitleScene (nút tiếng rộng `44s`,
  tâm cách mép `30s`; `s = zoom / 2`). Vị trí tính từ `getBoundingClientRect()` của
  canvas vì trang letterbox canvas, và tính lại khi `resize`.
- Màn chặn xoay (`z-index: 10`) che overlay (`z-index: 5`) ở khổ dọc.

## Giao diện (token của `docs/design-system/platformer/MASTER.md`)

Pixel: `border-radius: 0`, viền 2px, bóng đặc `4px 4px 0 var(--night-deep)`, **đổi trạng
thái tức thì, không `transition`**. Chữ nhãn `Pixelify Sans`. `--gold` chỉ dùng cho
vòng focus (bất biến #7); không có chữ ink trên nền gold. Icon là hình người pixel 8×7
vẽ bằng `<rect>` với `shape-rendering: crispEdges`, cùng cách với mũi tên của
`#rotate-gate` — không Lucide/Heroicons.

| Trạng thái | Hiện |
| --- | --- |
| idle (cờ tắt, hoặc chưa khởi động) | Không gì cả; phần tử ẩn và rỗng |
| signed-out | Nút `SIGN IN` (icon + nhãn), cao ≥ 44px |
| loading | Nút `SIGNING IN...`, `disabled`, `aria-busy` |
| signed-in | Nút avatar (`aria-label="Ducker ID account"`, `aria-haspopup="menu"`, `aria-expanded`) — ảnh nếu có, không thì chữ cái đầu |
| menu mở | Panel: tên, email (`system-ui`), mục `DUCKER ID PROFILE` (`target=_blank rel="noopener noreferrer"`), mục `SIGN OUT` |

Menu mở bằng click, đóng bằng Esc (trả focus về avatar), bấm ra ngoài, hoặc kích hoạt
một mục. Phím bấm trên overlay bị chặn không cho lên `window`, để Enter trên `SIGN IN`
không đồng thời bấm PLAY của Phaser.

## Nhãn (ASCII, `src/core/strings.ts`)

`SIGN IN` · `SIGNING IN...` · `DUCKER ID PROFILE` · `SIGN OUT` · aria `Ducker ID account`.
Tên và email của người chơi **không** nằm trong bảng: chúng là dữ liệu của họ, vẽ bằng
`system-ui` (ADR-0005 giữ nguyên cho nhãn).

## File

| File | Vai trò |
| --- | --- |
| `src/core/auth.ts` | Kiểu, `readDuckerConfig`, `initialOf` — thuần |
| `src/core/pkce.ts` | PKCE (RFC 7636) — thuần |
| `src/game/auth/config.ts` | **Nơi duy nhất** đọc `import.meta.env.VITE_*` (theo tên literal) |
| `src/game/auth/duckerAuth.ts` | `startLogin`, `consumeCallback` / `captureCallback`; `sessionStorage` khoá `ducker.pkce` |
| `src/game/auth/requests.ts` | `exchangeCode`, `fetchProfile` — hai lệnh `fetch` duy nhất |
| `src/game/auth/session.ts` | Session store ngoài (subscribe/getSnapshot), đổi code đúng một lần |
| `src/game/accountOverlay.ts` | Overlay DOM và nối dây với TitleScene |
| `src/main.ts` | `import './game/auth/session'` đầu tiên (bắt callback trước mọi code game) và `mountAccountOverlay(game)` |
| `index.html` | `#account-overlay` + CSS pixel |
| `vite.config.ts` · `.github/workflows/deploy.yml` | `base` theo `VITE_BASE_PATH`; deploy đặt `/<repo>/`, không truyền cờ |
| `playwright.config.ts` | Server thứ hai `:4174` bật cờ với issuer giả; server `:4173` ép cờ tắt |

## Ngoại lệ NFR

*`sessionStorage` khoá `ducker.pkce` là storage duy nhất, xoá khi người chơi quay về;
mạng chỉ tới issuer đã cấu hình, chỉ sau khi người chơi bấm đăng nhập; cờ tắt thì không
có gì.* Áp cho NFR-DATA-01, NFR-SEC-04, NFR-I18N-04 (xem ADR-0013 và `nfr.md`).

## Kiểm

- Unit: `core/auth.test.ts`, `core/pkce.test.ts` (node); `game/auth/*.test.ts`,
  `game/accountOverlay.test.ts` (happy-dom).
- e2e: `tests/ducker-id-sign-in.spec.ts` (cờ bật, `:4174`),
  `tests/ducker-id-sign-in-off.spec.ts` (cờ tắt, `:4173`: không nút, không request ra
  ngoài ngoài font, không đụng storage, không đọc `location.search`).
