# Kế hoạch thực hiện — và nó đã chạy thế nào

> **Trạng thái:** 🟢 xong
> **Thiết kế:** `design.md` · **Nguồn phát hiện:** `ux-feedback-2026-09-12.md`

Thứ tự dưới đây là thứ tự **đã làm thật**, không phải bản dự kiến viết lại sau.

## 1. Test trước, và nó phải đỏ đúng chỗ

`tests/touch-and-locked.spec.ts` — 3 test, chạy trong **context riêng** với
`hasTouch: true`, vì ba project trong `playwright.config.ts` đều là desktop và **một
lỗi cảm ứng không tái hiện được trên context không chạm được**.

Chạy lần đầu: **3/3 đỏ**, và đỏ đúng hai lỗi:
- `showTouch` không bao giờ thành `true` sau khi chạm vào vùng chơi;
- thẻ đáy bản đồ trả về `["0", "1", "LEVEL 2", "BEST --", "0"]` — không có `LOCKED`.

Luật tự đặt cho bộ test này, theo đúng lằn ranh của `playwright.config.ts`: **chỉ
khẳng định trạng thái trong lúc input đang được giữ**, không bao giờ khẳng định kết
quả vật lý. "Snapshot nói phím phải đang xuống" là tất định; "con vịt qua được hố" là
timing.

Playwright's `touchscreen` chỉ `tap` được chứ không giữ được, mà ngón tay **đang đè
nút** mới là thứ cần đo — nên cú giữ đi qua CDP `Input.dispatchTouchEvent`.

## 2. Sửa lỗi 1 — `src/game/input.ts`

Thêm listener `pointerdown` ở phạm vi scene, bật `sawTouch` khi `pointer.wasTouch`.
Chi tiết và các phương án đã loại: **ADR-0010**.

## 3. Sửa lỗi 2 — `src/game/ui.ts` + `WorldMapScene.ts` + `strings.ts`

- `Button.setEnabled(on)`: mặt trong suốt, viền `--locked`, chữ `--ink-dim`, bỏ khối
  bóng, `disableInteractive()`, và `activate()` từ chối — nên chuột, cảm ứng và Enter
  đều bị từ chối như nhau.
- `WorldMapScene.select()`: khi màn đang chọn bị khoá → thẻ ghi `LOCKED`, ẩn icon xu
  và số xu, `startButton.setEnabled(false)`.
- `strings.ts`: `locked: 'Locked'` → `'LOCKED'`. Chuỗi này có sẵn từ đầu mà chưa bao
  giờ được dùng ở đâu.

Chi tiết và các phương án đã loại: **ADR-0011**.

## 4. Kiểm chứng

| Bước | Kết quả |
| --- | --- |
| `npm run lint:core` | ok — 15 file trong `src/core/` vẫn thuần |
| `npx tsc --noEmit` | sạch |
| `npm run test` | 96/96 unit test xanh |
| 3 test mới | 3/3 xanh sau khi sửa |
| `npm run verify` | **18/18** test Playwright xanh trên cả ba khổ, build 332.94 kB gzip |

## 5. Nhìn tận mắt trong browser thật

Không chỉ test — chạy `npm run dev` rồi lái bằng **cảm ứng thật** (context
`hasTouch: true`, cú giữ qua CDP), chụp lại ở `anh/sau-sua-*.png`:

| Ảnh | Thấy gì |
| --- | --- |
| `sau-sua-01-node-khoa-start-vo-hieu.png` | thẻ ghi `LEVEL 2` / `LOCKED`, số xu biến mất, `START` thành nút viền vô hiệu |
| `sau-sua-02-node-mo-start-bat-lai.png` | chọn lại node 1 → `START` vàng trở lại, `BEST --` và số xu quay về |
| `sau-sua-03-vao-man-chua-cham.png` | vừa vào màn, **chưa** có nút cảm ứng (đúng FR-15) |
| `sau-sua-04-nut-cam-ung-hien.png` | sau **một** cú chạm vào vùng chơi: hai nút hướng ở góc dưới trái, nút nhảy lớn hơn ở dưới phải, đều mờ |
| `sau-sua-05-di-duoc-bang-ngon-tay.png` | giữ nút phải bằng ngón tay → nhân vật đi từ **x=72 tới x=168** |

Số đo đọc ra từ handle dev, không phải từ cảm nhận: `showTouch: true` ngay sau cú
chạm đầu, và `x` đổi thật sau cú giữ.

## 6. Tài liệu cập nhật trong cùng nhánh

- **ADR-0010 · ADR-0011 · ADR-0012** (cái thứ ba là quyết định **không** sửa F-04,
  kèm số đo).
- `03-design/invariants.md` → **bất biến #12**: cờ "đã thấy cảm ứng" phải bật được từ
  **ngoài** cụm nút cảm ứng. Đây đúng loại lỗi mà file đó tồn tại để chặn: sai âm
  thầm, không test nào đỏ.
- `02-requirements/nfr.md` → NFR-PERF-07 từ **ngân sách** thành **số đo** (4804 ms ở
  Fast 3G trên host thật); NFR-A11Y-06 ghi thêm hai cảnh báo (nửa cảm ứng từng sai;
  và nhóm không giữ được hai phím thì cả hai đường đều không tới được).
- `04-state/backlog.md` → §Đang làm, và §Việc tiếp theo giờ mang 8 việc còn lại của
  bản review thay cho hai dòng cũ.
- `.githooks/pre-commit` → gọi `npm run lint:core` thay vì `yarn`: repo này chỉ dùng
  npm, và commit `1eb16b8` đã xoá `yarn.lock` đúng vì lý do đó.

`README.md` **không** đổi: §Features đã hứa *"on-screen controls appear the first time
you touch"* từ trước — lời hứa đó giờ mới thành đúng.

## 7. Không làm, có chủ ý

Xem bảng cuối `design.md`. Ngắn gọn: F-04 → ADR-0012 (đo, không sửa) · F-02, F-05,
F-06, F-07, F-08, F-09, F-10 → `backlog.md` §Việc tiếp theo, vì tất cả đều là quyết
định thiết kế cần cổng duyệt, không phải lỗi hiện thực.
