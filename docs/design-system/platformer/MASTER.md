# Design System Master — Platformer

> **Trả lời:** Màu, chữ, khoảng cách, component của UI game này lấy ở đâu?
> **Trạng thái:** 🟡 một phần — palette chrome đã chốt và đã đo; còn chờ đối chiếu với palette thật của pack
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** đổi màu/chữ · thêm một component UI mới · sau khi sample palette pack

> **LOGIC:** Khi làm một màn hình cụ thể, xem `pages/<tên-màn>.md` trước.
> File đó tồn tại thì nó **override** file này. Không thì theo đúng file này.
>
> **KHÔNG regenerate file này.** `design-bootstrap` chạy một lần cho cả dự án.
> Chạy lại `search.py --design-system` sẽ ra kết quả khác và token trôi âm thầm.

---

**Dự án:** Platformer (game platformer 2D pixel-art, web, chơi ngang)
**Stack:** Phaser 3.90 + TypeScript + Vite · static, không backend
**Art game:** Pixel Adventure (Pixel Frog) — CC0 1.0 Universal
**Design Dials:** Variance 6/10 · Motion 3/10 · Density 3/10

## Xuất xứ — cái gì của bước 1, cái gì tôi override

`ui-ux-pro-max --design-system` cấp **ràng buộc**. `frontend-design` cấp **lựa chọn**.
Bảng này để phiên sau không phải đoán tại sao file khác output của script. Lý do đầy
đủ nằm trong ADR-0002.

| Bước 1 đề xuất | Xử lý | Vì sao |
| --- | --- | --- |
| Pattern `Hero-Centric Design`, section `Hero → value prop → proof → CTA` | **Bỏ hẳn** | Đó là bố cục landing page bán hàng. Dự án này có 5 màn hình game, không có landing page |
| Motion `Scroll Reveal` + GSAP ScrollTrigger | **Bỏ hẳn** | Không có chỗ nào cuộn. Camera cuộn nằm trong canvas, Phaser lo |
| `#DC2626` / `#2563EB` / `#22C55E` trên `#0F172A` | **Thay** | Đúng là red-600/blue-600/green-500/slate-900 mặc định của Tailwind — default của category, và chọn khi chưa biết pack có màu gì |
| `Press Start 2P` / `VT323` | **Thay** | Press Start 2P là font game bị dùng nhiều nhất và không đọc được ở cỡ nhỏ; HUD phải hiện `0:42` cỡ nhỏ trên điện thoại. VT323 là font terminal |
| `border-radius` 8/12/16px · shadow mờ · `transition 200ms ease` | **Thay** | Bo góc và bóng mờ phá lưới pixel. Xem §Lưới pixel |
| Component `Inputs`, `Modals` | **Bỏ** | Game này không có một ô nhập text nào |
| Thang spacing, thang density, luật a11y, checklist | **Giữ** | `design-bootstrap` nói rõ: a11y và UX của bước 1 **không** được override |
| `Key Effects: instant transitions` **vs** `Anti-pattern: instant state changes` | **Giải: chọn instant** | Bước 1 tự mâu thuẫn. Game pixel không có easing — `200ms ease` trên nút pixel đọc ra là lỗi render. Instant cũng thân thiện hơn với `prefers-reduced-motion` |

## Palette

Điểm khác biệt của hệ này: **token đặt tên theo nghĩa trong game**, không theo
`primary / secondary / accent`. Vì thế không ai vô tình làm nút CTA màu đỏ — đỏ
**nghĩa là** mất máu. Ngữ nghĩa khoá công dụng.

| Token | Hex | Nghĩa — chỉ dùng cho đúng việc này |
| --- | --- | --- |
| `--night-deep` | `#131735` | Đáy dải trời. Nền chữ trên mặt vàng |
| `--night` | `#262E5E` | Nền chính. Đỉnh dải trời |
| `--panel` | `#2E376B` | Thẻ, khung phủ, thanh HUD |
| `--ink` | `#F2ECDF` | Chữ chính. Trắng ngà, không phải trắng tinh — trắng tinh trên xanh indigo bị rung |
| `--ink-dim` | `#AEB4DA` | Chữ phụ, nhãn |
| `--gold` | `#F2B33D` | **Xu · kỷ lục · CTA chính · vòng focus.** Không dùng cho thứ khác |
| `--heart` | `#F4666B` | **Chỉ** máu và sát thương. Không bao giờ là nút |
| `--locked` | `#7B84BA` | Node chưa mở, thứ bị vô hiệu |
| `--on-gold` | `#131735` | Chữ/icon nằm **trên** mặt vàng |

