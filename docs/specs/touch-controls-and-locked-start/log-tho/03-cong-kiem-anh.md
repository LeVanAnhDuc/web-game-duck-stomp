# Cổng kiểm ảnh — chạy trước khi gọi `ux-expert`

Theo `lib/orchestration.md` §Kiểm ảnh trước khi gọi ux-expert. **Đã qua.**

## Số ảnh mỗi phiên, đối chiếu với số phiên tự khai trong log

| Mã phiên | Ảnh trong thư mục | Log tự khai | Khớp |
| --- | --- | --- | --- |
| p01-RR-03 | 5 | 5 | ✅ |
| p02-RR-02 | 8 | 8 | ✅ |
| p03-RR-01 | 4 | 4 | ✅ |
| p04-RR-05 | 4 | 4 | ✅ |
| p05-RR-04 | 3 | 3 | ✅ |
| p06-blind | 11 | 11 | ✅ |
| p07-blind | 4 | 4 | ✅ |
| p08-RR-01 | 7 | 7 | ✅ |

**46 ảnh có tiền tố phiên hợp lệ, không thiếu cái nào, không có dấu hiệu bị ghi đè.**
Tổng thư mục 66 file / 700 KB.

## 20 file KHÔNG mang tiền tố phiên — ghi ra chứ không im lặng bỏ qua

Tất cả mang tiền tố `zz-` và đều do **người điều phối** chụp để kiểm chứng, không thuộc
trải nghiệm của persona nào. **Không được dùng làm dẫn chứng cho lời kể của bất kỳ
persona nào**, nhưng **được** dùng làm dẫn chứng cho các phép đo của người điều phối
(đã dẫn trong các file `0x-doi-chieu-*.md` và mục Đối chiếu của từng log).

| File | Đo cái gì |
| --- | --- |
| `zz-kiem-tap-space-180ms.png` · `zz-kiem-hold-space-180ms.png` | bấm 100 ms **có** nhảy; `press` 0 ms không làm gì |
| `zz-kiem-nhay-ho-A…D` (4) | hố màn 1 vượt được bằng chạy 700 ms + nhảy 350 ms |
| `zz-kiem-motphim-A…C` (3) · `zz-kiem-haiphim-doi-chung.png` | lần thử đầu, **không sạch** (vị trí xuất phát khác nhau) — giữ lại để minh bạch, kết luận lấy từ bộ `zz-sach-*` |
| `zz-sach-1…3` (3) | mỗi lần nạp màn mới: một phím một lúc **không qua hố**, hai phím cùng lúc **qua** |
| `zz-man3-01…06` (6) | nhảy ở màn 3 chạy tốt 3 lần liên tiếp |
| `zz-kiem-title-co-save.png` | màn Title sau khi gieo save |

## Sai lệch đã ghi ở nơi khác, không lặp lại ở đây

- `p03-RR-01` chạy **trước** khi brief có mục "so ảnh với ảnh trước" → xem
  `01-doi-chieu-anh-p03.md`. RR-01 đã chạy lại thành `p08-RR-01`.
- `p04-RR-05` cho Duy dùng **laptop bàn phím** thay vì điện thoại như hồ sơ persona →
  lý do ghi ngay đầu `p04-RR-05.md`.
- Bốn kết luận của persona đã bị **loại** vì là lỗi bộ dò, không phải lỗi sản phẩm:
  "không thấy gì đổi" (p03), "không nhảy được" (p08), "không qua được hố" (p02, p06),
  "nhảy không ăn ở màn 3" (p04), "phím không ăn tới khi đưa cửa sổ lên trước" (p05).
  Mỗi cái có phép đo phản chứng trong file tương ứng.
