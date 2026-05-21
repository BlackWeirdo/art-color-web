// Product catalog. Each entry becomes its own page at /san-pham/{slug}.
// Replace placeholder content with your real products.
//
// IP NOTE: Do NOT copy brand names, prices, spec values, or images from any
// third-party site. Use only your own product info or Lorem Ipsum placeholders.

import { BRAND } from './site.ts';

export interface ProductFeature {
  title: string;
  /** Long-form paragraph displayed in the scroll-section feature row. */
  body: string;
  icon: 'spark' | 'route' | 'music' | 'pulse' | 'shield';
  image: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductVideo {
  mp4: string;
  webm?: string;
  poster: string;
}

export interface Product {
  slug: string;
  brand: string;
  name: string;
  tagline: string;
  sku: string;
  priceVnd: number;
  priceNote: string;
  ctaLabel: string;
  description: string;
  images: string[];
  features: ProductFeature[];
  specs: ProductSpec[];
  video: ProductVideo;
}

// Shared placeholder content — replace per-product when you have real data.
const COMMON_FEATURES: ProductFeature[] = [
  {
    title: 'Huấn luyện cá nhân hoá',
    body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phù hợp cho mọi cấp độ tập luyện, từ người mới bắt đầu đến vận động viên chuyên nghiệp.',
    icon: 'spark',
    image: 'https://picsum.photos/seed/feat-power/1200/900',
  },
  {
    title: 'Lộ trình toàn cầu',
    body: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Khám phá hàng nghìn lộ trình mô phỏng đường nổi tiếng thế giới.',
    icon: 'route',
    image: 'https://picsum.photos/seed/feat-route/1200/900',
  },
  {
    title: 'Âm nhạc đồng bộ nhịp tim',
    body: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Hệ thống AI phân tích nhịp tim thời gian thực và chọn nhạc theo BPM phù hợp.',
    icon: 'music',
    image: 'https://picsum.photos/seed/feat-music/1200/900',
  },
  {
    title: 'Theo dõi sinh trắc học',
    body: 'Duis aute irure dolor in reprehenderit in voluptate velit esse. Cảm biến đo nhịp tim, oxy máu, calo và áp lực mỗi bước.',
    icon: 'pulse',
    image: 'https://picsum.photos/seed/feat-pulse/1200/900',
  },
  {
    title: 'An toàn vận hành',
    body: 'Excepteur sint occaecat cupidatat non proident. Khung kết cấu thép cường lực, cảm biến dừng khẩn cấp tự động, bảo hành toàn diện nhiều năm.',
    icon: 'shield',
    image: 'https://picsum.photos/seed/feat-shield/1200/900',
  },
];

const COMMON_SPECS: ProductSpec[] = [
  { label: 'Công suất', value: 'X kW (placeholder)' },
  { label: 'Tốc độ tối đa', value: 'X km/h (placeholder)' },
  { label: 'Độ nghiêng', value: 'X% (placeholder)' },
  { label: 'Mặt chạy', value: 'X × X cm (placeholder)' },
  { label: 'Kích thước', value: 'X × X × X cm (placeholder)' },
  { label: 'Trọng lượng', value: 'X kg (placeholder)' },
  { label: 'Tải trọng tối đa', value: 'X kg (placeholder)' },
  { label: 'Bảo hành', value: 'X năm (placeholder)' },
];

function makeProduct(config: {
  slug: string;
  name: string;
  sku: string;
  tagline: string;
}): Product {
  return {
    brand: BRAND,
    priceVnd: 0,
    priceNote: 'Giá tham khảo, đã bao gồm VAT. Chi phí lắp đặt liên hệ tư vấn.',
    ctaLabel: 'Tư vấn ngay',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: Array.from(
      { length: 6 },
      (_, i) => `https://picsum.photos/seed/${config.slug}-${i + 1}/1200/1200`,
    ),
    features: COMMON_FEATURES,
    specs: COMMON_SPECS,
    video: {
      mp4: '/videos/demo-placeholder.mp4',
      webm: '/videos/demo-placeholder.webm',
      poster: `https://picsum.photos/seed/${config.slug}-poster/1280/720`,
    },
    ...config,
  };
}

export const products: Product[] = [
  makeProduct({
    slug: 'may-chay-bo-pro',
    name: 'Máy chạy bộ Pro',
    sku: 'AC-MR-001',
    tagline: 'Trải nghiệm chạy bộ premium ngay tại nhà — cảm biến đa điểm, lộ trình toàn cầu.',
  }),
  makeProduct({
    slug: 'xe-dap-tap-pro',
    name: 'Xe đạp tập Pro',
    sku: 'AC-BK-001',
    tagline: 'Xe đạp indoor chuyên nghiệp, mô phỏng đa địa hình từ leo dốc tới đường phẳng.',
  }),
  makeProduct({
    slug: 'may-cheo-rowing',
    name: 'Máy chèo Rowing Pro',
    sku: 'AC-RW-001',
    tagline: 'Workout toàn thân với chuyển động chèo thuyền tự nhiên, đốt mỡ hiệu quả.',
  }),
  makeProduct({
    slug: 'ta-tap-da-nang',
    name: 'Tạ tập đa năng',
    sku: 'AC-WT-001',
    tagline: 'Bộ tạ tích hợp đa chế độ — gọn nhẹ, thay thế cả phòng gym tại nhà.',
  }),
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
