# ADR-0010 · Bất kỳ cú chạm thật nào cũng làm hiện cụm nút cảm ứng

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** FR-15 · NFR-A11Y-06 · US-03 · bất biến #11 · bất biến #12 (mới)

## 1. Bối cảnh

FR-15 nói cụm nút cảm ứng **hiện sau cú chạm đầu**, ẩn sau phím đầu. Cách hiện thực
ban đầu đọc câu đó quá hẹp: thứ duy nhất bật cờ `sawTouch` là `pointerdown` **trên
chính mấy nút cảm ứng** — mà mấy nút đó đang ẩn cho tới khi cờ bật.

Phaser không hit-test thứ nó không vẽ. Nên cờ không bao giờ bật được: người chơi chỉ
có cảm ứng vào được màn 1 rồi **đứng đó**, không nhích một pixel. Không test nào đỏ,
không log lỗi nào, vì không có gì throw.

Review persona 2026-09-12 tìm ra bằng ba nguồn độc lập (hai phiên điện thoại và một
phép đo có `hasTouch: true` với tap cảm ứng thật). Nó chặn đúng **nhóm người chơi
chính** theo `overview.md` §3, và làm NFR-A11Y-06 ("chơi được hết chỉ bằng cảm ứng")
sai trên thực tế trong khi README vẫn hứa điều ngược lại.

## 2. Quyết định

`InputManager` nghe `pointerdown` ở **phạm vi scene**, và bật `sawTouch` khi
`pointer.wasTouch === true`.

`Pointer.wasTouch` của Phaser nghĩa là *"sự kiện input trước đến từ Touch, không phải
Mouse"* — tức **input đã thực sự tới**, không phải suy đoán về thiết bị. Nên bất biến
#11 (không đoán theo user-agent) được giữ nguyên, và người dùng chuột không bao giờ
bị cụm nút che màn chơi.

Cú chạm đầu tiên vì thế **chỉ để hiện nút**: nó không đồng thời làm nhân vật đi hay
nhảy. Với người chơi đó là một lần chạm "thử xem có gì" — đúng cái mà cả hai persona
điện thoại đã tự làm trước khi bỏ cuộc.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Hiện nút ngay khi vào màn nếu thiết bị có cảm ứng | Đoán theo năng lực thiết bị, vi phạm bất biến #11. Laptop cảm ứng bị nút che màn chơi dù người ta đang dùng bàn phím |
| Cụm nút luôn hiện, mờ hơn, tới khi có phím đầu tiên | Trái FR-15, và lấy mất chỗ trên màn hình của người chơi bàn phím — đúng cái mà FR-15 tồn tại để tránh |
| Vùng chạm vô hình phủ toàn màn: nửa phải = đi phải | Là nút thứ ba đội lốt (ADR-0004). Và cả hai persona điện thoại đã thử đúng mô hình này rồi thất bại: họ đi tìm **nút**, không tìm vùng |
| Bật cờ ở cú chạm đầu **bất kể** là chuột hay cảm ứng | Người dùng chuột trên desktop sẽ bị hiện cụm nút cảm ứng ngay khi bấm PLAY |

## 4. Hệ quả

**Được:**
- Người chơi chỉ có cảm ứng chơi được — đã thấy tận mắt: giữ nút phải bằng ngón tay
  thật (CDP touch) làm nhân vật đi từ x=72 tới x=168.
- NFR-A11Y-06 có test tự động cho **cả hai** nửa, không chỉ nửa bàn phím:
  `tests/touch-and-locked.spec.ts` chạy trong context `hasTouch: true`.
- README §Features đang hứa *"on-screen controls appear the first time you touch"* —
  lời hứa đó giờ mới thành đúng, không phải sửa README.

**Mất / phải chấp nhận:**
- Cú chạm đầu tiên bị "mất": nó hiện nút chứ không thao tác. Một nhịp trễ ở lần đầu
  vào màn, mãi mãi về sau không còn.
- Nghe `pointerdown` ở phạm vi scene nghĩa là mọi cú chạm trong màn chơi đều đi qua
  một listener — rẻ, nhưng nó **là** thêm một chỗ input có thể bị đụng tới.

**Điều kiện xem lại quyết định này:** nếu Phaser đổi nghĩa `wasTouch`, hoặc nếu xuất
hiện thiết bị lai mà `wasTouch` phân loại sai (bút stylus báo là touch trong khi
người dùng thực sự đang dùng bàn phím).
