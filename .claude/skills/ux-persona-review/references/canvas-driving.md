# Lái một game canvas — những gì đã kiểm thật

> **Trả lời:** persona lái Duck Stomp bằng tool nào, và tool nào **không** lái được?
> **Trạng thái:** 🟢 đủ
> **Đo lúc:** 2026-09-12 · playwright MCP (`plugin:playwright`) · Chromium · Vite dev
> `127.0.0.1:4173` và preview bản build `127.0.0.1:4174`
> **Cập nhật khi:** đổi công cụ trình duyệt · đổi cách nhận input trong `src/game/input.ts`
> · sửa cái đã ghi ở §Điểm đã hỏng lúc đo

Mọi con số trong file này là **đo được**, không phải suy ra. Chỗ nào chưa đo thì ghi
là chưa đo. Nếu bạn sửa code input rồi thấy file này lệch, sửa file này — đừng để
persona chạy theo một bản mô tả cũ.

## Vì sao file này tồn tại

Toàn bộ game nằm trong **một** `<canvas>`. Không có button, không có role, không có
text để tìm. `browser_snapshot` trả về đúng một node vô nghĩa, và mọi thói quen
"tìm element rồi click" đều không dùng được ở đây.

Tệ hơn: **có tool trông như dùng được mà không dùng được.** `browser_press_key` bấm
được menu nhưng không điều khiển được nhân vật. Một persona không biết điều đó sẽ
kết luận "game không nhận bàn phím", kể lại rất thuyết phục, và cả lần chạy thành
rác. Đó là lý do file này phải được đọc trước khi dispatch.

## Cái gì chạy, cái gì không

| Việc | Tool | Kết quả đo |
| --- | --- | --- |
| Bấm menu (PLAY, chọn màn, START, ESC) | `browser_press_key` | ✅ `Enter` ở Title → `WorldMap`; `Enter` ở bản đồ → `Game` |
| **Đi/chạy trong màn** | `browser_press_key` | ❌ **0 px.** 5 lần `press ArrowRight` liên tiếp: nhân vật không nhích |
| Đi/chạy trong màn | `browser_run_code_unsafe` + `keyboard.down/up` | ✅ giữ 300ms → **33 px**; `press(key,{delay:300})` → 21 px |
| **Nhảy** | `browser_press_key` | ❌ **0 px.** Không rời mặt đất |
| Nhảy | `keyboard.down('Space')` giữ 350ms → `up` | ✅ lên **49 px** |
| Bấm chuột vào UI trong canvas | `browser_click` (target `canvas`) hoặc `page.mouse.click(x,y)` | ✅ chuột tới được Phaser: bấm icon tạm dừng mở đúng scene `Pause` |
| Chụp ảnh | `browser_take_screenshot`, `filename` tuyệt đối | ✅ **nhưng không tự tạo thư mục** — thiếu là `ENOENT` |
| Đặt viewport | `browser_resize` | ✅ 667×375 → canvas 640×360, letterbox |
| Cảm ứng thật | `browser_*` | ❌ context của MCP có `hasTouch: false`; `touchscreen.tap` báo lỗi |
| Throttle mạng | `browser_*` | ❌ không có tool nào |
| Throttle mạng | `browser_run_code_unsafe` + CDP | ✅ xem §Mạng chậm |

**Lý do của hai dòng ❌ đầu:** Phaser đọc `key.isDown` mỗi frame. `press` không có
`delay` là down+up trong cùng một tick, nên không frame nào thấy phím đang xuống.
Menu thì bắt `keydown` (một sự kiện rời), nên menu vẫn ăn. Đây là cơ chế, không phải
may rủi: nó sẽ đúng như vậy mãi (`src/game/input.ts:76`, `src/game/ui.ts:281`).

## Công thức: chơi bằng bàn phím

