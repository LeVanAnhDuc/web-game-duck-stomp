# ADR-0001 · Dùng Phaser 3.90 + Arcade Physics + Tiled, không dùng PixiJS

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** NFR-PERF-02

## 1. Bối cảnh

Game platformer 2D, 6 màn tay-thiết-kế, art pixel từ pack CC0, chạy static không
backend, phải chơi được cả trên desktop lẫn cảm ứng. Gợi ý ban đầu là "Phaser hoặc
PixiJS" — nhưng hai thứ đó không cùng hạng: PixiJS chỉ là renderer 2D, Phaser là
engine có sẵn physics, tilemap, input, scene, camera.

Ràng buộc quyết định: giá trị của dự án nằm ở **thiết kế màn**, không ở việc tự viết
bộ giải va chạm.

## 2. Quyết định

Phaser 3.90 + **Arcade Physics** (không Matter, không Box2D) + màn chơi vẽ trong
**Tiled**, xuất JSON. Coyote time, jump buffer và nhảy cao-thấp theo lực giữ **viết
tay lên trên** Arcade Physics — Arcade cho AABB đúng kiểu platformer nhưng không cho
cảm giác "chặt" miễn phí.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| PixiJS + physics tự viết | Phải tự viết AABB, sweep chống xuyên tường ở tốc độ cao, corner correction, one-way platform, nạp tilemap, scene stack, input cảm ứng. Bug va chạm là hố thời gian kinh điển. Hợp nếu mục tiêu là học physics — mục tiêu ở đây không phải vậy |
| Canvas 2D thuần | Gánh mọi thứ của PixiJS, cộng tự lo hiệu năng vẽ. Rủi ro trên mobile yếu, không đổi lại gì |
| Matter.js / Box2D thay Arcade | Rigid body thật làm cú nhảy "trơn" và rất khó gọt. Platformer chuẩn không cần physics engine thật |

## 4. Hệ quả

**Được:**
- Tilemap từ Tiled, camera follow, scene manager, input hợp nhất phím/chuột/cảm ứng đều có sẵn
- Thời gian dồn vào thiết kế màn và juice

**Mất / phải chấp nhận:**
- Dependency lớn nhất trong ba phương án. **Chưa đo** dung lượng bundle thật — phải đo rồi mới đặt ngưỡng thời gian tải cho mobile
- Vẫn phải tự viết ba cơ chế cảm giác điều khiển

**Điều kiện xem lại:** bundle đo ra làm thời gian tải trên mobile 3G vượt ngưỡng
sẽ đặt ở `nfr.md`, và tree-shaking Phaser không cứu được.
