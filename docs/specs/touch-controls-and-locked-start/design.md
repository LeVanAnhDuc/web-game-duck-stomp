# Sửa hai lỗi UX chặn đường — cảm ứng và node bị khoá

> **Trả lời:** hai lỗi nào, cơ chế của chúng là gì, và sửa theo hướng nào?
> **Trạng thái:** 🟢 đủ
> **Nguồn:** `ux-feedback-2026-09-12.md` (cùng thư mục) — 8 phiên persona trên bản
> đã phát hành, cộng các phép đo độc lập của người điều phối.

## Phạm vi

Đúng **hai** lỗi. Cả hai đều là lỗi hiện thực, không phải quyết định thiết kế cần
bàn lại, và cả hai đều được xác nhận bằng phép đo chứ không chỉ bằng lời persona.

| # | Lỗi | Đụng gì |
| --- | --- | --- |
| 1 | Người chơi **chỉ dùng cảm ứng không di chuyển được nhân vật** | FR-15 · NFR-A11Y-06 · US-03 · bất biến #11 |
| 2 | Node bị khoá **vẫn chọn được**, nút START vẫn trông bấm được, bấm thì **im lặng** | FR-02 · US-01 |

## Lỗi 1 — vòng tròn tự khoá của cụm nút cảm ứng

### Cơ chế

```
HudScene.update()      →  cụm nút hiện khi   inputs.showTouch
InputManager.showTouch →  sawTouch && !sawKey
sawTouch               →  chỉ bật bởi pointerdown TRÊN CHÍNH mấy nút đang ẩn
```

Nút ẩn thì Phaser không hit-test nó, nên `pointerdown` không bao giờ tới. Không có
đường nào bật `sawTouch`. Người chơi cảm ứng vào được màn chơi rồi đứng đó.

### Bằng chứng

- Ba nguồn độc lập: hai phiên persona (`p01-RR-03` 5 kiểu chạm, `p07-blind` 2 kiểu
  chạm) và một phép đo bằng máy trong context sạch — kể cả với `hasTouch: true` và
  tap cảm ứng thật, `showTouch` không bao giờ bật.
- Không có test nào đỏ, không có log lỗi nào. Đây là kiểu hỏng **âm thầm**.

### Hướng sửa đã chọn

**Bất kỳ `pointerdown` thật nào có `pointer.wasTouch === true`, ở phạm vi scene, đều
bật `sawTouch`.**

`Pointer.wasTouch` là *"sự kiện input trước đến từ Touch (true) hay Mouse (false)"* —
nó là **input đã thực sự tới**, nên bất biến #11 (không đoán theo user-agent) vẫn
được giữ nguyên. Người dùng chuột không bị hiện nút cảm ứng che màn chơi.

Cái giá, chấp nhận có ý thức: **cú chạm đầu tiên chỉ để hiện nút**, nó không đồng
thời nhảy hay đi. Với người chơi thì đó là một lần chạm "thử xem có gì" — đúng cái
mà cả hai persona điện thoại đã tự làm.

### Ba hướng đã bỏ

| Hướng | Vì sao bỏ |
| --- | --- |
| Hiện nút ngay khi vào màn nếu thiết bị có cảm ứng | Đoán theo năng lực thiết bị = vi phạm bất biến #11. Laptop cảm ứng bị nút che màn chơi |
| Cho cụm nút luôn hiện, mờ hơn, tới khi có phím | Trái FR-15 ("hiện sau cú chạm đầu"), và chiếm chỗ màn chơi của người dùng bàn phím |
| Vùng chạm vô hình full-screen: nửa phải = đi phải | Là nút thứ ba đội lốt (ADR-0004), và cả hai persona điện thoại đều đã thử đúng cách này rồi thất bại — nó không phải mô hình họ mong đợi, họ đi tìm **nút** |

## Lỗi 2 — node khoá: chọn được, trông bấm được, bấm thì im

### Cơ chế