Giữ phím là bắt buộc, nên mọi hành động trong màn đi qua `browser_run_code_unsafe`.
Một lần gọi nên gói **một ý định của người chơi** ("chạy sang phải một đoạn rồi
nhảy"), không phải một trận đấu — persona cần nhìn ảnh giữa các ý định.

```js
async (page) => {
  const hold = async (key, ms) => { await page.keyboard.down(key); await page.waitForTimeout(ms); await page.keyboard.up(key); };
  await hold('ArrowRight', 600);          // chạy
  await page.keyboard.down('ArrowRight'); // chạy rồi nhảy, vẫn giữ hướng
  await hold('Space', 300);
  await page.waitForTimeout(250);
  await page.keyboard.up('ArrowRight');
  return document.title;                  // KHÔNG đọc trạng thái game ở đây
}
```

### Hiệu chỉnh: "bấm nhanh" của người thật là bao lâu

`press` không kèm `delay` là **0 ms** — không người nào bấm được như thế, và game
không thấy nó. Nên đừng dùng nó để mô phỏng một cú bấm. Thang quy đổi:

| Người thật làm gì | Viết thành |
| --- | --- |
| bấm nhanh một cái (bản năng của người quen web) | `down` → **80–120 ms** → `up` |
| giữ để chạy / để nhảy cao | `down` → **300–800 ms** → `up` |
| giữ để lấy đà phá tường | `down` → **1200 ms+** → `up` |

Phân biệt này quan trọng: một persona bấm-nhả 100 ms mà nhân vật **không** nhích là
một phát hiện thật về game. Cùng hành vi đó viết bằng `press` 0 ms thì chỉ là lỗi
của bộ dò. Hai thứ trông giống nhau trong báo cáo và chỉ một thứ có giá trị.

Điều khiển: `ArrowLeft/A` · `ArrowRight/D` · `Space/ArrowUp/W` để nhảy ·
`Esc/P` tạm dừng. Giữ hướng lâu thì nhanh dần — đó là thứ thay cho nút chạy, và là
thứ persona phải **tự** phát hiện, không được dặn trước.

## Công thức: chơi bằng chuột / cảm ứng

Đường đi bằng con trỏ đã kiểm: **PLAY** ở giữa canvas (khoảng `y = 45%` chiều cao
canvas) → **đĩa node màn 1** (ở 667×375 nằm tại canvas `128,114`) → nút **START** ở
thẻ dưới đáy (face tâm tại canvas `533,300`). Cả ba đều ăn `page.mouse.click`.

Toạ độ là **toạ độ trang**, nên phải cộng offset của canvas — nó lệch vì letterbox:

```js
const c = await page.evaluate(() => { const r = document.querySelector('canvas').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
await page.mouse.click(c.x + 128, c.y + 114);
```

Ở 667×375 thì `c.x = 20`, `c.y = 11`, canvas 640×360 — nhưng **đo lại mỗi phiên**,
vì zoom là số nguyên và nó nhảy bậc theo viewport (`src/core/scale.ts`).

Giữ ngón tay = `page.mouse.move` → `down` → `waitForTimeout` → `up`.
`touchscreen` của Playwright **chỉ có `tap`, không giữ được**, nên ngay cả trong
context bật `hasTouch` thì cũng không mô phỏng được ngón tay đè nút nhảy.

### Persona điện thoại: dùng gì, và phải khai gì trong báo cáo

Chạy ở viewport **667×375** trên page của MCP, lái bằng **chuột nhấn-giữ** làm người
thế cho ngón tay. Báo cáo **phải ghi** đây là con trỏ, không phải cảm ứng: context
của MCP không bật `hasTouch`, nên không có `touchstart` thật nào xảy ra.

Muốn cảm ứng thật thì phải tự mở context trong `run_code_unsafe`:

```js
const ctx = await page.context().browser().newContext({ viewport: { width: 667, height: 375 }, hasTouch: true });
const p = await ctx.newPage();
```

Kiểm 12.09.2026: cách này chạy, `p.touchscreen.tap` bấm được PLAY thật. Cái giá:
page đó **không phải** page mà các tool `browser_*` nhìn thấy, nên ảnh phải chụp
bằng `p.screenshot({ path: '<tuyệt đối>' })` ngay trong cùng lời gọi, và context
không sống qua lời gọi sau. Chỉ chọn đường này khi Red Route **bắt buộc** cảm ứng
thật; mặc định là chuột nhấn-giữ.

## Chờ cái gì, đọc cái gì

Scene đang chạy được publish ra DOM: `document.documentElement.dataset.scene`, một
trong `Boot·Preload·Title·WorldMap·Game·Hud·Pause·LevelComplete` (`src/main.ts:99`).
Nó có trong **cả** bản production, và nó là thứ duy nhất cho biết "màn đã nạp xong"
— cảnh chuyển trong canvas thì từ ngoài không thấy gì.

```js
await page.waitForFunction(() => document.documentElement.dataset.scene === 'Game', { timeout: 15000 });
```

Màn chặn xoay là DOM thật: `#rotate-gate` mất `hidden` khi viewport dọc.

**Handle `window.duckstomp`** (chỉ có ở bản dev) mở ra toàn bộ trạng thái game: toạ
độ nhân vật, số xu, đồng hồ. Nó dành cho **người điều phối** khi cần xác nhận một
`done_when` cho chính xác. **Persona không được dùng nó** — một người chơi thật
không đọc được toạ độ của mình, và một persona đọc được sẽ đi tới đích bằng cách mà
không người chơi nào đi, rồi báo cáo rằng đường đi ấy rõ ràng. Nếu một brief persona
có tên `duckstomp` trong đó thì brief đó viết sai.

## Ảnh

`browser_take_screenshot` ăn đường dẫn tuyệt đối nhưng **không tạo thư mục cha**.
Người điều phối phải `mkdir -p` `runs/<timestamp>/anh-tho/` trước khi dispatch —
đây là bước dễ quên nhất và nó làm phiên chết ngay ảnh đầu tiên với `ENOENT`.

Không truyền `filename` thì ảnh rơi vào `.playwright-mcp/` (đã gitignore) với tên
theo timestamp — mất luôn quy ước tiền tố mã phiên ở `lib/orchestration.md`. Luôn
truyền đường dẫn đầy đủ.

Game là pixel art màu phẳng: PNG một khung 640×360 chỉ khoảng 7 KB, nên **chụp
nhiều**. Đặc biệt chụp ngay trước và ngay sau mỗi lần chết — cảm giác điều khiển chỉ
đọc được từ chuỗi ảnh, không đọc được từ một ảnh.

## Mạng chậm

Không có tool throttle. Dùng CDP trong `run_code_unsafe`, và **phải chạy trên bản
build ở `:4174`**:

```js
const ctx = await page.context().browser().newContext({ viewport: { width: 667, height: 375 } });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Network.enable');
// DevTools "Fast 3G"
await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 562.5, downloadThroughput: 1.6e6 / 8, uploadThroughput: 750e3 / 8, connectionType: 'cellular3g' });
```

Đo 12.09.2026 trên bản build, localhost:

| Điều kiện | Tới Title chơi được | Tải về |
| --- | --- | --- |
| không throttle | **658 ms** | 339 KB / 8 request |
| Fast 3G | **4519 ms** | 339 KB / 8 request |

Cùng công thức đó trên **dev server** không tải xong trong 30 giây — dev server trả
vài trăm module rời, và con số ấy không nói gì về thứ người chơi thật tải. Đây cũng
là số đo đầu tiên đối chiếu được với ngân sách **NFR-PERF-07 (≤ 5s ở Fast 3G)**, và
nó là số **localhost**: chưa có RTT thật, chưa có TLS, chưa qua GitHub Pages.

## Gieo save

Red Route nào cần "người chơi đã chơi hôm qua" thì gieo `localStorage` **trước khi
điều hướng**, ở đúng context của phiên đó:

```js
await p.addInitScript(() => {
  localStorage.setItem('platformer.save.v1', JSON.stringify({
    version: 1,
    levels: { '1': { cleared: true, bestTimeMs: 41200, coins: 6 }, '2': { cleared: true, bestTimeMs: 58800, coins: 5 }, '3': { cleared: false, bestTimeMs: null, coins: 0 } },
    muted: false,
  }));
});
```

Khoá và hình dạng: `src/core/storage.ts:19` và `src/core/scoring.ts:15`. Sai một
trường thì save bị coi là rác và game xử như **chưa có save** — im lặng, không lỗi
— nên sau khi gieo phải xác nhận Title hiện nút chơi tiếp. Persona **không** được
biết mình đã bị gieo save; họ chỉ biết "hôm qua tôi có chơi".

Đổi chiều: phiên nào phải là người mới tinh thì mở **context mới** (cookie và
localStorage sạch), đừng chỉ điều hướng lại.

## Rào an toàn ở game này

- Game **không gọi `alert`/`confirm`/`prompt` ở đâu cả** (đã grep `src/` và
  `index.html`), nên cái bẫy treo phiên kinh điển không có ở đây. Vẫn đừng mở
  DevTools dialog bằng tay.
- Không có backend, không có tài khoản, không có gì gửi đi. Không có hành động nào
  không hoàn tác được, trừ **ghi đè save** — nên đừng chạy persona trên profile
  Chrome cá nhân của người dùng (hạng 3 ở `lib/browser-capability.md`): nó ghi vào
  cùng origin và xoá kỷ lục thật của họ.
- Trần cứng 40 hành động của persona: ở đây một "hành động" là một **ý định**
  (một lần chạy, một lần nhảy, một lần bấm), không phải một lời gọi tool.

## Điểm đã hỏng lúc đo — kiểm lại trước khi tin

Ghi 12.09.2026. Nếu đã sửa thì xoá mục này.

**Người chơi chỉ dùng con trỏ/cảm ứng không di chuyển được nhân vật.** Đo trong
context sạch, không bấm một phím nào: đi được PLAY → node → START vào màn 1, rồi
nhấn-giữ 400ms đúng ô nút nhảy (và ô nút phải) — `showTouch` vẫn `false`, cụm nút
vẫn ẩn, nhân vật không nhích một pixel. Lặp lại với `hasTouch: true` và
`touchscreen.tap`: y như vậy.

Cơ chế: cụm nút cảm ứng ẩn cho tới khi `showTouch` bật (`HudScene.ts:173`), mà thứ
duy nhất bật nó là `pointerdown` trên chính mấy nút đang ẩn (`input.ts:60`,
`HudScene.ts:132`) — vòng tròn tự khoá. Đụng **FR-15** và **NFR-A11Y-06**
("chơi được hết chỉ bằng cảm ứng"), với nhóm người chơi chính theo
`docs/01-product/overview.md` §3.

Vì sao nó nằm ở đây: persona điện thoại **sẽ** bị kẹt ở màn 1 và sẽ bỏ cuộc. Đó là
**phát hiện thật, không phải lỗi của bộ dò**. Ghi lại y nguyên bằng lời của persona,
và **đừng cứu phiên bằng cách chuyển sang bàn phím giữa đường** — làm vậy là xoá
đúng cái bằng chứng đáng giá nhất của lần chạy.
