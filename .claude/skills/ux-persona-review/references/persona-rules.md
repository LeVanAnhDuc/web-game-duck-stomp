# Rule tạo persona — bản đã chưng cho Duck Stomp

> **Fetch ngày:** 2026-09-12 · nguồn ghi ở cuối file
> **Trạng thái:** 🟢 đủ. Bản seed offline đã bị thay.
> **Cập nhật khi:** người dùng yêu cầu `--refresh-rules`. **Không tự fetch lại.**

Một chỗ fetch không được: `userfocus.co.uk/articles/redroutes.html` trả 403, và
`accessibility.blog.service.gov.uk` không phân giải được DNS. Phần Red Routes và
phần a11y dưới đây chưng từ nguồn thứ cấp (ghi rõ ở cuối) chứ không từ bản gốc.

## 1. Bốn loại persona (Cooper)

| Loại | Nghĩa | Ở game này |
| --- | --- | --- |
| primary | thiết kế **cho** họ. Không phục vụ được là hỏng | người chơi điện thoại cầm ngang (`overview.md` §3) |
| secondary | dùng được, cần thêm vài thứ | người chơi laptop/desktop bàn phím |
| served | bị ảnh hưởng mà không trực tiếp dùng | người gửi link cho bạn bè — họ hứng cái "game gì đấy?" |
| negative | sản phẩm **không** nhắm tới. Có mặt để phát hiện đang phục vụ nhầm ai | người tìm game có tiến độ trên nhiều máy, bảng xếp hạng online, nội dung dài hạn — đúng những thứ §4 Non-Goals từ chối |

Đúng **một** negative persona. Hai cái thì báo cáo biến thành danh sách đòi tính
năng ngoài phạm vi.

## 2. Persona bám hành vi, không bám nhân khẩu học

Lỗi kinh điển NN/g gọi là *persona bịa*: nghe như người thật mà không suy ra được
hành vi nào. "Nữ, 28 tuổi, thích du lịch" không dự đoán gì. "Bấm nút Back của trình
duyệt thay vì nút quay lại trong trang" thì có.

Ở một game, phiên bản của lỗi đó là **vốn từ về game**: "thích game casual" vô dụng;
"chưa bao giờ chơi platformer nên không biết đứng trên đầu địch là cách giết nó" thì
dự đoán được cả một phiên. Mỗi persona phải khai **vốn quy ước platformer** — đó là
biến quyết định nhiều nhất ở sản phẩm này, hơn cả trình độ số.

NN/g cũng cảnh báo *proto-persona* (viết từ giả định, không từ nghiên cứu) là buồng
vang của chính nhóm làm sản phẩm. Dàn persona ở đây **là** proto-persona: không có
người dùng thật nào được phỏng vấn. Nên ghi đúng như vậy trong báo cáo, và đọc kết
quả như "bảy người lạ đã thử", không phải "người dùng của chúng ta nghĩ vậy".

## 3. Trường bắt buộc của một persona

| Trường | Vì sao bắt buộc |
| --- | --- |
| bối cảnh, nghề | để lời kể nghe như người thật |
| trình độ số | mức chịu đựng với giao diện lạ |
| **vốn quy ước platformer** | có biết đạp đầu địch / khối `?` / cờ đích là gì không |
| thiết bị + mạng | đổi thẳng thành viewport và profile throttle |
| nhu cầu tiếp cận | dàn **phải** có ít nhất một người |
| **khả năng giữ nút** | xem §5 — game này bắt buộc giữ nút, không có toggle |
| động cơ, nỗi sợ | định hướng cái persona chú ý |
| `patience_threshold` | 2–6 bước bế tắc liên tiếp thì bỏ cuộc |
| ngôn ngữ | tiếng Việt hoặc tiếng Anh (UI game chỉ có ASCII, ADR-0005) |

## 4. Ba thứ khác nhau mà người ta hay gộp: onboarding · FTUE · tutorial

Nghiên cứu game UX tách rõ:

- **Onboarding** — cả quá trình đưa người chơi vào, gồm cả việc làm họ thấy thoải
  mái và có động cơ.
- **FTUE** — *cảm xúc* của mấy phút đầu. Đây chính là thứ "5 giây đứng yên" trong
  `lib/orchestration.md` đo, và nó chỉ đo được **một lần cho mỗi persona**.
- **Tutorial** — phần dạy luật.

Duck Stomp **không có tutorial** (`overview.md` §4: không có màn hướng dẫn bằng chữ;
màn 1 dạy luật bằng bố cục). Đúng theo cách làm mà tài liệu game design khuyến nghị
cho platformer: đừng dạy hết điều khiển từ đầu, mở một đường buộc người chơi đi sang
phải, rồi khi họ đã quen thì đặt một khoảng trống buộc phải nhảy.

**Hệ quả cho persona:** vì không có chữ nào dạy, phần lớn giá trị của mỗi phiên nằm
ở chỗ persona **tự đoán sai cái gì**. Persona phải được dặn ghi nguyên văn cái mình
tưởng — kể cả sau đó biết mình sai. Sửa lại cho đúng là xoá mất dữ liệu.

## 5. Tiếp cận: "hold vs tap" là điểm gãy đã biết

