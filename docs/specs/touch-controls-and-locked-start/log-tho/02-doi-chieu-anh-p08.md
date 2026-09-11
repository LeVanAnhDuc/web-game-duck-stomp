# Đối chiếu phiên p08-RR-01 — một nửa dùng được, một nửa phải loại

## Phần PHẢI LOẠI: "bấm mũi tên lên và phím cách đều không nhảy"

Persona khai bỏ cuộc vì không nhảy được qua hố. **Đây là lỗi của bộ dò, không phải
của game.** Người điều phối kiểm lại ngay trên cùng URL live, cùng khổ 1440×900,
vào màn 1 và thử ba cách bấm phím nhảy, so ảnh trước/sau theo byte:

| Cách bấm | Byte khác nhau giữa hai ảnh | Kết luận |
| --- | --- | --- |
| `down` → **100 ms** → `up` (cú bấm nhanh của người thật) | **8179** / 9337 byte | **NHẢY** |
| `down` → **180 ms** → `up` | **7899** byte | **NHẢY** |
| `press` không có `delay` — đúng thứ `browser_press_key` gửi | **0 byte, hai ảnh giống hệt** | không có gì xảy ra |

Ảnh chứng: `zz-kiem-tap-space-180ms.png` — chụp 180 ms sau một cú bấm 100 ms, con vịt
đang **ở trên không**, cách hẳn mặt nền.

Nên: game nhảy đúng với một cú bấm nhanh 100 ms. Persona đã dùng `browser_press_key`
(0 ms) cho hai lần thử nhảy, dù brief đã dặn thang quy đổi. Mọi kết luận về "không
nhảy được" trong phiên này **không được thành phát hiện**.

### Đã sửa nguyên nhân, không chỉ sửa báo cáo

Dặn bằng chữ là không đủ — hai phiên liên tiếp đều tự tìm về `browser_press_key`. Nên
tool đó đã bị **gỡ khỏi danh sách `tools:` của agent `ux-persona`**
(`.claude/agents/ux-persona.md`), tức từ phiên sau nó không còn cách nào gọi. Mọi cú
bấm buộc phải đi qua `browser_run_code_unsafe` với thời gian giữ tường minh.

Giới hạn của bản sửa: file agent **không nạp nóng**, nên trong phiên Claude Code này
danh sách tool cũ vẫn còn hiệu lực. Với các phiên còn lại của lần chạy này, brief
thay bằng một lệnh cấm tường minh: *"bạn KHÔNG được dùng `browser_press_key`"*.

## Phần DÙNG ĐƯỢC, và nó có giá trị cao

Ba thứ trong phiên này là dẫn chứng thật, không phụ thuộc vào lỗi trên:

1. **Ấn tượng đầu đọc được nút PLAY.** Khác hẳn p03 (cùng persona, cùng màn hình):
   lần này persona nhận ra "cái nút vàng to ghi PLAY" và đoán đúng "bấm vào để bắt
   đầu chơi". Chênh lệch giữa hai phiên đến từ brief, không từ sản phẩm — nên **không
   được** dùng cặp p03/p08 để nói bất cứ điều gì về việc nút PLAY có dễ nhận ra hay
   không. Cả hai phiên chỉ nói được: chữ `DUCK STOMP` là tiếng Anh và persona không
   hiểu nó nghĩa gì.

2. **Bấm nhanh phím hướng thì nhân vật gần như không nhích.** Nguyên văn: *"nhân vật
   chỉ nhích một tí xíu, gần như không thấy khác"* sau một cú bấm 100 ms. Đây là cái
   giá của ADR-0004 (tăng tốc theo thời gian giữ) hiện ra ở đúng nhóm người dùng mà
   nó đắt nhất: người quen web, bấm-nhả. Dẫn chứng ảnh: `p08-RR-01-05-sau-bam-nhanh-phai.png`.

3. **Nhưng persona TỰ nghĩ ra việc giữ phím**, không ai nói: *"chắc phải giữ lâu hơn
   mới đi được"* → đi được một đoạn dài tới mép hố, và persona nói *"mừng vì đoán
   đúng"*. Đây là bằng chứng **ủng hộ** ADR-0004: một người chưa từng chơi platformer
   suy ra được cơ chế giữ-để-chạy trong một bước. Ghi cả hai chiều, đừng chỉ ghi chiều
   xấu.

4. **Bấm trật nút START một lần** và tự nhận ra là trật (*"ảnh chụp không đổi gì cả,
   tôi phải nhìn lại vị trí cho kỹ"*). Nút START ở khổ này rộng khoảng 300×96 px màn
   hình — trật vẫn xảy ra. Dẫn chứng: `p08-RR-01-03-sau-bam-start.png`.

## Ảnh của người điều phối, không phải của persona

`zz-kiem-tap-space-180ms.png` và `zz-kiem-hold-space-180ms.png` **không** mang tiền tố
mã phiên, vì chúng không thuộc phiên nào: người điều phối chụp để kiểm chứng mục trên.
Ghi ra đây theo đúng cổng kiểm ảnh của `lib/orchestration.md` thay vì im lặng bỏ qua.
Không dùng chúng làm dẫn chứng cho trải nghiệm của bất kỳ persona nào.
