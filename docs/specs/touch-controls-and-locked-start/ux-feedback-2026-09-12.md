# Duck Stomp — UX persona review · 2026-09-12 (run `2026-09-12-0104`)

> 8 phiên · 7 proto-persona (Hoà chạy 2 lần) · 5 Red Route + 2 phiên mù
> Công cụ trình duyệt: playwright MCP — **một browser, một page dùng chung** ⚠️ ba chỗ kết quả bị giảm giá trị, xem §Ghi chú về chính lần chạy này
> Bản chạy: **bản đã phát hành** `https://levananhduc.github.io/web-game-duck-stomp/` (không phải `127.0.0.1:4173` như `entry` của red-routes)
> Red Route chốt ngày: 2026-09-12
> Lăng kính **Form design: ⚪ không áp dụng** — game canvas, không có một ô nhập nào (theo bản ghi đè của project).
>
> Log thô của từng phiên: `log-tho/`. Ảnh của các phát hiện Critical/High: `anh/`.
> Bản gốc đầy đủ (66 ảnh) ở `.claude/skills/ux-persona-review/runs/2026-09-12-0104/`, không vào repo.

---

## Ấn tượng đầu

Tính trên toàn bộ 8 phiên — ấn tượng đầu chỉ xảy ra một lần. Đã mở cả 8 ảnh `-01-vua-mo-trang`.

| Thước | Kết quả |
| --- | --- |
| **Đoán đúng đây là trang gì** | **7/8 phiên** (6/7 persona) đoán đúng "đây là một game để chơi" |
| Phiên duy nhất đoán sai | **p01-RR-03 (Trang)** — người duy nhất mở máy ở chiều dọc, nên chưa từng thấy màn Title |
| Đọc ra được nghĩa của cái tên `DUCK STOMP` | **1/8** — Minh (p02), người duy nhất vừa đọc tiếng Anh vừa có vốn platformer: *"đoán là game platformer nhỏ kiểu đạp đầu"*. Hoà nói thẳng ở **cả hai** phiên: *"chữ 'DUCK STOMP' là tiếng Anh tôi không hiểu nghĩa"* (p08) |
| **Có bấm PLAY không, và mất bao lâu mới dám bấm** (thay dòng "dám nhập email" — game không thu PII nào) | **5/8 phiên bấm thẳng CTA vàng ở hành động đầu tiên, không do dự một nhịp** (Lan, Khánh, Tuyết, Hoà-lần-2 bấm `PLAY`; Duy bấm `CONTINUE`). **2/8 trúng CTA trong lúc dò mù** — Minh *"thử click vào giữa canvas"*, Hoà-lần-1 *"thấy cái gì không hiểu thì bấm thử vào giữa xem có phản ứng gì không, giống bấm vào banner quảng cáo"*; ảnh `p02-RR-02-02-sau-click-giua.png` xác nhận cú bấm mù đó đã vào bản đồ. **1/8 chưa từng thấy nút PLAY** (Trang). **Không phiên nào chờ lâu rồi mới dám bấm** |
| Lý do người vẫn ngờ, dù game không hỏi họ điều gì | **3/7 persona tự nêu cùng một lý do**: không biết ai làm ra trang. Hoà (p03): *"không thấy tên công ty hay số điện thoại liên hệ gì"* · Lan (p05): *"nếu có tôi cũng sẽ ngần ngại vì không biết ai làm ra trang này"* · Tuyết (p07): *"nếu có chắc tôi cũng dè chừng vì không biết ai làm ra"* |

**Ba từ trước khi dùng:** tò mò (6/8) · lạ lẫm (4/8: Hoà ×2, Khánh, Tuyết) · quen thuộc (2/8 — đúng hai người có vốn platformer: Minh, Duy) · bối rối/nghi ngờ/trống trải (Trang, người duy nhất gặp màn chặn xoay) · hoài nghi (Khánh) · hơi run (Tuyết) · hơi ngại / hơi e dè / hơi ngờ ngợ (Hoà ×2, Lan)

**Ba từ sau khi dùng:** hụt hẫng (**3 persona**: Trang, Duy, Khánh) · bực / bực bội / hơi bực (**3 persona**: Trang, Duy, Hoà) · tiếc (**3 persona**: Minh, Hoà, Lan) · bí (**2 persona**: Tuyết, Hoà) · chịu thua (Hoà, cả hai phiên) · cay cú (Minh) · loay hoay · bế tắc · chán · ngại · nghi ngờ · không-để-lại-gì

**Đổi theo hướng:** xấu đi ở 7/8 phiên. Từ **"tò mò"** xuất hiện ở 6/8 phiên lúc đầu và chỉ sống sót ở **1** phiên sau khi dùng (Trang, kèm "bực, hụt hẫng"). Ba từ tiêu cực lặp từ 3 persona trở lên — *hụt hẫng*, *bực*, *tiếc* — theo `lib/frameworks.md` là phát hiện, không phải chuyện cảm tính: cả ba đều là từ của người **muốn** chơi mà không vào được, không phải của người thấy sản phẩm tệ.

**Ý định quay lại: 1/7 persona sẽ tự quay lại.** Minh (p02): *"có, chắc chắn có, vì đúng gu platformer của tôi, có ghi kỷ lục cá nhân rõ ràng để mình cày lại"*. Sáu người còn lại: không, hoặc *"trừ khi có ai chỉ tôi"* (Trang, Hoà, Lan, Tuyết đều nói dạng này). Khánh là **negative persona** và lý do anh bỏ đi (không tài khoản, không đồng bộ, không bảng xếp hạng) nằm nguyên trong danh sách Non-Goals — đó là kết quả **đạt**, không phải phát hiện.

