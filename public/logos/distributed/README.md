# Distributed Brand Logos

Logos của các thương hiệu mà Art Color **phân phối chính hãng tại Việt Nam**.
Hiển thị ở section "World-Leading Brands" trên trang chủ.

## Files cần drop

Đặt theo `src/data/distributed-brands.ts` mapping:

| Path | Brand | Trạng thái |
|---|---|---|
| `../technogym.png` | Technogym | ✅ Đã có (reuse file ở `public/logos/technogym.png`) |
| `brand-02.png` | (cần xác định) | Placeholder → drop file PNG |
| `brand-03.png` | (cần xác định) | Placeholder → drop file PNG |
| `brand-04.png` | (cần xác định) | Placeholder → drop file PNG |

Update `name` field trong `src/data/distributed-brands.ts` thành tên brand thật khi có logo.

## Format

- PNG transparent background
- Width ≥ 400px (cho Retina)
- Max-height hiển thị: ~56px desktop, ~40px mobile

## ⚠️ Pháp lý — IP

Mỗi logo là **TRADEMARK đăng ký** của hãng tương ứng. Chỉ được hiển thị logo nếu Art Color có:

1. **Authorized distributor agreement** với hãng đó, HOẶC
2. **Partnership/co-branding agreement** trong scope cho phép display logo

**KHÔNG**:
- Copy logo từ Google Image Search
- Tải logo từ Wikipedia/Wikimedia (license khác nhau từng brand)
- Reproduce logo bằng cách vẽ lại trong Illustrator/Canva
- Liệt kê brand mà Art Color không có quan hệ phân phối chính thức

Mỗi hãng có **Brand Center / Partner Portal** riêng cấp file logo chuẩn cho authorized distributor. Liên hệ rep từng hãng xin brand pack.

## Nếu chỉ phân phối Technogym

Nếu Art Color chỉ phân phối **1 brand duy nhất là Technogym**, có 2 lựa chọn:

### A. Bỏ section "World-Leading Brands"
Xóa `<DistributedBrands />` khỏi `src/pages/index.astro` — section này dành cho multi-brand distributors.

### B. Giữ section nhưng chỉ 1 logo
Trong `src/data/distributed-brands.ts` giảm array xuống 1 entry (chỉ Technogym), grid sẽ tự co lại — hiển thị 1 logo centered.

Hoặc dùng section này để showcase **product categories** của Technogym (Cardio / Strength / Personal / etc.) thay vì brands khác nhau.
