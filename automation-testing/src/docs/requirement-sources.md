# Nguồn requirement của Duck Stomp

**Requirement của module lấy ở đâu.** `/write-tests` đọc file này ở bước 1 và chỉ đọc các nơi liệt kê dưới đây, cộng với
những gì user nói trong chat. Không dùng Jira/Confluence.

Đường dẫn tính từ thư mục gốc repo test. Danh sách này được user xác nhận lúc scaffold; khi user chỉ thêm nơi khác, hoặc
một nơi bị bỏ/đóng băng, sửa bảng này trong cùng lượt.

## Tài liệu

- `../docs/README.md` — bản đồ tài liệu + quy ước ID (US / FR / NFR / ADR); đọc trước để biết file nào là nguồn đúng
- `../docs/01-product/overview.md` — định vị, Non-Goals (không server, không tài khoản game, chỉ màn hình ngang)
- `../docs/01-product/journeys.md` — luồng người dùng US-01…US-06, kèm "Điều gì có thể sai" (nguồn chính cho case negative)
- `../docs/01-product/glossary.md` — tên khái niệm ↔ tên trong code ↔ tên trên UI
- `../docs/02-requirements/scope.md` — danh mục chức năng FR-01…FR-20 và trạng thái
- `../docs/02-requirements/nfr.md` — ngưỡng NFR-PERF / SEC / A11Y / I18N / REL / DATA / GAME áp cho mọi feature
- `../docs/03-design/invariants.md` — điều kiện sai âm thầm (scale số nguyên, core thuần, save, cờ Ducker ID)
- `../docs/decisions/` — ADR-0001…0013: vì sao hành vi như vậy (vd ADR-0003 không mạng, ADR-0010 nút cảm ứng, ADR-0011 node khoá)
- `../docs/specs/<feature>/design.md` — thiết kế đã duyệt của từng feature (core-game, touch-controls-and-locked-start, ducker-id-sign-in)
- `../docs/design-system/platformer/MASTER.md` — ngưỡng hiển thị (vùng bấm, nút hướng 72px, nút nhảy 88px, tương phản)
- `../README.md` — mục Features + Controls: hợp đồng hành vi hướng tới người chơi

## Code

- `../client/src/core/strings.ts` — mọi chuỗi UI (ASCII, tiếng Anh), nguồn của `src/data/copy.ts`
- `../client/src/core/` — luật thuần: di chuyển, scale số nguyên, chấm điểm + mở khoá, save/migrate, tuning
- `../client/src/game/scenes/` — các scene Phaser: Boot, Preload, Title, WorldMap, Game, Hud, Pause, LevelComplete
- `../client/src/game/` — input (bàn phím + cảm ứng), âm thanh, saveStore, rotateGate, accountOverlay, entities
- `../client/src/game/auth/` — đăng nhập Ducker ID (OIDC + PKCE) sau cờ tính năng
- `../client/assets/levels/` — sáu màn chơi (Tiled JSON), sinh từ `../client/scripts/make-level.mjs`
- `../client/src/main.ts` — `<html data-scene>` (có cả ở production) và cửa debug `window.duckstomp` (chỉ dev) mà suite này dùng để nhìn vào canvas

## Không đọc như nguồn đúng

- `../docs/specs/*/plan.md` — danh sách task lúc build, không phải hành vi
- `../docs/specs/touch-controls-and-locked-start/log-tho/` — nhật ký thô của phiên persona, không phải hành vi
- `../docs/04-state/backlog.md` — việc đang làm / nợ kỹ thuật, không phải hành vi đã ship
- `../docs/code-conventions.md` — quy ước viết code dùng chung, không nói về hành vi
- `../.claude/skills/ux-persona-review/runs/` — nhật ký phiên persona
- `../client/src/**/*.test.ts` — unit test của app: gợi ý hành vi, không phải requirement

## Thứ tự thẩm quyền

User (chat) > tài liệu trên > code. Code cho biết app *đang* làm gì, không cho biết *nên* làm gì.