---

## Bảng điểm theo Red Route

Theo bản ghi đè của project: `par_deaths` và `par_time_s` vẫn **⚪ chưa đo**, nên phần trong màn chơi báo **số thô không kèm mẫu số**. Cột Hiệu suất chỉ tính **bước ngoài lúc chơi** (bấm menu).

| Red Route | Hiệu quả | Hiệu suất (bước menu / `min_steps`) | Số thô trong màn | Hài lòng |
| --- | --- | --- | --- | --- |
| **RR-01** Từ cái link tới xong màn 1 | **0/2 phiên** (p03, p08 — cùng persona Hoà) | p08: **3/2** (bấm trật START một lần) · p03: không vào được màn chơi, dừng trên bản đồ | p08: 0 lần chết, đồng hồ 2:06 lúc bỏ · p03: không vào màn | *"bí, hơi bực, chịu thua"* (p08) · *"bối rối, chịu thua, tiếc"* (p03) |
| **RR-02** Quay lại phá kỷ lục | **0/1** — không có dấu `NEW BEST` nào | **4/3** (cú bấm mù vào giữa + node 3 + node 2 + START) | 1 lần mất 2 tim, 3 lần rơi cùng một hố, đồng hồ 3:49 so với kỷ lục cũ 0:58 | *"Vui, cay cú, tiếc"* — **phiên duy nhất nghiêng dương**, và người duy nhất nói sẽ quay lại |
| **RR-03** Điện thoại, cầm dọc lúc mở | **0/1** — chặn cứng, không đi được một pixel nào | **2/3** (xoay máy + START; Trang bỏ qua được bước PLAY vì xoay ngang là vào thẳng bản đồ — ảnh `p01-RR-03-02-xoay-ngang-man-chon.png`) | 5 kiểu chạm khác nhau, **0 pixel di chuyển**, đồng hồ 0:08 lúc bỏ | *"tò mò, bực, hụt hẫng"* |
| **RR-04** Chết rồi chơi lại ngay | **1/1 — ĐẠT** | **0/0** — đúng cái "không có bước nào" là yêu cầu, và nó đúng | 5 lần rơi hố, mỗi lần điều khiển lại được ngay, tim giữ 3/3, đồng hồ không về 0 (0:07 → 0:37) | Về **chính route này**: *"Đây đúng là điều tôi mong muốn... cái này làm được tốt"*. Về cả phiên: *"loay hoay, tiếc, bế tắc"* |
| **RR-05** Tìm ra phòng xu giấu | **⚪ KHÔNG ĐO ĐƯỢC** | 2/3 (CONTINUE + START) | 0/9 xu, đồng hồ 4:44, chưa bao giờ tới bức tường nứt | *"bực bội, hụt hẫng, nghi ngờ"* — nhưng gắn với chỗ persona bị kẹt, không gắn với câu hỏi của RR-05 |
| *(phiên mù)* p06 Khánh · p07 Tuyết | không chấm điểm | — | Khánh **qua được hố thứ nhất** (ảnh `p06-blind-04-nhay-qua-ho.png`, 0:36) · Tuyết 4 hành động rồi bỏ | *"hụt hẫng, chơi-cho-vui, không-để-lại-gì"* · *"bí, chán, ngại"* |

---

## Phát hiện

Xếp theo mức nghiêm trọng giảm dần. Mọi ảnh dẫn ở đây đã được mở ra nhìn, và tiền tố ảnh đã đối chiếu với phiên được trích.

### F-01 · Critical · ISO 9241-11 · Interaction Design · Visual hierarchy

**Ở đâu:** RR-03 (và mọi phiên điện thoại) — trong màn chơi, ngay sau khi bấm START.

**Chuyện gì xảy ra:** Người chơi chỉ có cảm ứng thì **không có đường nào** làm nhân vật nhích một pixel. Cụm nút cảm ứng không xuất hiện ở bất kỳ khổ nào, bất kỳ kiểu chạm nào. Cả hai persona điện thoại đều bỏ cuộc tại đúng chỗ này, và cả hai đều tự kết luận là **thiếu bàn phím**, không phải là app lỗi.

**Dẫn chứng:**
- **Trang (p01-RR-03)**, sau 5 kiểu chạm khác nhau (giữ phải 600 ms, tap vào nhân vật, giữ tại nhân vật 300 ms, vuốt từ nhân vật sang phải, giữ trái 500 ms) — *"Đến đây tôi nghĩ 'chắc phải có bàn phím mới chơi được cái này, mà tôi chỉ có điện thoại thôi'"*. Ảnh `p01-RR-03-03-vao-man-choi.png` và `p01-RR-03-05-bi-ket-khong-dieu-khien-duoc.png`: hai ảnh **giống nhau hoàn toàn**, con vịt đứng đúng một chỗ, khác duy nhất ở đồng hồ 0:00 → 0:08. Không có nút cảm ứng nào trên màn hình trong cả hai ảnh.
- **Tuyết (p07-blind)**, bước 4 — *"Hai lần liền không ăn thua, tôi không biết làm sao nữa, nên tôi dừng lại, đợi hỏi lại con gái xem phải bấm ở đâu."* Ảnh `p07-blind-03-vao-level1.png` và `p07-blind-04-bi-ket-khong-di-duoc.png`: lại giống nhau hoàn toàn, khác duy nhất ở đồng hồ 0:06 → 1:01.

