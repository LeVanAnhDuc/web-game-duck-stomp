# Tổng quan sản phẩm

> **Trả lời:** Sản phẩm này là gì, cho ai, và **KHÔNG** làm gì?
> **Trạng thái:** 🟢 đủ
> **Cập nhật:** 2026-09-08 · commit —
> **Cập nhật khi:** định vị đổi · thêm/bớt một Non-Goal · trần chi phí đổi

<!-- CÁCH ĐIỀN
File này là nơi DUY NHẤT trả lời "cái này có thuộc phạm vi không". Mọi tranh luận
về scope kết thúc ở đây.

Mục 4 (Non-Goals) là mục quan trọng nhất và là mục dễ bỏ trống nhất. Một Non-Goal
tốt là thứ nghe HỢP LÝ mà vẫn bị từ chối — "không làm chat realtime", "không hỗ trợ
nhiều tổ chức". Nếu danh sách Non-Goals trống, file này chưa làm được việc của nó.

KHÔNG chứa: danh sách tính năng (-> 02-requirements/scope.md), ngưỡng kỹ thuật
(-> 02-requirements/nfr.md), thuật ngữ (-> 01-product/glossary.md).
-->

## 1. Một câu định vị

Một game platformer 2D hướng Mario chạy thẳng trong trình duyệt, chơi được bằng bàn
phím hoặc cảm ứng với **đúng hai điều khiển**, không cài đặt và không tài khoản.

## 2. Vấn đề đang giải

Muốn chơi một platformer tử tế trên điện thoại thì phải vào store, tải, và thường
phải chịu quảng cáo hoặc mua trong app. Muốn chơi trên máy tính công ty thì không
cài được gì. Cái còn thiếu là một game **mở link là chơi**, cầm thấy chặt, và không
đòi gì của người chơi — kể cả một địa chỉ email.

Phía người làm, vấn đề thứ hai: hầu hết platformer web chỉ chơi được trên desktop,
vì cơ chế của chúng cần ba đến bốn nút. Ràng buộc hai-điều-khiển ở đây là để một
thiết kế duy nhất phục vụ cả hai nền tảng, không phải để làm bản mobile hạng hai.

## 3. Người dùng mục tiêu

Người chơi tình cờ, mở link trên điện thoại hoặc laptop, có 5–20 phút. Không cài
gì, không đăng nhập, có thể không quay lại. Nhóm chính là người chơi **điện thoại
ngang** — đó là nhóm bị các platformer web khác bỏ rơi, và là nhóm quyết định mọi
lựa chọn về điều khiển.

Nhóm thứ hai: người chơi muốn phá kỷ lục thời gian của chính mình. Họ là lý do
localStorage tồn tại trong dự án này.

## 4. Non-Goals — dứt khoát không làm

- **Không có backend, không có tài khoản, không có bảng xếp hạng online.** Tiến độ
  nằm trong localStorage của máy người chơi. Đổi máy là mất — chấp nhận. Có server
  là có chi phí, có dữ liệu người dùng, và có bài toán chống gian lận điểm.
- **Không có hệ mạng và không có game over** (ADR-0003). Nghe hợp lý vì Mario có,
  nhưng Mario là máy arcade ăn xu.
- **Không có nút thứ ba khi đang chơi** (ADR-0004). Nghĩa là không có nút chạy,
  không có nút tấn công, không có ống dẫn (vào ống cần nút xuống), không có
  ngồi/trượt. Mọi năng lực phải cưỡi lên di chuyển và nhảy.
- **Không chơi ở khổ dọc.** Màn dọc chỉ hiện màn chặn xoay. Platformer cuộn ngang ở
  375px dọc thì không thấy được thứ mình đang chạy tới.
- **Không có trình soạn màn cho người chơi.** Màn chơi vẽ trong Tiled, là tài sản
  của dự án, không phải nội dung do người dùng tạo.
- **Không có nhạc nền**, chỉ SFX. Nhạc là thứ người chơi tắt đầu tiên và là phần
  chiếm dung lượng tải lớn nhất.
- **Không có nhiều thế giới.** Đúng 6 màn trên một bản đồ. Không phải "6 màn trước
  mắt rồi mở rộng sau" — mở rộng là một quyết định mới, cần ADR mới.
- **Không có màn hướng dẫn bằng chữ.** Màn 1 dạy luật bằng bố cục.
- **Không có bệ vụn rơi, không có loại địch thứ tư.** Ba loại địch là đủ dạy 6 màn.

## 5. Mô hình

| Câu hỏi | Trả lời |
| --- | --- |
| Ai trả tiền | Không ai — dự án học tập, chơi miễn phí, không quảng cáo |
| Trả bằng gì | — |
| **Trần chi phí hạ tầng / tháng** | **0đ.** Build static, deploy GitHub Pages. Ràng buộc này là lý do không có backend, và nó không thương lượng |

## 6. Thế nào là thành công

1. Người chơi trên **điện thoại ngang** hoàn thành màn 1 mà không cần một dòng
   hướng dẫn nào.
2. Có người chơi **lại** một màn đã xong để phá kỷ lục thời gian — đó là bằng chứng
   cảm giác điều khiển đủ chặt để đáng chơi lại.
3. Cùng một thiết kế điều khiển chạy trên bàn phím và cảm ứng mà **không có nhánh
   riêng nào cho từng nền tảng** trong logic gameplay.
