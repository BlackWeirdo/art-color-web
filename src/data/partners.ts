// Partners & customers data — placeholder until you fill in your authorized list.
//
// IP NOTE (CRITICAL):
// Logo của bên thứ ba (Ferrari, Apple, Nike, JW Marriott, RMIT, Vinamilk, etc.)
// là TRADEMARK đăng ký. Tên athletes là PUBLICITY RIGHTS. Chỉ được hiển thị nếu:
//   1. Có partner/sponsorship agreement trực tiếp với từng brand/athlete, HOẶC
//   2. Là authorized Technogym distributor → dùng official Partner Pack từ Technogym
//      (đã được clear quyền sử dụng cho dealer marketing).
// KHÔNG copy logos từ Google Image hoặc reproduction từ memory — vi phạm trademark.
//
// Drop logo files vào public/logos/partners/ theo naming convention bên dưới.

export interface PartnerItem {
  /** Tên hiển thị nếu không có logo (cũng dùng làm alt text + fallback khi img fail). */
  name: string;
  /** Đường dẫn tới logo trong /public, vd: '/logos/partners/cat2-01.png'. Bỏ trống = render text. */
  logo?: string;
}

export interface PartnerCategory {
  /** Category label. Dùng \n để xuống dòng cho hiệu ứng stack vertical. */
  label: string;
  items: PartnerItem[];
}

export const partners: PartnerCategory[] = [
  {
    label: 'Đại sứ\nthương hiệu',
    items: [
      { name: 'Đại sứ 01' },
      { name: 'Đại sứ 02' },
      { name: 'Đại sứ 03' },
      { name: 'Đại sứ 04' },
      { name: 'Đại sứ 05' },
      { name: 'Đại sứ 06' },
      { name: 'Đại sứ 07' },
      { name: 'Đại sứ 08' },
    ],
  },
  {
    label: 'Sức khỏe,\ntập đoàn &\nthể thao\nchuyên nghiệp',
    items: [
      { name: 'Đối tác 01', logo: '/logos/partners/cat2-01.png' },
      { name: 'Đối tác 02', logo: '/logos/partners/cat2-02.png' },
      { name: 'Đối tác 03', logo: '/logos/partners/cat2-03.png' },
      { name: 'Đối tác 04', logo: '/logos/partners/cat2-04.png' },
      { name: 'Đối tác 05', logo: '/logos/partners/cat2-05.png' },
      { name: 'Đối tác 06', logo: '/logos/partners/cat2-06.png' },
      { name: 'Đối tác 07', logo: '/logos/partners/cat2-07.png' },
      { name: 'Đối tác 08', logo: '/logos/partners/cat2-08.png' },
    ],
  },
  {
    label: 'Câu lạc bộ &\nphòng tập',
    items: [
      { name: 'CLB 01', logo: '/logos/partners/cat3-01.png' },
      { name: 'CLB 02', logo: '/logos/partners/cat3-02.png' },
      { name: 'CLB 03', logo: '/logos/partners/cat3-03.png' },
      { name: 'CLB 04', logo: '/logos/partners/cat3-04.png' },
      { name: 'CLB 05', logo: '/logos/partners/cat3-05.png' },
      { name: 'CLB 06', logo: '/logos/partners/cat3-06.png' },
      { name: 'CLB 07', logo: '/logos/partners/cat3-07.png' },
      { name: 'CLB 08', logo: '/logos/partners/cat3-08.png' },
    ],
  },
  {
    label: 'Khách sạn &\ndự án nhà ở',
    items: [
      { name: 'Đối tác 01', logo: '/logos/partners/cat4-01.png' },
      { name: 'Đối tác 02', logo: '/logos/partners/cat4-02.png' },
      { name: 'Đối tác 03', logo: '/logos/partners/cat4-03.png' },
      { name: 'Đối tác 04', logo: '/logos/partners/cat4-04.png' },
      { name: 'Đối tác 05', logo: '/logos/partners/cat4-05.png' },
      { name: 'Đối tác 06', logo: '/logos/partners/cat4-06.png' },
      { name: 'Đối tác 07', logo: '/logos/partners/cat4-07.png' },
      { name: 'Đối tác 08', logo: '/logos/partners/cat4-08.png' },
    ],
  },
];
