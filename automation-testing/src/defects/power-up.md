# POWERUP — Bug log

## Đang mở

| Bug | Mức | TC | Tóm tắt |
|---|---|---|---|
| [BUG-POWERUP-01](#bug-powerup-01) | Trung bình | TC-POWERUP-005 | Đứng tì vào tường nứt và giữ hướng chạy là tường vỡ — không cần đà |

### BUG-POWERUP-01

- **TC:** TC-POWERUP-005 · **Requirement:** REQ-POWERUP-05
- **Bước tái hiện:** màn 3, dạng mạnh → đứng sát tường nứt (cột 56) → giữ →
- **Mong đợi:** tường rung "chưa đủ nhanh" và đứng nguyên chừng nào người chơi chưa lấy đà (design.md §3, US-05).
- **Thực tế:** rung một lần, rồi khoảng 0,3 s sau tường vỡ dù nhân vật không nhích. `GameScene.onCrackedBlock` hỏi
  `canBreakByRunning(moveState)`, mà `core/movement.step` vẫn cộng gia tốc vào `vx` khi thân bị tường chặn (nó không
  biết va chạm), nên `vx` lên tới `breakSpeed` trong lúc nhân vật đứng yên. Hệ quả: lời mời "đường chạy dài" của US-05
  không còn cần thiết — tì vào tường là đủ.

## Đã sửa

_(chưa có)_
