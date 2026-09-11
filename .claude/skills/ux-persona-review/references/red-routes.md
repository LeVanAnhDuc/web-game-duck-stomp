# Red Routes — Duck Stomp

> **Trả lời:** hành trình nào của người chơi mà hỏng là sản phẩm hỏng?
> **Trạng thái:** 🟢 đã duyệt
> **Chốt ngày:** 2026-09-12 (người dùng duyệt nguyên bản, không sửa route nào)
> **Cập nhật khi:** thêm/bỏ một hành trình · một FR liên quan đổi trạng thái ·
> một `par_*` được đo lần đầu

Mỗi Red Route là một **hành trình**, không phải một màn hình. Đây là bản hợp đồng
phạm vi: mọi lần chạy persona về sau đều chấm điểm theo đúng danh sách này, nên sai
ở đây thì lệch mãi.

## Ba thứ khác với một web app, đọc trước khi đọc bảng

**`min_steps` ở đây chỉ đếm bước ngoài lúc chơi** — tức số lần bấm menu trên đường
tối ưu (PLAY, chọn màn, START, xoay máy). Trong màn chơi, đếm số lần bấm phím giữa
hai người là vô nghĩa: giữ phím hai giây là *một* lần bấm, và người chơi giỏi bấm
**nhiều** hơn người chơi dở chứ không ít hơn.

**Nên mỗi route khai thêm `par_deaths` và `par_time_s`** — số lần chết và thời gian
của một lượt đi sạch. Cả hai đang **⚪ chưa đo**: chưa ai đi một lượt tối ưu có ghi
số. Lần chạy persona đầu tiên sẽ sinh ra chúng; tới lúc đó, `ux-expert` báo cáo
trung vị thô **không kèm mẫu số** thay vì bịa một tỉ lệ.

**`done_when` phải nhìn thấy được trên màn hình.** Không tham chiếu
`window.duckstomp`, không tham chiếu code. Người điều phối được phép dùng handle đó
để xác nhận, persona thì không (`canvas-driving.md`).

---

## RR-01 · Từ cái link tới xong màn 1

| Trường | Giá trị |
| --- | --- |
| `id` | RR-01 |
| `actor` | người lạ hoàn toàn, laptop, không ai nói gì trước |
| `entry` | `http://127.0.0.1:4173/` · context sạch · 1440×900 |
| `done_when` | thấy thẻ tổng kết có thời gian + số xu, rồi về bản đồ thấy node 2 **không còn ổ khoá** |
| `min_steps` | **2** — PLAY, START |
| `par_deaths` | ⚪ chưa đo |
| `par_time_s` | ⚪ chưa đo |
| `why_red` | Đây là con đường **mọi** người chơi đều đi, và `overview.md` §6.1 định nghĩa thành công bằng đúng nó: xong màn 1 mà không cần một dòng hướng dẫn. Hỏng ở đây thì không có gì khác đáng đo. |
| `status` | **live** |
| `derived_from` | `docs/01-product/journeys.md:18` (US-01) · `docs/02-requirements/scope.md:23` (FR-01) · `:24` (FR-02) · `:27` (FR-05) · `:34` (FR-12) |

## RR-02 · Quay lại phá kỷ lục của chính mình

| Trường | Giá trị |
| --- | --- |
| `id` | RR-02 |
| `actor` | người đã chơi 2 màn "hôm qua", cùng máy cùng trình duyệt |
| `entry` | `:4173` · save đã gieo (`canvas-driving.md` §Gieo save: màn 1–2 `cleared`, best 41.2s và 58.8s) · 1440×900 |
| `done_when` | về đích màn 2 và thẻ tổng kết hiện dấu **NEW BEST** |
| `min_steps` | **3** — nút chơi tiếp, chọn node 2, START |
| `par_deaths` | ⚪ chưa đo |
| `par_time_s` | ⚪ chưa đo (mốc cần phá: 58.8s do người điều phối gieo) |
| `why_red` | `overview.md` §6.2 lấy "có người chơi lại một màn đã xong" làm bằng chứng cảm giác điều khiển đủ chặt. Không ai muốn chơi lại thì cả quyết định chỉ-hai-nút mất chỗ dựa. |
| `status` | **live** |
| `derived_from` | `docs/01-product/journeys.md:50` (US-02) · `docs/02-requirements/scope.md:34` (FR-12) · `:36` (FR-14) |

## RR-03 · Chơi trên điện thoại, cầm dọc lúc mở

