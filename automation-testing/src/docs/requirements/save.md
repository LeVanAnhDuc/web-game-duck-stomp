# SAVE — Lưu tiến độ trên máy người chơi

Truy vết phía app: FR-14 · US-01 · US-02 · NFR-REL-04 · NFR-REL-05 · invariant #4.

- **REQ-SAVE-01** Tiến độ còn sau khi tải lại trang: màn đã xong, kỷ lục và số xu vẫn hiện, Title có CONTINUE, màn kế vẫn mở.
- **REQ-SAVE-02** Save hỏng (không phải JSON) bị coi như chưa có save: Title chỉ có PLAY, chỉ màn 1 mở, không lỗi nào lộ ra trang hay console, và game chơi bình thường.
- **REQ-SAVE-03** Save mang `version` khác phiên bản game hiểu (vd 2 từ bản tương lai, hoặc thiếu `version`) bị coi như chưa có save.
- **REQ-SAVE-04** Trong một save hợp lệ, bản ghi của một màn bị hỏng (thiếu trường, sai kiểu, số âm) bị bỏ riêng màn đó; các màn hợp lệ còn lại được giữ.
- **REQ-SAVE-05** `localStorage` bị chặn hoàn toàn (chế độ riêng tư, trình duyệt tắt lưu trữ) thì game vẫn chơi được hết — vào màn, về đích, thấy bảng tổng kết, mở được màn kế trong phiên — không crash và không hiện lỗi kỹ thuật.