**Bao nhiêu người vấp:** **2/2 persona điện thoại** (2/8 phiên) — cộng thêm một phép đo độc lập của người điều phối trước cả lần chạy này, trong đó nhấn-giữ 400 ms đúng ô nút và tap cảm ứng thật với `hasTouch: true` đều cho cùng kết quả. Ba nguồn độc lập, một kết luận.

**Mức:** chặn `done_when` của RR-03 → High; ≥2 persona cùng vấp → **nâng lên Critical**. `overview.md` §3 xếp người chơi điện thoại ngang là **nhóm chính**, và `NFR-A11Y-06` đòi chơi được hết **chỉ** bằng cảm ứng.

**Hướng xử lý:** cụm nút cảm ứng cần một đường xuất hiện **không phụ thuộc vào việc người chơi đã chạm đúng chỗ nó đang ẩn**. Đây là điều kiện tự khoá, nên mọi bản sửa phải trả lời được câu "người mới mở game trên điện thoại thấy nút bằng cách nào" trước khi tính tới chuyện nút trông thế nào. (Đọc kèm F-02: người chơi không chỉ thiếu nút — họ **đã được cho thấy** là sẽ có nút.)

---

### F-02 · High · Trigger words · Visual hierarchy · Visual craft

**Ở đâu:** màn Title, ba ô ký hiệu ở đáy — rồi hệ quả ở màn chơi.

**Chuyện gì xảy ra:** Ba ký hiệu điều khiển không chữ ở đáy Title (FR-01, ADR-0005: dạy bằng ký hiệu) bị đọc thành **ba cái nút bấm được**. Vào màn chơi thì không có nút nào, và người chơi cảm ứng đi tìm chúng.

**Dẫn chứng:**
- **Tuyết (p07-blind)**, bước 3, ngay khi vào màn 1 — *"Không thấy có nút mũi tên nào để điều khiển **như lúc màn hình chờ ban đầu có 3 cái nút nhỏ** (mũi tên trái, phải, tam giác) — **nó biến mất tiêu rồi**."* Ảnh `p07-blind-01-vua-mo-trang.png` (ba ô ở đáy) và `p07-blind-03-vao-level1.png` (không còn ô nào).
- **Khánh (p06-blind)**, ngay ở ấn tượng 5 giây — *"có nút PLAY và mấy nút mũi tên trái/phải/nhảy phía dưới (**chắc là điều khiển cảm ứng**)"*. Ảnh `p06-blind-01-vua-mo-trang.png`.
- Gốc thị giác, đọc từ ảnh: ba ô đó dùng **đúng công thức của nút phụ** trong `MASTER.md` (viền 2px `--ink-dim`, nền trong suốt, góc vuông) và xếp ngay dưới nút `CONTINUE` cùng một trục, cùng một kiểu viền — xem `p02-RR-02-01-vua-mo-trang.png` và `p04-RR-05-01-vua-mo-trang.png`, nơi `CONTINUE` và hàng ba ô chồng nhau như hai hàng nút của cùng một menu. Chúng **là** bảng chú giải nhưng được vẽ bằng ngôn ngữ của nút.
- Chiều ngược lại, phải ghi: **Lan (p05-RR-04)** đọc đúng ngay ở ấn tượng 5 giây — *"ba ô nhỏ ở dưới ghi hình mũi tên trái, mũi tên phải, hình tam giác nhô lên (chắc là gợi ý cách điều khiển: trái/phải/nhảy)"*. Ảnh `p05-RR-04-01-vua-mo-trang.png`.

**Bao nhiêu người vấp:** **2/7 persona** đọc thành nút (1/7 đọc đúng là chú giải). Hai người, hai thiết bị khác nhau, cùng một cách đọc.

**Mức:** gây kỳ vọng sai và tốn bước → Medium; ≥2 persona → **nâng lên High**. Với Tuyết nó đổ trực tiếp vào lý do bỏ cuộc; với Khánh (desktop) thì vô hại.

**Hướng xử lý:** hàng ký hiệu này đang làm hai việc trái nhau — dạy phím, và trông như nút bấm. Chọn một. Nếu F-01 được sửa thì lời hứa đó thành lời hứa đúng, và phát hiện này tự tan; nếu không, nó là mũi nhọn của F-01.

---

### F-03 · High · Interaction Design · LATCH · Visual hierarchy

**Ở đâu:** RR-01 — bản đồ chọn màn, khi ô chọn nằm trên một node đang khoá.

**Chuyện gì xảy ra:** Bản đồ **cho phép chọn một màn đang có ổ khoá**. Thẻ dưới đáy đổi thành `LEVEL 2 · BEST -- · 0 xu` như một màn bình thường, và nút `START` **vẫn vàng rực, vẫn có bóng khối, vẫn trông bấm được y như lúc chọn màn 1**. Bấm thì **không có gì xảy ra, im lặng hoàn toàn**.

**Dẫn chứng:**
- **Hoà (p03-RR-01)**, bước 3 → bước 4: ảnh `p03-RR-01-03-sau-bam-mui-ten-phai.png` và `p03-RR-01-04-sau-bam-space.png` **giống nhau từng pixel**, và persona bấm phím cách giữa hai ảnh đó. Lời persona ở đúng chỗ bỏ cuộc: *"tôi không thấy có gì rõ ràng cho tôi biết là mình đang làm đúng hay sai — không có chữ báo lỗi, không có tiếng động lạ, nhưng cũng không có chữ nào bảo tôi 'làm đúng rồi đó'"*.
  ⚠️ Phần khác của phiên p03 đã bị **LOẠI** (persona khai "khung hình vẫn y như cũ" trong khi ảnh cho thấy màn hình đã đổi hoàn toàn — lỗi bộ dò, xem `log-tho/01-doi-chieu-anh-p03.md`). Phát hiện này **không** dựa vào lời khai đó: nó dựa vào hai ảnh giống nhau, là bằng chứng khách quan.
