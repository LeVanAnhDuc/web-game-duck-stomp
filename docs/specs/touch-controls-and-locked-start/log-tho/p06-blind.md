# p06-blind · Khánh · phiên mù (power user trên desktop, **negative persona**)

Viewport 1440×900 · context sạch · URL live · **không có `goal_in_user_words`** —
chỉ có cái link.

Ghi nguyên văn lời persona.

---

## Kể lại

**1. Ấn tượng 5 giây** (lúc vừa mở, chưa bấm gì — ảnh `p06-blind-01-vua-mo-trang.png`)

- Đây là trang gì, làm được gì cho tôi: Một game nhỏ tên "Duck Stomp", kiểu platformer đơn giản, có nút PLAY và mấy nút mũi tên trái/phải/nhảy phía dưới (chắc là điều khiển cảm ứng). Không thấy gì liên quan tài khoản hay lưu trữ.
- Dành cho tôi hay ai khác: Có vẻ như game giải trí nhanh vài phút, không phải loại game "nặng đô" có sự kiện/bảng xếp hạng như tôi hay chơi hàng ngày.
- Có tin để nhập email/số điện thoại không: Không có chỗ nào để nhập cả nên câu này chưa áp dụng, nhưng nhìn sơ thì không có dấu hiệu có đăng nhập.
- Ba từ: đơn giản, lạ lẫm, hoài nghi.

**2. Chuyện đã xảy ra**

- Thấy màn chào "DUCK STOMP" với nút PLAY → tưởng đây là game bình thường có menu → bấm PLAY → hiện màn chọn level: 6 vòng tròn, chỉ level 1 mở, 5 cái còn lại khoá, có số coin "0" và dòng "BEST --" (`p06-blind-02-chon-level.png`). Lúc này tôi nghĩ trong đầu: "à có 'BEST' chắc là game lưu điểm tốt nhất của mình đây, để xem".
- Bấm START → vào chơi thật, thấy nhân vật trắng nhỏ, 3 tim mạng, đếm coin "0/9", đồng hồ đếm giờ chạy, có hố cần nhảy qua và khối "?" (`p06-blind-03-vao-game.png`). Tôi hiểu đây là platformer chạy-nhảy-nhặt xu bình thường.
- Chạy phải rồi nhảy: qua được hố đầu tiên, coin vẫn 0/9 vì chưa chạm đồng xu, đồng hồ chạy tới 0:26 (`p06-blind-04-nhay-qua-ho.png`).
- Thử nhảy qua hố tiếp theo (rộng hơn) — thất bại 3 lần liên tiếp: mỗi lần rơi xuống lại bị đưa về gần mép hố, coin tăng dần (từ nhặt được xu rơi cùng đường) lên 2/9 rồi 3/9, đồng hồ vẫn chạy tiếp, không mất mạng (`p06-blind-05`, `06`, `07`). Trong đầu tôi nghĩ "sao mãi không qua được vậy, chắc mình bấm nhảy trễ quá" — đây là lúc tôi bí đủ 3 lần nên bỏ thử cái hố này.
- Mở menu Pause (phải dò lại toạ độ vì bấm trượt một lần — click không phản hồi) → thấy menu chỉ có RESUME, RETRY, MAP và nút loa, không có Settings/Account/Leaderboard nào (`p06-blind-08-menu-pause.png`).
- Bấm MAP để quay về màn chọn level (cũng trượt tay một lần đầu) → quay lại y hệt màn chọn level, nhưng "BEST --" vẫn là "--", coin tổng vẫn "0" dù lúc chơi tôi đã nhặt được 3 đồng — tức là chơi dở dang thoát ra thì không có gì được giữ lại (`p06-blind-09-ve-map-mat-tien-do.png`).
- Tải lại cả trang (giả định như mở lại/mở máy khác) → về đúng y hệt màn chào ban đầu, bấm PLAY lại thì màn chọn level cũng y hệt lúc đầu: coin 0, level 1 mở, BEST -- (`p06-blind-10`, `p06-blind-11`). Xác nhận: không giữ lại gì cả, kể cả trong cùng máy.
- Xem log network thấy toàn bộ chỉ là tải file tĩnh (JS, font, file `levels/level-1.json`...`level-6.json`) — không có request nào tới server để lưu tài khoản hay chấm điểm gì.

**3. Con số**

- Số hành động đã làm: khoảng 22 lần thao tác/click + nhiều lần chụp ảnh, tổng cỡ 40 lệnh công cụ (gần chạm trần 40 hành động).
- Thời gian: một buổi ngắn, mọi thứ diễn ra liên tục không chờ đợi lâu.
- Số lần phải quay lui: 1 (thoát level giữa chừng để xem menu).
- Số lần bấm vào chỗ không phản hồi: 2 (bấm trượt nút Pause lần đầu, bấm trượt nút MAP lần đầu).
- Kết quả: bỏ cuộc việc chơi hết level 1 (bí ở hố thứ hai sau 3 lần thử liên tiếp — đúng ngưỡng kiên nhẫn của tôi), nhưng đã tìm ra đủ câu trả lời cho hai câu hỏi chính nên coi như "xong" phần mò mẫm.

