# ADR-0013 · Đăng nhập Ducker ID tuỳ chọn, chỉ danh tính, ship dark sau một cờ

> **Ngày:** 2026-10-04
> **Trạng thái:** accepted
> **Liên quan:** FR-20 · US-06 · NFR-DATA-01 · NFR-SEC-04 · NFR-I18N-04 · ADR-0005 · ADR-0009

## 1. Bối cảnh

Người dùng yêu cầu (2026-10-04) 11 game web trong workspace có "Đăng nhập bằng Ducker
ID" giống `web-app-calculate-badminton`: OIDC Authorization Code + PKCE, public
client. Phạm vi là **danh tính** — nút đăng nhập, avatar + tên, menu tài khoản. Lưu
tiến độ, điểm, cài đặt **không đổi**. Giá trị cấu hình lấy từ env thật, **không bao
giờ import cứng rồi fallback về giá trị cứng**. Tính năng phải ẩn trên bản đã deploy.

Hai điều trong repo này va vào yêu cầu: Non-Goal "không có tài khoản" ở
`overview.md`, và NFR-DATA-01 "không thu thập PII". Và repo **không có React**
(ADR-0009), nên bộ view dùng chung không áp.

## 2. Quyết định

Thêm đăng nhập Ducker ID tuỳ chọn, **chỉ bật khi** `VITE_FEATURE_DUCKER_SIGN_IN` đúng
bằng chuỗi `true` **và** cả bốn `VITE_DUCKER_ISSUER` / `_CLIENT_ID` / `_SCOPE` /
`_PROFILE_PATH` có giá trị. Không giá trị nào có mặc định trong code: thiếu là tắt
(`readDuckerConfig` trả `null`). `deploy.yml` **không truyền** cờ và các biến đó nên
GitHub Pages không có nút; chỉ chạy được local.

- **Cấu trúc theo ranh giới sẵn có.** Phần thuần (`core/auth.ts`, `core/pkce.ts`) nằm
  trong `core/` và qua `lint:core`. Phần chạm `window` / `sessionStorage` / `fetch`
  (`game/auth/*`) nằm ngoài `core/`, vì `core/` không được biết trình duyệt.
- **UI là DOM overlay** `game/accountOverlay.ts`, theo mẫu `#rotate-gate`: nút
  `SIGN IN` / `SIGNING IN...`, avatar, menu (tên, email, `DUCKER ID PROFILE`,
  `SIGN OUT`). Chỉ hiện khi TitleScene đang chạy. Phím bấm trên overlay không lan tới
  Phaser (Enter trên SIGN IN không được đồng thời bấm PLAY).
- **Nhãn vẫn ASCII** trong `core/strings.ts` (ADR-0005 giữ nguyên). **Chỉ** tên/email
  của chính người chơi được vẽ bằng `system-ui` — đó là dữ liệu của họ, không phải
  chuỗi của game, và font pixel không có glyph tiếng Việt.
- **Base path đi theo env:** `vite.config.ts` dùng `loadEnv` → `base: VITE_BASE_PATH`
  thay cho `'./'`; `deploy.yml` đặt `/<tên-repo>/`. `redirect_uri` = origin + base,
  phải khớp tuyệt đối với URI đã đăng ký ở Ducker ID nên base tương đối không dùng
  được.
- **Phụ thuộc mới:** `happy-dom` (devDependency) cho test DOM của overlay và của
  `game/auth/*`. Test chọn môi trường theo từng file bằng docblock; test của `core/`
  vẫn chạy ở `node`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Vẽ nút trong Phaser (`Button`) | Không vẽ được tên có dấu tiếng Việt bằng font pixel (ADR-0005); tên người chơi cần `system-ui` |
| Bọc một lớp React cho overlay | Thêm framework vào một game không cần nó — đúng thứ ADR-0009 đã từ chối |
| Đặt `game/auth/*` trong `core/` | `core/` phải chạy được ở `node` và không biết `window`; storage/fetch là thứ `core/` không được chạm |
| Cho mỗi biến một giá trị mặc định | Người dùng cấm rõ: không import cứng rồi fallback về giá trị cứng |
| Lưu profile vào localStorage để giữ đăng nhập qua lần tải lại | Lưu PII xuống đĩa — ngoài phạm vi "chỉ danh tính", và đổi NFR-DATA-01 sâu hơn mức cần |

## 4. Hệ quả

**Ngoại lệ có giới hạn cho NFR (đã ghi vào `nfr.md`):** *`sessionStorage` khoá
`ducker.pkce` là storage duy nhất, xoá khi người chơi quay về; mạng chỉ tới issuer đã
cấu hình, chỉ sau khi người chơi bấm đăng nhập; cờ tắt thì không có gì.* Áp cho
NFR-DATA-01 (PII chỉ trong bộ nhớ tab), NFR-SEC-04 (5 biến `VITE_*` công khai, tuỳ
chọn) và NFR-I18N-04 / ADR-0005 (nhãn ASCII, tên người chơi `system-ui`).

**Được:** game chạy byte-theo-byte như cũ khi cờ tắt; đăng nhập không chặn gì (mọi lỗi
chỉ hạ về chưa-đăng-nhập); tải lại là chưa đăng nhập nên không có gì để rò.

**Mất / phải chấp nhận:**
- Bản build **không còn chạy từ `file://`**: `base` tuyệt đối thay cho `./`.
- Một devDependency mới (`happy-dom`) và hai file e2e mới với một dev server thứ hai
  (`:4174`, cờ bật, issuer giả `http://ducker.test`).
- **Nợ `[skip release]`:** người dùng chọn gắn `[skip release]` vào mọi commit của PR
  này. `release.yml` quét cả khoảng từ tag cuối, nên mọi push sau đó lên `main` cũng bị
  bỏ qua tới khi có tag mới hơn. Lần phát hành thật kế tiếp phải cắt tay một lần:
  `pnpm release:next`, rồi `git tag vX.Y.Z && git push origin vX.Y.Z`, rồi
  `gh release create vX.Y.Z --notes "$(pnpm -s release:notes)"`. Sau đó khoảng sạch và
  tự động chạy lại. Đã ghi ở `backlog.md` §Nợ kỹ thuật.

**Điều kiện xem lại quyết định này:** khi bật cờ ở bản deploy (cần đăng ký client ở
Ducker ID admin với redirect URI `https://levananhduc.github.io/web-game-duck-stomp/`,
thêm 5 biến vào repo variables và truyền chúng trong `deploy.yml`), hoặc khi game muốn
gắn tiến độ/điểm với danh tính — đó là một quyết định mới, không phải mở rộng của ADR
này.
