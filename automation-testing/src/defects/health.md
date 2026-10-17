# HEALTH — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-HEALTH-01](#bug-health-01) | Cao | TC-HEALTH-007 | Chết trên gai ở khung hình chậm: vừa hồi sinh đã mất thêm một tim |

### BUG-HEALTH-01

- **TC:** TC-HEALTH-007 · **Requirement:** REQ-HEALTH-02
- **Bước tái hiện:** màn 4 → đứng trên gai tới khi mất tim cuối, trên một khung hình dài hơn ~33 ms (máy chậm, tab bận;
  CI ubuntu tái hiện được ở PR #15: `playerRespawned {hearts: 3}` rồi `playerHit {hearts: 2}` cùng một `time.now`).
- **Mong đợi:** hồi sinh ở điểm xuất phát với đủ 3 tim và giữ nguyên 3 tim — ở đó không có gì gây sát thương.
- **Thực tế:** còn 2 tim ngay khi hồi sinh. `GameScene.die` gọi `Player.resetTo`, chỉ `setPosition` sprite và xoá bất
  tử (`invulnerableUntil = 0`). Arcade (`World.update`) chạy bước bù của khung đó bằng `World.step`, không gọi
  `Body.preUpdate`, nên thân vật lý vẫn nằm trên gai; overlap gai bắn lần nữa và `damage()` trừ tim vì bất tử đã bị xoá.
  Cùng đường đi cho cú chết do địch chạm cạnh bên.

## Đã sửa

_(chưa có)_
