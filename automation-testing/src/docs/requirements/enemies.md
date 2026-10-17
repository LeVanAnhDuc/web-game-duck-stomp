# ENEMIES — Đạp địch, spiker không đạp được, chạm cạnh bên

Truy vết phía app: FR-08 · US-04 · design.md §2 ("Đạp lên đầu địch") · README §Features ("Stomp enemies from above —
except the spiky one, which has to be avoided").

- **REQ-ENEMIES-01** Rơi xuống đầu một `walker` thì walker bị hạ (biến mất khỏi màn), nhân vật nảy lên một chút và không mất tim.
- **REQ-ENEMIES-02** `flyer` cũng đạp được: rơi xuống đầu nó thì nó bị hạ, không mất tim.
- **REQ-ENEMIES-03** `spiker` không đạp được: rơi xuống đầu nó thì mất 1 tim như mọi nguồn sát thương khác, và spiker vẫn còn sống.
- **REQ-ENEMIES-04** Chạm một địch từ cạnh bên (không phải từ trên xuống) thì mất 1 tim, địch không bị hạ.
