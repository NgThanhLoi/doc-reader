# Lê Minh Chi Kiếm — Web Reader

Trình đọc truyện tĩnh (Next.js static export), deploy được lên Vercel miễn phí.

**Nội dung:** full 1600 trang (Bìa + 1598 chương + ngoại truyện), trích từ EPUB gốc vào `data/*.json`.

## Tính năng

- 🌗 3 chủ đề có sẵn (Sáng / Sepia / Tối) + **màu nền & màu chữ tùy chỉnh** (color picker)
- 🔤 Đổi phông chữ (Serif / Sans-serif / Monospace)
- 🔍 Cỡ chữ (14–30px), khoảng dòng (1.4–2.6), độ rộng khung đọc (520–1100px)
- 🔖 Tự lưu tiến độ đọc → nút "Tiếp tục: Chương N" ở trang chủ
- 🔎 Tìm kiếm chương + phân trang trong danh sách chương (100 chương/trang)
- ⌨️ Điều hướng bàn phím: ← → để chuyển chương
- 📱 Responsive, tối ưu mobile

## Cấu trúc

```
data/            # index.json + ch0..ch1599.json (nội dung chương)
scripts/
  build-data.mjs # copy data/*.json -> public/data/ lúc build
  build-toc.mjs  # sinh lib/toc.js (danh sách chương nhúng sẵn)
app/
  page.js        # trang chủ
  toc/page.js    # danh sách chương (tìm kiếm + phân trang)
  read/page.js   # trình đọc (?c=N — load JSON theo chương, không prerender từng chương)
components/
  ReaderChrome.jsx  # topbar + bottombar + panel cài đặt (theme/font/cỡ chữ/màu)
lib/
  book.js, toc.js
```

Build chỉ tạo **4 trang HTML tĩnh**; nội dung chương fetch JSON theo yêu cầu → nhanh, nhẹ, không tốn băng thông Vercel.

## Chạy local

```bash
npm install
npm run dev        # http://localhost:3000
# hoặc build production:
npm run build      # xuất static ra out/
npx serve out
```

## Deploy lên Vercel

**Cách 1 — qua GitHub (khuyên dùng):**
```bash
git init && git add -A && git commit -m "reader init"
# tạo repo trên github.com rồi:
git remote add origin https://github.com/<user>/le-minh-chi-kiem-reader.git
git push -u origin main
```
Rồi vào [vercel.com/new](https://vercel.com/new) → Import repo → Next.js tự nhận → Deploy. Xong.

**Cách 2 — CLI trực tiếp:**
```bash
npm i -g vercel
vercel          # lần đầu: login + trả lời vài câu (framework: Next.js)
vercel --prod   # deploy production
```

Không cần biến môi trường, không cần config gì thêm (`output: 'export'` đã set trong `next.config.js`, Vercel tự phục vụ thư mục `out/`).

## Thay truyện khác

Chạy lại script trích xuất EPUB (tham khảo `scripts/export_epub.py` nếu cần) hoặc đặt bộ JSON mới vào `data/` với format:

```json
// data/index.json
[{"i": 0, "t": "Tên chương", "n": <số đoạn>}]
// data/ch0.json
{"t": "Tên chương", "p": ["đoạn 1", "đoạn 2", ...]}
```
rồi cập nhật `lib/book.js` (title/author/description/total) và chạy lại `npm run build`.
