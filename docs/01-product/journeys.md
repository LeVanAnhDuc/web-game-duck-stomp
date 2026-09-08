# Luồng người dùng

> **Trả lời:** Người dùng đi qua những luồng nào từ đầu đến cuối?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** có luồng người dùng mới · một luồng cũ đổi bản chất

<!-- CÁCH ĐIỀN
Viết bằng NGÔN NGỮ NGƯỜI DÙNG. Không có tên bảng, tên endpoint, tên component ở đây.
Mỗi luồng một mục, ID tăng dần US-01, US-02... không tái dùng số.

Mục "Điều gì có thể sai" là mục có giá trị nhất — nó là nguồn của test case và của
các trạng thái lỗi trên UI. Bỏ trống mục đó thì AI sẽ chỉ hiện thực đường đi đẹp.

KHÔNG chứa: chi tiết bố cục UI, danh mục chức năng (-> 02-requirements/scope.md).
-->

## US-01 · Lần đầu mở game và chơi xong màn 1

**Bối cảnh:** ai đó gửi link. Người chơi mở trên laptop, chưa biết game này là gì,
chưa từng bấm gì.

**Các bước:**
1. Thấy tên game và một nút mời chơi. Bên dưới có ba ký hiệu điều khiển, không chữ.
2. Bấm chơi. Từ cú bấm này trở đi mới có tiếng.
3. Thấy bản đồ: màn 1 mở, năm màn còn lại khoá và làm mờ.
4. Vào màn 1. Chạy sang phải, nhảy qua một khoảng trống, ăn vài đồng xu.
5. Chạm cờ đích. Thấy thời gian và số xu vừa lấy.
6. Về bản đồ; đường đi tự vẽ tới màn 2, và màn 2 mở ra.

**Kết quả mong đợi:** người chơi hiểu luật mà không đọc một dòng hướng dẫn. Máy đã
lưu: màn 1 xong, thời gian tốt nhất, số xu đã lấy trên tổng số xu của màn.

**Điều gì có thể sai:**
- Trình duyệt chặn âm thanh đến cú chạm đầu tiên → tiếng phải bật đúng ở bước 2,
  không phải lúc tải.
- Font từ Google Fonts tải chậm hoặc bị chặn → chữ phải vẫn đọc được bằng font dự
  phòng, không được nhảy bố cục.
- Người chơi bấm nhảy trước khi màn nạp xong → không được nhận input trước khi màn
  sẵn sàng.
- localStorage bị chặn (chế độ ẩn danh, hoặc trình duyệt tắt lưu trữ) → vẫn chơi
  được hết, chỉ là không lưu; không được crash và không được hiện lỗi kỹ thuật.
- Người chơi rơi xuống vực ngay ở bước 4 → phải hồi sinh nhanh, không phải màn
  "game over".

**Chức năng liên quan:** FR-01 · FR-02 · FR-03 · FR-04 · FR-05 · FR-12 · FR-14 · FR-17

---

## US-02 · Quay lại phá kỷ lục một màn đã xong

**Bối cảnh:** người chơi đã xong 3 màn hôm qua, hôm nay mở lại cùng máy, cùng
trình duyệt.

**Các bước:**
1. Mở link. Thấy nút chơi tiếp bên cạnh nút chơi mới.
2. Vào bản đồ; ba màn đầu có dấu đã xong, kỷ lục và số xu hiện ngay trên thẻ màn.
3. Chọn màn 2, vào chơi lại.
4. Về đích nhanh hơn lần trước.
5. Bảng tổng kết hiện dấu kỷ lục mới.

**Kết quả mong đợi:** kỷ lục mới ghi đè kỷ lục cũ; số xu chỉ ghi đè khi lấy được
**nhiều hơn**, không bị tụt vì lần này chơi tệ hơn.

**Điều gì có thể sai:**
- Dữ liệu lưu từ bản game cũ, cấu trúc đã đổi → phải migrate hoặc reset gọn, không
  được crash. Người chơi giữ save cũ trên máy lâu hơn code.
- Dữ liệu lưu bị người khác sửa tay hoặc hỏng → phải coi là không đáng tin và xử lý
  như chưa có save.
