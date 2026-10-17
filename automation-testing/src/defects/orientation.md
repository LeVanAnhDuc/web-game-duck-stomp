# ORIENTATION — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-ORIENTATION-01](#bug-orientation-01) | Cao | TC-ORIENTATION-004 | Xoay dọc giữa màn chơi làm màn chơi lại từ đầu và vẫn chạy sau màn chặn |

### BUG-ORIENTATION-01

- **TC:** TC-ORIENTATION-004 · **Requirement:** REQ-ORIENTATION-04
- **Bước tái hiện:** chơi màn 1 ở 667×375, ăn một xu, chờ đồng hồ qua 1 giây → xoay dọc (375×667) → chờ → xoay lại ngang.
- **Mong đợi:** lúc dọc màn chơi tạm dừng sau màn chặn, đồng hồ đứng; xoay lại thì chơi tiếp đúng chỗ (US-03 bước 2: "game
  tiếp tục đúng chỗ vừa dừng"; "game phải đã tạm dừng từ trước, không được để nhân vật rơi trong lúc màn chặn hiện").
- **Thực tế:** ngay khi xoay, màn chơi **khởi động lại**: đồng hồ về 0, xu đã ăn mất, nhân vật về điểm xuất phát — và scene
  Game **vẫn chạy** sau màn chặn (đồng hồ tăng từ 0 lên ~1 s trong lúc dọc). Xoay lại ngang thì màn khởi động lại lần nữa.
  Nguyên nhân thấy được trong code: handler `resize` của `client/src/main.ts` đăng ký trước `mountRotateGate`; khi đổi
  hướng làm zoom nguyên đổi (2 → 1 ở 667×375 ↔ 375×667, cũng xảy ra trên điện thoại thật 844×390 ↔ 390×844), nó gọi
  `scene.restart()` cho mọi scene đang chạy, kể cả Game. Lệnh `pause` của màn chặn chạy sau đó trong cùng tick nhưng
  `restart` được xử lý sau và để scene chạy lại. Khi người chơi đã tự tạm dừng (TC-ORIENTATION-005) thì Game không nằm
  trong danh sách scene đang chạy nên không bị restart.
- **Ghi chú:** ghi ngày 2026-10-18 trên Chromium (Windows). Không sửa trong PR test này.

## Đã sửa

_(chưa có)_