| Trường | Giá trị |
| --- | --- |
| `id` | RR-03 |
| `actor` | người chơi điện thoại, **không bao giờ** chạm bàn phím |
| `entry` | `:4173` · mở ở **375×667 (dọc)** rồi đổi sang 667×375 · context sạch |
| `done_when` | qua được màn chặn xoay, rồi chạm cờ đích màn 1 mà **không dùng một phím nào** |
| `min_steps` | **3** — xoay máy, PLAY, START |
| `par_deaths` | ⚪ chưa đo |
| `par_time_s` | ⚪ chưa đo |
| `why_red` | `overview.md` §3: người chơi **điện thoại ngang là nhóm chính**, không phải nhóm phụ. `NFR-A11Y-06` đòi chơi được hết **chỉ** bằng cảm ứng. |
| `status` | **live** — và đang **hỏng đã biết**: xem `canvas-driving.md` §Điểm đã hỏng. Vẫn để live: persona bị kẹt ở đây là số đo, không phải sự cố. |
| `derived_from` | `docs/01-product/journeys.md:78` (US-03) · `docs/02-requirements/scope.md:37` (FR-15) · `:38` (FR-16) · `docs/02-requirements/nfr.md:63` (NFR-A11Y-06) |

## RR-04 · Chết rồi chơi lại ngay

| Trường | Giá trị |
| --- | --- |
| `id` | RR-04 |
| `actor` | người chơi đang giữa màn 1, chưa biết vực là chết ngay |
| `entry` | `:4173` · context sạch · trong màn 1 (vực đầu tiên cách chỗ xuất hiện vài giây chạy) |
| `done_when` | sau khi chết, người chơi lại điều khiển được nhân vật **mà không bấm qua màn hình nào**, và đồng hồ **không** về 0 |
| `min_steps` | **0** — đúng cái không có bước nào mới là yêu cầu |
| `par_deaths` | không áp dụng — route này *cần* một lần chết |
| `par_time_s` | ⚪ chưa đo (đo độ trễ từ lúc chết tới lúc điều khiển được lại) |
| `why_red` | ADR-0003 bỏ hệ mạng và bỏ màn game over. Nếu hồi sinh không mượt thì chính quyết định đó sai, và cái giá phải trả nằm ở mọi màn. |
| `status` | **live** |
| `derived_from` | `docs/01-product/journeys.md:106` (US-04) · `docs/02-requirements/scope.md:28` (FR-06) · `:33` (FR-11) · `docs/decisions/0003-no-lives-checkpoint-respawn.md` |
| ⚠️ lệch dữ liệu | US-04 mô tả "đã qua checkpoint ở màn 4", nhưng `assets/levels/level-4.json` **không có object `checkpoint` nào** — cả game chỉ màn 6 có một cái. Nên ở màn 1–5 hồi sinh là về đầu màn. Route này viết theo dữ liệu, không theo US-04. Cần quyết: sửa US-04 hay thêm checkpoint. |

## RR-05 · Tìm ra phòng xu giấu

| Trường | Giá trị |
| --- | --- |
| `id` | RR-05 |
| `actor` | người chơi đã qua 2 màn, tò mò, thích lục lọi |
| `entry` | `:4173` · save đã gieo tới màn 3 mở · vào màn 3 (2 `crackedBlock`, 4 `coinHidden`) |
| `done_when` | vào được khoang phía sau bức tường nứt và ăn xu trong đó — thấy rõ trên ảnh |
| `min_steps` | **3** — chơi tiếp, chọn node 3, START |
| `par_deaths` | ⚪ chưa đo |
| `par_time_s` | ⚪ chưa đo |
| `why_red` | Đây là chỗ duy nhất game **dạy bằng bố cục** thay vì bằng chữ (`overview.md` §4: không có màn hướng dẫn bằng chữ). Không ai tự hiểu "đường chạy dài là lời mời" thì cả cách dạy đó không hoạt động — mà nó là cách dạy duy nhất game có. |
| `status` | **live** — nhưng chấp nhận trước: không tìm ra **là** một kết quả hợp lệ (US-05 nói rõ), không phải một thất bại phải chữa |
| `derived_from` | `docs/01-product/journeys.md:130` (US-05) · `docs/02-requirements/scope.md:27` (FR-05) · `:29` (FR-07) · `assets/levels/level-3.json` |

---

## Cố ý KHÔNG phải Red Route

Ghi ra để lần sau không ai thêm lại:

- **Bật/tắt tiếng, tạm dừng** (FR-13, FR-17) — có dùng, nhưng hỏng thì không ai mất
  đường về đích. Persona nào tình cờ bấm thì vẫn ghi lại.
- **Màn 5, màn 6, bệ di động, địch bay** — cùng bộ luật với màn 1–4, chỉ khó hơn.
  Thêm vào chỉ làm dài lần chạy mà không hỏi thêm câu nào mới.
- **Phá khối `?` từ dưới** (FR-10) — nằm trên đường của RR-01, không cần route riêng.
- **Chơi hết 6 màn trong một phiên** — vượt xa 5–20 phút mà `overview.md` §3 nói,
  và vượt trần 40 hành động của persona.

## Tổng số phiên cho một lần chạy

5 route `live` + 2 phiên mù (`lib/orchestration.md`) = **7 phiên**.