`gameaccessibilityguidelines.com` xếp **thay giữ-nút bằng gạt-công-tắc (hold vs tap)**
vào nhóm khuyến nghị cơ bản cho người hạn chế vận động, cùng với remap được nút.

Duck Stomp đi ngược đúng chỗ đó, **có chủ ý**: giữ hướng lâu thì nhanh dần (thay cho
nút chạy), giữ nút nhảy lâu thì nhảy cao hơn — cả hai đến từ ADR-0004
(không có nút thứ ba). Không có toggle, không remap được.

Nên dàn persona **phải có một người không giữ nút lâu được** (đau khớp, chỉ dùng
được một tay, hoặc dùng bàn phím ảo). Người đó sẽ không qua được khoảng trống đầu
tiên. Đó là một phát hiện có giá trị, không phải một persona "đặt sai" — nó đo cái
giá thật của ADR-0004, thứ mà chính ADR đó chấp nhận mà chưa bao giờ đo.

Kèm theo: **NFR-A11Y-02** đòi mọi thao tác *ngoài lúc chơi* làm được bằng bàn phím,
và **NFR-A11Y-06** đòi chơi được hết bằng *chỉ* cảm ứng. Hai câu đó là hai persona
khác nhau, đừng gộp vào một người.

## 6. Jobs-To-Be-Done

Mỗi persona viết được một câu: *khi \_\_\_, tôi muốn \_\_\_, để \_\_\_.*
Câu đó là nguyên liệu sinh `goal_in_user_words` — diễn đạt bằng **từ của người chơi**,
không dùng từ của sản phẩm.

Ở một game, nhu cầu hầu như không bao giờ là một tính năng. Nó là **tâm trạng**:
"đang đợi tàu, còn 10 phút, muốn gì đó bấm cho hết thời gian". Một
`goal_in_user_words` mà nghe như dòng trong `scope.md` là viết sai. So sánh:

- ❌ "dùng tính năng lưu tiến độ để tiếp tục màn 2"
- ✅ "hôm qua tôi chơi tới đâu rồi ấy, xem lại xem có nhanh hơn được không"

## 7. Red Routes — vì sao chỉ có 5

Red Route là **động mạch**: đường mà hỏng thì sản phẩm hỏng, ví von từ các tuyến
đường đỏ ở London. Chọn bằng hai trục: **tần suất** và **mức nghiêm trọng**. Việc
làm thường xuyên là bánh mì của sản phẩm; việc ít làm mà hỏng thì người dùng hận —
cả hai đều đỏ. Việc vừa thường xuyên vừa nghiêm trọng là đỏ nhất.

Giữ danh sách ngắn là cố ý. Ai thêm route thứ sáu thì phải nói được nó thay chỗ
route nào — xem phần §Cố ý KHÔNG phải Red Route trong `red-routes.md`.

## 8. Kích thước dàn

5–7 người, **cố định giữa các lần chạy**. Đẻ persona mới mỗi lần chạy là tự phá thứ
đắt nhất skill này tạo ra: khả năng so sánh trước/sau khi sửa. Persona là **tài liệu
sống**: sửa được, nhưng sửa thì ghi ngày và ghi vì sao, đừng viết lại từ đầu.

Bắt buộc trong dàn: ít nhất một persona a11y · đúng một negative · ít nhất một người
chơi điện thoại trên mạng chậm · ít nhất một người **không có vốn platformer nào**.

---

## Nguồn

- Cooper, *About Face* — bốn loại persona (chưng từ bản tóm trong seed, không fetch lại)
- [NN/g — Personas Make Users Memorable](https://www.nngroup.com/articles/persona/) ·
  [Why Personas Fail](https://www.nngroup.com/articles/why-personas-fail/) ·
  [Proto Personas](https://www.nngroup.com/videos/proto-personas/) ·
  [Personas Are Living Documents](https://www.nngroup.com/articles/personas-are-living-documents/)
- Red Routes (David Travis / Userfocus) — bản gốc trả **403**, chưng từ
  [The Decision Lab](https://thedecisionlab.com/reference-guide/design/red-route-usability) ·
  [usability-ed](https://usability-ed.blogspot.com/2013/10/red-route-usability.html) ·
  [Border Crossing UX](https://bordercrossingux.com/ux-techniques-red-routing-top-tasks/)
- Onboarding / FTUE / tutorial:
  [HypeHype Learning Hub](https://learn.hypehype.com/game-design/game-onboarding-and-first-time-user-experience) ·
  [GDevelop — Why Game Tutorials Fail](https://gdevelop.io/blog/improve-game-tutorials) ·
  [Quest for UX](https://questforux.beehiiv.com/p/do-you-know-the-difference-between-onboarding-ftue-and-tutorials)
- Tiếp cận vận động:
  [Game Accessibility Guidelines — full list](https://gameaccessibilityguidelines.com/full-list/) ·
  [remappable controls](https://gameaccessibilityguidelines.com/allow-controls-to-be-remapped-reconfigured/) ·
  [Can I Play That — motor/physical](https://caniplaythat.com/basic-accessibility-options-for-mobility/)
- GOV.UK user profiles: **không fetch được** (DNS). Chưa dùng nguồn thay thế.
