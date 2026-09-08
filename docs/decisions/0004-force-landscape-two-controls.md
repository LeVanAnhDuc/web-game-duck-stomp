# ADR-0004 · Bắt buộc màn hình ngang, và đúng hai điều khiển khi đang chơi

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** NFR-A11Y-02 · NFR-A11Y-03 · NFR-I18N-01

## 1. Bối cảnh

Yêu cầu: desktop và cảm ứng **ngang hàng nhau**, không phải "mobile làm sau". Hai
hệ quả kỹ thuật đi kèm mà không hiển nhiên:

- Platformer cuộn ngang cần **thấy trước mặt**. Ở 375px dọc thì gần như không thấy
  con địch mình đang chạy tới.
- Mario thật có nút chạy (nút B). Đó là điều khiển thứ ba, và trên cảm ứng thì giữ B
  + bấm nhảy + kéo hướng bằng một ngón là bất khả.

## 2. Quyết định

**Bắt buộc ngang.** Để dọc thì hiện màn chặn (icon điện thoại đang xoay, có hoạt
ảnh, **không chữ**) và game tự tạm dừng.

**Đúng hai điều khiển khi đang chơi:** di chuyển và nhảy. Mọi năng lực phải cưỡi lên
chúng — nấm cho năng lực phá khối nứt, kích hoạt bằng *chạy hết đà đâm vào* hoặc
*rơi từ trên xuống*, không thêm nút.

Thay nút chạy bằng **tăng tốc theo thời gian giữ hướng**: giữ càng lâu càng nhanh,
đạt tối đa sau khoảng nửa giây, thả ra thì trượt dần. Giữ được cảm giác quán tính mà
không cần nút thứ ba, và cảm ứng với bàn phím giống nhau tuyệt đối.

Ràng buộc hai-điều-khiển **chỉ áp cho lúc chơi**. Bản đồ thế giới là menu, nên ở đó
cảm ứng chạm thẳng vào node, bàn phím dùng mũi tên + Enter.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Chơi dọc, camera zoom ra | Pixel-art thu nhỏ thì mất nét, và tầm nhìn ngang vẫn hẹp — thiết kế màn phải tránh mọi cú nhảy cần nhìn trước, tức là bị bó thật sự |
| Hỗ trợ cả dọc lẫn ngang, camera tự đổi | Mọi màn phải chơi được ở tỉ lệ xấu nhất, nên thiết kế màn tự hạ xuống mức của phương án dọc, mà tốn gấp đôi công để kiểm |
| Chỉ desktop, mobile hiện "cần bàn phím" | Trái yêu cầu đã nêu rõ: mobile ngang hàng |
| Thêm nút chạy / nút tấn công cho cảm ứng | Ba nút trên cảm ứng thì ngón che mất chỗ cần nhìn, và không giữ nổi cùng lúc |
| Long-press hoặc double-tap để thêm năng lực | Có ngưỡng thời gian phải gọt riêng cho cảm ứng — đúng thứ phương án tăng-tốc tránh được |

## 4. Hệ quả

**Được:**
- Một mô hình input cho cả hai nền tảng, nên không có nền tảng nào là hạng hai
- Tầm nhìn ngang đủ để phản ứng, đúng thứ platformer cần
- Không có chuỗi text hướng dẫn nào phát sinh — màn chặn xoay là icon, chú giải điều khiển là ký hiệu

**Mất / phải chấp nhận:**
- Thêm một màn chặn, và người khoá xoay màn hình sẽ bị vướng
- Không bao giờ thêm được cơ chế cần nút thứ ba mà không viết ADR mới thay thế cái này
- Ngưỡng "nửa giây để đạt tốc tối đa" là số **chưa gọt trên máy thật**

**Điều kiện xem lại:** thiết kế màn về sau cần một năng lực không cưỡi được lên hai
điều khiển.