**4. Ba từ sau khi dùng**

Ba từ: hụt hẫng, chơi-cho-vui, không-để-lại-gì. Tôi sẽ không quay lại trang này — lý do chính: tôi chơi game để tích luỹ (điểm, thứ hạng, vật phẩm theo tài khoản), mà ở đây chơi dở là mất trắng, không có bảng xếp hạng để so với bạn bè, không có đăng nhập nên đổi máy chắc chắn mất hết. So với cảm giác ban đầu (đơn giản, lạ lẫm, hoài nghi), giờ tôi đã hết hoài nghi — không phải "chưa chắc" nữa mà là "chắc chắn không có" thứ tôi cần, nên cảm giác đi từ tò mò sang thất vọng rõ ràng hơn.

**5. Đính kèm thô**

- `p06-blind-01-vua-mo-trang.png` … `p06-blind-11-xacnhan-mat-tien-do.png` (11 ảnh, xem danh sách trong phần kể trên)

Log console: chỉ có dòng khởi động Phaser v3.90.0, lặp lại 10 lần (mỗi lần vào/reload trang), **không có lỗi nào**.

Log network: 11 request, toàn bộ là file tĩnh — trang HTML, CSS font của Google, bundle JS, hai file woff2, và `levels/level-1.json` … `level-6.json`. Không có request nào tới API.

**Trả lời hai câu hỏi trọng tâm của brief:**
- *Cái tôi chơi được có giữ lại không, mở máy khác thì còn không:* Không — chơi dở dang thoát giữa chừng thì "BEST" và tổng coin không đổi, vẫn "--" và "0". Tải lại cả trang thì mọi thứ về y hệt lúc mới mở lần đầu. Nhìn network log thì toàn bộ chỉ là file tĩnh, không có request nào tới server để lưu gì cả — nên chắc chắn đổi máy là mất trắng.
- *Có so được với người khác không:* Không thấy bất kỳ dấu vết nào của bảng xếp hạng, ở bất cứ màn hình nào tôi đi qua. Chữ "BEST --" ở màn chọn level ban đầu làm tôi tưởng có so sánh, nhưng hoá ra nó chỉ là kỷ lục cá nhân của chính mình cho level đó (giống high score) — mà thực tế cũng không thấy nó tăng cả sau khi chơi.

---

## Đối chiếu của người điều phối

### Negative persona phản ứng ĐÚNG như `overview.md` §4 dự đoán — đây là kết quả đạt

Khánh bỏ đi vì: không tài khoản, không đồng bộ, không bảng xếp hạng, đổi máy là mất.
Cả bốn thứ đó nằm nguyên trong danh sách Non-Goals. Nên kết luận *"tôi sẽ không quay
lại"* là **kết quả đúng**, không phải phát hiện cần chữa. Đừng biến đòi hỏi của Khánh
thành đề xuất.

### Nhưng có MỘT kỳ vọng sai do UI tạo ra — và đó là phát hiện thật

> "à có 'BEST' chắc là game lưu điểm tốt nhất của mình đây" … "Chữ 'BEST --' ở màn
> chọn level ban đầu **làm tôi tưởng có so sánh**"

`BEST` một mình không nói được nó là kỷ lục **của chính người chơi trên máy này**.
Với người quen game có bảng xếp hạng, nó gợi ý so sánh với người khác. Đây đúng là
câu hỏi mà negative persona có mặt để trả lời (`p06-khanh-doi-hoi.md` §Khánh có mặt
để làm gì, mục 1): **một nhãn đang nói quá thứ sản phẩm làm được.**

Mức: Low. Một persona, không chặn đường ai, và người chơi mục tiêu (không phải Khánh)
sẽ không có kỳ vọng đó. Nhưng nó **là** dẫn chứng trực tiếp cho lăng kính Trigger words.

### Không lưu gì khi thoát giữa màn: ĐÚNG THEO THIẾT KẾ, không phải lỗi

Khánh nhặt 3 xu rồi thoát ra giữa màn, và không có gì được lưu. Đúng: save chỉ ghi khi
**xong màn** (FR-12 + FR-14), và xu chỉ ghi đè khi lấy được **nhiều hơn**. Không có
lần xong màn nào thì không có gì để ghi. Ghi lại để đừng ai đọc log này thành bug.

### Trùng với các phiên khác

- **Bấm trượt nút 2 lần** (Pause, MAP) rồi tự dò lại. Persona thứ ba bấm trượt nút UI
  (Hoà trượt START, Khánh trượt Pause và MAP). Cả ba lần đều tự sửa được, và cả ba đều
  là agent tự tính toạ độ từ ảnh — nên dẫn chứng **yếu**, ghi là quan sát.
- **Qua được hố thứ nhất, kẹt ở hố thứ hai 3 lần.** Cùng dạng với p02/p05: kỹ năng
  của agent, không phải độ khó. Xem `p02-RR-02.md` §Đối chiếu để biết vì sao không
  được kết luận gì về độ khó.
