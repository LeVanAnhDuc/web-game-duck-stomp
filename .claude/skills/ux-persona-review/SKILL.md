---
name: ux-persona-review
description: Use when you want to know how a real stranger experiences Duck Stomp — dispatches blind persona subagents that actually play the running game in a browser, captures their first five seconds and their gut reaction, then returns UX/UI findings mapped to ISO 9241-11, LATCH, trigger words, interaction design, visual hierarchy, visual craft and trust/desirability, every finding backed by a quote or a screenshot from a session log. This product is a canvas game with no DOM and no text input, so read references/canvas-driving.md before dispatching anyone. Trigger on "chay persona", "test UX", "nguoi choi that thay sao", "game co de hieu khong", "an tuong dau", "UX review", "red route", or before opening a PR that changes what the player sees or feels.
---

# Duck Stomp — UX persona review

## Sản phẩm này

- Thư mục: `D:/Learn/web-app-ecosystem/web-game/web-game-platformer`
- Port: dev `:4173` · preview bản build `:4174` (cả hai bind `127.0.0.1`, `--strictPort`)
- Bật app:
  - phiên thường → `npm run dev -- --port 4173 --strictPort --host 127.0.0.1`
  - phiên có throttle mạng → `npm run build && npm run preview -- --port 4174 --strictPort --host 127.0.0.1`
    **Bắt buộc dùng bản build cho throttle.** Dev server trả module chưa bundle;
    Fast 3G trên dev server không tải xong trong 30s, và con số đó không nói gì về
    thứ người chơi thật tải. Đo 12.09.2026: bản build 8 request / 339 KB,
    tới Title chơi được **658ms** không throttle, **4519ms** ở Fast 3G.
- Dấu hiệu nhận biết đúng app: `<title>` là `Duck Stomp`, và
  `document.documentElement.dataset.scene` trả về một trong
  `Boot·Preload·Title·WorldMap·Game·Hud·Pause·LevelComplete`. Không có thuộc tính đó
  thì đang mở sai app — cả workspace này chỉ game này publish nó (`src/main.ts:99`).
  Trang đúng có **một** `<canvas>` 640×360 letterbox giữa viewport 667×375.
- Email dùng-một-lần cho persona: ⚪ **không áp dụng.** Game không có một ô nhập nào,
  không tài khoản, không thu bất kỳ PII nào (NFR-DATA-01). Persona nào được "nhắc"
  nhập email là persona đang bị dẫn dắt sai.
- Tài khoản thử: ⚪ **không có.** Trạng thái duy nhất là `localStorage`
  key `platformer.save.v1` — cách gieo save cho Red Route cần tiến độ cũ nằm ở
  `references/canvas-driving.md` §Gieo save.

## Chạy

Quy trình chung nằm ở `lib/orchestration.md`. Đọc nó trước.

**Rồi đọc `references/canvas-driving.md` trước khi dispatch persona đầu tiên.**
Đây là một game trên canvas: không có DOM để snapshot, không có role để click, và
`browser_press_key` **không** điều khiển được nhân vật. Một persona không được dặn
điều này sẽ báo cáo "game không nhận bàn phím" — một phát hiện sai hoàn toàn, nghe
rất thuyết phục, và tốn cả lần chạy để phát hiện ra.

**Và mỗi brief dispatch phải mang theo hai mục của `canvas-driving.md` — §Công thức
chơi bằng bàn phím và §Công thức chơi bằng chuột / cảm ứng — dán vào cuối
`lib/persona-brief.tpl`.** `lib/` bị `--update` ghi đè nên không nhét được vào đó;
persona thì không có tool đọc file, nên nếu người điều phối không dán thì persona
không có cách nào biết. Dán **cách lái**, tuyệt đối không dán §Điểm đã hỏng: nói
trước cho người chơi biết chỗ nào hỏng là phá chính phép đo.

Dữ liệu riêng của sản phẩm này:

| Cần gì | Ở đâu |
| --- | --- |
| Red Route đã chốt | `references/red-routes.md` |
| Cách lái một game canvas — đã kiểm thật | `references/canvas-driving.md` |
| Dàn persona | `references/personas/` |
| Rule đã dùng để sinh persona | `references/persona-rules.md` |
| Khung đánh giá, luật xếp hạng | `lib/frameworks.md` |
| Thứ tự công cụ trình duyệt | `lib/browser-capability.md` |
| Token thiết kế (thắng cảm nhận thẩm mỹ chung) | `docs/design-system/platformer/MASTER.md` |

## Ba chỗ khung đánh giá lệch với sản phẩm này

`lib/frameworks.md` viết cho web app có form và có đăng nhập. Nó bị `--update` ghi
đè nên **không sửa nó**; ba chỗ lệch dưới đây là bản ghi đè của project, và
`ux-expert` phải nhận brief kèm mục này.

1. **Lăng kính Form design → ⚪ không áp dụng.** Không có ô nhập, không có nhãn,
   không có báo lỗi nhập liệu trong toàn bộ game. Ghi "không áp dụng" chứ đừng đi
   tìm form; cũng đừng thay nó bằng một lăng kính tự nghĩ ra.
2. **Bảng ấn tượng đầu, dòng "Dám nhập email" → ⚪ không áp dụng.** Thay bằng
   **"Có bấm PLAY không, và mất bao lâu mới dám bấm"**: đó là hành động rủi ro duy
   nhất mà trang chủ đòi ở người lạ. Giữ nguyên dòng "Đoán đúng đây là trang gì" —
   với một game không có chữ hướng dẫn, đó là thước gắt nhất.
3. **Hiệu suất** = trung vị bước thực tế / `min_steps` chỉ đúng cho phần **menu**.
   Trong màn chơi, đếm số lần bấm phím giữa hai người chơi là vô nghĩa (giữ phím 2
   giây là một lần bấm). Nên mỗi Red Route ở đây khai thêm `par_deaths` và
   `par_time_s`; xem phần header của `references/red-routes.md`.

## Hai agent

`ux-persona` (Sonnet, chỉ có trình duyệt) đóng vai người chơi.
`ux-expert` (Opus, chỉ có Read) dịch log sang khung đánh giá.

Cả hai định nghĩa ở `.claude/agents/`. Nếu Claude Code báo không tìm thấy agent
type, phiên hiện tại được mở trước khi hai file đó tồn tại — khởi động lại phiên.

## Bảo trì

Nâng cấp phần logic: `bash D:/Learn/web-app-ecosystem/.claude/skills/ux-persona-lab/scripts/install.sh D:/Learn/web-app-ecosystem/web-game/web-game-platformer --update`
Lấy lại rule persona mới: cùng lệnh với `--refresh-rules`.
Cả hai đều **không** đụng tới `red-routes.md`, `canvas-driving.md` và `personas/`.
Chúng cũng không đụng file này — mọi thứ riêng của Duck Stomp phải nằm ở đây hoặc
trong `references/`, đừng bao giờ viết vào `lib/`.

⚠️ **`--update` render lại `.claude/agents/*.md` từ template và xoá mất một bản sửa
bắt buộc.** Template khai `tools: mcp__playwright__*`, một wildcard **không khớp gì**
ở máy này — plugin playwright expose tool dưới tiền tố
`mcp__plugin_playwright_playwright__`, nên persona sẽ không có một công cụ trình
duyệt nào. Sau **mỗi** lần `--update`, mở `.claude/agents/ux-persona.md` và đặt lại
danh sách tool tường minh (bản hiện tại là bản mẫu để copy), rồi `git diff` để chắc
chắn. Đây là lỗi im lặng: agent vẫn dispatch được, chỉ là không mở được link.
