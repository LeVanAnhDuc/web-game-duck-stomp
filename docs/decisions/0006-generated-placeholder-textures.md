# ADR-0006 · Sinh texture placeholder trong code, đằng sau một lớp đổi được sang atlas thật

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** ADR-0002 · NFR-GAME-01 · NFR-PERF-08

## 1. Bối cảnh

ADR-0002 chốt art từ pack **Pixel Adventure (Pixel Frog)**, license CC0 đã xác nhận
từ trang gốc. Nhưng itch.io phát hành file qua **luồng trình duyệt** — trang "name
your own price" cần một session và một token, không có link tải trực tiếp lấy được
từ dòng lệnh.

Chặn ở đây thì toàn bộ phần còn lại đứng: physics, thiết kế màn, HUD, lưu tiến độ,
kiểm thử — không thứ nào cần sprite thật để **đúng**, chúng chỉ cần sprite để **đẹp**.

## 2. Quyết định

Toàn bộ art trong game do `game/textures` **sinh tại lúc boot** bằng
`Phaser.GameObjects.Graphics.generateTexture()`: tile địa hình, nhân vật hai dạng,
ba loại địch, xu, nấm, khối nứt, khối `?`, cờ, gai. Chúng là khối màu phẳng theo
palette placeholder trong `MASTER.md`, vẽ trên lưới pixel đúng kích thước tile thật.

Mọi texture nằm sau **một module duy nhất** với một bảng khoá texture. Thay pack
thật = nạp atlas trong `PreloadScene` và cho `game/textures` trả về khoá của atlas
thay vì texture tự sinh. Không có file gameplay nào nhắc tới tên texture cụ thể.

Kích thước tile chốt **16px**, nhân vật **16×16** — chọn để khớp nền 320×180 thành
đúng 20×11¼ tile, và là kích thước phổ biến nhất của pack platformer pixel.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Chặn lại, chờ người dùng tải pack | Đứng toàn bộ dự án vì một file zip 204 kB. Không thứ gì khác cần nó để đúng |
| Dùng browser automation tự tải từ itch.io | Chạm vào session trình duyệt của người dùng cho một việc họ làm trong 20 giây, và file rơi vào thư mục Downloads chứ không vào repo |
| Vẽ tay sprite PNG rồi commit | Tôi không vẽ được pixel-art tử tế; kết quả tệ hơn khối màu phẳng và lại **trông như art thật**, nên không ai biết nó là tạm |
| Bỏ pack, giữ hình khối vĩnh viễn | Đã bị loại từ lúc brainstorm — người dùng chọn pixel-art từ pack |

## 4. Hệ quả

**Được:**
- Không có asset nhị phân nào trong repo giai đoạn này, và không có bước tải nào
  trong `npm run dev`
- Bundle nhẹ, dễ đạt NFR-PERF-08
- Ranh giới texture bị buộc phải rõ ngay từ đầu — thay pack là sửa một module

**Mất / phải chấp nhận:**
- Game **trông như bản thử**, không như game hoàn thiện. Đây là món nợ có tên, đã
  ghi ở `backlog.md`
- Không kiểm được các thứ chỉ lộ ra với sprite thật: sprite 16×16 có vừa hitbox
  không, animation bao nhiêu frame, palette pack có hoà với 9 token UI không
- `MASTER.md` còn 🟡 cho tới khi sample được palette pack

**Điều kiện xem lại:** pack đã nằm trong `assets/`. Lúc đó viết ADR mới nếu kích
thước tile thật của pack khác 16px — vì con số đó lan vào nền 320×180 và vào mọi
file Tiled.
