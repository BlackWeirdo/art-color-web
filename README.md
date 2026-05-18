# Product Page Template

Astro 6 + Tailwind CSS v4 + Motion One template cho 1 trang product detail (lead-gen style). Dark mode mặc định, responsive mobile-first, scroll animations.

## IP / Bản quyền

Template này **chỉ tái sử dụng cấu trúc & layout patterns** chung của product page. User PHẢI tự chuẩn bị:

- **Brand riêng**: thay `Acme Fitness` trong `src/data/product.ts` và `src/data/contact.ts`.
- **Ảnh sản phẩm riêng**: replace `picsum.photos` URLs bằng ảnh thật của user (upload vào `public/images/`).
- **Spec / giá riêng**: thay placeholder `X kW`, `X km/h` bằng thông số sản phẩm thật.
- **Video riêng**: thay file rỗng trong `public/videos/` bằng video user tự quay / sở hữu.

**TUYỆT ĐỐI KHÔNG** copy brand name, exact spec values, giá, slogan, ảnh, video từ trang web của bên thứ ba mà user không sở hữu bản quyền.

## Setup

Yêu cầu: **Node.js 20+** (khuyến nghị 22 LTS).

```powershell
npm install
npm run dev          # http://localhost:4321
npm run build        # output to ./dist
npm run preview      # preview production build
```

## Cấu trúc

```
src/
├── data/                   # placeholder data
├── layouts/                # MainLayout
├── components/
│   ├── Header / Footer / ThemeToggle / ProductSchema
│   └── sections/           # mỗi section 1 file .astro
├── scripts/                # theme / gallery / sticky / reveal
├── styles/global.css       # Tailwind + theme tokens
└── pages/index.astro       # composes all sections

public/
├── images/                 # user-supplied product photos
├── videos/                 # user-supplied demo video
└── favicon.svg
```

## Customize

- Brand colors: `src/styles/global.css` (`--color-bg`, `--color-fg`, `--color-accent`)
- Product data: `src/data/product.ts`
- Contact info: `src/data/contact.ts`
- Section order: `src/pages/index.astro`

## Stack

- [Astro 6](https://astro.build/) — static-first, near-zero JS
- [Tailwind CSS v4](https://tailwindcss.com/) — CSS-first config via `@theme`
- [Motion One](https://motion.dev/) — ~3KB scroll reveal animations

## License

MIT cho code. Placeholder/Lorem content phải replace trước khi publish.