Nền không phải một màu phẳng: **dải dọc từ `--night-deep` ở đáy lên `--night` ở
trên**, lặp lại kiểu trời của pack. Nền tối phẳng cộng một màu nhấn chói là công
thức mặc định của "UI game retro"; dải hai tông là thứ rút từ chính thế giới game.

### Tương phản — đo bằng WCAG 2.1, không phải ước lượng

| Cặp | Tỉ lệ | Kết luận |
| --- | --- | --- |
| `ink` / `night-deep` | 14.85:1 | ✅ chữ thường |
| `ink` / `night` | 10.91:1 | ✅ chữ thường |
| `ink` / `panel` | 9.51:1 | ✅ chữ thường |
| `ink-dim` / `night` | 6.33:1 | ✅ chữ thường |
| `ink-dim` / `panel` | 5.52:1 | ✅ chữ thường |
| `gold` / `night` | 6.91:1 | ✅ chữ thường |
| `gold` / `panel` | 6.02:1 | ✅ chữ thường |
| `on-gold` / `gold` | 9.40:1 | ✅ chữ thường |
| `heart` / `night` | 4.26:1 | ✅ icon (cần ≥3:1) |
| `heart` / `panel` | 3.71:1 | ✅ icon |
| `locked` / `night` | 3.58:1 | ✅ icon |

**Cặp bị cấm — `ink` trên `gold` = 1.58:1.** Mặt vàng luôn dùng `--on-gold`.
Đây là luật, không phải bug cần sửa.

`ink-dim`, `heart`, `locked` là kết quả của một vòng sửa: giá trị đầu lần lượt đo ra
4.39 / 2.86 / 1.74 và **fail**. Đừng đổi ba màu này mà không đo lại.

### Hai palette, hai phạm vi

- **Trong canvas** (nhân vật, tile, địch, hiệu ứng): palette của **pack là nguồn
  đúng**. Không tô lại sprite theo token ở trên.
- **UI chrome** (Title, bản đồ, HUD, phủ, nút): dùng token ở trên.

🟡 **Còn treo:** chưa tải pack nên chưa sample được palette thật của nó. Việc phải
làm sau khi tải: kiểm 9 token trên có hoà với hue chủ đạo của pack không. Lệch thì
sửa **token**, không sửa sprite. Không viết hex nào của pack vào đây trước khi
sample thật.

## Chữ

Hai họ, rõ ràng khác nhau, mỗi họ một việc:

- **Display — `Jersey 15`** (400). Tên game, tiêu đề màn hình, số lớn ở bảng tổng kết.
  Chọn vì nó **hẹp**: màn ngang 375px cao thì chiều dọc là tài nguyên khan nhất, và
  tiêu đề không được ăn vào vùng chơi. Đây là lý do chức năng, không phải khẩu vị.
- **UI/HUD — `Pixelify Sans`** (variable 400–700). HUD, nhãn, chữ trên nút, dòng dữ
  liệu. Chọn vì nó **đọc được ở cỡ nhỏ** và có trục weight, nên HUD đậm 700 và nhãn
  phụ 400 mà không cần họ thứ ba.

```css
@import url('https://fonts.googleapis.com/css2?family=Jersey+15&family=Pixelify+Sans:wght@400..700&display=swap');
```

**Số trong HUD phải là `font-variant-numeric: tabular-nums`.** Thiếu nó thì đồng hồ
nhảy ngang mỗi giây vì các chữ số rộng khác nhau — đúng loại lỗi không ai báo mà ai
cũng thấy khó chịu.

| Vai | Cỡ | Họ · weight | Dùng ở đâu |
| --- | --- | --- | --- |
| `display-lg` | 48px | Jersey 15 400 | tên game trên Title, **chỉ ở đây** |
| `display` | 32px | Jersey 15 400 | tiêu đề màn hình, số kỷ lục |
| `hud` | 20px | Pixelify Sans 700 | tim, xu, đồng hồ — tabular |
| `body` | 16px | Pixelify Sans 400 | dòng dữ liệu, chữ trên nút |
| `label` | 12px | Pixelify Sans 500 | meta phụ. **Sàn tuyệt đối**, không nhỏ hơn |

Cỡ đều là bội của 4 để cạnh pixel rơi vào pixel thật ở cả 1x và 2x.