- Xác nhận thêm bằng ảnh của **một phiên khác**: `p02-RR-02-05-man-chon-level.png` (Minh) — ô chọn đang nằm trên node 5 **có ổ khoá**, thẻ đáy ghi `LEVEL 5 · BEST -- · 0`, `START` vàng nguyên vẹn. Minh tình cờ không bấm nên không bị chặn.
- Chi tiết thị giác đọc được từ ảnh: vòng chọn trên node **mở** là vòng **vàng** (`p08-RR-01-03-sau-bam-start.png`, `p06-blind-09-ve-map-mat-tien-do.png`), còn vòng chọn trên node **khoá** là vòng đôi màu `--locked` xanh nhạt (`p03-RR-01-03`). Có phân biệt, nhưng cùng độ dày, cùng hình dáng — và **thẻ đáy cùng nút START thì không phân biệt gì cả**, mà đó mới là hai thứ to nhất trên màn hình.

**Bao nhiêu người vấp:** **1/8 phiên bị chặn** (Hoà, p03) · **2/8 phiên nhìn thấy cái thẻ sai trạng thái đó**.

**Mức:** chặn `done_when` của RR-01 → **High**. Không nâng bậc: chỉ một persona thực sự bấm.

**Hướng xử lý:** trạng thái của node đang chọn phải đi tới **cả thẻ đáy và cả CTA**, không chỉ tới vòng chọn; và một cú bấm bị từ chối cần **một** câu trả lời nào đó thay vì im lặng. `MASTER.md` §Component đã viết đúng nguyên tắc — *"'tức thì' không có nghĩa là 'không thấy gì đổi'"* — chỉ là chưa áp vào trường hợp này.

---

### F-04 · High · ISO 9241-11 (tiếp cận) · Interaction Design

**Ở đâu:** RR-01 / RR-04 — cái hố đầu tiên của màn 1.

**Chuyện gì xảy ra:** **Không giữ được hai phím cùng lúc thì không qua nổi cái hố đầu tiên của màn 1.** Không phải chuyện canh thời gian — là chuyện cơ chế.

**Dẫn chứng:**
- **Lan (p05-RR-04)** — persona tiếp cận, giới hạn cơ thể ghi trong hồ sơ: một lần giữ tối đa 1000 ms, **không bao giờ giữ hai phím cùng lúc**. Sau 5 cách nhảy khác nhau: *"tôi nghĩ cái hố đó cần giữ phím chạy VÀ giữ phím nhảy cùng lúc suốt quãng bay thì mới đủ xa, mà tay tôi không giữ được hai phím một lúc nên chịu. **Nếu đúng vậy thì đây chính là nỗi sợ ban đầu của tôi**: game bắt buộc phải giữ nút đồng thời, không có cách nào đổi."* Ảnh `p05-RR-04-03-van-ket-o-cai-ho.png`: xu dừng ở 2/9, đồng hồ 4:33, con vịt vẫn ở bờ bên này.
- Phép đo phản chứng của **người điều phối** (ảnh `zz-sach-1…3`, **ảnh của người điều phối, không thuộc phiên nào** — dùng cho phép đo, không dùng cho lời kể của persona): một phím một lúc → rơi hố ở cả hai biến thể; hai phím cùng lúc → qua hố, đứng trên nền bên kia.
- Và hố này **vượt được**: Khánh (p06-blind) qua nó bằng chạy-rồi-nhảy — ảnh `p06-blind-04-nhay-qua-ho.png`, con vịt đứng bờ bên kia, 0:36, chưa mất tim. Nên đây **không** phải phát hiện về độ khó.

**Bao nhiêu người vấp:** **1/7 persona** — nhưng là persona tiếp cận duy nhất về vận động, và kết luận của cô khớp với một phép đo bằng máy có ảnh sạch.

**Mức:** chặn `done_when` của RR-01 với nhóm người dùng này → **High**. Không nâng bậc (một persona).

**Hướng xử lý:** đây **không phải bug**. Đây là cái giá của **ADR-0004** (không có nút thứ ba: tăng tốc bằng thời gian giữ, nhảy xa bằng đà), và ADR đó đã chấp nhận cái giá — chỉ là chưa bao giờ **đo**. Giờ đã đo, ở đúng chỗ nó đắt nhất: người không giữ được hai phím cùng lúc dừng lại ở hố đầu tiên của màn đầu tiên. `gameaccessibilityguidelines.com` xếp "hold vs tap" vào nhóm **cơ bản**. Sửa hay không sửa là quyết định sản phẩm, không phải lỗi phải vá — nhưng giờ nó là quyết định **có số**.

---

### F-05 · Medium · Interaction Design · Visual hierarchy

**Ở đâu:** mọi màn chơi, mỗi khi input không ăn.

**Chuyện gì xảy ra:** Khi thao tác không có tác dụng, **đồng hồ là thứ duy nhất động trên màn hình** — và người chơi đọc nó thành "game đang phản hồi mình". Nó đẩy họ đi sâu thêm vào giả thuyết sai thay vì đổi hướng.