`WorldMapScene.enter()` đã có chốt `if (!isUnlocked(...)) return` — nhưng là một
`return` **im lặng**. Còn phía hiển thị thì không có gì đổi: thẻ dưới đáy vẫn ghi
`LEVEL 2 · BEST --` như một màn bình thường, và nút `START` vẫn vàng rực y như khi
chọn màn đang mở.

### Bằng chứng

Ảnh `p03-RR-01-03` và `p03-RR-01-04` **giống nhau từng pixel**, và persona bấm Space
giữa hai ảnh đó. Bằng chứng khách quan, không phụ thuộc việc persona có nhận ra hay
không. Đây cũng là cú bấm khiến persona bỏ cuộc.

### Hướng sửa đã chọn

Khi màn đang chọn bị khoá:

1. Nút START chuyển sang **trạng thái vô hiệu**: mặt trong suốt, viền `--locked`,
   chữ `--ink-dim`, bỏ khối bóng, **không nhận input**, và `activate()` không làm gì.
2. Thẻ dưới đáy hiện `LOCKED` thay cho `BEST --`, và **ẩn** icon xu + số xu — hai con
   số đó vô nghĩa với một màn chưa mở.

Token lấy từ `MASTER.md`, không tự chọn màu:

- `--locked` `#7B84BA` được định nghĩa đúng cho *"node chưa mở, **thứ bị vô hiệu**"*.
- `locked / night` = 3.58:1 → đủ cho **viền và icon** (≥3:1), **không** đủ cho chữ.
  Nên chữ dùng `--ink-dim`: `ink-dim / panel` = 5.52:1 ✅ NFR-A11Y-01.
- Không dùng `--gold` cho nút vô hiệu: bất biến #7 khoá vàng cho xu / kỷ lục / CTA /
  focus.

Chuỗi `locked` **đã có sẵn** trong bảng khoá (`src/core/strings.ts`) và chưa từng
được dùng ở đâu. Đổi giá trị `'Locked'` → `'LOCKED'` cho khớp `BEST` / `START` /
`PAUSED`; vẫn ASCII nên NFR-I18N-04 không đổi.

### Hai hướng đã bỏ

| Hướng | Vì sao bỏ |
| --- | --- |
| Không cho chọn node khoá | Mất một thứ đang có giá trị: người chơi bấm vào node khoá để **xem trước** màn tiếp theo. Vấn đề không phải chọn được, mà là nút START nói dối |
| Hiện toast/thông báo "màn này chưa mở" | Cả game không có một dòng chữ hướng dẫn nào (`overview.md` §4). Một nút vô hiệu đúng chuẩn đã nói đủ, mà không cần câu chữ nào |

## KHÔNG thuộc phạm vi lần này — và vì sao

| Phát hiện | Vì sao để lại |
| --- | --- |
| **Hố đầu màn 1 không qua được nếu không giữ hai phím cùng lúc** (đo được) | Đây là **cái giá của ADR-0004**, không phải bug. Sửa nó là mở lại một quyết định thiết kế nền (thêm nút, thêm toggle, hoặc bỏ tăng-tốc-theo-thời-gian-giữ). Ghi số đo vào `nfr.md` + ADR mới, để lần sau bàn có số liệu |
| Màn chặn xoay bị đọc thành "trang bị lỗi" trong ~3 giây | Sửa là việc thiết kế hình (hoạt hình xoay máy), cần cổng duyệt mockup — không nhét vào một PR sửa lỗi |
| Ba ký hiệu ở Title bị đọc thành ba cái nút | Cùng lý do. Và sau khi sửa lỗi 1 thì lời hứa đó **được giữ**: chạm một cái là nút hiện ra |
| `BEST` bị hiểu là bảng xếp hạng | Low, một persona, và persona đó là negative persona |
| Đồng hồ `0:05` bị đọc thành `0:0S` | Một persona, đặc tính font pixel cỡ nhỏ. Cần một lần chạy nữa để xác nhận |

## Tham chiếu

FR-02 · FR-15 · US-01 · US-03 · NFR-A11Y-01 · NFR-A11Y-06 · ADR-0004 · bất biến #7 ·
bất biến #11 · ADR mới trong PR này cho quyết định `wasTouch`.
