# ADR-0003 · Không có hệ mạng và không có game over; chết là hồi sinh ở checkpoint

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** NFR-REL-03

## 1. Bối cảnh

Game đi theo hướng Mario. Mario có hệ mạng: mất hết mạng thì game over và quay về
đầu. Đây là chỗ lệch Mario rõ nhất trong toàn bộ thiết kế, nên phải ghi lý do chứ
không lặng lẽ làm khác.

Người chơi ở đây mở một tab web, không bỏ tiền vào máy.

## 2. Quyết định

Không có mạng, không có game over. Mỗi màn có **một checkpoint giữa đường**; chết
thì hồi sinh ở đó trong **dưới một giây**. Máu là 3 tim, hết tim thì hồi sinh ở
checkpoint — không phải kết thúc lượt chơi.

Vẫn giữ hình phạt có ý nghĩa: đồng hồ không reset khi hồi sinh, nên chết nhiều thì
mất kỷ lục thời gian.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Hệ mạng đúng như Mario | Mario có hệ mạng vì nó là máy arcade ăn xu — mất mạng là mất tiền thật. Trên web, phạt nặng thì người chơi tắt tab chứ không chơi lại |
| Chết là về đầu màn, không checkpoint | Màn 6 dài; mất cả màn vì một cú nhảy sai là cách nhanh nhất để mất người chơi |
| Nhiều checkpoint mỗi màn | Làm thiết kế màn mất sức căng, và với màn dài 2–3 phút thì một cái là đủ |

## 4. Hệ quả

**Được:**
- Vòng thử-lại ngắn, phù hợp thứ chơi trên tab trình duyệt
- Hình phạt chuyển sang **thời gian**, tức là chuyển vào đúng thứ localStorage đang đo — chết nhiều thì mất kỷ lục

**Mất / phải chấp nhận:**
- Mất căng thẳng kiểu arcade. Ai muốn cảm giác Mario gốc sẽ thấy game này dễ
- "Dưới một giây" là một ngưỡng phải đo thật, chưa đo

**Điều kiện xem lại:** người chơi thật báo game quá dễ đến mức không có động lực
chơi lại.
