# Thiết kế · core-game

**Liên quan:** FR-01 … FR-19 · US-01 … US-05 · NFR-GAME-01…04 · NFR-A11Y-01…06 ·
NFR-REL-01…05 · NFR-PERF-05…08 · NFR-I18N-01 · NFR-I18N-04 ·
ADR-0001 · ADR-0002 · ADR-0003 · ADR-0004 · ADR-0005 · ADR-0006 · ADR-0007

Feature này là **toàn bộ game ở bản đầu tiên**. Không tách nhỏ hơn được: bản đồ
không có nghĩa nếu chưa có màn chơi, màn chơi không có nghĩa nếu chưa có cảm giác
điều khiển, và lưu tiến độ không có nghĩa nếu chưa có gì để lưu.

Tài liệu này **không nhắc lại** định vị (`overview.md`), luồng người dùng
(`journeys.md`), ranh giới module (`architecture.md`), ngưỡng (`nfr.md`), bất biến
(`invariants.md`), hay token thiết kế (`design-system/platformer/MASTER.md`). Nó chỉ
nói những gì chưa có ở đâu cả.

## 1. Cảm giác điều khiển — hợp đồng của `core/movement`

Đây là phần quan trọng nhất và là phần duy nhất được unit test kỹ.

```
step(state: MoveState, input: InputSnapshot, dtMs: number): MoveResult
```

`InputSnapshot` phẳng và không biết nguồn: `{ left, right, jumpPressed, jumpHeld }`.
Bàn phím và nút cảm ứng cùng sinh ra nó — đó là cách ADR-0004 được thực thi trong
code, không phải bằng lời hứa.

Bốn cơ chế, tất cả nằm trong hàm thuần này:

| Cơ chế | Luật | Vì sao ở đây, không ở Phaser |
| --- | --- | --- |
| `runRamp` | Giữ hướng → `vx` tiến dần tới `maxRun` theo `accel`; nhả → giảm theo `friction`; đổi hướng → giảm nhanh hơn (`turnAccel`) | Thay cho nút chạy (ADR-0004). Arcade có `drag` nhưng không có đường cong "lấy đà" |
| `variableJump` | `jumpPressed` khi đứng đất → `vy = -jumpVelocity`. Nhả sớm trong lúc đang lên → `vy` bị cắt còn `vy * cutMultiplier` | Arcade không có khái niệm "nhả sớm" |
| `coyoteTime` | Rời mặt đất mà chưa nhảy → còn `coyoteTimeMs` để nhảy vẫn ăn | Cần đếm thời gian **kể từ khi mất đất**, Arcade chỉ cho biết `blocked.down` của frame này |
| `jumpBuffer` | `jumpPressed` khi đang bay → nhớ trong `jumpBufferMs`; chạm đất trong khoảng đó → nhảy ngay frame chạm đất | Nếu không thì bấm sớm 2 frame là mất cú nhảy |

