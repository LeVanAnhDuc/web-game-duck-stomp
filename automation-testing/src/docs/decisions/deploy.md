# DEPLOY — Quyết định

Đi cặp với `docs/requirements/deploy.md`.

## Nguồn

Đọc ngày 2026-10-18 (đường dẫn tính từ gốc repo app).

- **Tài liệu:** `README.md` (link Play, §Releases and versioning), `docs/decisions/0008-pages-enabled-by-hand.md`,
  `docs/02-requirements/nfr.md` (NFR-GAME-04), `client/.env.example` (`VITE_BASE_PATH`).
- **Code:** `.github/workflows/deploy.yml` (`VITE_BASE_PATH: /${{ github.event.repository.name }}/`, upload `client/dist`),
  `client/vite.config.ts` (`base`, `publicDir: 'assets'`), `client/src/game/scenes/PreloadScene.ts`
  (`levels/level-N.json`, tương đối).

## Quyết định chốt (Chốt bởi agent — user uỷ quyền)

- **Q1** Module này viết để chạy **không đổi** trên dev (gốc `/`) và prd (GitHub Pages dưới `/web-game-duck-stomp/`): chỉ
  dùng DOM, `data-scene`, bàn phím và mạng — không `window.duckstomp`. Trên dev REQ-DEPLOY-02 đúng hiển nhiên; giá trị
  thật của nó là khi chạy `ENV=prd`.
- **Q2** Đường dẫn gốc lấy từ `baseURL` của project (`urls.webUrl` + `/`), không viết cứng.
- **Q3** Google Fonts là ngoài site, không thuộc REQ-DEPLOY-01/02 (module `privacy` lo phần đó).

## Tài khoản test

Không có tài khoản.

## Ngoài phạm vi

- Workflow deploy chạy xanh — kiểm ở CI (`gh run list`), không phải e2e.

## Tech debt liên quan

_(không có)_
