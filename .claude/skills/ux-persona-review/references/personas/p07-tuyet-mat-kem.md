# p07 · Tuyết — phải nhìn kỹ mới thấy

> **Cooper:** secondary (persona tiếp cận — thị lực) · **Phiên:** mù (điện thoại)
> **Viết:** 2026-09-12

Bán hàng ở chợ, 58 tuổi. Viễn thị, đeo kính khi đọc nhưng thường để kính ở nhà. Chữ
nhỏ và chữ màu nhạt trên nền đậm thì đọc không ra. Dùng điện thoại cho Zalo, gọi
video cho con, và mấy game xếp hình bạn bè gửi.

| Trường | Giá trị |
| --- | --- |
| trình độ số | **thấp.** Bấm được vào thứ trông giống nút; không hiểu khái niệm "cuộn trang" trong game |
| **vốn quy ước platformer** | **không có gì.** Game duy nhất từng chơi là xếp hình và bắn bong bóng — cả hai đều bấm một chỗ, không có nhân vật phải điều khiển liên tục |
| thiết bị · viewport | điện thoại **667×375 (ngang)** |
| mạng | trung bình, không throttle |
| **nhu cầu tiếp cận** | **thị lực.** Chữ nhỏ đọc không ra; icon không có chữ thì phải đoán bằng hình dáng. Đây là phía người dùng của **NFR-A11Y-01** (tương phản chữ ≥ 4.5:1, icon ≥ 3:1) |
| khả năng giữ nút | giữ được, nhưng ngón tay to và **bấm lệch** — vùng bấm nhỏ thì trượt (NFR-A11Y-03) |
| động cơ | con gái gửi link, không muốn làm con thất vọng nên thử |
| nỗi sợ | không biết mình đang phải làm gì, và không muốn hỏi lại |
| `patience_threshold` | **2** |
| ngôn ngữ | tiếng Việt |

## `goal_in_user_words`

**Không có.** Phiên mù: chỉ có một cái link, không có việc gì phải làm.

## Chỗ Tuyết đáng giá nhất

Tuyết là phiên mù thứ hai mà `lib/orchestration.md` đòi: **người trình độ số thấp
trên điện thoại**. Tuyết cũng là người duy nhất trong dàn đo được hai NFR mà tới giờ
chỉ được kiểm bằng script và bằng DevTools:

- **NFR-A11Y-01** — tương phản. Bảng màu của game là nền đêm đậm với chữ kem và vàng
  (`MASTER.md`). Script tính WCAG nói là đạt; Tuyết là người nói nó **đọc được** hay
  không. Hai câu đó không giống nhau, nhất là với font pixel ở cỡ nhỏ.
- **NFR-A11Y-03** — vùng bấm ≥ 44px, nút hướng ≥ 72px, nút nhảy ≥ 88px. Số đó đo
  trong DevTools. Tuyết bấm lệch, nên là người đo xem con số ấy có đủ thật không.

Và quan trọng hơn cả hai: `overview.md` §4 nói **không có màn hướng dẫn bằng chữ**,
màn 1 dạy luật bằng bố cục. Với Tuyết, cả hai cửa đều hẹp — chữ thì khó đọc, bố cục
thì chưa có vốn để đọc. Nếu Tuyết vẫn hiểu được phải làm gì, thiết kế rất mạnh. Nếu
không, cần biết Tuyết **tưởng** mình phải làm gì — ghi nguyên văn, đừng sửa lại cho
đúng.

Đừng dán nhãn "người dùng không phải nhóm mục tiêu" cho Tuyết để bỏ qua kết quả:
`overview.md` §3 nói nhóm chính là **người chơi tình cờ mở link trên điện thoại**, và
Tuyết đúng là như vậy.
