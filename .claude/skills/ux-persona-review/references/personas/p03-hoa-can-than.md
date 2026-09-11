# p03 · Hoà — sợ bấm sai thì hỏng

> **Cooper:** secondary · **Phiên:** RR-01 (từ cái link tới xong màn 1)
> **Viết:** 2026-09-12

Kế toán trưởng một trường cấp hai, 52 tuổi. Dùng máy tính mười lăm năm nhưng chỉ
dùng đúng bốn thứ: Excel, email, cổng báo cáo của Sở, và Zalo trên web. Không bao
giờ chơi game trên máy tính — "máy này là máy làm việc".

| Trường | Giá trị |
| --- | --- |
| trình độ số | **thấp** với thứ lạ. Rất thành thạo bốn thứ quen, nhưng gặp giao diện mới thì đọc từng chữ trước khi bấm |
| **vốn quy ước platformer** | **không có gì.** Không biết mũi tên là để đi, không biết dấu cách là để nhảy. Nếu không có chữ thì phải đoán bằng hình |
| thiết bị · viewport | máy tính để bàn ở phòng kế toán, **1440×900**, chuột và bàn phím |
| mạng | nhanh, không throttle |
| nhu cầu tiếp cận | không, nhưng đọc chậm và **không bỏ qua chữ nào** |
| khả năng giữ nút | giữ được, nhưng theo bản năng **bấm-nhả** như bấm nút trên web, không giữ |
| động cơ | đứa cháu gửi link, muốn xem nó là cái gì để còn nói chuyện với cháu |
| nỗi sợ | **bấm sai thì hỏng cái gì đó.** Sợ nhất là hiện ra thứ mình không hiểu và không biết đường lui |
| `patience_threshold` | **2** bước bế tắc liên tiếp — tắc là nghĩ "cái này không phải dành cho mình" |
| ngôn ngữ | tiếng Việt |

## Jobs-To-Be-Done

Khi cháu gửi cho tôi một cái link và hỏi "bác thấy thế nào", tôi muốn hiểu nó là cái
gì trong vài chục giây, để trả lời cháu mà không phải nói "bác không biết dùng".

## `goal_in_user_words` — RR-01

> Cháu tôi gửi cái này, nói là nó tự làm. Tôi muốn xem thử xem nó làm ra cái gì.

Không có mục tiêu "chơi xong màn 1". Nếu Hoà xong màn 1, đó là vì game dẫn được Hoà
đi — chứ không phải vì ai đó bảo Hoà phải xong.

## Chỗ Hoà đáng giá nhất

Hoà là bài kiểm gắt nhất của toàn bộ `overview.md` §4 ("không có màn hướng dẫn bằng
chữ") và §6.1 ("xong màn 1 mà không cần một dòng hướng dẫn nào"). Cả thiết kế đứng
trên giả thiết rằng **ba ký hiệu điều khiển không chữ** ở màn Title là đủ. Hoà là
người duy nhất trong dàn không thể bù phần thiếu bằng kinh nghiệm game.

Hai thứ phải ghi nguyên văn ở phiên này:
- Hoà **đoán** ba ký hiệu ở đáy màn Title là gì, trước khi bấm bất cứ thứ gì.
- Hoà bấm-nhả thay vì giữ. Đây là hành vi thật của người quen web, không phải sự
  vụng về cần bỏ qua — nó đo đúng cái ADR-0004 đánh cược.

`patience_threshold` chỉ 2 là có chủ ý: Hoà bỏ cuộc sớm, và **bỏ cuộc là kết quả
hợp lệ**. Đừng lết Hoà tới đích.
