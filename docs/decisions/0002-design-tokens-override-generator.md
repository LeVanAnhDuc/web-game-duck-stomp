# ADR-0002 · Palette đặt tên theo nghĩa trong game, override đề xuất của ui-ux-pro-max

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** NFR-A11Y-01 · NFR-A11Y-05 · NFR-I18N-01

## 1. Bối cảnh

`design-bootstrap` chia việc: `ui-ux-pro-max --design-system` cấp **ràng buộc**,
`frontend-design` cấp **lựa chọn** và có quyền override màu/font của bước 1 (nhưng
không được override luật a11y).

Bước 1 trả về: pattern landing page `Hero → value prop → proof → CTA`, motion GSAP
ScrollTrigger, palette `#DC2626`/`#2563EB`/`#22C55E` trên `#0F172A`, và cặp font
`Press Start 2P` / `VT323`. Ba trong bốn thứ đó không dùng được: app này không có
landing page, không có chỗ nào cuộn, và palette kia đúng là red-600/blue-600/
green-500/slate-900 mặc định của Tailwind — chọn khi chưa biết pack art có màu gì.

## 2. Quyết định

Palette 9 token **đặt tên theo nghĩa trong game** (`--gold` = xu/kỷ lục/CTA/focus,
`--heart` = chỉ máu, `--locked` = chưa mở) thay vì `primary/secondary/accent`. Ngữ
nghĩa khoá công dụng: không ai làm CTA màu đỏ, vì đỏ *nghĩa là* mất máu.

Chữ: **Jersey 15** (display) + **Pixelify Sans** (UI/HUD, variable 400–700).

Nền là **dải dọc hai tông**, không phải một màu phẳng.

Toàn bộ tương phản đã **đo bằng WCAG 2.1**; ba token đầu (`ink-dim`, `heart`,
`locked`) đo ra 4.39 / 2.86 / 1.74 và fail, đã sửa rồi đo lại.

Chi tiết ở `docs/design-system/platformer/MASTER.md`.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Giữ nguyên output bước 1 | Palette là default của category theo nghĩa chặt nhất, và không biết gì về pack art |
| `Press Start 2P` / `VT323` | Press Start 2P là font game bị dùng nhiều nhất và không đọc được ở cỡ nhỏ — mà HUD phải hiện `0:42` cỡ nhỏ trên điện thoại. VT323 là font terminal |
| `Silkscreen` cho display | Là font pixel phổ biến thứ hai sau Press Start 2P. Jersey 15 hẹp hơn, và chiều dọc là tài nguyên khan nhất ở màn ngang 375px cao |
| Nền tối phẳng + một màu nhấn chói | Công thức mặc định của "UI game retro", cùng nhóm với scanline CRT và glow neon |
| Icon từ Heroicons/Lucide (checklist bước 1 yêu cầu) | Icon vector hiện đại cạnh sprite pixel là hai hệ dán vào nhau. Giải bằng cách lấy icon **từ chính pack** — vẫn thoả luật "không emoji làm icon" |

## 4. Hệ quả

**Được:**
- Token không thể dùng sai chỗ, vì tên nó là nghĩa của nó
- Mọi tỉ lệ tương phản là số đo thật, không phải ước lượng
- `instant transitions` giải được mâu thuẫn nội tại của output bước 1, và thân thiện hơn với `prefers-reduced-motion`

**Mất / phải chấp nhận:**
- Palette **chưa đối chiếu với pack** — pack chưa tải. `MASTER.md` đang 🟡 vì lý do này. Lệch thì sửa token, không sửa sprite
- Lệch khỏi output của generator, nên phiên sau phải đọc §Xuất xứ của `MASTER.md` mới hiểu

**Điều kiện xem lại:** sample palette thật của pack thấy 9 token không hoà được với
hue chủ đạo của nó.