**Dẫn chứng:**
- **Trang (p01-RR-03)** — *"Thử chạm nhanh đúng vào nhân vật — đồng hồ nhảy từ 0:00 lên 0:01, nhưng nhân vật vẫn đứng yên. Nghĩ '**à có phản hồi rồi, chắc sắp ra**'."* Ảnh `p01-RR-03-05-bi-ket-khong-dieu-khien-duoc.png`.
- **Tuyết (p07-blind)** — *"không có gì xảy ra, con vật vẫn đứng y chỗ cũ, **chỉ có đồng hồ ở trên chạy lên '0:33'**"*. Ảnh `p07-blind-04-bi-ket-khong-di-duoc.png` (1:01).
- **Duy (p04-RR-05)** — *"Tất cả đều không có bất kỳ thay đổi hình ảnh nào — nhân vật đứng y nguyên một chỗ, **chỉ có đồng hồ trong game chạy tăng dần** (từ 0:08 lên tới 4:19)"*. Ảnh `p04-RR-05-04-ket-khong-nhay-duoc.png` (4:44).

**Bao nhiêu người vấp:** **3/7 persona** nói ra cùng một câu, độc lập với nhau, trên hai loại thiết bị.

**Mức:** gây khó chịu và dẫn sai hướng, không tự nó cản trở → Low; ≥2 persona → **nâng lên Medium**.

**Hướng xử lý:** đồng hồ hiện đang kiêm hai việc: đo thành tích, và là dấu hiệu duy nhất cho thấy game còn sống. Cần tách hai việc đó ra — người đang bí phải phân biệt được "game nghe tôi mà tôi bấm sai" với "game không nghe tôi". (Giới hạn của dẫn chứng: phần "nhảy không ăn" trong phiên p04 đã bị LOẠI; chỉ dùng chi tiết "đồng hồ là thứ duy nhất động", chi tiết này nhìn thấy được trên ảnh.)

---

### F-06 · Medium · Trigger words · LATCH

**Ở đâu:** RR-02 — bản đồ chọn màn, với save đã gieo.

**Chuyện gì xảy ra:** Suy luận "**mở khoá = tôi đã chơi rồi**" mạnh hơn ký hiệu trên bản đồ. Bản đồ có phân biệt (dấu tick vs con số) nhưng người chơi vẫn chọn sai màn, phải bấm vào mới biết.

**Dẫn chứng:** **Minh (p02-RR-02)**, ngay sau khi vào bản đồ — *"Tôi tưởng 'màn tôi chơi tới hôm qua' là level 3 (**vì nó mở khoá**) — click vào thì thấy panel ghi 'LEVEL 3, BEST --' tức là **chưa từng chơi qua, sai đối tượng**."* Ảnh `p02-RR-02-05-man-chon-level.png` và `p02-RR-02-06-level2-best-058.png`: màn 1–2 là vòng kem có dấu tick, node 3 là vòng tối có số `3` viền trắng.

**Bao nhiêu người vấp:** 1/8 phiên. Nhưng đọc cùng F-03 và F-08: **3 persona đọc sai 3 thứ khác nhau trên đúng cùng một thẻ đáy bản đồ** (Minh: "mở = đã chơi" · Khánh: "BEST = so với người khác" · Hoà: thẻ của màn khoá trông như màn chơi được). Cái thẻ đó là chỗ tập trung lỗi đọc của lần chạy này.

**Mức:** chỉ tốn thêm bước (1 bước thừa trên một route dài 3 bước) → **Medium**.

**Hướng xử lý:** trạng thái node có ba giá trị — đã xong, mở mà chưa chơi, còn khoá — và người chơi hiện chỉ đọc được hai. Trục phân loại (Category) của bản đồ cần khác trục "đi tới đâu rồi" (Location) mà người chơi mang trong đầu.

---

### F-07 · Medium · Trust & desirability · Visual craft

**Ở đâu:** RR-03 — màn chặn xoay máy, tức **ấn tượng đầu của nhóm người dùng chính**.

**Chuyện gì xảy ra:** Màn chặn xoay bị đọc là **trang bị lỗi**, không phải là lời nhắc xoay máy. Người chơi chờ gần 3 giây và chạm thử một lần mới suy ra được.

**Dẫn chứng:** **Trang (p01-RR-03)**, ấn tượng 5 giây, ghi trước khi chạm gì — *"Tôi không biết. **Nhìn như một sơ đồ gì đó bị lỗi, chưa hiện đủ hình.**"* · *"Không có cảm giác là dành cho tôi, tôi chả hiểu hai cái khung này để làm gì."* · ba từ: **bối rối, nghi ngờ, trống trải** — bộ ba âm nhất trong cả 8 phiên. Rồi: *"Chờ thêm gần 3 giây — không đổi gì. Chạm vào giữa cũng không đổi gì."*
Ảnh `p01-RR-03-01-vua-mo-trang.png`: trên nền `--night-deep` chỉ có **một khung chữ nhật dọc viền xám, một mũi tên vàng, một khung chữ nhật ngang viền vàng**. Không một chữ nào, không con vịt, không hình điện thoại, không tên game. Mật độ thấp hơn hẳn mọi màn khác của game, và đây là màn **duy nhất** không mang dấu hiệu nào của thương hiệu Duck Stomp.

**Bao nhiêu người vấp:** 1/8 phiên gặp nó — nhưng **đó là phiên duy nhất trong 8 phiên đoán sai câu "đây là trang gì"**, và là persona **primary**. Ấn tượng đầu chỉ xảy ra một lần.

**Mức:** tốn thêm bước và làm hỏng ấn tượng đầu, không chặn đường (cuối cùng vẫn suy ra được) → **Medium**.

