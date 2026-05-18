# Logos

Drop logo files vào đây để hiển thị trên site. Tên file PHẢI khớp chính xác (case-sensitive trên Linux/Cloudflare).

## Files cần có

| Path | Dùng ở đâu | Format ưu tiên | Size khuyến nghị |
|---|---|---|---|
| `art-color.png` | Header (h-8), Footer (h-8) | PNG transparent | width ≥ 400px (cho Retina), height ~128px+ |
| `technogym.png` | Hero meta (h-4), Footer "Đối tác phân phối" (h-7) | PNG transparent | width ≥ 400px (cho Retina) |

## Fallback behavior

Nếu file thiếu (404), `<img>` tag có `onerror="this.style.display='none'"` sẽ ẩn ảnh — bên cạnh vẫn hiển thị text fallback ("Art Color" / "Technogym"). Site **không vỡ** khi thiếu logo.

## Format tips

### SVG (khuyến nghị)
- Crisp ở mọi DPR (Retina, 4K)
- Có thể đổi màu qua CSS (nếu logo dùng `currentColor` thay vì hex)
- Nhẹ (~5-20 KB)
- Optimize qua [SVGOMG](https://jakearchibald.github.io/svgomg/)

### PNG (fallback)
- Nếu chỉ có PNG, đổi tên file thành `art-color.png` / `technogym.png` rồi update path trong code (`src="/logos/art-color.png"`).
- Dùng PNG transparent background.
- Width ≥ 800px để render đẹp Retina.

## Dark mode

Nếu logo của bạn là **đen trên nền trong suốt** (như nhiều logo công ty), trên dark mode sẽ không nhìn thấy. Giải pháp:

1. **Cách 1 — Hai version**: tạo `art-color-light.svg` (dùng cho light mode) và `art-color-dark.svg` (dùng cho dark mode, logo trắng), wire conditional render trong code.
2. **Cách 2 — CSS filter**: Thêm class `dark:invert` (nếu logo đen+trắng monochrome): 
   ```html
   <img src="/logos/art-color.svg" class="h-8 w-auto dark:invert" />
   ```
3. **Cách 3 — Một version trắng/sáng**: dùng logo trắng/sáng cho cả 2 mode. Trên light mode background trắng nó vẫn dùng được nếu có viền hoặc placement contrast.

## Technogym logo — pháp lý

Logo Technogym là trademark đăng ký của Technogym S.p.A. Chỉ được sử dụng:
- Nếu Art Color là **distributor được uỷ quyền** của Technogym tại Việt Nam → dùng file logo từ **Brand Center / Dealer Portal** của hãng cấp
- Theo điều khoản dealer agreement (kích thước tối thiểu, clearspace, không méo, không đổi màu trái phép)

**Tuyệt đối không** copy logo từ Google Image Search / website khác — vi phạm trademark + thường file chất lượng kém.

Nếu chưa có authorized version → liên hệ rep Technogym xin brand pack chính thức.