- Chơi lại nhưng chết nhiều → đồng hồ không được reset khi hồi sinh, nếu không thì
  kỷ lục vô nghĩa.
- Về đích **chậm** hơn kỷ lục → không được hiện dấu kỷ lục mới.

**Chức năng liên quan:** FR-01 · FR-02 · FR-12 · FR-14

---

## US-03 · Chơi trên điện thoại

**Bối cảnh:** người chơi mở link trên điện thoại, đang cầm dọc.

**Các bước:**
1. Thấy một hình: điện thoại mờ, mũi tên, điện thoại sáng nằm ngang. Không chữ.
2. Xoay ngang. Màn chặn biến mất, game tiếp tục đúng chỗ vừa dừng.
3. Thấy hai nút hướng ở góc dưới bên trái và một nút nhảy lớn hơn ở dưới bên phải,
   đều mờ để không che màn chơi.
4. Chơi bằng hai ngón cái.

**Kết quả mong đợi:** không có cơ chế nào cần tới nút thứ ba. Giữ hướng lâu thì
nhân vật nhanh dần — đó là cách thay cho nút chạy.

**Điều gì có thể sai:**
- Người chơi khoá xoay màn hình → màn chặn hiện mãi. Phải nói được bằng hình rằng
  cần xoay, và phải chấp nhận rằng nhóm này bị vướng (ADR-0004).
- Xoay ngay giữa lúc đang nhảy → game phải đã tạm dừng từ trước, không được để
  nhân vật rơi trong lúc màn chặn hiện.
- Ngón tay che vùng cần nhìn → nút phải mờ và đặt vào góc.
- Người dùng laptop cảm ứng → chạm một lần thì hiện nút, bấm phím thì ẩn nút. Không
  đoán theo user-agent.
- Bấm hai nút hướng cùng lúc → phải xử lý dứt khoát, không được kẹt vào một hướng.

**Chức năng liên quan:** FR-03 · FR-15 · FR-16

---

## US-04 · Chết và hồi sinh

**Bối cảnh:** đang ở nửa sau màn 4, đã qua checkpoint, còn một tim.

**Các bước:**
1. Chạm vào con địch có gai trên đầu.
2. Mất tim cuối.
3. Xuất hiện lại ở checkpoint gần nhất sau chưa đầy một giây, đủ ba tim.
4. Đồng hồ **không** reset.

**Kết quả mong đợi:** người chơi thử lại ngay, không phải bấm qua bất kỳ màn hình
nào.

**Điều gì có thể sai:**
- Chết ngay tại checkpoint → không được hồi sinh vào đúng thứ vừa giết mình.
- Chết trong khi đang ở dạng mạnh → mất nấm trước, mới tính tới tim.
- Rơi xuống vực → chết ngay, bỏ qua tim. Đây là ngoại lệ duy nhất.
- Chết đúng lúc đang chạm cờ đích → phải quyết dứt khoát một trong hai, không được
  vừa xong màn vừa chết.

**Chức năng liên quan:** FR-06 · FR-07 · FR-09 · FR-11

---

## US-05 · Tìm ra phòng xu giấu

**Bối cảnh:** đang chơi màn 3, vừa ăn nấm và đang ở dạng mạnh.

**Các bước:**
1. Thấy một đường chạy dài khác thường dẫn tới một bức tường có vết nứt.
2. Giữ hướng chạy cho đủ đà.
3. Đâm vào tường; tường vỡ.
4. Phía sau là một khoang chứa mấy đồng xu.

**Kết quả mong đợi:** người chơi tự hiểu rằng đường chạy dài là một lời mời, mà
không ai nói cho họ. Số xu của màn tăng lên, và tổng xu tối đa của màn đã tính cả
số xu giấu này.

**Điều gì có thể sai:**
- Đâm vào tường khi chưa đủ đà → tường không vỡ, và phải cho tín hiệu rõ là "chưa
  đủ nhanh", không phải "tường này không phá được".
- Chạm địch mất nấm giữa đường chạy → mất năng lực, phải quay lại lấy nấm khác.
- Người chơi không bao giờ tìm ra → chấp nhận được. Xu giấu không được nằm trên
  đường bắt buộc để xong màn.

**Chức năng liên quan:** FR-05 · FR-07
