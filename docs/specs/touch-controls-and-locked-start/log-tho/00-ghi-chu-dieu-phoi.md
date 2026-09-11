# Ghi chú của người điều phối — lần chạy 2026-09-12-0104

Đọc file này trước khi đọc log. Nó nói lần chạy này được dựng thế nào, và chỗ nào
kết quả bị giảm giá trị.

## Chạy trên bản đã deploy, không phải local

`entry` trong `red-routes.md` ghi `127.0.0.1:4173`. Lần chạy này **cố ý** dùng bản
đã phát hành: **https://levananhduc.github.io/web-game-duck-stomp/**

Kiểm trước khi chạy (2026-09-12): HTTP 200 · `<title>Duck Stomp</title>` ·
`data-scene` có mặt · `window.duckstomp` **không** có (đúng, bản production strip nó)
· 342 376 byte qua 8 request · `main` local = `origin/main` = `1eb16b8`, tức bản
đang chạy trên Pages đúng là bản trong repo.

Thời gian tới Title chơi được, **đo trên host thật**:

| Khổ | Điều kiện | Tới Title |
| --- | --- | --- |
| 1440×900 | mạng thật | 2121 ms |
| 667×375 | mạng thật | 1187 ms |
| 375×667 (dọc) | mạng thật | 1224 ms · `#rotate-gate` hiện |
| 667×375 | Fast 3G (562.5 ms RTT · 1.6 Mbit/s) | **4804 ms** |

4804 ms là số đo đầu tiên của **NFR-PERF-07** trên hạ tầng thật (ngân sách ≤ 5000 ms
— đạt, dư 196 ms). Số localhost tương ứng là 4519 ms.

Zoom canvas khác nhau theo khổ, nên **toạ độ bấm chuột không dùng lại được giữa các
phiên**: 1440×900 → canvas 1280×720 tại (120,135), zoom 4 · 667×375 → 640×360 tại
(20,11), zoom 2 · 375×667 → 320×180 tại (41,365), zoom 1.

## Giảm giá trị 1: các phiên chạy TUẦN TỰ, không song song

`lib/orchestration.md` cho phép 4 phiên đồng thời, dựa trên giả định mỗi phiên có
một browser context riêng. Ở máy này **không đúng**: playwright MCP expose **một**
browser với **một** page dùng chung, nên hai persona chạy cùng lúc sẽ điều hướng đè
lên nhau và log của cả hai thành rác.

Nên bảy phiên chạy **lần lượt**. Phạm vi không bị cắt — vẫn đủ 5 Red Route + 2 phiên
mù — chỉ dài hơn về thời gian.

## Giảm giá trị 2: cảm ứng là chuột nhấn-giữ, không phải cảm ứng thật

Context của playwright MCP có `hasTouch: false`, và `touchscreen` của Playwright chỉ
có `tap` chứ không giữ được. Nên phiên điện thoại (p01-RR-03, p07-blind) lái bằng
**chuột nhấn-giữ** ở viewport 667×375: không có `touchstart` thật nào xảy ra.

Hệ quả phải nhớ khi đọc log: mọi kết luận về cảm ứng ở đây là kết luận về **con trỏ**.
Nếu game phân biệt `pointerType` thì hai thứ này không tương đương.

## Gieo save: ai bị gieo, gieo gì

Persona **không** được biết mình bị gieo save; họ chỉ biết "hôm qua tôi có chơi".
Người điều phối gieo `localStorage` key `platformer.save.v1` trong cùng context
**trước khi** dispatch, rồi persona tự mở link.

| Phiên | Context | Gieo |
| --- | --- | --- |
| p03-RR-01 | sạch | không |
| p02-RR-02 | gieo | màn 1–2 `cleared`, best 41 200 ms và 58 800 ms, coins 6 và 5 |
| p01-RR-03 | sạch + Fast 3G | không |
| p05-RR-04 | sạch | không |
| p04-RR-05 | gieo | màn 1–2 `cleared` (mở màn 3) |
| p06-blind | sạch | không |
| p07-blind | sạch | không |

## Cái persona được cho và cái bị giữ lại

Mỗi brief mang theo: hồ sơ persona, link, `goal_in_user_words` (phiên mù thì không
có), mã phiên, thư mục ảnh, và **cách lái canvas** (thang quy đổi bấm/giữ, cách bấm
chuột theo toạ độ canvas, lệnh cấm đọc trạng thái game bằng JavaScript).

Bị giữ lại, có chủ ý:

- **Điều khiển.** Không nói phím nào, không nói giữ hướng thì nhanh dần, không nói
  đạp đầu địch thì địch chết. Cả `overview.md` §6.1 đứng trên giả thiết người chơi tự
  hiểu; nói trước là xoá phép đo.
- **`canvas-driving.md` §Điểm đã hỏng.** Persona không được cảnh báo trước chỗ đã
  biết là hỏng. Bị kẹt vì lỗi thật là số đo; được cảnh báo trước thì chỉ còn là diễn.
- **Mục "Chỗ persona này đáng giá nhất"** trong file persona. Đó là ghi chú cho người
  đọc báo cáo. Nói cho persona biết mình đang được dùng để đo cái gì thì họ sẽ cố
  gắng hơn mức nhân vật của mình — và đúng cái đó là thứ cần đo.

## Ghi chú thu thập log

`ux-persona` không có tool ghi file (chỉ có trình duyệt). Nên mỗi phiên trả lời về
dưới dạng văn bản và **người điều phối** ghi nguyên văn vào
`runs/2026-09-12-0104/<mã-phiên>.md`. Không rút gọn, không sửa văn.
