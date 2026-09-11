# Đối chiếu ảnh phiên p03-RR-01 — người điều phối tự mở ảnh ra xem

Bắt buộc đọc file này trước khi dùng bất cứ dòng nào của `p03-RR-01.md` làm dẫn chứng.

## Persona khai gì

> "Vì bấm chuột không thấy gì rõ ràng thay đổi (theo cảm nhận của tôi, **khung hình
> vẫn y như cũ**)"

và đếm "**3 lần** bấm vào chỗ không có phản hồi rõ ràng".

## Ảnh cho thấy gì

| Ảnh | Thật ra trên màn hình là gì |
| --- | --- |
| `p03-RR-01-01-vua-mo-trang.png` | Màn Title. **Có một nút PLAY vàng rất lớn** (khoảng 455×105 px màn hình) ở giữa, có viền focus vàng, chữ `PLAY` đen trên vàng. Tiêu đề `DUCK STOMP`. Ba ký hiệu điều khiển không chữ ở đáy. Icon loa ở góc trên phải |
| `p03-RR-01-02-sau-khi-bam-giua-man-hinh.png` | **Bản đồ thế giới.** Toàn bộ màn hình đã đổi: 6 node (node 1 mở và đang được chọn với vòng vàng, 5 node còn lại có ổ khoá), đường nối nét đứt, thẻ dưới đáy ghi `LEVEL 1` · `BEST --` · `0` xu, và một nút `START` vàng |
| `p03-RR-01-03-sau-bam-mui-ten-phai.png` | Vẫn bản đồ, nhưng **vòng chọn đã nhảy sang node 2 (node bị khoá)**; thẻ dưới đáy đổi thành `LEVEL 2` |
| `p03-RR-01-04-sau-bam-space.png` | **Y hệt ảnh 03.** Vẫn `LEVEL 2`, vẫn trên bản đồ. Bấm Space không đưa đi đâu cả |

## Hệ quả 1 — một dòng của persona là SAI, không được dùng

Cú bấm chuột **đã chạy đúng**: nó trúng nút PLAY và mở bản đồ. Cú bấm mũi tên phải
**cũng chạy đúng**: nó di chuyển ô chọn. Nên con số "3 lần bấm không có phản hồi" là
**sai**: hai trong ba lần có phản hồi, và phản hồi ở lần thứ nhất là đổi **toàn bộ**
màn hình.

Một người thật không thể không thấy màn hình đổi hoàn toàn. Đây là **giới hạn của
persona chạy bằng LLM**: agent không đối chiếu ảnh mới với ảnh trước. Nó **không**
phải phát hiện về sản phẩm, và **không** được dùng để kết luận "game thiếu phản hồi".

Vì lỗi này, brief của mọi phiên sau p03 được thêm một mục bắt buộc: *sau mỗi lần
chụp, nói rõ ảnh này khác ảnh trước ở chỗ nào*. Nên p03 **không so sánh được** với các
phiên sau ở khía cạnh "có nhận ra phản hồi hay không", và RR-01 được **chạy lại** dưới
mã phiên mới `p08-RR-01` (theo `lib/orchestration.md`: lần chạy lại lấy số mới).

## Hệ quả 2 — nhưng ảnh 03→04 là một phát hiện THẬT, và nó nặng

Ảnh `03` và `04` giống nhau từng pixel, và persona bấm Space giữa hai ảnh đó. Tức là:

- Bản đồ cho phép **chọn một màn đang bị khoá** (node 2, có ổ khoá).
- Thẻ dưới đáy vẫn hiện `LEVEL 2` như một màn bình thường, `BEST --`.
- Nút **`START` vẫn vàng rực, vẫn trông bấm được y như lúc chọn màn 1** — không mờ đi,
  không đổi chữ, không có dấu hiệu nào nói "màn này chưa mở".
- Bấm Space (đường tương đương với bấm START) thì **không có gì xảy ra, im lặng
  hoàn toàn**.

Đây là dẫn chứng bằng ảnh, không phụ thuộc vào việc persona có nhận ra hay không: hai
ảnh giống nhau là bằng chứng khách quan. Và nó đúng là lý do persona bỏ cuộc — chỉ là
đúng ở cú bấm thứ ba, không phải cả ba.

## Hệ quả 3 — ấn tượng đầu của persona vẫn dùng được

Mục "Ấn tượng 5 giây" được ghi **trước** khi bấm gì, từ đúng ảnh `01`, nên nó không
bị ảnh hưởng bởi lỗi trên. Câu đáng giá nhất trong cả phiên nằm ở đó:

> "không có chữ tiếng Việt, **không có nút bấm nào tôi nhận ra là nút**"

Nói về một nút vàng 455×105 px có chữ `PLAY` giữa màn hình. Cái này thì ảnh `01` xác
nhận là nút **có** ở đó và rất nổi — nên phát hiện không phải "nút bị chìm", mà là
**`PLAY` là một chữ tiếng Anh và hình dáng nút phẳng không nói được với người này rằng
nó là nút**. Giữ nguyên, đừng diễn giải quá.
