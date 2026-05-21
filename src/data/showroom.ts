/** Showroom location info displayed on the homepage "Experience It In Person" section.
 *  Replace placeholder values with the real Art Color showroom details.
 *  To swap the map: replace `mapEmbedUrl` with iframe `src` from Google Maps
 *  "Share → Embed" or use `?q=<address>` query format (no API key required). */
export interface Showroom {
  address: string;
  hours: string;
  mapEmbedUrl: string;
}

export const showroom: Showroom = {
  address: '123 Đường Placeholder, Quận 1, TP. Hồ Chí Minh',
  hours: '8:00 — 21:00 mỗi ngày',
  // Saigon Notre-Dame Cathedral coordinates as placeholder.
  mapEmbedUrl:
    'https://maps.google.com/maps?q=10.7769%2C106.7009&t=&z=15&ie=UTF8&iwloc=&output=embed',
};
