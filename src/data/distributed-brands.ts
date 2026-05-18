// World-leading brands the company exclusively distributes.
// Displayed on the homepage "World-Leading Brands" section.
//
// IP NOTE (CRITICAL):
// Each logo here represents a third-party TRADEMARK. Only list brands for
// which the company has an authorized distributor / partner agreement.
// - Technogym = confirmed Art Color partnership (existing /logos/technogym.png)
// - Other slots = placeholder; replace `name` + drop logo file into
//   /public/logos/distributed/ when authorized.
// Do NOT copy logos from Google Images / competitor websites.

export interface DistributedBrand {
  name: string;
  /** Path to logo in /public. If missing or file 404 → falls back to text name. */
  logo?: string;
}

export const distributedBrands: DistributedBrand[] = [
  {
    name: 'Technogym',
    logo: '/logos/technogym.png', // reuse existing partner-cap file
  },
  {
    name: 'Thương hiệu 02',
    logo: '/logos/distributed/brand-02.png',
  },
  {
    name: 'Thương hiệu 03',
    logo: '/logos/distributed/brand-03.png',
  },
  {
    name: 'Thương hiệu 04',
    logo: '/logos/distributed/brand-04.png',
  },
];
