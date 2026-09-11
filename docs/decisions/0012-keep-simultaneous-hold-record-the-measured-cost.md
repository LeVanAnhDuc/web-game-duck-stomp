# ADR-0012 · Giữ yêu cầu giữ hai phím cùng lúc, và ghi lại cái giá đã đo

> **Ngày:** 2026-09-12
> **Trạng thái:** accepted
> **Liên quan:** ADR-0004 (không thay thế, chỉ đo cái giá của nó) · NFR-A11Y-06 · FR-03

## 1. Bối cảnh

ADR-0004 bỏ nút chạy và thay bằng **tăng tốc theo thời gian giữ hướng**, cộng với
nhảy cao theo lực giữ. ADR đó chấp nhận một cái giá về tiếp cận mà không đo.

Review persona 2026-09-12 đo được nó. Persona tiếp cận về vận động (giữ tối đa ~1
giây, **không giữ được hai phím cùng lúc**) thử 5 cách nhảy khác nhau và **không qua
được cái hố đầu tiên của màn 1**. Người điều phối kiểm lại bằng phép đo sạch, mỗi lần
nạp màn mới từ đầu:

| Cách bấm | Kết quả |
| --- | --- |
| một phím một lúc: giữ phải 1000 ms → nhả → nhảy 500 ms | rơi xuống hố |
| một phím một lúc: giữ phải 1000+400 ms → nhả → nhảy 500 ms | không tới được mép hố (nhả phím là giảm tốc ngay) |
| **hai phím cùng lúc**: giữ phải, nhảy 350 ms trong lúc vẫn giữ | **qua hố** |

Nên: **hố đầu tiên của màn đầu tiên không vượt được nếu không giữ đồng thời hai
phím.** Không phải chuyện canh thời gian — là cơ chế.
`gameaccessibilityguidelines.com` xếp "hold vs tap" vào nhóm khuyến nghị **cơ bản**.

## 2. Quyết định

**Giữ nguyên cơ chế.** Không thêm toggle chạy, không thêm chế độ "tap để nhảy xa",
không hạ độ rộng hố ở màn 1 trong đợt này.

Đổi lại, cái giá được **ghi ra thành số** ở `nfr.md` (cạnh NFR-A11Y-06) và ở
`04-state/backlog.md`, kèm đường dẫn tới bản review, để lần sau ai bàn lại thì bàn
với số liệu chứ không với cảm giác.

Đây là một quyết định **có ý thức để không sửa**, không phải một lỗi bị bỏ sót.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| Thêm toggle "tự chạy" trong menu | Là nút thứ ba đội lốt, và mở ra cả một màn cài đặt mà game chưa có. Trái trực tiếp ADR-0004 |
| Cho nhảy giữ lại quán tính ngang sau khi nhả phím hướng | Đụng vào máy trạng thái di chuyển — trái tim của cảm giác điều khiển, đang được 25 unit test khoá. Sửa nó vì một phát hiện từ **một** persona là đổi thứ đắt nhất vì tín hiệu mỏng nhất |
| Thu hẹp hố đầu màn 1 | Màn 1 dạy luật bằng bố cục (`overview.md` §4). Cái hố đó **là** bài dạy "phải nhảy". Làm nó dễ hơn là bỏ bài dạy, mà vẫn không giúp người không giữ được hai phím ở 5 màn còn lại |
| Sửa ngay trong PR này | Cả ba hướng trên đều là quyết định sản phẩm cần cổng duyệt, không phải bản vá đi kèm hai lỗi hiện thực |

## 4. Hệ quả

**Được:**
- ADR-0004 giữ nguyên hiệu lực, và giờ có một con số đi kèm thay vì một giả định.
- Lần bàn sau bắt đầu từ dữ liệu: *"người không giữ được hai phím dừng ở hố đầu tiên
  của màn đầu tiên"*, có ảnh chứng.

**Mất / phải chấp nhận:**
- Người chơi hạn chế vận động ở mức này **không chơi được game này**. Đó là cái giá,
  nói thẳng ra, không bọc lại.
- NFR-A11Y-06 vẫn đạt theo đúng chữ (chơi được hết bằng bàn phím; chơi được hết bằng
  cảm ứng — sau ADR-0010), nhưng có một nhóm người dùng mà **cả hai** đường đều
  không tới được. Ghi rõ ở `nfr.md`.

**Điều kiện xem lại quyết định này:** khi có thêm một persona tiếp cận thứ hai vấp
cùng chỗ, hoặc khi có người chơi thật báo lại — lúc đó tín hiệu đủ dày để trả giá cho
việc mở lại ADR-0004.
