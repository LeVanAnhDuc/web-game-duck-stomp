# Quyết định kiến trúc (ADR)

> **Trả lời:** Sáu tháng sau — tại sao lại làm thế này?
> **Cập nhật khi:** chốt một quyết định kỹ thuật. Ghi **ngay trong phiên đó**.

## Mục lục

<!-- BEGIN:auto — bảng dưới do .claude/scripts/docs-regen.sh sinh từ các file ADR. Đừng sửa tay. -->
| ID | Tiêu đề | Ngày | Trạng thái |
| --- | --- | --- | --- |
| [ADR-0001](0001-use-phaser-arcade-physics.md) | Dùng Phaser 3.90 + Arcade Physics + Tiled, không dùng PixiJS | 2026-09-08 | accepted |
| [ADR-0002](0002-design-tokens-override-generator.md) | Palette đặt tên theo nghĩa trong game, override đề xuất của ui-ux-pro-max | 2026-09-08 | accepted |
| [ADR-0003](0003-no-lives-checkpoint-respawn.md) | Không có hệ mạng và không có game over; chết là hồi sinh ở checkpoint | 2026-09-08 | accepted |
| [ADR-0004](0004-force-landscape-two-controls.md) | Bắt buộc màn hình ngang, và đúng hai điều khiển khi đang chơi | 2026-09-08 | accepted |
| [ADR-0005](0005-english-ascii-ui-strings.md) | Chuỗi hiển thị dùng tiếng Anh, toàn bộ ASCII | 2026-09-08 | accepted |
| [ADR-0006](0006-generated-placeholder-textures.md) | Sinh texture placeholder trong code, đằng sau một lớp đổi được sang atlas thật | 2026-09-08 | accepted |
| [ADR-0007](0007-synthesised-webaudio-sfx.md) | SFX tổng hợp bằng WebAudio, không dùng file âm thanh | 2026-09-08 | accepted |
| [ADR-0008](0008-pages-enabled-by-hand.md) | Bật GitHub Pages bằng tay một lần, không để workflow tự bật | 2026-09-08 | accepted |
| [ADR-0009](0009-quy-uoc-view-dung-chung-khong-ap-cho-repo-nay.md) | Bộ quy ước view dùng chung phần lớn KHÔNG áp cho repo này | 2026-09-11 | accepted |
| [ADR-0010](0010-touch-controls-revealed-by-any-real-touch.md) | Bất kỳ cú chạm thật nào cũng làm hiện cụm nút cảm ứng | 2026-09-12 | accepted |
| [ADR-0011](0011-locked-node-stays-selectable-cta-refuses-visibly.md) | Node bị khoá vẫn chọn được, nhưng CTA từ chối một cách thấy được | 2026-09-12 | accepted |
| [ADR-0012](0012-keep-simultaneous-hold-record-the-measured-cost.md) | Giữ yêu cầu giữ hai phím cùng lúc, và ghi lại cái giá đã đo | 2026-09-12 | accepted |
<!-- END:auto -->

Trạng thái: `accepted` · `superseded by ADR-00xx` · `deprecated`

## Cách thêm một ADR

1. Lấy số kế tiếp, tạo `NNNN-<slug-tieng-anh>.md` từ [`_template.md`](_template.md).
   Ví dụ: `0003-dung-prisma-thay-typeorm.md`.
2. Điền. Giữ trong khoảng 15–40 dòng.
3. Thêm một dòng vào bảng trên.

## Ba quy tắc

- **Một quyết định, một file.** File thứ hai bàn cùng chuyện nghĩa là quyết định đầu chưa dứt.
- **Append-only.** ADR đã `accepted` thì **không sửa nội dung**. Đổi ý thì viết ADR mới, ghi `supersedes ADR-0007`, và đổi ADR cũ sang `superseded by`.
- **Ghi ngay khi chốt**, không để cuối phiên. Ngữ cảnh của một phiên dài có thể bị nén trước khi phiên kết thúc, và lúc đó lý do đã mất.

## Khi nào cần ADR

Cần: chọn thư viện/framework/datastore · đổi ranh giới module · chọn cách xử lý một vấn đề mà có ≥ 2 phương án hợp lý · chấp nhận một hạn chế lâu dài.

Không cần: sửa bug · thêm chức năng theo đúng khuôn có sẵn · quyết định có thể đảo trong 10 phút.