**Hướng xử lý:** phải nằm trong ngôn ngữ hình, không phải thêm câu chữ — ADR-0005 chốt UI chỉ ASCII và `overview.md` §4 nói không có màn hướng dẫn bằng chữ. Câu hỏi để người làm sản phẩm quyết: màn này cần trông như **một phần của game** (thay vì một wireframe), hay cần một thứ gì đó chuyển động để nói "đây là trạng thái chờ, không phải trang lỗi".

> ⚠️ **Sửa lại sau khi đọc code — mức của F-07 là KHÔNG CHẮC.** ADR-0004 chốt màn chặn
> xoay là *"icon điện thoại đang xoay, **có hoạt ảnh**, không chữ"*, và hoạt ảnh đó
> **có thật** trong `index.html`: `.rotate-phone--goal` chạy `animation: nudge 1.6s
> steps(2, end) infinite` dưới `@media (prefers-reduced-motion: no-preference)`.
> Một persona nhìn sản phẩm **chỉ qua ảnh chụp tĩnh** thì **không thể thấy** hoạt ảnh
> ấy — nên phần "nhìn như trang bị lỗi" có thể là hệ quả của bộ dò, không phải của
> sản phẩm. Phần **không** phụ thuộc hoạt ảnh thì vẫn đứng: hai khối chữ nhật viền
> trơn không nói được "đây là cái điện thoại", và màn này không mang dấu hiệu nào của
> thương hiệu game. Cần một lần chạy có tay người (hoặc có quay video) để chốt mức.
> Đây là một giới hạn **chung** của phương pháp mà `lib/frameworks.md` chưa nói tới:
> **không lăng kính nào trong tám lăng kính đánh giá được thứ chỉ tồn tại khi
> chuyển động.**

---

### F-08 · Low · Trigger words · Trust & desirability

**Ở đâu:** bản đồ chọn màn, nhãn `BEST`.

**Chuyện gì xảy ra:** `BEST` một mình không nói được nó là kỷ lục **của chính người chơi, trên chính máy này**. Với người quen game có bảng xếp hạng, nó gợi ý so sánh với người khác.

**Dẫn chứng:** **Khánh (p06-blind)** — lúc mới vào bản đồ: *"à có 'BEST' chắc là game lưu điểm tốt nhất của mình đây, để xem"*; rồi ở phần trả lời câu hỏi trọng tâm: *"Chữ 'BEST --' ở màn chọn level ban đầu **làm tôi tưởng có so sánh**, nhưng hoá ra nó chỉ là kỷ lục cá nhân của chính mình cho level đó"*. Ảnh `p06-blind-09-ve-map-mat-tien-do.png` (`BEST --`).

**Bao nhiêu người vấp:** 1/7 persona, và là **negative persona** — người chơi mục tiêu sẽ không mang kỳ vọng đó.

**Mức:** **Low**. Không chặn ai. Nhưng nó đúng là câu hỏi mà negative persona có mặt để trả lời: **một nhãn đang nói quá thứ sản phẩm làm được.**

**Hướng xử lý:** một chữ nữa cạnh `BEST` là đủ để khoá nghĩa "của bạn, trên máy này" — nhưng ràng buộc ASCII và chiều ngang của thẻ là của người làm sản phẩm.

---

### F-09 · Low · Visual craft (đối chiếu `MASTER.md` §Chữ)

**Ở đâu:** mọi chữ ở cỡ `label` 12px và HUD — tức đúng hai con số duy nhất mang nghĩa trong game: `BEST` và số xu.

**Chuyện gì xảy ra:** **Chữ số `5` đọc ra thành chữ `S`.**

**Dẫn chứng:**
- **Tuyết (p07-blind)**, ấn tượng đầu về màn chơi — *"chữ đồng hồ ở giữa trên **đọc được là '0:0S'**"* (lúc đó đồng hồ đang là 0:05). Ảnh `p07-blind-03-vao-level1.png`.
- Đối chiếu ảnh của hai phiên khác, và **glyph thật sự nhập nhằng, không chỉ là mắt của Tuyết**: `p02-RR-02-06-level2-best-058.png` hiện `BEST 0:S8` và số xu là `S` (save gieo cho màn 2 là 58 800 ms và 5 xu) · `p06-blind-08-menu-pause.png`, đồng hồ mờ sau lớp phủ, đọc ra `2:S2`.

**Bao nhiêu người vấp:** **1/7 persona** đọc sai thành lời. **Không** nâng bậc — chỉ một người vấp — nhưng ghi rõ rằng glyph đó nhìn thấy được ở ảnh của **3 phiên khác nhau**, nên đây là tính chất của sản phẩm chứ không phải của một đôi mắt.

**Mức:** **Low** — gây khó chịu, không chặn. Đáng ghi vì nó đi ngược đúng lý do `MASTER.md` chọn `Pixelify Sans`: *"Chọn vì nó đọc được ở cỡ nhỏ"*, và vì `label` 12px đã là **sàn tuyệt đối** của hệ, không hạ được nữa.

**Hướng xử lý:** hai con số duy nhất mang nghĩa (kỷ lục, số xu) đang ở cỡ nhỏ nhất của hệ. Cân lại: đổi cỡ, hay đổi glyph.

---

### F-10 · Low · Trigger words

**Ở đâu:** màn Title, nút `CONTINUE` (chỉ hiện khi có save).

**Chuyện gì xảy ra:** `CONTINUE` được hiểu là "vào thẳng chỗ tôi dừng lần trước", thực tế nó mở bản đồ.

**Dẫn chứng:** **Duy (p04-RR-05)**, hành động đầu tiên — *"Tôi thấy màn hình chính → **tưởng CONTINUE sẽ đưa thẳng vào chỗ tôi dừng lần trước** → bấm CONTINUE → hiện ra màn chọn level"*. Ảnh `p04-RR-05-01-vua-mo-trang.png` (có cả `PLAY` và `CONTINUE`).

