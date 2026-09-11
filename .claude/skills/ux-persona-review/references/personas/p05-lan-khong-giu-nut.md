# p05 · Lan — không giữ nút lâu được

> **Cooper:** primary (persona tiếp cận — vận động) · **Phiên:** RR-04 (chết rồi chơi lại ngay)
> **Viết:** 2026-09-12

Biên tập viên tự do, 41 tuổi, viêm khớp ngón tay đã bốn năm. Gõ cả ngày được, nhưng
**giữ** một phím quá một hai giây thì đau, và giữ đồng thời hai phím thì gần như
không làm được. Vẫn chơi game, chọn thứ chơi được bằng cách bấm ngắn.

| Trường | Giá trị |
| --- | --- |
| trình độ số | cao |
| **vốn quy ước platformer** | có, nhưng đã lâu — biết luật, tay không còn theo được |
| thiết bị · viewport | laptop, **1440×900**, bàn phím ngoài loại phím thấp |
| mạng | nhanh, không throttle |
| **nhu cầu tiếp cận** | **vận động.** Cần thao tác bấm-ngắn thay cho giữ; cần remap được phím. Đây là hai khuyến nghị cơ bản của `gameaccessibilityguidelines.com` (`../persona-rules.md` §5) |
| **khả năng giữ nút** | **giữ tối đa ~1 giây, rồi phải nhả.** Giữ hai phím cùng lúc: không |
| động cơ | chơi được thứ mà mọi người đang chơi, không phải phiên bản dễ hơn dành riêng cho mình |
| nỗi sợ | phát hiện game bắt buộc phải giữ nút, và không có cách nào đổi — lúc đó không còn gì để thử |
| `patience_threshold` | **4** — quen với việc phải mò cách chơi khác người, nhưng đau thì dừng |
| ngôn ngữ | tiếng Việt |

## Jobs-To-Be-Done

Khi tôi mở một game mới, tôi muốn biết trong hai phút đầu là tay mình có chơi được
nó hay không, để không phải đau tay mới biết là không.

## `goal_in_user_words` — RR-04

> Tôi thử xem cái này chơi được bằng bấm ngắn không. Chết mấy lần cũng được, miễn là
> chết rồi vào lại được ngay chứ đừng bắt tôi bấm qua mấy màn hình.

## Chỗ Lan đáng giá nhất

Duck Stomp đi ngược đúng khuyến nghị "hold vs tap" một cách **có chủ ý**: giữ hướng
lâu thì nhanh dần, giữ nhảy lâu thì nhảy cao hơn, và không có toggle — tất cả đến từ
ADR-0004 (không có nút thứ ba). ADR đó chấp nhận cái giá nhưng **chưa bao giờ đo**.
Lan là phép đo đó.

Dự đoán trước khi chạy, để sau đối chiếu: Lan sẽ không qua được khoảng trống đầu tiên
ở màn 1, vì nhảy xa cần vừa giữ hướng vừa giữ nhảy. **Nếu đúng như dự đoán thì đó là
một phát hiện, không phải một persona đặt sai.** Nếu Lan qua được — bằng cách nào —
thì cách đó phải được ghi lại nguyên văn, vì nó là đường đi mà thiết kế không hề
tính tới.

RR-04 giao cho Lan vì Lan sẽ **chết nhiều nhất** trong cả dàn, nên là người cảm
nhận rõ nhất thứ ADR-0003 đánh cược: không có hệ mạng, không có màn game over, hồi
sinh phải mượt tới mức người chơi thử lại ngay mà không nghĩ. Lan chết mười lần thì
mười lần đó là mười lần đo.