`MoveState` mang `coyoteMs`, `bufferMs`, `vx`, `vy`, `facing`, `isPowered`.
Hàm **không đọc đồng hồ** — `dtMs` truyền vào (invariants #5). Đó là điều kiện để
test được toàn bộ bảng trên mà không mở browser.

Mọi con số nằm ở `core/tuning`, một object hằng. Gọt cảm giác = sửa một file.

## 2. Sát thương và nấm — một luật, không hai

Thứ tự xử lý khi player chạm một nguồn sát thương (địch cạnh bên, gai, `spiker` từ
mọi phía):

1. Đang trong khoảng bất tử sau khi trúng đòn → bỏ qua hoàn toàn.
2. Đang `poweredForm` → **mất nấm**, về sprite gốc, bật lùi, bật bất tử. Tim
   **không đổi**.
3. Không powered → **mất 1 tim**, bật lùi, bật bất tử.
4. Tim về 0 → `playerDied` → hồi sinh ở checkpoint với đủ 3 tim.

Rơi khỏi màn (`pit`) **bỏ qua toàn bộ bảng trên**: chết ngay (invariants #8).

Đạp lên đầu địch: `walker` và `flyer` chết, player bật nhẹ lên. `spiker` **không**
chết và gây sát thương theo bảng trên — đó là toàn bộ điểm của nó.

## 3. Năng lực của nấm

`poweredForm` cho phép phá `crackedBlock`, và chỉ theo đúng hai cách:

- **Đủ đà:** `|vx| >= tuning.breakSpeed` và va chạm theo chiều ngang.
- **Rơi từ trên:** `vy > 0` và va chạm từ phía trên khối.

Không đủ đà mà đâm vào → khối **không vỡ** và phát tín hiệu "chưa đủ nhanh": khối
rung một nhịp ngắn + SFX khác với SFX phá vỡ. US-05 nói rõ điều này phải phân biệt
được với "khối này không phá được".

## 4. Màn chơi là dữ liệu, không phải code

Mỗi màn là một file Tiled JSON trong `assets/levels/level-N.json`, gồm:

- một tile layer `terrain` — chỉ hình khối đặc
- một object layer `objects` — mọi thứ khác, phân biệt bằng `type`:
  `spawn` · `goal` · `checkpoint` · `coin` · `coinHidden` · `powerUp` ·
  `questionBlock` · `crackedBlock` · `walker` · `spiker` · `flyer` · `spikes` ·
  `movingPlatform`

Thuộc tính trên object mang biến thể, **không sinh ra lớp code mới**:
`walker.turnAtEdge: bool` (một quân bài thiết kế, không phải hai lớp),
`flyer.path` và `movingPlatform.path` là hai điểm đầu-cuối + `speed`,
`questionBlock.gives: "coin" | "powerUp"`.

`LevelLoader` đọc file, dựng tilemap và spawn entity theo `type`. Thêm màn = thêm
file + một node trên bản đồ, **không sửa code** (NFR-GAME-04).

Tổng số xu của màn (dùng cho `6/8`) đếm được từ file, tính cả `coinHidden` — nên
không có con số nào bị hardcode ở hai chỗ.

## 5. Sáu màn dạy gì

Mỗi màn giới thiệu đúng một thứ, trong một tình huống an toàn, trước khi ghép:

| Màn | Dạy | Ghép lại |
| --- | --- | --- |
| 1 | chạy · nhảy · xu · vực | — |
| 2 | `walker` và đạp đầu | vực |
| 3 | nấm · `crackedBlock` · xu giấu (US-05) | walker |
| 4 | `spiker` — thứ không đạp được | nấm, vực |
| 5 | `flyer` · `movingPlatform` | spiker, crackedBlock |
| 6 | không có gì mới; dài hơn, có checkpoint ở giữa | tất cả |

Màn 1 dạy bằng **bố cục**: một hành lang hẹp buộc chạy, một khoảng trống buộc nhảy,
một xu treo cao buộc nhảy đúng lúc. Không một chữ nào.

## 6. Lưu tiến độ

Một khoá localStorage duy nhất. Hình dạng:

```ts
type SaveData = {
  version: 1
  levels: Record<string, { cleared: boolean; bestTimeMs: number | null; coins: number }>
  muted: boolean
}
```

Luật ghi, tất cả nằm trong `core/scoring` + `core/progress` (hàm thuần, test được):

- `bestTimeMs` chỉ ghi đè khi **nhỏ hơn** giá trị cũ.
- `coins` chỉ ghi đè khi **lớn hơn** giá trị cũ — chơi lại tệ hơn không được làm
  tụt số xu đã tìm được (US-02).
- `cleared` một khi `true` thì không bao giờ về `false`.

Đọc: validate hình dạng trước, `version` lạ hoặc payload rác → coi như **chưa có
save** (NFR-REL-04). `localStorage` throw → chạy tiếp ở chế độ không lưu, mọi thứ
khác vẫn hoạt động (NFR-REL-05).

## 7. Phóng số nguyên

`core/scale.computeScale(vw, vh)` trả `{ zoom, canvasW, canvasH }` với
`zoom = max(1, floor(min(vw/320, vh/180)))`. Canvas luôn `320*zoom × 180*zoom`,
phần dư là letterbox bằng màu `--night-deep`. Hàm thuần, test với một bảng viewport
(NFR-GAME-01, invariants #1).

UI chrome cũng nhân theo `zoom` — thang chữ trong `MASTER.md` là thang ở `zoom = 2`.

## 8. Điều khiển cảm ứng và cổng xoay màn

`InputManager` giữ một cờ `sawTouch` và `sawKey`. Cú chạm đầu → hiện nút cảm ứng;
phím đầu → ẩn. **Không đọc user-agent** (invariants #11).

`RotateGate` là một overlay DOM ngoài canvas, bật khi `vh > vw`. Khi bật, nó gọi
`scene.pause()` **trước** khi hiện — US-03 nói rõ không được để nhân vật rơi trong
lúc màn chặn đang hiện.

## 9. Kiểm thử

| Cái gì | Bằng gì | Vì sao |
| --- | --- | --- |
| `core/movement` — cả 4 cơ chế, từng bảng luật ở §1 | Vitest | Đây là thứ dễ hồi quy nhất và tốn nhất khi hồi quy |
| `core/scale` | Vitest, bảng 20 viewport | NFR-GAME-01 là bất biến im lặng |
| `core/storage` — 6 payload rác, migrate, storage throw | Vitest | NFR-REL-04, NFR-REL-05 |
| `core/scoring`, `core/progress` | Vitest | Luật "chỉ ghi đè khi tốt hơn" ở §6 |
| `core/strings` — mọi chuỗi ASCII | Vitest | NFR-I18N-04 |
| Tải được, vào được màn 1, chụp 3 khổ | Playwright, **một** smoke test | Physics E2E chập chờn và sẽ bị tắt sau ba lần đỏ oan |

## 10. Cái gì cố tình chưa làm ở bản này

- Art thật từ pack — ADR-0006. Texture sinh trong code, sau một lớp đổi được.
- Sample palette pack vào `MASTER.md` — còn 🟡 vì lý do trên.
- Ngưỡng thời gian tải thật — NFR-PERF-07 đang là **ngân sách**, chưa phải số đo.