**Bao nhiêu người vấp:** 1/8 phiên. Không ai bị chặn, không ai tốn bước thừa (bản đồ vẫn là chỗ đúng để đi tiếp).

**Mức:** **Low** — một lệch nhỏ giữa nhãn và hành vi.

---

## Quan sát chưa xác nhận — chưa đủ dẫn chứng để thành phát hiện có mức

Ghi ra vì chúng chỉ đúng chỗ, không vì chúng đủ bằng chứng. Lần chạy sau nên nhắm vào đây.

1. **Màn PAUSED không có chỗ nào nói cách điều khiển — và đó là chỗ người bí sẽ tìm.** Trang (p01-RR-03): *"Bấm vào icon tạm dừng góc phải trên, **hi vọng trong đó có hướng dẫn cách chơi** — chỉ ra màn 'PAUSED' với 3 nút RESUME/RETRY/MAP, không có chỗ nào ghi cách điều khiển."* Ảnh `p01-RR-03-04-man-tam-dung.png` và `p06-blind-08-menu-pause.png` (Khánh vào đó tìm Settings): cả hai ảnh chỉ có `PAUSED` · `RESUME` · `RETRY` · `MAP` · icon loa. **1 persona** đi tìm hướng dẫn ở đó.
2. **Ký hiệu tam giác nói được "nhảy" mà không nói được "phím nào".** Lan (p05): *"Tôi đoán icon tam giác nhọn ở màn đầu ý là mũi tên lên chứ không phải Space, thử lại với ArrowUp"* · Hoà (p08): *"Đứng trước hố, **không có chữ nào chỉ tôi cách nhảy**. Tôi nhớ hình tam giác ở màn đầu giống mũi tên lên"*. Hai persona đều phải suy phím từ hình — **nhưng cả hai đều suy ra đúng**, và kết cục của cả hai lần đều bị nhiễu bởi lỗi bộ dò. Nên ký hiệu **hoạt động**; cái không hoạt động là phản hồi, và cái đó đã nằm ở F-05.
3. **Đạp đầu địch không ăn ở lần thử đầu, với cả hai người có vốn platformer dày.** Minh (p02): *"chết vì chủ quan, ai bảo không nhảy sớm hơn"* (mất 2 tim ở con walker đầu tiên) · Duy (p04): *"chắc mình đâm ngang vào nó chứ không đè lên đầu được"* (cũng mất 2 tim). **2 persona cùng vấp**, đủ điều kiện nâng bậc — nhưng cả hai lần đều là agent tự canh thời gian nhảy qua từng lời gọi tool, nên dẫn chứng yếu. **Cần một lần chạy có tay người để chốt.** Ứng cử viên số một cho lần chạy sau.
4. **Chết mà không có dấu hiệu nào là đã chết.** Lan (p05): *"không thấy nhảy, mà bỗng dưng con vịt lại đứng đúng y vị trí ban đầu của màn chơi, đồng hồ thì nhảy vọt (từ 0:07 lên 0:37), ba trái tim vẫn còn nguyên"* — ảnh `p05-RR-04-02-roi-ho-quay-lai-dau.png`. Minh (p02): *"tim tự đầy lại 3/3 (**không tính là 'chết' hẳn**, chỉ mất thời gian)"*. Khánh (p06): *"mỗi lần rơi xuống lại bị đưa về gần mép hố... **không mất mạng**"*. Ba persona nói về cùng một chỗ, nhưng chỉ Lan thấy nó gây nhầm; hai người kia thấy ổn, và `done_when` của RR-04 thì **đạt**.
5. **Bấm trượt nút UI rồi tự dò lại.** Hoà (p08) trượt `START`; Khánh (p06) trượt `Pause` và `MAP`. 3 lần / 2 persona, tất cả tự sửa được — và tất cả đều là agent tự tính toạ độ từ ảnh, trong khi `START` ở khổ đó rộng khoảng 300×96 px màn hình. **Dẫn chứng yếu.**

---

## Không phát hiện được gì ở