**Ngôn ngữ UI là tiếng Anh, và toàn bộ ASCII.** Không phải lựa chọn thẩm mỹ — là
ràng buộc đo được: subset `latin-ext` của cả Jersey 15 và Pixelify Sans phủ
`U+1E00–1E9F` và `U+1EF2–1EFF` nhưng **bỏ trống `U+1EA0–U+1EF1`**, tức thiếu gần
toàn bộ chữ tiếng Việt có dấu thanh trên nguyên âm có dấu phụ. `CHƠI` thì còn
glyph, `TẠM DỪNG` thì mất `Ạ` và `Ừ` — hỏng một phần, kiểu tệ nhất. Không font
pixel nào trên Google Fonts có subset `vietnamese`. Chi tiết ở ADR-0005.

**Chữ HOA là hợp lệ** cho nhãn nút và tiêu đề màn hình (`PLAY`, `START`, `PAUSED`,
`LEVEL 3 CLEAR`) — đó là ngôn ngữ của game arcade, không phải dấu hiệu máy sinh.

**Ba lối đánh chữ bị cấm** (đây mới là dấu hiệu nhận biết trang do máy sinh):
nhấn một từ trong tiêu đề bằng màu/đậm khác · nhãn eyebrow viết HOA giãn chữ đặt
**phía trên** một khối nội dung · thêm nhãn typographic mà nội dung không cần.

Số màn `1…6` **được** dùng số, vì đó là một chuỗi thật — người chơi đi tuần tự.
Đây là ngoại lệ có lý do, không phải cái cớ để đánh số mọi thứ khác.

## Lưới pixel — không thoả hiệp

| Luật | Vi phạm thì sao |
| --- | --- |
| **Độ phóng chỉ là số nguyên.** Base 320×180, phóng ×2 ×3 ×4… và letterbox phần dư | Phóng 2.34× làm pixel mờ và **rung** khi camera cuộn. Test vẫn xanh, ảnh chụp vẫn có, chỉ nhìn là thấy sai |
| Phaser: `pixelArt: true` + `roundPixels: true` | Sprite bị nội suy mượt — mất toàn bộ chất pixel |
| `border-radius: 0` mọi nơi | Bo góc mượt cạnh một sprite pixel đọc ra là hai hệ khác nhau dán cạnh nhau |
| Bóng là **khối đặc, không blur**: `box-shadow: 4px 4px 0 var(--night-deep)` | Bóng mờ là bóng của thế giới vector |
| Viền `2px solid`, không `1px` | 1px biến mất ở 1x trên màn hình dày pixel |

🟡 **Còn treo:** 320×180 chọn vì nó là 16:9 và phóng nguyên lên
640×360 / 960×540 / 1280×720. Ở 16px/tile nó cho tầm nhìn 20 × 11¼ tile — rộng
ngang, thấp dọc, đúng thứ platformer chơi ngang cần. **Phải xác nhận lại kích thước
tile thật của pack sau khi tải** rồi mới chốt số này.

## Khoảng cách

Bội của 4. Density 3/10 (thoáng), nhưng **cắt trần ở 32px**: viewport ngang chỉ cao
375px, không cõng được `--space-3xl: 96px` của bước 1.

| Token | Giá trị | Dùng |
| --- | --- | --- |
| `--space-xs` | 4px | khe icon–số trong HUD |
| `--space-sm` | 8px | khe trong dòng |
| `--space-md` | 16px | padding nút, khe giữa dòng dữ liệu |
| `--space-lg` | 24px | padding thẻ, padding phủ |
| `--space-xl` | 32px | **trần.** khe giữa các nhóm, lề màn hình |

## Component

Trạng thái đổi **tức thì**, không transition. Nhưng "tức thì" không có nghĩa là
"không thấy gì đổi" — mỗi trạng thái phải khác rõ ràng.

```css
:root {
  --night-deep:#131735; --night:#262E5E; --panel:#2E376B;
  --ink:#F2ECDF; --ink-dim:#AEB4DA; --gold:#F2B33D;
  --heart:#F4666B; --locked:#7B84BA; --on-gold:#131735;
}

/* CTA chính — CHƠI, VÀO MÀN, MÀN SAU */
.btn-gold {
  background: var(--gold); color: var(--on-gold);
  font: 400 16px 'Pixelify Sans'; padding: 16px 24px;
  border: 2px solid var(--on-gold); border-radius: 0;
  box-shadow: 4px 4px 0 var(--night-deep);
  cursor: pointer; min-height: 48px;
}
.btn-gold:hover  { background: #FFC85A; }
.btn-gold:active { box-shadow: 0 0 0 var(--night-deep); transform: translate(4px,4px); }
.btn-gold:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

/* Nút phụ — CHƠI LẠI, BẢN ĐỒ */
.btn-quiet {
  background: transparent; color: var(--ink);
  border: 2px solid var(--ink-dim); border-radius: 0;
  padding: 16px 24px; min-height: 48px; cursor: pointer;
}
.btn-quiet:hover { border-color: var(--ink); background: var(--panel); }

/* Thẻ và khung phủ */
.panel {
  background: var(--panel); border: 2px solid var(--night-deep);
  border-radius: 0; padding: 24px;
  box-shadow: 4px 4px 0 var(--night-deep);
}
.overlay-scrim { background: rgba(19,23,53,0.82); }  /* không backdrop-filter: blur */

/* Nút cảm ứng trong lúc chơi */
.touch-btn {
  background: rgba(242,236,223,0.35); border: 2px solid rgba(19,23,53,0.5);
  border-radius: 0;
}
.touch-btn:active { background: rgba(242,236,223,0.70); }
/* hướng ≥72px · nhảy ≥88px — nhảy to hơn vì bấm nhiều nhất và gấp nhất */
```

