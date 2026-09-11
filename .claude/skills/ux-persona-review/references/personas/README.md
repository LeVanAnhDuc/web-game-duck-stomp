# Dàn persona — Duck Stomp

> **Chốt ngày:** 2026-09-12 · theo `../persona-rules.md`, dựa trên
> `../red-routes.md` (duyệt cùng ngày)
> **Trạng thái:** 🟢 đủ
> **Cập nhật khi:** Red Route thêm/bớt · một persona tỏ ra không dự đoán được hành vi nào

**Dàn này cố định giữa các lần chạy.** Đẻ persona mới mỗi lần là tự phá thứ đắt nhất
skill này tạo ra: khả năng so sánh trước và sau khi sửa. Sửa được, nhưng sửa thì ghi
ngày và ghi vì sao ngay trong file của người đó.

Cả bảy là **proto-persona**: viết từ tài liệu sản phẩm, chưa phỏng vấn một người chơi
thật nào. Báo cáo phải đọc như "bảy người lạ đã thử", không phải "người dùng của
chúng ta nghĩ vậy" (`../persona-rules.md` §2).

## Bảy người, và ai đi đường nào

| File | Tên | Cooper | Thiết bị · mạng | Vốn platformer | Phiên |
| --- | --- | --- | --- | --- | --- |
| `p01-trang-doi-xe.md` | Trang | **primary** | phone ngang 667×375 · 3G chậm | **không có** | RR-03 |
| `p02-minh-ban-phim.md` | Minh | secondary | desktop 1440×900 · nhanh | dày (lớn lên với Mario) | RR-02 |
| `p03-hoa-can-than.md` | Hoà | secondary | desktop 1440×900 · nhanh | **không có** | RR-01 |
| `p04-duy-luc-loi.md` | Duy | primary | phone ngang 667×375 · nhanh | rất dày | RR-05 |
| `p05-lan-khong-giu-nut.md` | Lan | **primary (a11y)** | desktop 1440×900 · nhanh | có, nhưng đã lâu | RR-04 |
| `p06-khanh-doi-hoi.md` | Khánh | **negative** | desktop 1440×900 · nhanh | dày | mù (power user) |
| `p07-tuyet-mat-kem.md` | Tuyết | secondary (a11y) | phone ngang 667×375 · trung bình | **không có** | mù (điện thoại) |

Tổng **7 phiên** = 5 Red Route `live` + 2 phiên mù, đúng như `lib/orchestration.md`.
Hai phiên mù nhận đúng hai hồ sơ mà file đó đòi: một người trình độ số thấp trên
điện thoại (Tuyết) và một power user trên desktop (Khánh).

## Bốn ràng buộc của dàn, và chỗ chúng được thoả

| Ràng buộc | Ai thoả |
| --- | --- |
| ít nhất một persona tiếp cận | **Lan** (vận động: không giữ nút lâu được) và **Tuyết** (thị lực kém) |
| đúng **một** negative persona | **Khánh** — hai cái thì báo cáo biến thành danh sách đòi tính năng ngoài phạm vi |
| ít nhất một người điện thoại trên mạng chậm | **Trang** |
| ít nhất một người **không** có vốn platformer nào | **Trang**, **Hoà**, **Tuyết** — ba người, vì đây là biến quyết định nhiều nhất ở một game không có chữ hướng dẫn |

## Hai điều tuyệt đối không nói cho persona

1. **Điều khiển.** Không nói phím nào, không nói giữ hướng thì nhanh dần, không nói
   đạp đầu địch thì địch chết. Cả `overview.md` §6.1 đứng trên giả thiết người chơi
   tự hiểu; nói trước là xoá phép đo.
2. **`canvas-driving.md` §Điểm đã hỏng.** Người điều phối dán vào brief **cách lái**
   (hai mục §Công thức), không dán chỗ đã biết là hỏng. Persona bị kẹt vì lỗi thật
   thì đó là số đo; persona được cảnh báo trước thì chỉ còn là diễn.