- **RR-05 · Tìm ra phòng xu giấu — ⚪ KHÔNG ĐO ĐƯỢC.** Duy không bao giờ tới được bức tường nứt (ảnh `p04-RR-05-04-ket-khong-nhay-duoc.png`, 0/9 xu, đồng hồ 4:44, con vịt đứng ngay dưới khối `?`). Câu hỏi thật của RR-05 — *"người chơi có tự hiểu đường chạy dài là một lời mời không"* — **vẫn chưa có câu trả lời**. Đây là chỗ duy nhất game dạy bằng bố cục thay vì bằng chữ, nên nó vẫn là lỗ trống lớn nhất của bản đánh giá này. Đừng suy ra gì.
- **RR-04 · Chết rồi chơi lại ngay — đạt, không có phát hiện nào.** Lan chết 5 lần và mô tả đúng cái ADR-0003 hứa. Khớp với quan sát độc lập của Minh (p02) và Khánh (p06).
- **Đọc save đã gieo.** Minh (p02) tự đọc ra *"panel hiện 'LEVEL 2, BEST 0:58' và 5 xu"*; Duy (p04) tự đọc ra *"level 1, 2 đã có dấu tick, level 3 đang mở khoá, tổng 17 xu"*. Không ai lẫn về dữ liệu của chính mình (chỉ lẫn về **trạng thái node**, xem F-06).
- **Dạy bằng bố cục, ở chỗ nó có tác dụng.** Lan (p05), không ai nói gì: *"lần này số xu tăng từ 0/9 lên 1/9, và khối dấu hỏi giữa không trung biến thành ô trống!"* Và Hoà (p08), người chưa từng chơi platformer, tự suy ra cơ chế giữ-để-chạy trong **một** bước: *"Tôi nghĩ 'chắc phải giữ lâu hơn mới đi được'... **Mừng vì đoán đúng.**"* Đây là dẫn chứng **ủng hộ** ADR-0004, phải ghi cùng chiều với F-04.
- **Tải trang và hiệu năng.** Không persona nào phàn nàn, kể cả người duy nhất bị ép Fast 3G: Trang (p01) — *"khá nhanh thật ra, không thấy chờ lâu như lo sợ ban đầu"*. Khớp số đo: 4804 ms tới Title trên Fast 3G, ngân sách NFR-PERF-07 là ≤5000 ms.
- **Console và mạng.** **0 error, 0 warning ở cả 8 phiên.** Toàn bộ request là file tĩnh. Không có dấu hiệu lỗi kỹ thuật nào lộ ra phía người chơi.
- **Bật/tắt tiếng (FR-13).** **Không persona nào bấm icon loa** trong cả 8 phiên, dù nó nằm ở góc trên phải của mọi màn. Cố ý không phải Red Route, nên không có gì để chấm — chỉ ghi rằng nó chưa từng bị thử.
- **Lưới pixel và hệ token.** Mở cả 8 ảnh Title cộng các ảnh màn chơi ở 3 khổ: pixel sắc nét ở mọi khổ, không thấy dấu hiệu phóng bằng số không nguyên; góc vuông khắp nơi; viền 2px; bóng là khối đặc lệch 4px; cặp bị cấm `ink` trên `gold` **không** xuất hiện ở đâu — và Tuyết xác nhận từ phía người đọc: *"nút vàng 'PLAY' cũng đọc được rõ ràng vì chữ đậm trên nền vàng sáng"*. Hệ token của `MASTER.md` được giữ đúng; hai chỗ trả giá đều đã nêu ở F-02 và F-09.
- **Form design — ⚪ không áp dụng.**

---

## Ghi chú về chính lần chạy này

Bảy điều làm giảm giá trị của những con số ở trên. Đọc chúng trước khi mang bảng điểm đi họp.

1. **Tám phiên chạy TUẦN TỰ, không song song.** `lib/orchestration.md` cho phép 4 phiên đồng thời, dựa trên giả định mỗi phiên có một browser context riêng. Ở máy này không đúng: playwright MCP expose **một** browser với **một** page dùng chung. Phạm vi không bị cắt, chỉ dài hơn về thời gian — nhưng nó kéo theo giảm giá trị số 5.
2. **"Cảm ứng" ở đây là chuột nhấn-giữ, không phải cảm ứng thật.** Context của playwright MCP có `hasTouch: false`, và `touchscreen` của Playwright chỉ `tap` chứ không giữ được. Hai phiên điện thoại lái bằng **con trỏ** ở viewport 667×375: **không có một `touchstart` thật nào xảy ra**. Mọi kết luận về cảm ứng, kể cả F-01, là kết luận về **con trỏ**. F-01 vẫn đứng vì người điều phối đã đo lại riêng với `hasTouch: true` và tap cảm ứng thật, cho cùng kết quả.
3. **RR-05 không đo được.** Giới hạn cấu trúc của phương pháp: một agent LLM điều khiển game hành động qua từng lời gọi tool rời rạc, không có vòng phản hồi từng khung hình như tay người. **Không sửa được bằng brief tốt hơn.** Cùng lý do đó, mọi kết luận về **độ khó** trong lần chạy này đã bị loại.
4. **Cả bảy là proto-persona — chưa phỏng vấn một người chơi thật nào.** Đọc báo cáo này như *"bảy người lạ đã thử"*, **không** phải *"người dùng của chúng ta nghĩ vậy"*.
5. **Năm kết luận của persona đã bị LOẠI vì là lỗi bộ dò**, mỗi cái có phép đo phản chứng trong `log-tho/`: "không thấy gì đổi" (p03) · "không nhảy được" (p08) · "không qua được hố" (p02, p06) · "nhảy không ăn ở màn 3" (p04) · "phím không ăn tới khi đưa cửa sổ lên trước" (p05). Không có phát hiện nào dựng trên năm cái đó. Thêm một chi tiết thấy khi mở ảnh, củng cố việc loại: ảnh cuối của p02 tên là `p02-RR-02-08-ket-tai-ho.png` nhưng **trong khung không có cái hố nào**.
6. **Hai sai lệch so với thiết kế lần chạy:** RR-01 phải **chạy lại** dưới mã phiên mới `p08-RR-01` vì brief của p03 thiếu mục "so ảnh với ảnh trước", nên **không được** dùng cặp p03/p08 để nói bất cứ điều gì về việc nút `PLAY` có dễ nhận ra hay không · và **Duy (p04-RR-05) được cho dùng laptop bàn phím** thay vì điện thoại như hồ sơ persona, để RR-05 có cơ hội sinh dữ liệu thay vì lặp lại F-01 lần thứ ba.
7. **20 ảnh mang tiền tố `zz-` là ảnh của người điều phối**, không thuộc phiên nào — dùng **chỉ** cho các phép đo đã ghi (F-04), không dùng làm dẫn chứng cho lời kể của persona. 46 ảnh mang tiền tố phiên hợp lệ đã qua cổng kiểm, khớp số tự khai của cả 8 log.
