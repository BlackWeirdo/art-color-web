# Partner / Customer Logos

Drop authorized partner logo files vào folder này. Tên file PHẢI khớp với `src/data/partners.ts`.

## Naming convention

| File | Category | Vị trí trong grid (2 row × 4 col) |
|---|---|---|
| `cat2-01.png` ... `cat2-08.png` | Sức khỏe, tập đoàn & thể thao chuyên nghiệp | row 1 (1-4), row 2 (5-8) |
| `cat3-01.png` ... `cat3-08.png` | Câu lạc bộ & phòng tập | row 1 (1-4), row 2 (5-8) |
| `cat4-01.png` ... `cat4-08.png` | Khách sạn & dự án nhà ở | row 1 (1-4), row 2 (5-8) |

Category 1 (Đại sứ thương hiệu) hiện đang là **text-only** (tên athletes). Nếu muốn dùng ảnh:
- Đổi entry trong `partners.ts`: `{ name: 'Tên', logo: '/logos/partners/cat1-01.png' }`
- Drop file `cat1-XX.png` vào đây.

## Format

- **PNG transparent** background
- Width ≥ 400px (cho Retina sharpness)
- Max-height hiển thị: ~56px desktop, ~40px mobile → file gốc cao 120-200px là đủ
- Logos đơn sắc (đen hoặc trắng) sẽ tự động trông OK trên cả dark/light theme nếu có transparent BG

## ⚠️ Pháp lý — đọc kỹ trước khi drop file

Logo của bên thứ ba **là trademark đăng ký**. Đặt logo của Apple, Ferrari, Nike, Juventus, JW Marriott, RMIT, Vinamilk, J.P. Morgan, Crowne Plaza... lên website Art Color KHÔNG TỰ NHIÊN cho phép — cần có:

1. **Partner/sponsorship agreement** trực tiếp với từng brand, HOẶC
2. **Authorized Technogym distributor** → dùng Partner Pack chính thức từ Technogym
   - Liên hệ rep Technogym Việt Nam / Brand Center xin file logos đã được clear quyền sử dụng cho marketing dealer
   - Partner Pack thường gồm logos PNG đã optimize + brand guidelines

**Tuyệt đối KHÔNG**:
- Copy logo từ Google Image Search
- Tải logo từ Wikipedia/Wikimedia (license khác nhau từng brand)
- Reproduce logo bằng cách vẽ lại trong Illustrator/Canva
- Dùng logo của brands mà Art Color không có quan hệ thương mại

Vi phạm trademark có thể dẫn đến:
- Yêu cầu gỡ bỏ (cease & desist letter)
- Tranh chấp dân sự
- Damage cho brand reputation của Art Color

## Names (text-only) policy

Nếu hiển thị tên athletes (Ronaldo, Nadal...) trong category "Đại sứ thương hiệu":
- Cần **publicity rights** từ chính athlete (qua agency của họ)
- Hoặc qua Technogym (TG có hợp đồng ambassador với những người này)

Nếu chưa có quyền → để placeholder generic ("Đại sứ 01") hoặc bỏ category này.
