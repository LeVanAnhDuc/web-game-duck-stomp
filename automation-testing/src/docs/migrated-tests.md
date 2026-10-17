# Test đã gom về lúc scaffold

Bộ e2e Playwright cũ của app (`tests/`, chạy bằng `playwright.config.ts` → `pnpm test:e2e` ở gốc repo, sau bước dời
app là `client/`) được `git mv` về đây khi dựng `automation-testing/`. Config cũ gộp vào `playwright.config.ts`:
hai Vite dev server (:4173 cờ Ducker ID tắt, :4174 cờ bật với issuer giả), project `app` (667×375), `app-touch`
(`hasTouch`), `app-auth` (bản bật cờ). Ba viewport cũ (667×375, 1024×768, 1440×900) chạy lặp mọi spec; giờ logic chạy
một lần ở 667×375 và các khẳng định phụ thuộc khổ màn hình được gom về module `boot` (mỗi khổ một test).

| Từ | Về | Trạng thái |
|---|---|---|
| `tests/smoke.spec.ts` | `src/tests/e2e/boot/title.e2e.ts` (3 case → TC-BOOT-001/004/007; khẳng định bội số nguyên → `boot/scale.e2e.ts`) | đã chuẩn hóa |
| `tests/touch-and-locked.spec.ts` | `src/tests/e2e/touch/controls.e2e.ts` (3 case → TC-TOUCH-002/003/005/008; CDP giữ ngón → `GamePage.touchDown`) | đã chuẩn hóa |
| `tests/ducker-id-sign-in-off.spec.ts` | `src/tests/e2e/ducker-id/flag-off.e2e.ts` (TC-DUCKERID-001/002) | đã chuẩn hóa |
| `tests/ducker-id-sign-in.spec.ts` | `src/tests/e2e/ducker-id/sign-in.e2e.ts` (TC-DUCKERID-003…012); issuer giả → `src/fixtures/issuer.fixture.ts` | đã chuẩn hóa |
| `playwright.config.ts` (3 viewport, 2 webServer) | `playwright.config.ts` | gộp |

Unit test (vitest, `client/src/**/*.test.ts`) ở lại `client/`: chúng thuộc về code.

Case cũ bị đổi khi chuẩn hóa: "the overlay is gone once the game starts" từng gọi thẳng `scene.start` qua
`window.duckstomp`; giờ đi bằng Enter như người chơi (TC-DUCKERID-012). "an IdP error leaves the player signed out"
từng mở thẳng URL lỗi; giờ issuer giả từ chối qua redirect thật (TC-DUCKERID-007). Không case nào bị bỏ.

## Còn trỏ về nơi cũ

- `docs/specs/*/plan.md`, `docs/specs/*/design.md`, `docs/decisions/00*.md` — tài liệu lịch sử (đã ship), giữ nguyên văn.
- `docs/04-state/backlog.md` §Đang làm — số liệu "18 test Playwright" là ảnh chụp trạng thái lúc ghi, không phải luật.
- `docs/specs/touch-controls-and-locked-start/` (log thô, ux-feedback) — nhật ký phiên cũ.
