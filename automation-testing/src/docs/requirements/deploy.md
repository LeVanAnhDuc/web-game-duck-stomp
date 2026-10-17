# DEPLOY — Site tĩnh dưới đường dẫn gốc của GitHub Pages

Truy vết phía app: NFR-GAME-04 (màn chơi là dữ liệu tĩnh) · ADR-0008 · README ("Play: https://levananhduc.github.io/web-game-duck-stomp/") · `deploy.yml` (`VITE_BASE_PATH=/<repo>/`).

- **REQ-DEPLOY-01** Từ lúc mở tới lúc đang chơi màn 1, mọi tài nguyên của site tải thành công: không response ≥ 400, không request nào thất bại.
- **REQ-DEPLOY-02** Mọi request tới chính site nằm dưới đường dẫn gốc của site (trên GitHub Pages là `/web-game-duck-stomp/`) — không request nào rơi ra gốc domain.
- **REQ-DEPLOY-03** Sáu file màn được phục vụ ở `levels/level-1.json` … `levels/level-6.json` dưới đường dẫn gốc, là JSON Tiled có lớp object.
