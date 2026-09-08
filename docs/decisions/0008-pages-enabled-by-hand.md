# ADR-0008 · Bật GitHub Pages bằng tay một lần, không để workflow tự bật

> **Ngày:** 2026-09-08
> **Trạng thái:** accepted
> **Liên quan:** NFR-PERF-07 · NFR-PERF-08 · ADR-0001

## 1. Bối cảnh

`deploy.yml` dùng `actions/configure-pages@v5`, và action đó có tham số
`enablement: true` nghe rất hợp lý: nó tự tạo Pages site nếu chưa có, nên repo mới
clone về là chạy được ngay, không ai phải nhớ một bước thủ công.

Nhưng `GITHUB_TOKEN` mà workflow nhận được **không** tạo được Pages site. Nó có
`pages: write` nên **deploy** được, còn **tạo** site cần quyền admin repo. Đặt
`enablement: true` thì workflow đỏ với `Resource not accessible by integration` —
một thông báo không nói gì về nguyên nhân thật.

Các repo game khác trong workspace đã đâm phải đúng chỗ này và ghi lại (xem
`web-game-asteroids/.github/workflows/deploy.yml`).

## 2. Quyết định

Không dùng `enablement`. Bật Pages là **một bước thủ công, làm một lần**, trong
Settings → Pages → Source = **GitHub Actions**.

Ghi lại ở ba nơi để không ai phải đi tìm: comment ngay trong `deploy.yml`, một
dòng ở `README.md` §Releases and versioning, và ADR này.

## 3. Phương án đã loại

| Phương án | Vì sao loại |
| --- | --- |
| `enablement: true` | Không chạy được với `GITHUB_TOKEN` mặc định. Đỏ với thông báo không liên quan tới nguyên nhân |
| Dùng Personal Access Token có quyền admin | Đánh đổi rất tệ: thêm một secret quyền cao, tồn tại vĩnh viễn, chỉ để tiết kiệm một cú bấm làm một lần trong đời repo |
| Deploy bằng branch `gh-pages` thay vì Actions | Vẫn phải vào Settings chọn source. Đổi một bước thủ công thành một bước thủ công khác, cộng thêm một branch artifact trong lịch sử |
| Bỏ Pages, hướng dẫn người chơi tự chạy | Trái định vị ở `overview.md`: "mở link là chơi" |

## 4. Hệ quả

**Được:**
- Không có secret nào ngoài `GITHUB_TOKEN` tự cấp
- `deploy.yml` không có nhánh nào chỉ chạy đúng một lần rồi thành code chết

**Mất / phải chấp nhận:**
- **Lần deploy đầu tiên sẽ đỏ** nếu chưa ai vào Settings bật Pages. Đó là hành vi
  đúng, nhưng nó trông như lỗi — nên nó được ghi ở ba chỗ
- Link `**Play**` trong README trỏ tới một URL **chưa tồn tại** cho tới sau lần
  deploy đầu. README hiện có `<!-- screenshot: pending first deploy -->` đúng vì lý
  do này; chạy lại `capture-screenshots.mjs` sau khi Pages sống

**Điều kiện xem lại:** GitHub cho `GITHUB_TOKEN` quyền tạo Pages site, hoặc
`actions/configure-pages` đổi cách làm việc đó.