**Nhấn tức thì, không phải 200ms.** Nút cảm ứng "lún xuống" bằng cách bỏ bóng và
dịch đúng 4px — cùng khoảng với bóng, nên nó đọc ra là nút bị ấn chìm.

**Focus luôn là `--gold`**, vì gold đo được ≥6:1 trên cả `night` và `panel`.

**Icon lấy từ pack pixel-art**, không phải Heroicons/Lucide. Checklist bước 1 cấm
emoji làm icon — sprite của pack không phải emoji, và Heroicons cạnh pixel-art thì
lệch hẳn phong cách. Các glyph tim/xu/loa/tạm-dừng trong wireframe ASCII chỉ là ký
hiệu để vẽ, không phải asset.

## Signature element — dồn toàn bộ sự bạo gan vào một chỗ

**Đường trên bản đồ tự vẽ ra, từng đoạn pixel một, khi mở được node mới.**

Đây là animation **duy nhất** ngoài canvas trong toàn app, và nó chỉ chạy khi vừa
xong một màn — nó trả lời một hành động của người chơi và cho thấy **cái gì vừa
đổi**. Chạy một lần, khoảng 400ms, dịch theo bậc pixel chứ không nội suy mượt.
`prefers-reduced-motion: reduce` → vẽ ngay trạng thái cuối, không animate.

Mọi thứ còn lại giữ im: không scanline CRT, không glow neon, không parallax ở UI,
không hover animation trên thẻ, không hiệu ứng vào màn theo section. Ba thứ đầu là
bộ ba mặc định của "UI game retro" và chính vì thế bị cấm ở đây.

## Anti-pattern

- ❌ Phóng pixel bằng số **không nguyên** — lỗi nặng nhất, và nó im lặng
- ❌ `border-radius` khác 0 · bóng có blur · `backdrop-filter: blur`
- ❌ `transition` trên trạng thái nút (game pixel không có easing)
- ❌ Dùng `--heart` cho bất cứ thứ gì không phải máu; `--gold` cho bất cứ thứ gì
  không phải xu / kỷ lục / CTA / focus
- ❌ `ink` trên `gold`
- ❌ Emoji làm icon; và cả bộ icon vector hiện đại (Heroicons/Lucide) cũng không
- ❌ Chữ dưới 12px
- ❌ Số HUD không `tabular-nums`
- ❌ Vòng focus vô hình
- ❌ Scanline CRT, glow neon, marquee text
- ❌ Nhãn eyebrow viết HOA giãn chữ đặt trên một khối nội dung · nhấn một từ trong
  tiêu đề · nhãn typographic vô ích
- ❌ Chuỗi hiển thị có ký tự ngoài ASCII (xem §Chữ — font không có glyph)
- ❌ Chuỗi meta nối bằng dấu giữa dòng · dấu mũi tên cuối chữ trên nút

## Checklist trước khi giao UI

- [ ] Độ phóng canvas là số nguyên ở mọi khổ đã kiểm
- [ ] Tương phản: chữ ≥4.5:1, icon ≥3:1 — **đo**, không ước lượng
- [ ] Focus thấy được bằng bàn phím ở cả 5 màn hình
- [ ] `prefers-reduced-motion` tắt animation vẽ đường bản đồ
- [ ] Vùng bấm ≥44px; hướng ≥72px, nhảy ≥88px
- [ ] Nút cảm ứng hiện sau cú chạm đầu, ẩn sau phím đầu — không đoán theo user-agent
- [ ] Số HUD `tabular-nums`, đồng hồ không nhảy ngang
- [ ] Kiểm ở **667×375 (ngang) · 1024×768 · 1440×900**; 375 dọc chỉ để kiểm màn chặn xoay
- [ ] Không có thanh cuộn ngang ở bất kỳ khổ nào
- [ ] Không icon nào là emoji
